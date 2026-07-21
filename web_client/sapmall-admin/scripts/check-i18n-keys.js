/**
 * 校验 Admin 中英文 i18n key 是否对拍。
 * 用法：npm run check:i18n
 */
const fs = require('fs');
const path = require('path');

const LOCALE_ROOT = path.join(__dirname, '../src/i18n/locales');

function flattenKeys(obj, prefix = '') {
  const keys = [];
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return keys;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function loadLangKeys(lang) {
  const dir = path.join(LOCALE_ROOT, lang);
  if (!fs.existsSync(dir)) {
    throw new Error(`缺少语言目录: ${dir}`);
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const merged = {};
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    deepMerge(merged, data);
  }
  return new Set(flattenKeys(merged));
}

function diff(a, b) {
  return [...a].filter((k) => !b.has(k)).sort();
}

const zhKeys = loadLangKeys('zh');
const enKeys = loadLangKeys('en');

const missingInEn = diff(zhKeys, enKeys);
const missingInZh = diff(enKeys, zhKeys);

console.log(`zh keys: ${zhKeys.size}`);
console.log(`en keys: ${enKeys.size}`);

if (missingInEn.length || missingInZh.length) {
  if (missingInEn.length) {
    console.error('\n英文缺失 key:');
    missingInEn.forEach((k) => console.error(`  - ${k}`));
  }
  if (missingInZh.length) {
    console.error('\n中文缺失 key:');
    missingInZh.forEach((k) => console.error(`  - ${k}`));
  }
  process.exit(1);
}

console.log('\n✓ 中英文 i18n key 对拍通过');
