import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// The snapshots are the checked-in source artifacts. This catches changes to
// any of the three emitters that have not been regenerated and reviewed.
describe('single spec generation', () => {
  it('reproduces every committed language artifact', async () => {
    const { generate } = await import('./generate.mjs');
    const spec = JSON.parse(await fs.readFile('spec/server.openapi.json', 'utf8'));
    const files = await generate(spec);
    for (const [name, content] of Object.entries(files)) {
      expect(content, name).toBe(await fs.readFile(path.resolve(name), 'utf8'));
    }
  });
  it('contains documented deployment and response operations on their producer surface', async () => {
    const spec = JSON.parse(await fs.readFile('spec/server.openapi.json', 'utf8'));
    const operations = Object.values(spec.paths).flatMap((item) => Object.values(item as Record<string, {operationId?: string}>)).filter(op => op.operationId);
    for (const id of ['instanceCreate', 'createResponse', 'getResponse', 'getResponseInputItems', 'getDiscovery']) {
      expect(operations.map(op => op.operationId)).toContain(id);
    }
  });
});

it('emits no untyped model escape hatches for documented schemas', async () => {
  const { generate } = await import('./generate.mjs');
  const spec = JSON.parse(await fs.readFile('spec/server.openapi.json', 'utf8'));
  const files = await generate(spec);
  const parsed = ts.createSourceFile('models.ts', files['src/models.ts'], ts.ScriptTarget.Latest, true);
  const escapeTypes: string[] = [];
  const inspect = (node: ts.Node): void => {
    if (node.kind === ts.SyntaxKind.AnyKeyword || node.kind === ts.SyntaxKind.UnknownKeyword) escapeTypes.push(node.getText(parsed));
    ts.forEachChild(node, inspect);
  };
  inspect(parsed);
  expect(escapeTypes).toEqual([]);
  expect(files['python/beeos_cloud_sdk/__init__.py']).not.toMatch(/:\s*(?:Any|object)\b/);
  expect(files['go/client.go']).not.toMatch(/map\[string\](?:any|interface\{\})/);
});

it('preserves schema string literals when replacing open schema types', async () => {
  const { generate } = await import('./generate.mjs');
  const spec = JSON.parse(await fs.readFile('spec/server.openapi.json', 'utf8'));
  spec.components.schemas.ExampleStatus = { type: 'string', enum: ['unknown', 'ready'] };
  const files = await generate(spec);
  expect(files['src/models.ts']).toContain('ExampleStatus: "unknown" | "ready"');
});
