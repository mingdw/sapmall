import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/pages/marketplace/product');

function fixImports(content) {
  return content
    .replace(/from '\.\.\/\.\.\/\.\.\/components/g, "from '../../../../components")
    .replace(/from '\.\.\/\.\.\/\.\.\/services/g, "from '../../../../services")
    .replace(/from '\.\.\/\.\.\/\.\.\/utils/g, "from '../../../../utils")
    .replace(/from '\.\.\/\.\.\/services/g, "from '../../../services")
    .replace(/from '\.\.\/\.\.\/utils/g, "from '../../../utils");
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|scss)$/.test(name)) {
      let c = fs.readFileSync(p, 'utf8');
      const next = fixImports(c);
      if (name === 'paths.ts') {
        const updated = next
          .replace('/product/:productCode', '/marketplace/product/:productCode')
          .replace('`/product/${', '`/marketplace/product/${')
          .replace('pages/product', 'pages/marketplace/product');
        fs.writeFileSync(p, updated);
      } else if (next !== c) {
        fs.writeFileSync(p, next);
      }
    }
  }
}

walk(root);
console.log('imports fixed');
