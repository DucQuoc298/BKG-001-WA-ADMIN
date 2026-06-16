import { build, context } from 'esbuild';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const formName = args.find((arg) => !arg.startsWith('--')) || 'demo-form';

const tsxEntryPoint = path.join(rootDir, 'src', 'plugins', formName, 'index.tsx');
const tsEntryPoint = path.join(rootDir, 'src', 'plugins', formName, 'index.ts');
const entryPoint = existsSync(tsxEntryPoint) ? tsxEntryPoint : tsEntryPoint;
const outfile = path.join(rootDir, 'dist', `${formName}.mjs`);

if (!existsSync(entryPoint)) {
  console.error(`[build] Missing entry for form: ${formName}`);
  process.exit(1);
}

const options = {
  entryPoints: [entryPoint],
  bundle: true,
  format: 'esm',
  target: 'es2020',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  outfile,
};

try {
  if (watch) {
    const ctx = await context(options);
    await ctx.watch();
    console.log(`[watch] Building plugin: ${formName}`);
  } else {
    await build(options);
    console.log(`[build] Output: dist/${formName}.mjs`);
  }
} catch (error) {
  console.error(`[build] Failed for form: ${formName}`);
  console.error(error?.message || error);
  process.exit(1);
}
