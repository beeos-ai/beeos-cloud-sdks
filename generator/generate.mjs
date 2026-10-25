import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTypeScript } from './typescript.mjs';
import { generatePython } from './python.mjs';
import { generateGo } from './go.mjs';
import { generateNativeTypeScript } from './native-typescript.mjs';
import { generateNativePython } from './native-python.mjs';
import { generateNativeGo } from './native-go.mjs';
export async function generate(spec, nativeSpec) {
  const files = { ...await generateTypeScript(structuredClone(spec)), ...await generatePython(structuredClone(spec)), ...await generateGo(structuredClone(spec)) };
  if (!nativeSpec) return files;
  Object.assign(files, await generateNativeTypeScript(structuredClone(nativeSpec)), await generateNativePython(structuredClone(nativeSpec)), await generateNativeGo(structuredClone(nativeSpec)));
  files['src/index.ts'] += '\nexport * as native from "./native.js";\nexport { NativeBeeOSClient, NativeBeeOSAPIError, SDKWaitTimeout, SDKRequestTimeout, SDKCancelled, SDKPublicationSuperseded, SDKOperationFailed } from "./native.js";\nexport { NativeResponseText } from "./native-text.js";\n';
  files['python/beeos_cloud_sdk/__init__.py'] += '\nfrom .native import NativeBeeOSClient as NativeBeeOSClient, AsyncNativeBeeOSClient as AsyncNativeBeeOSClient, SDKTransportError as SDKTransportError, SDKRequestTimeout as SDKRequestTimeout\nfrom .native_text import NativeResponseText as NativeResponseText\n';
  files['python/pyproject.toml'] = files['python/pyproject.toml'].replace('requires-python = ">=3.11"\n', 'requires-python = ">=3.11"\ndependencies = ["httpx>=0.28.1,<0.29", "websockets>=16.0,<17"]\n');
  files['go/go.mod'] += '\nrequire github.com/gorilla/websocket v1.5.4-0.20250319132907-e064f32e3674\n';
  files['go/go.mod'] += '\nrequire golang.org/x/net v0.26.0 // indirect\n';
  return files;
}
export async function writeGenerated(root, check = false) {
  const spec = JSON.parse(await fs.readFile(path.join(root,'spec/server.openapi.json'),'utf8'));
  const nativeSpec = JSON.parse(await fs.readFile(path.join(root,'spec/native.openapi.json'),'utf8'));
  const files = await generate(spec, nativeSpec);
  const changed=[];
  for (const [name,contents] of Object.entries(files)) {
    const target=path.join(root,name);
    if(check) {
      if(await fs.readFile(target,'utf8').catch(error=>{ if(error.code==='ENOENT') return ''; throw error; }) !== contents) changed.push(name);
    } else { await fs.mkdir(path.dirname(target),{recursive:true}); await fs.writeFile(target,contents); }
  }
  if(changed.length) throw new Error('Generated files differ: '+changed.join(', '));
  return files;
}
if(process.argv[1] === fileURLToPath(import.meta.url)) await writeGenerated(fileURLToPath(new URL('../',import.meta.url)),process.argv.includes('--check'));
