import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const formName = process.argv[2] || 'demo-form';
const source = path.join(rootDir, 'dist', `${formName}.mjs`);
const target = path.join(rootDir, '..', 'public', 'plugins', `${formName}.mjs`);

try {
  copyFileSync(source, target);
  console.log(`[publish] Copied dist/${formName}.mjs -> public/plugins/${formName}.mjs`);
} catch (error) {
  console.error(`[publish] Failed for form: ${formName}`);
  console.error(error?.message || error);
  process.exit(1);
}
