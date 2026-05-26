/**
 * Split DaoPage.module.scss by line ranges (1-based inclusive).
 * Run from repo: node scripts/split-dao-scss.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DAO_DIR = path.join(__dirname, '../src/pages/dao');
const SOURCE = path.join(DAO_DIR, 'DaoPage.module.scss');

/** @type {Record<string, number[][]>} */
const SPLITS = {
  'DaoPage.module.scss': [[1, 38]],
  'DaoLayout.module.scss': [[39, 49], [1066, 1089]],
  'styles/dao.pageLayout.module.scss': [[1091, 1148]],
  'styles/dao.shared.module.scss': [[1150, 1158], [2184, 2237]],
  'styles/dao.listTags.module.scss': [[1378, 1398], [1903, 2026]],
  'components/DaoHeroSection.module.scss': [[51, 66], [395, 458]],
  'components/DaoHeroBackground.module.scss': [[68, 393]],
  'components/DaoHeroCarousel.module.scss': [[459, 1064]],
  'components/DaoMainListCard.module.scss': [[1160, 1377], [1399, 2183]],
  'components/DaoDiscussionTopicTagsCard.module.scss': [[1702, 1902]],
  'components/DaoParticipationCard.module.scss': [[2239, 2359]],
  'components/DaoProposalRulesCard.module.scss': [[2361, 2475]],
  'components/DaoTabOverviewCard.module.scss': [[2477, 3272]],
  'components/DaoAnnouncementTicker.module.scss': [[3273, 3369]],
  'styles/dao.detailCommon.module.scss': [
    [3379, 3395],
    [3512, 3681],
  ],
  'components/DaoEventDetail.module.scss': [[3370, 3511]],
  'components/DaoDiscussionDetail.module.scss': [
    [3683, 3799],
    [4068, 4126],
  ],
  'components/DaoDiscussionReplyList.module.scss': [[3800, 3962]],
  'components/DaoDiscussionReplyComposer.module.scss': [[3963, 4067]],
  'components/DaoProposalDetail.module.scss': [[4127, 4793]],
  'components/DaoProposalEditor.module.scss': [[4794, 5092]],
};

function extractLines(lines, start, end) {
  return lines.slice(start - 1, end).join('\n');
}

function main() {
  const lines = fs.readFileSync(SOURCE, 'utf8').split('\n');
  const header =
    '/* Requires ancestor .pageRoot for --dao-* CSS variables */\n\n';

  for (const [relFile, ranges] of Object.entries(SPLITS)) {
    const chunks = ranges.map(([s, e]) => extractLines(lines, s, e));
    const outPath = path.join(DAO_DIR, relFile);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const fileHeader = relFile === 'DaoPage.module.scss' ? '' : header;
    fs.writeFileSync(outPath, fileHeader + chunks.join('\n\n') + '\n', 'utf8');
    console.log(`${relFile}: ${ranges.map((r) => r.join('-')).join(', ')}`);
  }

  console.log('\nSplit complete. DaoPage.module.scss now only has pageRoot.');
}

main();
