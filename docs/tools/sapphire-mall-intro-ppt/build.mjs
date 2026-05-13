/**
 * 生成 Sapphire Mall 项目介绍 PPTX（内容对齐 README / PRD / Bags PRD / Roadmap）。
 * 运行：npm install && node build.mjs
 */
import pptxgen from "pptxgenjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** 若默认 pptx 被占用，可设置环境变量 SMALL_PPT_OUT 为其它文件名再生成。 */
const outFile = process.env.SMALL_PPT_OUT ?? "Sapphire_Mall_项目介绍.pptx";
const outPath = join(__dirname, "..", "..", outFile);

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Sapphire Mall";
pres.title = "Sapphire Mall 项目介绍";
pres.subject = "平台概览与规划";

const masterBlue = "1a237e";
const accent = "3949ab";
const textMuted = "5c6bc0";

function addTitleSlide(title, subtitle) {
  const s = pres.addSlide();
  s.background = { color: masterBlue };
  s.addText(title, {
    x: 0.5,
    y: 2.2,
    w: 12.3,
    h: 1.4,
    fontSize: 40,
    bold: true,
    color: "FFFFFF",
    fontFace: "Microsoft YaHei",
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5,
      y: 3.6,
      w: 12.3,
      h: 1.2,
      fontSize: 18,
      color: textMuted,
      fontFace: "Microsoft YaHei",
    });
  }
}

function addSection(title) {
  const s = pres.addSlide();
  s.background = { color: accent };
  s.addText(title, {
    x: 0.6,
    y: 3.2,
    w: 12.2,
    h: 1.5,
    fontSize: 36,
    bold: true,
    color: "FFFFFF",
    fontFace: "Microsoft YaHei",
  });
}

function addParagraphSlide(title, body, opts = {}) {
  const s = pres.addSlide();
  s.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 12.5,
    h: 0.65,
    fontSize: 28,
    bold: true,
    color: masterBlue,
    fontFace: "Microsoft YaHei",
  });
  s.addText(body, {
    x: 0.55,
    y: 1.05,
    w: 12.4,
    h: 6.55,
    fontSize: opts.fontSize ?? 18,
    color: "212121",
    fontFace: "Microsoft YaHei",
    lineSpacingMultiple: 1.22,
  });
}

function addBullets(title, bullets, opts = {}) {
  const s = pres.addSlide();
  s.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 12.5,
    h: 0.65,
    fontSize: 28,
    bold: true,
    color: masterBlue,
    fontFace: "Microsoft YaHei",
  });
  s.addText(bullets.join("\n"), {
    x: 0.55,
    y: 1.1,
    w: 12.4,
    h: 6.5,
    fontSize: opts.fontSize ?? 17,
    color: "212121",
    fontFace: "Microsoft YaHei",
    bullet: true,
    lineSpacingMultiple: 1.15,
  });
}

// --- Slides ---
addTitleSlide(
  "Sapphire Mall",
  "去中心化社区自驱动的虚拟商品交易平台 · 项目介绍"
);

const PLATFORM_INTRO_BODY =
  "Sapphire Mall 是基于区块链的虚拟商品交易平台，支持主流稳定币与平台通证 SAP 作为主要支付手段；以 DAO 推动社区共建共治，让买家、创作者与社区贡献者等不同角色互惠共赢、共享平台价值。以 Bags 作为可编排的增长与实验层，支持多样化营销与创作者向玩法，帮助平台在不绑死主交易架构的前提下，加速验证市场反馈与商业闭环。";

addParagraphSlide("1. 平台简介", PLATFORM_INTRO_BODY, { fontSize: 17 });

addSection("2. 传统电商痛点");

addBullets("Web2 电商的典型局限", [
  "入驻费、保证金与营销预算流向不透明，商家侧难以审计与对账。",
  "交易资金依赖平台托管与中心化清结算，存在对手方与挪用风险。",
  "纠纷处理依赖平台单方规则与信誉背书，过程与结果难被用户验证。",
  "虚拟商品确权与分账规则常不透明，创作者收益保障不足。",
  "跨境支付与多币种成本高，治理参与弱，用户难以分享平台成长红利。",
]);

addSection("3. 去中心化优势与产品特点");

addBullets("链上结算与支付", [
  "支持 USDT、USDC 等稳定币与 SAP（ERC-20）双轨支付，兼顾熟悉度与生态通证。",
  "关键规则由合约与链上记录承载，订单与资产状态可审计、难单方面篡改。",
  "面向虚拟商品场景：数字内容、工具与服务等，区别于纯炒作型 NFT 叙事。",
]);

addBullets("全球化与体验", [
  "DApp 内置中英文（i18n），文档与产品口径双语，面向更广泛用户与合作伙伴。",
  "主路径强调钱包连接、网络与余额反馈清晰，降低误操作成本。",
  "暗色 Web3 视觉与响应式布局，桌面与移动端关键交易路径一屏内可完成主要操作。",
]);

addBullets("社区与多角色价值对齐", [
  "DAO 与提案投票：费率、功能与金库用途等可由 SAP 持有者参与决策（叙事与实现以当前里程碑为准）。",
  "社区审核、纠纷陪审与任务激励：贡献可映射为 SAP 或积分类激励，形成自运转飞轮。",
  "认证商家以较低链上摩擦发布与上架商品；平台收入含交易手续费与增值服务，部分注入金库由治理决定用途。",
]);

addSection("4. 角色划分与收益模型");

addBullets("角色与收益（与 PRD / 用户故事地图一致）", [
  "普通用户 / 买家：浏览购买虚拟商品；可参与治理投票、审核、仲裁与任务获取 SAP 或权益。",
  "创作者 / 认证商家：完成认证后上架商品（元数据与文件可走 IPFS 等去中心化存储）；销售收入归创作者，平台按规则收取手续费等。",
  "社区贡献者 / 陪审员：参与商品审核与纠纷裁决，按规则获得激励；陪审资格与商家保证金等与 SAP 锁定场景相关（详见 PRD）。",
  "平台 / DAO 金库：手续费与部分费用进入金库，由 DAO 决定回购销毁、生态激励或建设投入。",
  "说明：PRD v0.4 已聚焦交易与治理，质押与「流动性挖矿」不作为当前主叙事；远期流动性与 DeFi 扩展见路线图与通证文档中的规划条目。",
], { fontSize: 15 });

addSection("5. 活动营销与 Bags 集成");

addBullets("增长引擎：Bags（Solana）", [
  "问题：若把全部营销活动塞进购物车与 SAP 主合约路径，迭代成本高且易混淆「活动资产」与主代币。",
  "方案：对接 Bags 的 launch、Launch Intent 与开放 API/SDK，活动上链快、易传播；主站保持 EVM 商城与 SAP 经济稳定边界。",
  "入口统一：DApp 内所有活动、奖励及 Bags 说明与外链聚合在「/rewards（生态活动）」；「/marketplace」专注选品与下单，不承担活动主入口。",
]);

addBullets("钱包与边界（产品口径）", [
  "仅购物与 SAP 主链路：用户只需 EVM 钱包。",
  "参与 Bags 活动：链上环节在 Bags 完成，需按提示使用 Solana 钱包；不参与活动不受影响。",
  "自愿 EVM ↔ Solana 绑定（规划中的二期能力）用于站内权益与画像，不能替代 Bags 侧签名授权。",
]);

addSection("6. 现有功能与演示入口");

addBullets("功能清单（与 README 路由对齐）", [
  "sapmall-dapp：/marketplace 代币化商品商城；/exchange 兑换与资产；/rewards 生态活动与 Bags 聚合；/dao 社区与治理；/help 帮助；内嵌 /admin 管理后台。",
  "sapmall-admin：平台与商家侧运营管理（订单、用户、商家等）。",
  "sapmall-website：项目官网与对外叙事。",
  "design/prototypes：高保真 HTML 原型，可用于离线演示与视觉对齐。",
]);

addBullets("建议演示顺序", [
  "官网（sapmall-website）→ DApp 连接钱包 → 商城浏览与商品详情。",
  "展示双币支付与订单流程（按当前测试网 / 环境配置）。",
  "进入 /rewards 说明 Bags 外链与活动规则，强调与结账路径分离。",
  "DAO / 帮助页：治理叙事与 FAQ。",
]);

addSection("7. 未来规划");

addBullets("路线图摘要（Roadmap / PRD）", [
  "V1.0 MVP：核心合约与 SAP、商家认证、商品发布与发现、稳定币+SAP 支付、社区审核与纠纷仲裁 V1、基础 DAO 提案/投票、个人中心与运营看板。",
  "V2.0：深化 DAO（贡献度加权投票、金库模块）、创作者工具箱、贡献度激励与 SAP 场景扩展、评论与通知。",
  "V3.0：多链部署、可组合资产标准、第三方集成与 API/SDK、DID、AI 辅助推荐与审核等长期方向。",
  "Bags 侧：在「跳转 + 凭证叙事」基础上，可演进后端记账、快照权益与 SAP 激励的合规衔接（以子域 PRD 迭代为准）。",
]);

addTitleSlide("谢谢", "详细文档见仓库 docs/（PRD、白皮书、Tokenomics、Bags PRD、Roadmap）");

await pres.writeFile({ fileName: outPath });
console.log("Written:", outPath);
