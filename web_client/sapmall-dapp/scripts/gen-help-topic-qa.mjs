/**
 * 生成 helpTopicQaCatalog.ts（各主题 12 条问答）
 * 运行: node scripts/gen-help-topic-qa.mjs
 */
import fs from 'fs';
import path from 'path';

const CATEGORIES = [
  'getting-started',
  'wallet-security',
  'exchange-payment',
  'marketplace',
  'merchant',
  'order-support',
  'dao-community',
];

const QA = {
  'getting-started': {
    zh: [
      ['如何连接 MetaMask 钱包？', '页头连接钱包并完成签名即可开始使用。', '点击页头「连接钱包」，选择 MetaMask 等插件钱包，解锁账户后授权并签名。连接成功即可浏览商城、兑换 SAP 与下单。'],
      ['新用户 3 分钟能做什么？', '连接钱包 → 兑换 SAP → 完成首单。', '建议路径：连接钱包 → 在兑换页将稳定币换成 SAP → 进入商城选购并完成链上支付。首次可用小额 SAP 试单。'],
      ['如何完成第一笔订单？', '选品、确认订单、钱包签名支付三步完成。', '在商城选择商品进入详情页，确认价格与规格后提交订单，在钱包中确认交易并等待链上确认。'],
      ['什么是 Gas 费？', '链上交易的网络手续费，需预留原生代币支付。', 'Gas 由区块链网络收取，与商品金额无关。请确保钱包内有少量 ETH 等原生币用于支付网络费。'],
      ['SAP 可以用来做什么？', '可用于商城支付、保证金及部分生态场景。', 'SAP 是平台核心代币，可在商城结算、参与活动等。余额可在钱包与交易历史中查看。'],
      ['如何查看交易历史？', '在「交易历史」查看订单与链上记录。', '登录后进入交易历史，可按类型筛选支付、兑换、退款等记录，并复制 TxHash 备查。'],
      ['支持哪些浏览器？', '推荐 Chrome、Brave 等安装钱包插件的浏览器。', '请使用最新版 Chrome、Brave 或 Firefox，并安装官方钱包扩展。避免使用已停止维护的旧版浏览器。'],
      ['连接后看不到余额怎么办？', '确认网络正确并刷新页面后重试。', '检查钱包所选网络是否与平台要求一致，刷新页面或重新连接钱包。若仍异常，可尝试切换 RPC 或联系支持。'],
      ['如何参与生态奖励？', '在生态奖励页查看任务与发放记录。', '进入「生态奖励」浏览可参与任务，按规则完成行为后奖励将按活动说明发放至钱包。'],
      ['第一次购物建议金额多少？', '建议小额试单以熟悉 Gas 与确认时间。', '首次建议使用可承受的小额 SAP 完成一笔订单，了解从签名到确认的全流程后再加大金额。'],
      ['如何切换中英文？', '使用页头语言切换器即可。', '点击页头语言/地区入口，选择中文或 English，帮助中心与商城文案将同步切换。'],
      ['账号与资产安全基础', '妥善保管助记词，警惕钓鱼链接。', '切勿向任何人透露助记词或私钥；确认官网域名后再连接钱包；大额资产建议使用硬件钱包。'],
    ],
    en: [
      ['How do I connect MetaMask?', 'Use Connect wallet in the header and sign once.', 'Click Connect wallet, choose MetaMask or another extension, unlock, approve, and sign. You can then browse, swap, and checkout.'],
      ['What can I do in 3 minutes?', 'Connect → swap to SAP → place a first order.', 'Path: connect wallet → swap stablecoins to SAP on Exchange → shop and pay on-chain. Start with a small SAP test order.'],
      ['How do I place my first order?', 'Pick a product, confirm checkout, sign in the wallet.', 'Choose an item, confirm price and specs, submit the order, sign the transaction, and wait for on-chain confirmation.'],
      ['What is gas?', 'Network fee for on-chain txs; keep native token for gas.', 'Gas is paid to the network, not the store. Keep a small amount of ETH (or native coin) in the wallet for fees.'],
      ['What is SAP used for?', 'Checkout, deposits, and select ecosystem features.', 'SAP is the platform token for marketplace payments and campaigns. Check balance in wallet and history.'],
      ['Where is transaction history?', 'Open Transaction history for orders and on-chain logs.', 'Filter payments, swaps, refunds, and copy TxHash for verification on a block explorer.'],
      ['Which browsers are supported?', 'Chrome, Brave, or Firefox with a wallet extension.', 'Use an up-to-date browser with the official wallet extension. Avoid outdated browsers.'],
      ['Balance not showing after connect?', 'Verify network and refresh, then reconnect.', 'Ensure the wallet network matches the platform, refresh or reconnect. Switch RPC or contact support if needed.'],
      ['How do ecosystem rewards work?', 'See tasks and payouts on the Rewards page.', 'Open Ecosystem rewards for eligible tasks. Payouts follow each campaign’s rules.'],
      ['How much for a first purchase?', 'Start small to learn gas and confirmation time.', 'Use a small SAP amount for the first order, then scale up once you understand the flow.'],
      ['How do I change language?', 'Use the language switcher in the header.', 'Switch between Chinese and English; help and marketplace copy update accordingly.'],
      ['Basic account and asset safety', 'Protect seed phrase; beware phishing.', 'Never share seed phrase or private key; verify the domain before connecting; consider a hardware wallet for large holdings.'],
    ],
  },
  'wallet-security': {
    zh: [
      ['钱包连接失败怎么办？', '检查插件、网络与站点授权。', '确认钱包已解锁、网络正确，断开站点后重新连接。可尝试无痕模式或更换浏览器。'],
      ['如何保护私钥与助记词？', '离线备份，永不截图或发送他人。', '助记词仅手写离线保存；不要通过聊天工具传输；SapMall 不会索要助记词。'],
      ['选错网络如何解决？', '在钱包中切换到平台支持的链。', '打开钱包网络列表，选择推荐网络，刷新 SapMall 后重新连接并完成签名。'],
      ['如何撤销代币授权？', '在钱包或区块浏览器管理 Approve。', '对不再使用的合约授权建议撤销，降低资产被盗风险。路径因钱包而异，可在安全中心查找。'],
      ['硬件钱包是否支持？', '支持主流硬件钱包连接签名。', '可通过 WalletConnect 或兼容方式连接硬件钱包，签名前请核对设备屏幕上的地址与金额。'],
      ['签名前如何防钓鱼？', '核对域名与交易参数。', '确认浏览器地址为官方域名；签名弹窗中的收款地址、金额与页面展示一致再确认。'],
      ['多个钱包账户如何切换？', '在钱包扩展内切换账户后刷新站点。', '在 MetaMask 等扩展中切换账户，回到 SapMall 断开并重新连接以同步当前地址。'],
      ['连接后提示地址不匹配', '使用曾完成 KYC 或绑定的同一地址。', '若平台要求特定地址，请在钱包中选择对应账户。必要时联系支持说明情况。'],
      ['什么是交易模拟失败？', '可能余额不足或合约限制。', '钱包模拟失败时检查 SAP/稳定币余额、授权额度与网络状态，调整参数后重试。'],
      ['如何识别假客服？', '官方不会私聊索要助记词。', '客服不会通过 DM 索取助记词、私钥或转账。请仅使用帮助中心公示的渠道。'],
      ['钱包被盗应急步骤', '立即转移剩余资产并撤销授权。', '若怀疑泄露，尽快将剩余资产转至新钱包，撤销可疑授权，并更换所有关联密码。'],
      ['浏览器插件安全建议', '只安装官方商店版本。', '从 Chrome 网上应用店等官方渠道安装钱包插件，勿使用来路不明的破解版。'],
    ],
    en: [
      ['Wallet won’t connect?', 'Check extension, network, and site permissions.', 'Unlock the wallet, verify network, disconnect the site and reconnect. Try incognito or another browser.'],
      ['How to protect keys and seed phrase?', 'Offline backup only; never share.', 'Write seed phrase offline only; never send via chat; SapMall will never ask for it.'],
      ['Wrong network selected?', 'Switch to a supported chain in the wallet.', 'Pick the recommended network, refresh SapMall, reconnect and sign.'],
      ['How to revoke token approvals?', 'Manage Approve in wallet or explorer.', 'Revoke unused approvals to reduce risk. Steps vary by wallet—check security settings.'],
      ['Are hardware wallets supported?', 'Major hardware wallets work via WalletConnect.', 'Connect via WalletConnect or compatible flow; verify address and amount on device screen.'],
      ['Avoid phishing before signing', 'Verify domain and tx details.', 'Confirm official URL; ensure recipient, amount, and data match the UI before signing.'],
      ['Switch wallet accounts', 'Change account in extension then reconnect site.', 'Switch in MetaMask, disconnect SapMall, reconnect to sync the active address.'],
      ['Address mismatch warning', 'Use the same address used for binding/KYC.', 'Select the required account in the wallet or contact support.'],
      ['Simulation failed?', 'Often balance, approval, or contract limits.', 'Check SAP/stablecoin balance, allowances, and network; adjust and retry.'],
      ['Spot fake support', 'We never ask for seed phrase in DMs.', 'Official support won’t request seed phrase, keys, or transfers via private messages.'],
      ['Wallet compromise steps', 'Move funds and revoke approvals.', 'Transfer remaining assets to a new wallet, revoke suspicious approvals, rotate passwords.'],
      ['Browser extension safety', 'Install only from official stores.', 'Use Chrome Web Store etc.; avoid unofficial cracked builds.'],
    ],
  },
  'exchange-payment': {
    zh: [
      ['稳定币如何兑换 SAP？', '在兑换页选币、授权、确认兑换。', '进入兑换页选择 USDT/USDC 等，输入数量，首次需 Approve，确认兑换交易并等待到账。'],
      ['SAP 支付手续费说明', 'SAP 结算可能享受费率优惠。', '使用 SAP 支付商城订单时，平台可能减免部分手续费，具体以兑换页与活动公告为准。'],
      ['兑换失败常见原因', '余额、滑点、授权或拥堵导致。', '检查余额是否充足、滑点是否合理、是否已完成授权；失败可在钱包查看 revert 原因。'],
      ['兑换限额是多少？', '单笔与每日限额见兑换页公示。', '大额兑换可能需额外确认或分批操作，请以页面实时显示的限额为准。'],
      ['Approve 授权是什么？', '允许合约使用指定数量代币。', '首次兑换需授权合约划转稳定币，仅授权必要额度可降低风险。'],
      ['到账时间多久？', '取决于链上确认速度。', '兑换提交后需等待区块确认，拥堵时可能延长，可在交易历史查看状态。'],
      ['支持哪些稳定币？', '常见 USDT、USDC 等以页面为准。', '兑换页会列出当前支持的输入代币与网络，请选择与钱包网络一致的代币。'],
      ['滑点设置建议', '波动大时适当提高滑点。', '市价波动剧烈时，过低滑点可能导致兑换失败，可适当上调并注意价格影响。'],
      ['SAP 余额未更新', '等待确认或刷新页面。', '链上确认完成后余额才会更新，请稍候并刷新；长时间未到账请凭 TxHash 联系支持。'],
      ['能否取消进行中的兑换？', '链上提交后一般无法取消。', '交易广播后无法由平台撤销，若长时间 pending 可在钱包加速或等待网络恢复。'],
      ['汇率如何计算？', '按池子实时价格与手续费。', '兑换页预览已含预估汇率与费用，确认前请仔细核对最终到账 SAP 数量。'],
      ['保证金可以用 SAP 吗？', '商家保证金支持 SAP 支付。', '入驻商家按指引在兑换/保证金专区使用 SAP 链上支付，完成后状态会更新。'],
    ],
    en: [
      ['Swap stablecoins to SAP?', 'Pick token on Exchange, approve, confirm.', 'Choose USDT/USDC, enter amount, Approve if first time, confirm swap and wait for credit.'],
      ['SAP payment fees', 'SAP checkout may qualify for discounts.', 'Fee reductions apply to SAP settlements per Exchange and campaign notices.'],
      ['Why swaps fail', 'Balance, slippage, approval, or congestion.', 'Verify balance, slippage, and allowances; inspect revert reason in the wallet.'],
      ['Swap limits', 'Per-tx and daily limits on Exchange page.', 'Large swaps may need extra steps; follow on-screen limits.'],
      ['What is Approve?', 'Lets the contract spend your token allowance.', 'First swap needs approval—grant only needed allowance to reduce risk.'],
      ['How long to settle?', 'Depends on confirmations.', 'After broadcast, wait for confirmations; check status in history.'],
      ['Which stablecoins?', 'USDT, USDC, etc.—see Exchange list.', 'Pick a token matching your wallet network as shown on the page.'],
      ['Slippage tips', 'Raise slippage in volatile markets.', 'Too low may fail; increase carefully and watch price impact.'],
      ['SAP balance not updated', 'Wait for confirmation or refresh.', 'Balance updates after on-chain confirmation; contact support with TxHash if delayed.'],
      ['Cancel a pending swap?', 'Usually cannot cancel on-chain.', 'Once broadcast, it cannot be revoked; speed up in wallet or wait.'],
      ['How is rate calculated?', 'Live pool price plus fees.', 'Preview on Exchange includes estimated rate—verify before confirming.'],
      ['Pay deposit with SAP?', 'Merchant deposit supports SAP.', 'Follow merchant guide to pay deposit on-chain; status updates after confirmation.'],
    ],
  },
  'marketplace': {
    zh: [
      ['如何浏览虚拟商品？', '分类筛选与搜索定位商品。', '在商城首页按分类浏览或使用搜索，进入详情页查看价格、库存与交付说明。'],
      ['数字权益与 NFT 区别', '权益类可能含链上凭证。', '虚拟道具侧重使用场景；数字权益/NFT 类商品请阅读交付方式与兑换有效期。'],
      ['购物车与结算流程', '支持合并下单与 SAP 支付。', '将商品加入购物车后进入结算，确认明细与 Gas 预留，在钱包完成签名。'],
      ['支付后多久交付？', '依商品类型与链上确认时间。', '链上支付确认后，虚拟商品/兑换码将按商品页说明发放，请留意订单状态。'],
      ['商品缺货怎么办？', '可收藏或订阅到货通知。', '若显示售罄，可关注同类商品或稍后再试；已下单缺货将按规则退款。'],
      ['能否使用优惠券？', '以结算页显示为准。', '若活动开放优惠券，将在结算页展示可用券与抵扣规则，SAP 支付同样适用活动条款。'],
      ['订单可以取消吗？', '未链上确认前可能可取消。', '提交后若仍在 pending，部分订单可取消；已确认链上交易需走售后流程。'],
      ['虚拟商品如何退款？', '符合规则可在订单页申请。', '查看商品退款政策，在订单详情发起申请，链上退款需等待确认。'],
      ['商品评价可信吗？', '来自真实购买用户。', '评价与购买记录挂钩，仅供参考，购买前仍以商品详情为准。'],
      ['如何联系卖家？', '通过订单消息或客服中转。', '在订单详情使用站内消息；勿站外转账，防诈骗。'],
      ['多商品合并 Gas', '一笔订单一次签名为主。', '合并结算通常只需一次支付签名，具体 Gas 以钱包估算为准。'],
      ['商品描述看不懂', '可查看帮助或咨询客服。', '对交付方式、有效期有疑问时，先阅读该分类帮助文章，或联系客服确认。'],
    ],
    en: [
      ['Browse virtual goods?', 'Use categories and search.', 'Filter by category or search, open product page for price, stock, and delivery notes.'],
      ['Digital rights vs NFT items', 'Some include on-chain proof.', 'Virtual items focus on usage; read delivery and redemption expiry for rights/NFT products.'],
      ['Cart and checkout', 'Combine items and pay with SAP.', 'Add to cart, review checkout, reserve gas, sign payment in wallet.'],
      ['Delivery timing', 'Depends on product and confirmations.', 'After on-chain payment confirms, delivery follows product page rules—watch order status.'],
      ['Out of stock?', 'Try later or similar items.', 'If sold out, check alternatives; paid orders refunded per policy.'],
      ['Coupons available?', 'Shown at checkout if active.', 'Eligible coupons appear at checkout with SAP payment rules.'],
      ['Cancel an order?', 'Possible before on-chain confirm.', 'Pending orders may be cancellable; confirmed txs need support flow.'],
      ['Refunds for virtual goods?', 'Apply from order if eligible.', 'Read refund policy, submit from order details, wait for on-chain refund.'],
      ['Are reviews trustworthy?', 'From verified buyers.', 'Reviews are for reference—rely on product details for decisions.'],
      ['Contact seller?', 'Order messages or support.', 'Use in-app order messaging; never pay off-platform.'],
      ['Gas for multiple items', 'Usually one signature per order.', 'Combined checkout typically needs one payment signature.'],
      ['Unclear product description?', 'Read help or ask support.', 'Check category help or contact support before buying.'],
    ],
  },
  merchant: {
    zh: [
      ['商家入驻流程概览', '提交资料 → 审核 → 缴纳保证金。', '在商家入口提交资质，审核通过后在 DApp 完成保证金链上支付，即可上架商品。'],
      ['保证金要交多少？', '按类目与等级公示标准执行。', '具体数额以入驻指引与后台提示为准，请确保钱包 SAP 余额充足并预留 Gas。'],
      ['保证金可以退吗？', '退出合作且无异议时可申请退还。', '满足退出条件后按规则发起退还，链上退回需等待确认，周期见商家协议。'],
      ['商家后台在哪进入？', '页头或帮助中心链接。', '具备权限的账户可从页头进入嵌入式商家后台，管理商品、订单与保证金状态。'],
      ['商品上架审核多久？', '一般 1–3 个工作日。', '提交商品后进入审核队列，请确保图文与描述符合规范，驳回会注明修改意见。'],
      ['订单发货如何操作？', '虚拟商品多为自动交付。', '虚拟类订单在链上确认后系统自动履约；特殊商品按详情配置手动处理。'],
      ['商家 SAP 结算周期', '按平台结算规则对账。', '销售款项与手续费在结算周期内对账，明细可在后台财务报表查看。'],
      ['违规会被处罚吗？', '视情节警告、下架或清退。', '请遵守平台公约，严重违规可能扣除保证金或终止合作。'],
      ['如何修改店铺信息？', '在后台店铺设置中编辑。', '更新 Logo、简介与客服联系方式后提交，部分修改需重新审核。'],
      ['多角色权限管理', '主账号可邀请子账号。', '在权限管理中为运营、财务等角色分配最小必要权限，定期复核。'],
      ['保证金 TxHash 在哪填？', '支付后系统自动抓取。', '完成链上支付后系统匹配交易，若长时间未更新请手动提交 TxHash 供核验。'],
      ['入驻审核被拒怎么办？', '按意见补充材料重新提交。', '查看驳回原因，完善资质或说明后再次提交，必要时联系招商支持。'],
    ],
    en: [
      ['Merchant onboarding overview', 'Apply → review → pay deposit.', 'Submit credentials, after approval pay deposit on-chain in the DApp, then list products.'],
      ['How much deposit?', 'Per category/level on the guide.', 'Follow onboarding prompts; keep enough SAP and gas in the wallet.'],
      ['Is deposit refundable?', 'When exiting without disputes.', 'Apply per exit rules; on-chain refund waits for confirmations per agreement.'],
      ['Where is merchant admin?', 'Header or help center link.', 'Authorized users open embedded admin to manage products, orders, and deposit.'],
      ['Listing review time?', 'Typically 1–3 business days.', 'Listings enter review—ensure compliant copy/images; rejections include feedback.'],
      ['How to fulfill orders?', 'Virtual goods often auto-deliver.', 'After on-chain payment confirms, system fulfills; manual for special SKUs.'],
      ['SAP settlement cycle', 'Per platform schedule.', 'Sales and fees reconcile each cycle—see finance reports in admin.'],
      ['Policy violations?', 'Warnings, delist, or termination.', 'Follow marketplace rules; serious cases may forfeit deposit or end partnership.'],
      ['Edit store profile?', 'In store settings.', 'Update branding and support contacts; some changes need re-review.'],
      ['Role permissions', 'Owner invites sub-accounts.', 'Assign least privilege to ops/finance roles and review periodically.'],
      ['Deposit TxHash?', 'Auto-captured after payment.', 'If status lags, submit TxHash manually for verification.'],
      ['Application rejected?', 'Fix issues and resubmit.', 'Address rejection notes, improve docs, or contact onboarding support.'],
    ],
  },
  'order-support': {
    zh: [
      ['订单取消与退款', '符合条件可在订单页申请。', '未履约或符合政策的订单可发起取消/退款，链上退回需等待网络确认。'],
      ['用 TxHash 查询状态', '复制哈希到区块浏览器。', '在交易历史复制 TxHash，打开对应网络浏览器查看确认数与执行结果。'],
      ['支付一直 pending', '等待确认，勿重复支付。', '网络拥堵时确认变慢，请耐心等待；勿对同一订单重复签名支付。'],
      ['如何联系人工客服？', '邮件、Discord 或 Telegram。', '提供订单号、钱包地址与 TxHash，便于快速定位问题。'],
      ['退款多久到账？', '链上确认后自动入账。', '退款发起后需矿工确认，一般数分钟至数小时，极端拥堵可能更长。'],
      ['订单显示成功未收货', '先查交付方式与邮箱/站内信。', '虚拟商品可能为兑换码或链上凭证，请查看订单详情与消息通知。'],
      ['能修改收货信息吗？', '虚拟商品通常无需物流地址。', '数字商品以账号或链上地址交付为主，如有特殊字段请在下单前确认。'],
      ['重复扣款怎么办？', '保留两笔 TxHash 联系支持。', '若误操作两次支付，请立即停止进一步操作并提交两笔哈希供核查退款。'],
      ['发票如何申请？', '企业用户可走工单渠道。', '按帮助中心指引提交开票信息与订单号，处理周期以客服回复为准。'],
      ['售后申诉流程', '订单详情发起并附证据。', '描述问题并上传截图/哈希，客服将在工作日按优先级处理。'],
      ['跨境/网络限制', '请使用合规网络访问。', '若无法访问，检查本地网络策略，建议使用稳定国际线路并确保钱包 RPC 可用。'],
      ['评价与投诉商家', '订单完成后可评价或举报。', '客观评价有助于社区；严重违规请通过举报入口提交，平台将调查。'],
    ],
    en: [
      ['Cancel and refund orders', 'Apply from order when eligible.', 'Cancel/refund per policy; on-chain refunds need confirmations.'],
      ['Look up TxHash', 'Paste hash into block explorer.', 'Copy from history, open explorer for the network, check status.'],
      ['Payment stuck pending', 'Wait; do not pay twice.', 'Congestion slows confirmations—avoid duplicate payments for one order.'],
      ['Contact human support', 'Email, Discord, or Telegram.', 'Provide order ID, wallet address, and TxHash.'],
      ['Refund timing', 'Credits after on-chain confirm.', 'Usually minutes to hours; longer if network is busy.'],
      ['Paid but no delivery?', 'Check delivery method and inbox.', 'Virtual goods may be codes or on-chain proofs—see order details.'],
      ['Change delivery info?', 'Usually N/A for digital goods.', 'Delivery is to account/address—verify before checkout.'],
      ['Double charge?', 'Keep both TxHashes for support.', 'Stop further payments and submit both hashes for investigation.'],
      ['Request invoice?', 'Enterprise via ticket flow.', 'Submit company info and order IDs per help guide.'],
      ['Appeal process', 'Open ticket from order with proof.', 'Describe issue with screenshots/hashes; support replies on business days.'],
      ['Network restrictions', 'Use compliant connectivity.', 'If blocked locally, fix network/RPC access to wallet and site.'],
      ['Rate or report seller', 'After completion.', 'Leave fair reviews; report serious violations via report入口.'],
    ],
  },
  'dao-community': {
    zh: [
      ['如何参与 DAO 投票？', '社区参与页连接钱包投票。', '进入社区参与查看提案，阅读说明后在投票期内提交链上投票，权重以提案规则为准。'],
      ['提案有哪些状态？', '进行中、已通过、未通过等。', '列表会标注投票进度与截止时间，请在截止前完成投票以免错过。'],
      ['投票权如何计算？', '以各提案快照规则为准。', '常见为 SAP 持仓快照或 NFT 持有，具体见提案正文与 FAQ。'],
      ['加入 Discord 社区', '获取公告与讨论支持。', '通过帮助中心链接加入官方 Discord，遵守社区守则，勿轻信私信。'],
      ['Telegram 公告频道', '订阅活动与维护通知。', '关注官方 Telegram 获取版本更新、活动与紧急维护信息。'],
      ['如何发起提案？', '需满足治理门槛。', '持有足够治理权重可在治理模块提交提案，包含标题、描述与投票选项，进入公示期后投票。'],
      ['委托投票是什么？', '将投票权委托给代表。', '若支持委托，可在治理页选择代表，委托后由代表代投，可随时撤销委托。'],
      ['投票需要 Gas 吗？', '链上投票需支付网络费。', '提交投票交易需 Gas，请预留少量原生代币；部分 L2 网络费用较低。'],
      ['提案通过后多久执行？', '按时间锁与多签流程。', '通过后进入执行队列，具体时间取决于治理合约配置，可在提案页查看执行状态。'],
      ['社区活动奖励', '按活动规则发放 SAP 或 NFT。', '参与官方活动需完成指定任务并连接钱包，奖励发放以活动页说明为准。'],
      ['治理风险须知', '链上操作不可逆。', '投票、委托前请仔细阅读提案来源与合约地址，仅与官方公示链接交互。'],
      ['无法连接钱包投票', '检查网络与快照资格。', '确认钱包网络、是否在快照区块持有足够权重，仍失败请提交地址与提案 ID 联系支持。'],
    ],
    en: [
      ['How to vote in DAO?', 'Connect wallet on Community page.', 'Open Community proposals, read details, vote on-chain before deadline per rules.'],
      ['Proposal statuses', 'Active, passed, rejected, etc.', 'Track progress and deadline—vote before close.'],
      ['How is voting power calculated?', 'Per proposal snapshot rules.', 'Often SAP snapshot or NFT holdings—see proposal text.'],
      ['Join Discord', 'Announcements and discussion.', 'Use official link from help center; follow rules; ignore random DMs.'],
      ['Telegram announcements', 'Updates and maintenance.', 'Follow official channel for releases and incidents.'],
      ['How to create a proposal?', 'Meet governance threshold.', 'Submit title, body, and options; voting starts after review period.'],
      ['Vote delegation', 'Delegate weight to a representative.', 'Choose a delegate on governance page; revoke anytime.'],
      ['Gas for voting?', 'On-chain votes need network fee.', 'Keep native token for gas; L2 may be cheaper.'],
      ['Execution after pass?', 'Timelock and multisig flow.', 'Execution queued per contract—check status on proposal page.'],
      ['Community campaign rewards', 'SAP or NFT per rules.', 'Complete tasks with connected wallet; payouts per campaign page.'],
      ['Governance risks', 'On-chain actions are final.', 'Read proposal source and contract; use official links only.'],
      ['Cannot vote with wallet?', 'Check network and eligibility.', 'Verify network and snapshot holdings; contact support with address and proposal ID.'],
    ],
  },
};

const out = `/* AUTO-GENERATED — node scripts/gen-help-topic-qa.mjs */
import type { HelpArticleMeta, HelpCategory, HelpFaqItem } from '../types';
import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';

export const TOPIC_QA_PER_CATEGORY = 12;

export type TopicQaLocaleText = { title: string; summary: string; body: string };
export type TopicQaEntry = { zh: TopicQaLocaleText; en: TopicQaLocaleText };

const QA_BY_CATEGORY: Record<HelpCategory, TopicQaEntry[]> = ${JSON.stringify(QA, null, 2).replace(/"(\w[\w-]*)":/g, "'$1':")} as unknown as Record<HelpCategory, TopicQaEntry[]>;

export function getTopicQaSlug(category: HelpCategory, index: number): string {
  return \`\${category}-\${String(index + 1).padStart(2, '0')}\`;
}

export function buildHelpTopicArticles(): HelpArticleMeta[] {
  const articles: HelpArticleMeta[] = [];
  const baseDate = '2026-05-01';
  for (const { category } of HELP_TOPIC_CATALOG) {
    const items = QA_BY_CATEGORY[category];
    items.forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      articles.push({
        slug,
        category,
        tagKeys: ['help.tags.flow'],
        updatedAt: baseDate.replace(/01$/, String(10 + i).padStart(2, '0')),
        hot: i === 0,
        blocks: [{ type: 'paragraph', key: \`help.topicQa.\${slug}.body\` }],
      });
    });
  }
  return articles;
}

export function buildHelpTopicFaq(): HelpFaqItem[] {
  const faqs: HelpFaqItem[] = [];
  for (const { category } of HELP_TOPIC_CATALOG) {
    const items = QA_BY_CATEGORY[category];
    items.forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      faqs.push({
        id: \`faq-\${slug}\`,
        category,
        questionKey: \`help.topicQa.\${slug}.title\`,
        answerKey: \`help.topicQa.\${slug}.body\`,
      });
    });
  }
  return faqs;
}

export function buildTopicQaI18nTree(locale: 'zh' | 'en'): Record<string, TopicQaLocaleText> {
  const tree: Record<string, TopicQaLocaleText> = {};
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((entry, i) => {
      const slug = getTopicQaSlug(category, i);
      tree[slug] = entry[locale];
    });
  }
  return tree;
}
`;

// Fix JSON.stringify output - use proper TS format instead
const lines = [];
lines.push(`/* AUTO-GENERATED — node scripts/gen-help-topic-qa.mjs */`);
lines.push(`import type { HelpArticleMeta, HelpCategory, HelpFaqItem } from '../types';`);
lines.push(`import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';`);
lines.push('');
lines.push('export const TOPIC_QA_PER_CATEGORY = 12;');
lines.push('');
lines.push('export type TopicQaLocaleText = { title: string; summary: string; body: string };');
lines.push('export type TopicQaEntry = { zh: TopicQaLocaleText; en: TopicQaLocaleText };');
lines.push('');
lines.push('const QA_BY_CATEGORY: Record<HelpCategory, TopicQaEntry[]> = {');

for (const cat of CATEGORIES) {
  lines.push(`  '${cat}': [`);
  for (let i = 0; i < 12; i++) {
    const [zt, zs, zb] = QA[cat].zh[i];
    const [et, es, eb] = QA[cat].en[i];
    const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    lines.push(`    { zh: { title: '${esc(zt)}', summary: '${esc(zs)}', body: '${esc(zb)}' }, en: { title: '${esc(et)}', summary: '${esc(es)}', body: '${esc(eb)}' } },`);
  }
  lines.push('  ],');
}
lines.push('};');
lines.push('');
lines.push(`export function getTopicQaSlug(category: HelpCategory, index: number): string {
  return \`\${category}-\${String(index + 1).padStart(2, '0')}\`;
}`);
lines.push('');
lines.push(`export function buildHelpTopicArticles(): HelpArticleMeta[] {
  const articles: HelpArticleMeta[] = [];
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      const day = String(8 + i).padStart(2, '0');
      articles.push({
        slug,
        category,
        tagKeys: ['help.tags.flow'],
        updatedAt: \`2026-05-\${day}\`,
        hot: i === 0,
        blocks: [{ type: 'paragraph', key: \`help.topicQa.\${slug}.body\` }],
      });
    });
  }
  return articles;
}`);
lines.push('');
lines.push(`export function buildHelpTopicFaq(): HelpFaqItem[] {
  const faqs: HelpFaqItem[] = [];
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((_, i) => {
      const slug = getTopicQaSlug(category, i);
      faqs.push({
        id: \`faq-\${slug}\`,
        category,
        questionKey: \`help.topicQa.\${slug}.title\`,
        answerKey: \`help.topicQa.\${slug}.body\`,
      });
    });
  }
  return faqs;
}`);
lines.push('');
lines.push(`export function buildTopicQaI18nTree(locale: 'zh' | 'en'): Record<string, TopicQaLocaleText> {
  const tree: Record<string, TopicQaLocaleText> = {};
  for (const { category } of HELP_TOPIC_CATALOG) {
    QA_BY_CATEGORY[category].forEach((entry, i) => {
      tree[getTopicQaSlug(category, i)] = entry[locale];
    });
  }
  return tree;
}`);

const target = path.join(process.cwd(), 'src/pages/help/mocks/helpTopicQaCatalog.ts');
fs.writeFileSync(target, lines.join('\n'), 'utf8');
console.log('Wrote', target);
