import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTypeScript } from './typescript.mjs';
import { generatePython } from './python.mjs';
import { generateGo } from './go.mjs';
export async function generate(spec) {
  return { ...await generateTypeScript(structuredClone(spec)), ...await generatePython(structuredClone(spec)), ...await generateGo(structuredClone(spec)) };
}
export async function writeGenerated(root, check = false) {
  const spec = JSON.parse(await fs.readFile(path.join(root,'spec/server.openapi.json'),'utf8'));
  const files = await generate(spec);
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
