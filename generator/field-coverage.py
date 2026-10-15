#!/usr/bin/env python3
"""Report how many documented fields of spec/server.openapi.json still lack a description.

Per x-sdk-resource it counts, over everything reachable from that resource's operations:
  properties          schema properties with no description, including properties of objects
                      declared inline in a request or response body (named `<operationId>/<status>.path`)
  parameters          operation parameters with no description
  enum_missing        string properties that look like discriminators (see DISCRIMINATOR_NAMES)
                      and carry neither `enum` nor `x-enumDescriptions`
  enum_undescribed    properties whose enum values are not all explained by x-enumDescriptions
  variants_missing    `type` properties with x-enumDescriptions on an object that also has an
                      open/untyped property, when no x-variants links the shape per type
  opaque              properties typed as open JSON or as an object without properties and without
                      x-variants (their structure is not described)

Usage: field-coverage.py [--spec spec/server.openapi.json] [--json] [--resource NAME]
"""
import argparse
import json
from pathlib import Path

DISCRIMINATOR_NAMES = {'type', 'state', 'status', 'kind', 'role', 'mode', 'stop_reason', 'reason', 'phase', 'level', 'sender'}
METHODS = ('get', 'put', 'post', 'delete', 'patch')


def refs(node, out):
    if isinstance(node, dict):
        ref = node.get('$ref')
        if isinstance(ref, str) and ref.startswith(('#/components/schemas/', '#/components/x-variantSchemas/')):
            out.add(ref.rsplit('/', 1)[1])
        for value in node.values():
            refs(value, out)
    elif isinstance(node, list):
        for value in node:
            refs(value, out)


def closure(schemas, seeds):
    seen, todo = set(), list(seeds)
    while todo:
        name = todo.pop()
        if name in seen or name not in schemas:
            continue
        seen.add(name)
        found = set()
        refs(schemas[name], found)
        todo.extend(found)
    return seen


def variant_targets(schemas):
    """Names of schemas that are variants, and (schema, property) pairs some x-variants points at."""
    variants, siblings = set(), set()

    def walk(node):
        if isinstance(node, dict):
            found = node.get('x-variants')
            if found:
                variants.update(v['$ref'].rsplit('/', 1)[1] for v in found['mapping'].values())
                if 'sibling' in found:
                    siblings.add(found['sibling'])
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)
    walk(schemas)
    return variants, siblings


def is_opaque(prop):
    """A property whose structure is not described: open JSON or an object without properties."""
    if prop.get('$ref') == '#/components/schemas/JSONValue':
        return True
    if prop.get('x-variants'):
        return False
    if prop.get('type') == 'object' and not prop.get('properties'):
        return True
    items = prop.get('items')
    return prop.get('type') == 'array' and isinstance(items, dict) and is_opaque(items) and not items.get('x-variants')


def schema_gaps(name, schema, schemas, variants, siblings):
    gaps = {'properties': [], 'enum_missing': [], 'enum_undescribed': [], 'variants_missing': [], 'opaque': []}
    for key, prop in schema.get('properties', {}).items():
        where = name + '.' + key
        if not prop.get('description'):
            gaps['properties'].append(where)
        target = schemas.get((prop.get('$ref') or '').rsplit('/', 1)[-1], prop)
        described = prop.get('x-enumDescriptions') or target.get('x-enumDescriptions')
        values = prop.get('enum') or target.get('enum')
        if described is None and values is None and prop.get('type') == 'string' and key in DISCRIMINATOR_NAMES and name not in variants:
            gaps['enum_missing'].append(where)
        if values is not None and set(values) - set(described or {}):
            gaps['enum_undescribed'].append(where)
        if key == 'type' and described and 'x-variants' not in schema and where not in siblings and name not in variants and any(is_opaque(p) or not (p.keys() & {'type', '$ref', 'anyOf', 'oneOf'}) for p in schema['properties'].values()):
            gaps['variants_missing'].append(where)
        if is_opaque(prop):
            gaps['opaque'].append(where)
    return gaps


def inline_objects(node, path):
    """Objects declared inline (not through $ref) in a body schema, with their path."""
    if not isinstance(node, dict) or '$ref' in node:
        return
    for key in ('anyOf', 'oneOf', 'allOf'):
        for child in node.get(key, []):
            yield from inline_objects(child, path)
    if 'items' in node:
        yield from inline_objects(node['items'], path + '[]')
    if node.get('properties'):
        yield path, node
        for key, prop in node['properties'].items():
            yield from inline_objects(prop, path + '.' + key)


def inline_bodies(op):
    bodies = [('request', op.get('requestBody', {}).get('content', {}))]
    bodies += [(status, response.get('content', {})) for status, response in op['responses'].items() if isinstance(response, dict)]
    for where, content in bodies:
        for body in content.values():
            if 'schema' in body:
                yield from inline_objects(body['schema'], op['operationId'] + '/' + where)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', default=str(Path(__file__).resolve().parent.parent / 'spec/server.openapi.json'))
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--resource')
    args = ap.parse_args()
    spec = json.loads(Path(args.spec).read_text())
    schemas = {**spec['components']['schemas'], **spec['components'].get('x-variantSchemas', {})}
    variants, siblings = variant_targets(schemas)
    resources = {}
    for path, item in spec['paths'].items():
        for method in METHODS:
            op = item.get(method)
            if op:
                entry = resources.setdefault(op.get('x-sdk-resource', '?'), {'ops': [], 'seeds': set()})
                entry['ops'].append(op)
                refs(op, entry['seeds'])
    report = {}
    for resource, entry in sorted(resources.items()):
        if args.resource and resource != args.resource:
            continue
        gaps = {'properties': [], 'parameters': [], 'enum_missing': [], 'enum_undescribed': [], 'variants_missing': [], 'opaque': []}
        for op in entry['ops']:
            for param in op.get('parameters', []):
                if not param.get('description'):
                    gaps['parameters'].append(op['operationId'] + ':' + param['name'])
        inline_total = 0
        for op in entry['ops']:
            for path, node in inline_bodies(op):
                inline_total += len(node['properties'])
                for kind, items in schema_gaps(path, node, schemas, variants, siblings).items():
                    gaps[kind].extend(items)
        for name in sorted(closure(schemas, entry['seeds'])):
            for kind, items in schema_gaps(name, schemas[name], schemas, variants, siblings).items():
                gaps[kind].extend(items)
        total = inline_total + sum(len(s.get('properties', {})) for n, s in schemas.items() if n in closure(schemas, entry['seeds']))
        report[resource] = {'schema_properties': total, **{k: sorted(set(v)) for k, v in gaps.items()}}
    if args.json:
        print(json.dumps(report, indent=1))
        return
    cols = ('properties', 'parameters', 'enum_missing', 'enum_undescribed', 'variants_missing', 'opaque')
    print('%-16s %6s ' % ('resource', 'props') + ' '.join('%15s' % c for c in cols))
    for resource, row in report.items():
        print('%-16s %6d ' % (resource, row['schema_properties']) + ' '.join('%15d' % len(row[c]) for c in cols))


if __name__ == '__main__':
    main()
