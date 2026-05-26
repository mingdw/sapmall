/**
 * 生成商品主图 UPDATE SQL（多源免费样例图，已避开无效 Unsplash / picsum seed）
 * 运行: node backend_service/docs/sql/generate_product_image_updates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataSql = path.join(__dirname, '..', 'sapphire_mall_data.sql');
const outSql = path.join(__dirname, 'update_product_images_unsplash.sql');

const VERIFIED_UNSPLASH = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80',
];

const PEXELS = [
  'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const FLICKR_TAGS = {
  '111000': 'abstract,art',
  '112000': 'music,concert',
  '113000': 'digital,technology',
  '114000': 'book,writing',
  '121000': 'portrait,people',
  '122000': 'character,cosplay',
  '123000': 'social,network',
  '131000': 'game,video',
  '132000': 'technology,gaming',
  '133000': 'fantasy,character',
  '134000': 'game,design',
  '135000': 'animal,pet',
  '136000': 'architecture,city',
  '137000': 'car,vehicle',
  '138000': 'space,future',
  '211000': 'design,graphic',
  '212000': 'template,design',
  '213000': 'icon,digital',
  '311000': 'education,book',
  '312000': 'classroom,learning',
};

function hashSeed(seed) {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function buildImageUrl(product) {
  const h = hashSeed(`${product.cat3}-${product.id}`);
  const mode = h % 5;
  if (mode === 0) {
    const n = 10 + (h % 90);
    return `https://picsum.photos/id/${n}/800/600.jpg`;
  }
  if (mode === 1) {
    const tags = FLICKR_TAGS[product.cat3] || 'digital,abstract';
    const lock = h % 10000;
    return `https://loremflickr.com/800/600/${tags}/all?lock=${lock}`;
  }
  if (mode === 2) return VERIFIED_UNSPLASH[h % VERIFIED_UNSPLASH.length];
  if (mode === 3) return PEXELS[h % PEXELS.length];
  const hues = ['312e81', '1e3a5f', '4c1d95'];
  const accent = ['c4b5fd', '7dd3fc', 'f0abfc'];
  const i = h % hues.length;
  return `https://dummyimage.com/800x600/${hues[i]}/${accent[i]}.png&text=SAP+${product.id}`;
}

const content = fs.readFileSync(dataSql, 'utf8');
const products = [];
const insertRe = /INSERT INTO `sys_product_spu`[\s\S]*?VALUES \(([\s\S]*?)\);/g;
let block;
while ((block = insertRe.exec(content)) !== null) {
  const vals = block[1];
  const id = Number(vals.match(/^(\d+)/)?.[1]);
  const code = vals.match(/^\d+, '([^']+)'/)?.[1];
  const name = vals.match(/^\d+, '[^']+', '([^']+)'/)?.[1];
  const cat3 = vals.match(/'(\d{6})', \d+, '(\d{6})', \d+, '(\d{6})'/)?.[3];
  const images = vals.match(/, 1, '([^']*)', '20/)?.[1];
  if (!id || !code || !name) continue;
  products.push({ id, code, name, cat3, images });
}

const lines = [
  '-- 商品主图批量更新 — 多源免费样例图（picsum 直链 / loremflickr / pexels / 已验证 unsplash / dummyimage）',
  '-- 会覆盖 example.com、无效 unsplash、picsum seed 等旧链接；保留 sap01 COS 主图',
  '-- 执行: mysql -u user -p saphire_mall < update_product_images_unsplash.sql',
  '',
  'START TRANSACTION;',
  '',
];

let updateCount = 0;
for (const p of products) {
  if (p.images?.includes('sap01-1251895040.cos.ap-guangzhou.myqcloud.com')) {
    lines.push(`-- id=${p.id} ${p.name} — 保留 COS 图片`);
    lines.push('');
    continue;
  }
  const url = buildImageUrl(p);
  updateCount += 1;
  lines.push(`-- id=${p.id} ${p.name} (${p.code})`);
  lines.push(`UPDATE sys_product_spu SET images = '${url}', updated_at = NOW() WHERE id = ${p.id};`);
  lines.push('');
}

lines.push('COMMIT;', '');
lines.push(`-- 共 ${updateCount} 条更新`);

fs.writeFileSync(outSql, lines.join('\n'), 'utf8');
console.log(`Generated ${updateCount} updates -> ${outSql}`);
