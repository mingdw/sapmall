export interface Category {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface GuideStep {
  id: number;
  title: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 1,
    icon: 'wallet',
    title: '钱包连接',
    description: '如何连接和管理您的数字钱包',
    color: 'from-sapphire-500 to-sapphire-600'
  },
  {
    id: 2,
    icon: 'exchange-alt',
    title: '交易操作',
    description: '学习如何进行安全的交易操作',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 3,
    icon: 'coins',
    title: '质押挖矿',
    description: '了解质押和挖矿的操作流程',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    icon: 'vote-yea',
    title: 'DAO 治理',
    description: '参与社区治理和投票指南',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 5,
    icon: 'shield-alt',
    title: '安全指南',
    description: '保护您的数字资产安全',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 6,
    icon: 'bug',
    title: '问题排查',
    description: '常见问题的解决方案',
    color: 'from-indigo-500 to-blue-600'
  }
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: '如何连接 MetaMask 钱包？',
    answer: '1. 确保已安装 MetaMask 浏览器插件<br>2. 点击页面右上角的"连接钱包"按钮<br>3. 选择 MetaMask 选项<br>4. 在弹出的窗口中确认连接<br>5. 连接成功后，您的钱包地址将显示在页面上'
  },
  {
    id: 2,
    question: '交易失败时如何处理？',
    answer: '交易失败的常见原因和解决方案：<br>• Gas 费不足：增加 Gas 费用<br>• 网络拥堵：等待网络恢复或提高 Gas 价格<br>• 余额不足：确保账户有足够资金<br>• 滑点设置过低：适当增加滑点容忍度<br>• 合约错误：联系技术支持'
  },
  {
    id: 3,
    question: '如何参与质押获得收益？',
    answer: '质押操作步骤：<br>1. 访问"质押"页面<br>2. 选择合适的质押池<br>3. 输入要质押的代币数量<br>4. 确认交易并支付 Gas 费<br>5. 等待交易确认<br>6. 开始获得质押奖励<br>注意：质押可能有锁定期，请仔细阅读条款'
  },
  {
    id: 4,
    question: '如何参与 DAO 治理投票？',
    answer: '参与治理投票的要求：<br>• 持有 SAP 治理代币<br>• 代币已质押或委托<br>• 在投票期间内进行投票<br>投票步骤：<br>1. 访问"DAO 治理"页面<br>2. 查看活跃提案<br>3. 阅读提案详情<br>4. 选择"赞成"、"反对"或"弃权"<br>5. 确认投票交易'
  },
  {
    id: 5,
    question: '如何保护钱包安全？',
    answer: '钱包安全要点：<br>• 永远不要分享您的私钥或助记词<br>• 使用硬件钱包存储大额资产<br>• 定期更新钱包软件<br>• 只访问官方网站<br>• 仔细核实交易信息<br>• 使用多重签名钱包<br>• 保持软件和浏览器更新<br>• 警惕钓鱼网站和诈骗'
  }
];

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: '设置数字钱包',
    description: '下载并安装 MetaMask 或其他支持的钱包，创建新钱包并安全保存助记词。'
  },
  {
    id: 2,
    title: '连接到平台',
    description: '访问 Sapphire Mall，点击"连接钱包"按钮，选择您的钱包类型并完成连接。'
  },
  {
    id: 3,
    title: '完成身份验证',
    description: '根据平台要求完成身份验证，以提高账户安全性和交易限额。'
  },
  {
    id: 4,
    title: '充值数字资产',
    description: '通过钱包向平台充值数字资产，支持多种主流加密货币。'
  },
  {
    id: 5,
    title: '开始使用服务',
    description: '浏览商城、参与质押、进行交易或参与社区治理。'
  }
];