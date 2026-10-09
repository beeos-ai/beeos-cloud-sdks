export const pascal = value => value.replace(/(^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (_, _a, b) => b.toUpperCase());
export function resolve(spec, value) {
  if (!value?.$ref) return value;
  return resolve(spec, value.$ref.slice(2).split('/').reduce((a, k) => a[k.replace(/~1/g, '/').replace(/~0/g, '~')], spec));
}
export function operations(spec) {
  return Object.entries(spec.paths).flatMap(([path, item]) => Object.entries(item).filter(([method]) => ['get','post','put','patch','delete'].includes(method)).map(([method, operation]) => ({ ...operation, path, method: method.toUpperCase(), parameters: [...(item.parameters ?? []), ...(operation.parameters ?? [])].map(p => resolve(spec,p)) })));
}
