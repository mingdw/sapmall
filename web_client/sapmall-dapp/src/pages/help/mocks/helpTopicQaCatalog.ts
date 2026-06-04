/* AUTO-GENERATED — node scripts/gen-help-topic-qa.mjs */
import type { HelpArticleMeta, HelpCategory, HelpFaqItem } from '../types';
import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';
import { enrichTopicQaRichContent } from '../utils/buildTopicQaRichContent';
import { buildTopicQaArticleBlocks } from '../utils/buildHelpArticleBlocks';
import { computeHelpViewCount } from '../utils/formatHelpMetric';

export const TOPIC_QA_PER_CATEGORY = 12;

export type TopicQaLocaleText = { title: string; summary: string; body: string };
export type TopicQaEntry = { zh: TopicQaLocaleText; en: TopicQaLocaleText };

const QA_BY_CATEGORY: Record<HelpCategory, TopicQaEntry[]> = {
  'getting-started': [
    { zh: { title: '如何连接 MetaMask 钱包？', summary: '页头连接钱包并完成签名即可开始使用。', body: '点击页头「连接钱包」，选择 MetaMask 等插件钱包，解锁账户后授权并签名。连接成功即可浏览商城、兑换 SAP 与下单。' }, en: { title: 'How do I connect MetaMask?', summary: 'Use Connect wallet in the header and sign once.', body: 'Click Connect wallet, choose MetaMask or another extension, unlock, approve, and sign. You can then browse, swap, and checkout.' } },
    { zh: { title: '新用户 3 分钟能做什么？', summary: '连接钱包 → 兑换 SAP → 完成首单。', body: '建议路径：连接钱包 → 在兑换页将稳定币换成 SAP → 进入商城选购并完成链上支付。首次可用小额 SAP 试单。' }, en: { title: 'What can I do in 3 minutes?', summary: 'Connect → swap to SAP → place a first order.', body: 'Path: connect wallet → swap stablecoins to SAP on Exchange → shop and pay on-chain. Start with a small SAP test order.' } },
    { zh: { title: '如何完成第一笔订单？', summary: '选品、确认订单、钱包签名支付三步完成。', body: '在商城选择商品进入详情页，确认价格与规格后提交订单，在钱包中确认交易并等待链上确认。' }, en: { title: 'How do I place my first order?', summary: 'Pick a product, confirm checkout, sign in the wallet.', body: 'Choose an item, confirm price and specs, submit the order, sign the transaction, and wait for on-chain confirmation.' } },
    { zh: { title: '什么是 Gas 费？', summary: '链上交易的网络手续费，需预留原生代币支付。', body: 'Gas 由区块链网络收取，与商品金额无关。请确保钱包内有少量 ETH 等原生币用于支付网络费。' }, en: { title: 'What is gas?', summary: 'Network fee for on-chain txs; keep native token for gas.', body: 'Gas is paid to the network, not the store. Keep a small amount of ETH (or native coin) in the wallet for fees.' } },
    { zh: { title: 'SAP 可以用来做什么？', summary: '可用于商城支付、保证金及部分生态场景。', body: 'SAP 是平台核心代币，可在商城结算、参与活动等。余额可在钱包与交易历史中查看。' }, en: { title: 'What is SAP used for?', summary: 'Checkout, deposits, and select ecosystem features.', body: 'SAP is the platform token for marketplace payments and campaigns. Check balance in wallet and history.' } },
    { zh: { title: '如何查看交易历史？', summary: '在「交易历史」查看订单与链上记录。', body: '登录后进入交易历史，可按类型筛选支付、兑换、退款等记录，并复制 TxHash 备查。' }, en: { title: 'Where is transaction history?', summary: 'Open Transaction history for orders and on-chain logs.', body: 'Filter payments, swaps, refunds, and copy TxHash for verification on a block explorer.' } },
    { zh: { title: '支持哪些浏览器？', summary: '推荐 Chrome、Brave 等安装钱包插件的浏览器。', body: '请使用最新版 Chrome、Brave 或 Firefox，并安装官方钱包扩展。避免使用已停止维护的旧版浏览器。' }, en: { title: 'Which browsers are supported?', summary: 'Chrome, Brave, or Firefox with a wallet extension.', body: 'Use an up-to-date browser with the official wallet extension. Avoid outdated browsers.' } },
    { zh: { title: '连接后看不到余额怎么办？', summary: '确认网络正确并刷新页面后重试。', body: '检查钱包所选网络是否与平台要求一致，刷新页面或重新连接钱包。若仍异常，可尝试切换 RPC 或联系支持。' }, en: { title: 'Balance not showing after connect?', summary: 'Verify network and refresh, then reconnect.', body: 'Ensure the wallet network matches the platform, refresh or reconnect. Switch RPC or contact support if needed.' } },
    { zh: { title: '如何参与生态奖励？', summary: '在生态奖励页查看任务与发放记录。', body: '进入「生态奖励」浏览可参与任务，按规则完成行为后奖励将按活动说明发放至钱包。' }, en: { title: 'How do ecosystem rewards work?', summary: 'See tasks and payouts on the Rewards page.', body: 'Open Ecosystem rewards for eligible tasks. Payouts follow each campaign’s rules.' } },
    { zh: { title: '第一次购物建议金额多少？', summary: '建议小额试单以熟悉 Gas 与确认时间。', body: '首次建议使用可承受的小额 SAP 完成一笔订单，了解从签名到确认的全流程后再加大金额。' }, en: { title: 'How much for a first purchase?', summary: 'Start small to learn gas and confirmation time.', body: 'Use a small SAP amount for the first order, then scale up once you understand the flow.' } },
    { zh: { title: '如何切换中英文？', summary: '使用页头语言切换器即可。', body: '点击页头语言/地区入口，选择中文或 English，帮助中心与商城文案将同步切换。' }, en: { title: 'How do I change language?', summary: 'Use the language switcher in the header.', body: 'Switch between Chinese and English; help and marketplace copy update accordingly.' } },
    { zh: { title: '账号与资产安全基础', summary: '妥善保管助记词，警惕钓鱼链接。', body: '切勿向任何人透露助记词或私钥；确认官网域名后再连接钱包；大额资产建议使用硬件钱包。' }, en: { title: 'Basic account and asset safety', summary: 'Protect seed phrase; beware phishing.', body: 'Never share seed phrase or private key; verify the domain before connecting; consider a hardware wallet for large holdings.' } },
  ],
  'wallet-security': [
    { zh: { title: '钱包连接失败怎么办？', summary: '检查插件、网络与站点授权。', body: '确认钱包已解锁、网络正确，断开站点后重新连接。可尝试无痕模式或更换浏览器。' }, en: { title: 'Wallet won’t connect?', summary: 'Check extension, network, and site permissions.', body: 'Unlock the wallet, verify network, disconnect the site and reconnect. Try incognito or another browser.' } },
    { zh: { title: '如何保护私钥与助记词？', summary: '离线备份，永不截图或发送他人。', body: '助记词仅手写离线保存；不要通过聊天工具传输；SapMall 不会索要助记词。' }, en: { title: 'How to protect keys and seed phrase?', summary: 'Offline backup only; never share.', body: 'Write seed phrase offline only; never send via chat; SapMall will never ask for it.' } },
    { zh: { title: '选错网络如何解决？', summary: '在钱包中切换到平台支持的链。', body: '打开钱包网络列表，选择推荐网络，刷新 SapMall 后重新连接并完成签名。' }, en: { title: 'Wrong network selected?', summary: 'Switch to a supported chain in the wallet.', body: 'Pick the recommended network, refresh SapMall, reconnect and sign.' } },
    { zh: { title: '如何撤销代币授权？', summary: '在钱包或区块浏览器管理 Approve。', body: '对不再使用的合约授权建议撤销，降低资产被盗风险。路径因钱包而异，可在安全中心查找。' }, en: { title: 'How to revoke token approvals?', summary: 'Manage Approve in wallet or explorer.', body: 'Revoke unused approvals to reduce risk. Steps vary by wallet—check security settings.' } },
    { zh: { title: '硬件钱包是否支持？', summary: '支持主流硬件钱包连接签名。', body: '可通过 WalletConnect 或兼容方式连接硬件钱包，签名前请核对设备屏幕上的地址与金额。' }, en: { title: 'Are hardware wallets supported?', summary: 'Major hardware wallets work via WalletConnect.', body: 'Connect via WalletConnect or compatible flow; verify address and amount on device screen.' } },
    { zh: { title: '签名前如何防钓鱼？', summary: '核对域名与交易参数。', body: '确认浏览器地址为官方域名；签名弹窗中的收款地址、金额与页面展示一致再确认。' }, en: { title: 'Avoid phishing before signing', summary: 'Verify domain and tx details.', body: 'Confirm official URL; ensure recipient, amount, and data match the UI before signing.' } },
    { zh: { title: '多个钱包账户如何切换？', summary: '在钱包扩展内切换账户后刷新站点。', body: '在 MetaMask 等扩展中切换账户，回到 SapMall 断开并重新连接以同步当前地址。' }, en: { title: 'Switch wallet accounts', summary: 'Change account in extension then reconnect site.', body: 'Switch in MetaMask, disconnect SapMall, reconnect to sync the active address.' } },
    { zh: { title: '连接后提示地址不匹配', summary: '使用曾完成 KYC 或绑定的同一地址。', body: '若平台要求特定地址，请在钱包中选择对应账户。必要时联系支持说明情况。' }, en: { title: 'Address mismatch warning', summary: 'Use the same address used for binding/KYC.', body: 'Select the required account in the wallet or contact support.' } },
    { zh: { title: '什么是交易模拟失败？', summary: '可能余额不足或合约限制。', body: '钱包模拟失败时检查 SAP/稳定币余额、授权额度与网络状态，调整参数后重试。' }, en: { title: 'Simulation failed?', summary: 'Often balance, approval, or contract limits.', body: 'Check SAP/stablecoin balance, allowances, and network; adjust and retry.' } },
    { zh: { title: '如何识别假客服？', summary: '官方不会私聊索要助记词。', body: '客服不会通过 DM 索取助记词、私钥或转账。请仅使用帮助中心公示的渠道。' }, en: { title: 'Spot fake support', summary: 'We never ask for seed phrase in DMs.', body: 'Official support won’t request seed phrase, keys, or transfers via private messages.' } },
    { zh: { title: '钱包被盗应急步骤', summary: '立即转移剩余资产并撤销授权。', body: '若怀疑泄露，尽快将剩余资产转至新钱包，撤销可疑授权，并更换所有关联密码。' }, en: { title: 'Wallet compromise steps', summary: 'Move funds and revoke approvals.', body: 'Transfer remaining assets to a new wallet, revoke suspicious approvals, rotate passwords.' } },
    { zh: { title: '浏览器插件安全建议', summary: '只安装官方商店版本。', body: '从 Chrome 网上应用店等官方渠道安装钱包插件，勿使用来路不明的破解版。' }, en: { title: 'Browser extension safety', summary: 'Install only from official stores.', body: 'Use Chrome Web Store etc.; avoid unofficial cracked builds.' } },
  ],
  'exchange-payment': [
    { zh: { title: '稳定币如何兑换 SAP？', summary: '在兑换页选币、授权、确认兑换。', body: '进入兑换页选择 USDT/USDC 等，输入数量，首次需 Approve，确认兑换交易并等待到账。' }, en: { title: 'Swap stablecoins to SAP?', summary: 'Pick token on Exchange, approve, confirm.', body: 'Choose USDT/USDC, enter amount, Approve if first time, confirm swap and wait for credit.' } },
    { zh: { title: 'SAP 支付手续费说明', summary: 'SAP 结算可能享受费率优惠。', body: '使用 SAP 支付商城订单时，平台可能减免部分手续费，具体以兑换页与活动公告为准。' }, en: { title: 'SAP payment fees', summary: 'SAP checkout may qualify for discounts.', body: 'Fee reductions apply to SAP settlements per Exchange and campaign notices.' } },
    { zh: { title: '兑换失败常见原因', summary: '余额、滑点、授权或拥堵导致。', body: '检查余额是否充足、滑点是否合理、是否已完成授权；失败可在钱包查看 revert 原因。' }, en: { title: 'Why swaps fail', summary: 'Balance, slippage, approval, or congestion.', body: 'Verify balance, slippage, and allowances; inspect revert reason in the wallet.' } },
    { zh: { title: '兑换限额是多少？', summary: '单笔与每日限额见兑换页公示。', body: '大额兑换可能需额外确认或分批操作，请以页面实时显示的限额为准。' }, en: { title: 'Swap limits', summary: 'Per-tx and daily limits on Exchange page.', body: 'Large swaps may need extra steps; follow on-screen limits.' } },
    { zh: { title: 'Approve 授权是什么？', summary: '允许合约使用指定数量代币。', body: '首次兑换需授权合约划转稳定币，仅授权必要额度可降低风险。' }, en: { title: 'What is Approve?', summary: 'Lets the contract spend your token allowance.', body: 'First swap needs approval—grant only needed allowance to reduce risk.' } },
    { zh: { title: '到账时间多久？', summary: '取决于链上确认速度。', body: '兑换提交后需等待区块确认，拥堵时可能延长，可在交易历史查看状态。' }, en: { title: 'How long to settle?', summary: 'Depends on confirmations.', body: 'After broadcast, wait for confirmations; check status in history.' } },
    { zh: { title: '支持哪些稳定币？', summary: '常见 USDT、USDC 等以页面为准。', body: '兑换页会列出当前支持的输入代币与网络，请选择与钱包网络一致的代币。' }, en: { title: 'Which stablecoins?', summary: 'USDT, USDC, etc.—see Exchange list.', body: 'Pick a token matching your wallet network as shown on the page.' } },
    { zh: { title: '滑点设置建议', summary: '波动大时适当提高滑点。', body: '市价波动剧烈时，过低滑点可能导致兑换失败，可适当上调并注意价格影响。' }, en: { title: 'Slippage tips', summary: 'Raise slippage in volatile markets.', body: 'Too low may fail; increase carefully and watch price impact.' } },
    { zh: { title: 'SAP 余额未更新', summary: '等待确认或刷新页面。', body: '链上确认完成后余额才会更新，请稍候并刷新；长时间未到账请凭 TxHash 联系支持。' }, en: { title: 'SAP balance not updated', summary: 'Wait for confirmation or refresh.', body: 'Balance updates after on-chain confirmation; contact support with TxHash if delayed.' } },
    { zh: { title: '能否取消进行中的兑换？', summary: '链上提交后一般无法取消。', body: '交易广播后无法由平台撤销，若长时间 pending 可在钱包加速或等待网络恢复。' }, en: { title: 'Cancel a pending swap?', summary: 'Usually cannot cancel on-chain.', body: 'Once broadcast, it cannot be revoked; speed up in wallet or wait.' } },
    { zh: { title: '汇率如何计算？', summary: '按池子实时价格与手续费。', body: '兑换页预览已含预估汇率与费用，确认前请仔细核对最终到账 SAP 数量。' }, en: { title: 'How is rate calculated?', summary: 'Live pool price plus fees.', body: 'Preview on Exchange includes estimated rate—verify before confirming.' } },
    { zh: { title: '保证金可以用 SAP 吗？', summary: '商家保证金支持 SAP 支付。', body: '入驻商家按指引在兑换/保证金专区使用 SAP 链上支付，完成后状态会更新。' }, en: { title: 'Pay deposit with SAP?', summary: 'Merchant deposit supports SAP.', body: 'Follow merchant guide to pay deposit on-chain; status updates after confirmation.' } },
  ],
  'marketplace': [
    { zh: { title: '如何浏览虚拟商品？', summary: '分类筛选与搜索定位商品。', body: '在商城首页按分类浏览或使用搜索，进入详情页查看价格、库存与交付说明。' }, en: { title: 'Browse virtual goods?', summary: 'Use categories and search.', body: 'Filter by category or search, open product page for price, stock, and delivery notes.' } },
    { zh: { title: '数字权益与 NFT 区别', summary: '权益类可能含链上凭证。', body: '虚拟道具侧重使用场景；数字权益/NFT 类商品请阅读交付方式与兑换有效期。' }, en: { title: 'Digital rights vs NFT items', summary: 'Some include on-chain proof.', body: 'Virtual items focus on usage; read delivery and redemption expiry for rights/NFT products.' } },
    { zh: { title: '购物车与结算流程', summary: '支持合并下单与 SAP 支付。', body: '将商品加入购物车后进入结算，确认明细与 Gas 预留，在钱包完成签名。' }, en: { title: 'Cart and checkout', summary: 'Combine items and pay with SAP.', body: 'Add to cart, review checkout, reserve gas, sign payment in wallet.' } },
    { zh: { title: '支付后多久交付？', summary: '依商品类型与链上确认时间。', body: '链上支付确认后，虚拟商品/兑换码将按商品页说明发放，请留意订单状态。' }, en: { title: 'Delivery timing', summary: 'Depends on product and confirmations.', body: 'After on-chain payment confirms, delivery follows product page rules—watch order status.' } },
    { zh: { title: '商品缺货怎么办？', summary: '可收藏或订阅到货通知。', body: '若显示售罄，可关注同类商品或稍后再试；已下单缺货将按规则退款。' }, en: { title: 'Out of stock?', summary: 'Try later or similar items.', body: 'If sold out, check alternatives; paid orders refunded per policy.' } },
    { zh: { title: '能否使用优惠券？', summary: '以结算页显示为准。', body: '若活动开放优惠券，将在结算页展示可用券与抵扣规则，SAP 支付同样适用活动条款。' }, en: { title: 'Coupons available?', summary: 'Shown at checkout if active.', body: 'Eligible coupons appear at checkout with SAP payment rules.' } },
    { zh: { title: '订单可以取消吗？', summary: '未链上确认前可能可取消。', body: '提交后若仍在 pending，部分订单可取消；已确认链上交易需走售后流程。' }, en: { title: 'Cancel an order?', summary: 'Possible before on-chain confirm.', body: 'Pending orders may be cancellable; confirmed txs need support flow.' } },
    { zh: { title: '虚拟商品如何退款？', summary: '符合规则可在订单页申请。', body: '查看商品退款政策，在订单详情发起申请，链上退款需等待确认。' }, en: { title: 'Refunds for virtual goods?', summary: 'Apply from order if eligible.', body: 'Read refund policy, submit from order details, wait for on-chain refund.' } },
    { zh: { title: '商品评价可信吗？', summary: '来自真实购买用户。', body: '评价与购买记录挂钩，仅供参考，购买前仍以商品详情为准。' }, en: { title: 'Are reviews trustworthy?', summary: 'From verified buyers.', body: 'Reviews are for reference—rely on product details for decisions.' } },
    { zh: { title: '如何联系卖家？', summary: '通过订单消息或客服中转。', body: '在订单详情使用站内消息；勿站外转账，防诈骗。' }, en: { title: 'Contact seller?', summary: 'Order messages or support.', body: 'Use in-app order messaging; never pay off-platform.' } },
    { zh: { title: '多商品合并 Gas', summary: '一笔订单一次签名为主。', body: '合并结算通常只需一次支付签名，具体 Gas 以钱包估算为准。' }, en: { title: 'Gas for multiple items', summary: 'Usually one signature per order.', body: 'Combined checkout typically needs one payment signature.' } },
    { zh: { title: '商品描述看不懂', summary: '可查看帮助或咨询客服。', body: '对交付方式、有效期有疑问时，先阅读该分类帮助文章，或联系客服确认。' }, en: { title: 'Unclear product description?', summary: 'Read help or ask support.', body: 'Check category help or contact support before buying.' } },
  ],
  'merchant': [
    { zh: { title: '商家入驻流程概览', summary: '提交资料 → 审核 → 缴纳保证金。', body: '在商家入口提交资质，审核通过后在 DApp 完成保证金链上支付，即可上架商品。' }, en: { title: 'Merchant onboarding overview', summary: 'Apply → review → pay deposit.', body: 'Submit credentials, after approval pay deposit on-chain in the DApp, then list products.' } },
    { zh: { title: '保证金要交多少？', summary: '按类目与等级公示标准执行。', body: '具体数额以入驻指引与后台提示为准，请确保钱包 SAP 余额充足并预留 Gas。' }, en: { title: 'How much deposit?', summary: 'Per category/level on the guide.', body: 'Follow onboarding prompts; keep enough SAP and gas in the wallet.' } },
    { zh: { title: '保证金可以退吗？', summary: '退出合作且无异议时可申请退还。', body: '满足退出条件后按规则发起退还，链上退回需等待确认，周期见商家协议。' }, en: { title: 'Is deposit refundable?', summary: 'When exiting without disputes.', body: 'Apply per exit rules; on-chain refund waits for confirmations per agreement.' } },
    { zh: { title: '商家后台在哪进入？', summary: '页头或帮助中心链接。', body: '具备权限的账户可从页头进入嵌入式商家后台，管理商品、订单与保证金状态。' }, en: { title: 'Where is merchant admin?', summary: 'Header or help center link.', body: 'Authorized users open embedded admin to manage products, orders, and deposit.' } },
    { zh: { title: '商品上架审核多久？', summary: '一般 1–3 个工作日。', body: '提交商品后进入审核队列，请确保图文与描述符合规范，驳回会注明修改意见。' }, en: { title: 'Listing review time?', summary: 'Typically 1–3 business days.', body: 'Listings enter review—ensure compliant copy/images; rejections include feedback.' } },
    { zh: { title: '订单发货如何操作？', summary: '虚拟商品多为自动交付。', body: '虚拟类订单在链上确认后系统自动履约；特殊商品按详情配置手动处理。' }, en: { title: 'How to fulfill orders?', summary: 'Virtual goods often auto-deliver.', body: 'After on-chain payment confirms, system fulfills; manual for special SKUs.' } },
    { zh: { title: '商家 SAP 结算周期', summary: '按平台结算规则对账。', body: '销售款项与手续费在结算周期内对账，明细可在后台财务报表查看。' }, en: { title: 'SAP settlement cycle', summary: 'Per platform schedule.', body: 'Sales and fees reconcile each cycle—see finance reports in admin.' } },
    { zh: { title: '违规会被处罚吗？', summary: '视情节警告、下架或清退。', body: '请遵守平台公约，严重违规可能扣除保证金或终止合作。' }, en: { title: 'Policy violations?', summary: 'Warnings, delist, or termination.', body: 'Follow marketplace rules; serious cases may forfeit deposit or end partnership.' } },
    { zh: { title: '如何修改店铺信息？', summary: '在后台店铺设置中编辑。', body: '更新 Logo、简介与客服联系方式后提交，部分修改需重新审核。' }, en: { title: 'Edit store profile?', summary: 'In store settings.', body: 'Update branding and support contacts; some changes need re-review.' } },
    { zh: { title: '多角色权限管理', summary: '主账号可邀请子账号。', body: '在权限管理中为运营、财务等角色分配最小必要权限，定期复核。' }, en: { title: 'Role permissions', summary: 'Owner invites sub-accounts.', body: 'Assign least privilege to ops/finance roles and review periodically.' } },
    { zh: { title: '保证金 TxHash 在哪填？', summary: '支付后系统自动抓取。', body: '完成链上支付后系统匹配交易，若长时间未更新请手动提交 TxHash 供核验。' }, en: { title: 'Deposit TxHash?', summary: 'Auto-captured after payment.', body: 'If status lags, submit TxHash manually for verification.' } },
    { zh: { title: '入驻审核被拒怎么办？', summary: '按意见补充材料重新提交。', body: '查看驳回原因，完善资质或说明后再次提交，必要时联系招商支持。' }, en: { title: 'Application rejected?', summary: 'Fix issues and resubmit.', body: 'Address rejection notes, improve docs, or contact onboarding support.' } },
  ],
  'order-support': [
    { zh: { title: '订单取消与退款', summary: '符合条件可在订单页申请。', body: '未履约或符合政策的订单可发起取消/退款，链上退回需等待网络确认。' }, en: { title: 'Cancel and refund orders', summary: 'Apply from order when eligible.', body: 'Cancel/refund per policy; on-chain refunds need confirmations.' } },
    { zh: { title: '用 TxHash 查询状态', summary: '复制哈希到区块浏览器。', body: '在交易历史复制 TxHash，打开对应网络浏览器查看确认数与执行结果。' }, en: { title: 'Look up TxHash', summary: 'Paste hash into block explorer.', body: 'Copy from history, open explorer for the network, check status.' } },
    { zh: { title: '支付一直 pending', summary: '等待确认，勿重复支付。', body: '网络拥堵时确认变慢，请耐心等待；勿对同一订单重复签名支付。' }, en: { title: 'Payment stuck pending', summary: 'Wait; do not pay twice.', body: 'Congestion slows confirmations—avoid duplicate payments for one order.' } },
    { zh: { title: '如何联系人工客服？', summary: '邮件、Discord 或 Telegram。', body: '提供订单号、钱包地址与 TxHash，便于快速定位问题。' }, en: { title: 'Contact human support', summary: 'Email, Discord, or Telegram.', body: 'Provide order ID, wallet address, and TxHash.' } },
    { zh: { title: '退款多久到账？', summary: '链上确认后自动入账。', body: '退款发起后需矿工确认，一般数分钟至数小时，极端拥堵可能更长。' }, en: { title: 'Refund timing', summary: 'Credits after on-chain confirm.', body: 'Usually minutes to hours; longer if network is busy.' } },
    { zh: { title: '订单显示成功未收货', summary: '先查交付方式与邮箱/站内信。', body: '虚拟商品可能为兑换码或链上凭证，请查看订单详情与消息通知。' }, en: { title: 'Paid but no delivery?', summary: 'Check delivery method and inbox.', body: 'Virtual goods may be codes or on-chain proofs—see order details.' } },
    { zh: { title: '能修改收货信息吗？', summary: '虚拟商品通常无需物流地址。', body: '数字商品以账号或链上地址交付为主，如有特殊字段请在下单前确认。' }, en: { title: 'Change delivery info?', summary: 'Usually N/A for digital goods.', body: 'Delivery is to account/address—verify before checkout.' } },
    { zh: { title: '重复扣款怎么办？', summary: '保留两笔 TxHash 联系支持。', body: '若误操作两次支付，请立即停止进一步操作并提交两笔哈希供核查退款。' }, en: { title: 'Double charge?', summary: 'Keep both TxHashes for support.', body: 'Stop further payments and submit both hashes for investigation.' } },
    { zh: { title: '发票如何申请？', summary: '企业用户可走工单渠道。', body: '按帮助中心指引提交开票信息与订单号，处理周期以客服回复为准。' }, en: { title: 'Request invoice?', summary: 'Enterprise via ticket flow.', body: 'Submit company info and order IDs per help guide.' } },
    { zh: { title: '售后申诉流程', summary: '订单详情发起并附证据。', body: '描述问题并上传截图/哈希，客服将在工作日按优先级处理。' }, en: { title: 'Appeal process', summary: 'Open ticket from order with proof.', body: 'Describe issue with screenshots/hashes; support replies on business days.' } },
    { zh: { title: '跨境/网络限制', summary: '请使用合规网络访问。', body: '若无法访问，检查本地网络策略，建议使用稳定国际线路并确保钱包 RPC 可用。' }, en: { title: 'Network restrictions', summary: 'Use compliant connectivity.', body: 'If blocked locally, fix network/RPC access to wallet and site.' } },
    { zh: { title: '评价与投诉商家', summary: '订单完成后可评价或举报。', body: '客观评价有助于社区；严重违规请通过举报入口提交，平台将调查。' }, en: { title: 'Rate or report seller', summary: 'After completion.', body: 'Leave fair reviews; report serious violations via report入口.' } },
  ],
  'dao-community': [
    { zh: { title: '如何参与 DAO 投票？', summary: '社区参与页连接钱包投票。', body: '进入社区参与查看提案，阅读说明后在投票期内提交链上投票，权重以提案规则为准。' }, en: { title: 'How to vote in DAO?', summary: 'Connect wallet on Community page.', body: 'Open Community proposals, read details, vote on-chain before deadline per rules.' } },
    { zh: { title: '提案有哪些状态？', summary: '进行中、已通过、未通过等。', body: '列表会标注投票进度与截止时间，请在截止前完成投票以免错过。' }, en: { title: 'Proposal statuses', summary: 'Active, passed, rejected, etc.', body: 'Track progress and deadline—vote before close.' } },
    { zh: { title: '投票权如何计算？', summary: '以各提案快照规则为准。', body: '常见为 SAP 持仓快照或 NFT 持有，具体见提案正文与 FAQ。' }, en: { title: 'How is voting power calculated?', summary: 'Per proposal snapshot rules.', body: 'Often SAP snapshot or NFT holdings—see proposal text.' } },
    { zh: { title: '加入 Discord 社区', summary: '获取公告与讨论支持。', body: '通过帮助中心链接加入官方 Discord，遵守社区守则，勿轻信私信。' }, en: { title: 'Join Discord', summary: 'Announcements and discussion.', body: 'Use official link from help center; follow rules; ignore random DMs.' } },
    { zh: { title: 'Telegram 公告频道', summary: '订阅活动与维护通知。', body: '关注官方 Telegram 获取版本更新、活动与紧急维护信息。' }, en: { title: 'Telegram announcements', summary: 'Updates and maintenance.', body: 'Follow official channel for releases and incidents.' } },
    { zh: { title: '如何发起提案？', summary: '需满足治理门槛。', body: '持有足够治理权重可在治理模块提交提案，包含标题、描述与投票选项，进入公示期后投票。' }, en: { title: 'How to create a proposal?', summary: 'Meet governance threshold.', body: 'Submit title, body, and options; voting starts after review period.' } },
    { zh: { title: '委托投票是什么？', summary: '将投票权委托给代表。', body: '若支持委托，可在治理页选择代表，委托后由代表代投，可随时撤销委托。' }, en: { title: 'Vote delegation', summary: 'Delegate weight to a representative.', body: 'Choose a delegate on governance page; revoke anytime.' } },
    { zh: { title: '投票需要 Gas 吗？', summary: '链上投票需支付网络费。', body: '提交投票交易需 Gas，请预留少量原生代币；部分 L2 网络费用较低。' }, en: { title: 'Gas for voting?', summary: 'On-chain votes need network fee.', body: 'Keep native token for gas; L2 may be cheaper.' } },
    { zh: { title: '提案通过后多久执行？', summary: '按时间锁与多签流程。', body: '通过后进入执行队列，具体时间取决于治理合约配置，可在提案页查看执行状态。' }, en: { title: 'Execution after pass?', summary: 'Timelock and multisig flow.', body: 'Execution queued per contract—check status on proposal page.' } },
    { zh: { title: '社区活动奖励', summary: '按活动规则发放 SAP 或 NFT。', body: '参与官方活动需完成指定任务并连接钱包，奖励发放以活动页说明为准。' }, en: { title: 'Community campaign rewards', summary: 'SAP or NFT per rules.', body: 'Complete tasks with connected wallet; payouts per campaign page.' } },
    { zh: { title: '治理风险须知', summary: '链上操作不可逆。', body: '投票、委托前请仔细阅读提案来源与合约地址，仅与官方公示链接交互。' }, en: { title: 'Governance risks', summary: 'On-chain actions are final.', body: 'Read proposal source and contract; use official links only.' } },
    { zh: { title: '无法连接钱包投票', summary: '检查网络与快照资格。', body: '确认钱包网络、是否在快照区块持有足够权重，仍失败请提交地址与提案 ID 联系支持。' }, en: { title: 'Cannot vote with wallet?', summary: 'Check network and eligibility.', body: 'Verify network and snapshot holdings; contact support with address and proposal ID.' } },
  ],
};

export function getTopicQaSlug(category: HelpCategory, index: number): string {
  return `${category}-${String(index + 1).padStart(2, '0')}`;
}

const SUMMARY_MIN_LEN: Record<'zh' | 'en', number> = { zh: 52, en: 80 };

/** 折叠摘要过短时，拼接正文前段以便预览展开效果 */
const enrichLocaleText = (text: TopicQaLocaleText, locale: 'zh' | 'en'): TopicQaLocaleText => {
  if (text.summary.length >= SUMMARY_MIN_LEN[locale]) {
    return text;
  }
  const lead = text.summary.replace(/[。.!?]$/, '').trim();
  const sep = locale === 'zh' ? '。' : '. ';
  const bodyTail =
    text.body.length > 160 ? `${text.body.slice(0, 160).trim()}…` : text.body.trim();
  return {
    ...text,
    summary: `${lead}${sep}${bodyTail}`,
  };
};

export function buildHelpTopicArticles(): HelpArticleMeta[] {
  const articles: HelpArticleMeta[] = [];
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      const day = String(8 + i).padStart(2, '0');
      articles.push({
        slug,
        category,
        tagKeys: [],
        updatedAt: `2026-05-${day}`,
        viewCount: computeHelpViewCount(category, i, slug),
        blocks: buildTopicQaArticleBlocks(slug, category, i),
        helpfulCount: 86 + i * 23 + category.length * 3,
        notHelpfulCount: 2 + (i % 6),
      });
    });
  }
  return articles;
}

export function buildHelpTopicFaq(): HelpFaqItem[] {
  const faqs: HelpFaqItem[] = [];
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      faqs.push({
        id: `faq-${slug}`,
        category,
        questionKey: `help.topicQa.${slug}.title`,
      });
    });
  }
  return faqs;
}

export function buildTopicQaI18nTree(locale: 'zh' | 'en'): Record<string, TopicQaLocaleText> {
  const tree: Record<string, TopicQaLocaleText> = {};
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((entry, i) => {
      const base = enrichLocaleText(entry[locale], locale);
      tree[getTopicQaSlug(category, i)] = enrichTopicQaRichContent(base, category, locale, i);
    });
  }
  return tree;
}