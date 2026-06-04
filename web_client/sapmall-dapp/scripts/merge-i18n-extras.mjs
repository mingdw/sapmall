/**
 * 将遗留 .ts 文案合并进对应 translation_*.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesRoot = path.join(__dirname, '../src/i18n/locales');

function loadTsObject(filePath) {
  if (!fs.existsSync(filePath)) return null;
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  code = code.replace(/as const;?\s*$/, '');
  code = code.replace(/export default\s+/, 'return ');
  code = code.replace(/const\s+\w+\s*=\s*/, 'return ');
  // eslint-disable-next-line no-new-func
  return new Function(code)();
}

function deepMerge(target, source) {
  if (!source) return target;
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function mergeFile(lang, targetFile, ...extras) {
  const file = path.join(localesRoot, lang, targetFile);
  const base = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const extra of extras) {
    if (extra) deepMerge(base, extra);
  }
  fs.writeFileSync(file, `${JSON.stringify(base, null, 2)}\n`, 'utf8');
  console.log(`merged ${lang}/${targetFile}`);
}

for (const lang of ['zh', 'en']) {
  const mpExtra = loadTsObject(path.join(localesRoot, lang, 'marketplacePage.ts'));
  const paymentExtra = loadTsObject(path.join(localesRoot, lang, 'paymentPage.ts'));
  const pdExtra = loadTsObject(path.join(localesRoot, lang, 'productDetailExtras.ts'));
  const wcExtra = loadTsObject(path.join(localesRoot, lang, 'walletNetworkExtras.ts'));

  mergeFile(lang, 'translation_marketplace.json', mpExtra, paymentExtra, pdExtra);
  mergeFile(lang, 'translation_common.json', wcExtra);
}

console.log('Extras merged.');
