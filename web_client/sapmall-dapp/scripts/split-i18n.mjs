/**
 * 将 legacy translation.json 拆分为按导航模块划分的 JSON 文件。
 * 用法: node scripts/split-i18n.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesRoot = path.join(__dirname, '../src/i18n/locales');

const COMMON_KEYS = ['common', 'header', 'navigation', 'user', 'walletConnect', 'homepage', 'footer'];
const MODULE_KEYS = {
  marketplace: ['marketplacePage', 'productDetail', 'payment', 'checkout'],
  rewards: ['rewards'],
  exchange: ['exchange'],
  dao: ['dao'],
  help: ['help'],
};

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}

function writeJson(lang, filename, data) {
  const dir = path.join(localesRoot, lang);
  const file = path.join(dir, filename);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`  wrote ${lang}/${filename}`);
}

function splitLang(lang) {
  const legacyPath = path.join(localesRoot, lang, 'translation.json');
  if (!fs.existsSync(legacyPath)) {
    console.warn(`skip ${lang}: no translation.json`);
    return;
  }
  const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));

  writeJson(lang, 'translation_common.json', pick(legacy, COMMON_KEYS));

  const marketplace = pick(legacy, MODULE_KEYS.marketplace);
  // 合并旧独立文件（若存在）
  const mpPath = path.join(localesRoot, lang, 'marketplacePage.json');
  const mpTsPath = path.join(localesRoot, lang, 'marketplacePage.ts');
  if (fs.existsSync(mpPath)) {
    Object.assign(marketplace, JSON.parse(fs.readFileSync(mpPath, 'utf8')));
  }
  const paymentPath = path.join(localesRoot, lang, 'paymentPage.json');
  if (fs.existsSync(paymentPath)) {
    Object.assign(marketplace, JSON.parse(fs.readFileSync(paymentPath, 'utf8')));
  }
  writeJson(lang, 'translation_marketplace.json', marketplace);

  writeJson(lang, 'translation_rewards.json', pick(legacy, MODULE_KEYS.rewards));
  writeJson(lang, 'translation_exchange.json', pick(legacy, MODULE_KEYS.exchange));
  writeJson(lang, 'translation_dao.json', pick(legacy, MODULE_KEYS.dao));

  const helpPath = path.join(localesRoot, lang, 'help.json');
  if (fs.existsSync(helpPath)) {
    writeJson(lang, 'translation_help.json', JSON.parse(fs.readFileSync(helpPath, 'utf8')));
  } else {
    writeJson(lang, 'translation_help.json', pick(legacy, MODULE_KEYS.help));
  }
}

console.log('Splitting i18n locales...');
for (const lang of ['zh', 'en']) {
  console.log(`\n[${lang}]`);
  splitLang(lang);
}
console.log('\nDone.');
