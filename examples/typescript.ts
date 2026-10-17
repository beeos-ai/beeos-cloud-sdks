import { BeeOSClient, type CreateServerInstanceInput, type InstanceCreateResponse, type CreateResponseResponse, type GetResponseResponse, type GetResponseInputItemsResponse, type ListHarnessesResponse, type GetDiscoveryResponse, type UHPEvent, type UHPHarnessCreate } from '../src/index.js';

// Compile only: the function is never invoked and no network request is made.
async function typedSmoke(client: BeeOSClient): Promise<string> {
  const input: CreateServerInstanceInput = {
    name: 'typed-smoke', variant_id: 'variant-example',
    llm: { providers: [{ id: 'provider-example', protocol: 'openai', base_url: 'https://provider.example.invalid/v1', api_key: 'example-provider-key' }], models: [{ provider_id: 'provider-example', model: 'model-example', role: 'default', order: 0 }] },
  };
  const created: InstanceCreateResponse = await client.instances.create(input, 'example-idempotency-key');
  const harnesses: ListHarnessesResponse = await client.harnesses.list();
  const discovery: GetDiscoveryResponse = await client.catalog.getDiscovery();
  const response: CreateResponseResponse = await client.responses.create({ input: 'hello', metadata: { harness_id: 'harness-example' } });
  const retrieved: GetResponseResponse = await client.responses.get(response.id);
  const items: GetResponseInputItemsResponse = await client.responses.getInputItems(response.id);
  const events: AsyncIterable<UHPEvent> = await client.responses.createStream({ input: 'hello', metadata: { harness_id: 'harness-example' } });
  void [harnesses, discovery, retrieved, items, events];
  return created.data.id;
}
const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: () => 'example-api-key' });
void typedSmoke;
void client;

function rejectsInvalidDocumentedInputs(): void {
  // @ts-expect-error The variant identifier is a documented string field.
  const invalidVariant: CreateServerInstanceInput = { name: 'example', variant_id: 42 };
  // @ts-expect-error Streaming requests have a distinct typed resource method.
  client.responses.create({ input: 'hello', stream: true });
  // @ts-expect-error The result has a documented data.id field, not arbitrary keys.
  const invalidResultKey: InstanceCreateResponse['data']['not_a_field'] = 'x';
  void [invalidVariant, invalidResultKey];
}
void rejectsInvalidDocumentedInputs;

function requiresDocumentedResponseInput(): void {
  // @ts-expect-error The documented input property is required.
  client.responses.create({ model: 'example-model' });
  // @ts-expect-error Known metadata fields retain their string types.
  client.responses.create({ input: 'hello', metadata: { harness_id: 42 } });
  // @ts-expect-error The streaming method has the same required input contract.
  client.responses.createStream({ model: 'example-model' });
  client.responses.create({ input: 'hello', metadata: { harness_id: 'harness-example', trace_id: 'trace-example' } });
}
void requiresDocumentedResponseInput;

// Regression assertions, enforced by npm run typecheck:smoke.
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
// getEvents resolves to the parsed `data:` JSON events of the SSE stream.
const getEventsReturnsEventStream: Equal<ReturnType<BeeOSClient['responses']['getEvents']>, Promise<AsyncIterable<UHPEvent>>> = true;
// Request bodies are typed by the schema name in every language.
const harnessWritesShareOneSchema: Equal<Parameters<BeeOSClient['harnesses']['create']>[0], UHPHarnessCreate> & Equal<Parameters<BeeOSClient['harnesses']['update']>[1], UHPHarnessCreate> extends true ? true : false = true;
void [getEventsReturnsEventStream, harnessWritesShareOneSchema];
