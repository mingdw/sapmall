import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#181f2a] to-[#232b3b] text-gray-300 pt-12 pb-6 px-4 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* 左侧Logo和简介 */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 1024 1024"><path fill="#fff" d="M512 64l448 256v384l-448 256L64 704V320z"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">Sapphire Mall</div>
              <div className="text-xs text-gray-400">Web3虚拟商品交易平台</div>
            </div>
          </div>
          <div className="text-gray-300 text-base mb-4 mt-2">构建去中心化的数字商品生态系统，让每一次交易都充满价值与信任。</div>
          <div className="flex space-x-4 mb-6">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"><i className="fab fa-twitter text-xl" /></a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"><i className="fab fa-discord text-xl" /></a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"><i className="fab fa-telegram text-xl" /></a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"><i className="fab fa-github text-xl" /></a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"><i className="fas fa-podcast text-xl" /></a>
          </div>
        </div>
        {/* 右侧四列 */}
        <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-white mb-3 text-lg">产品服务</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">代币商城</a></li>
              <li><a href="#" className="hover:text-blue-400">NFT交易</a></li>
              <li><a href="#" className="hover:text-blue-400">DeFi质押</a></li>
              <li><a href="#" className="hover:text-blue-400">DAO治理</a></li>
              <li><a href="#" className="hover:text-blue-400">跨链桥</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-3 text-lg">开发者</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">API文档</a></li>
              <li><a href="#" className="hover:text-blue-400">SDK下载</a></li>
              <li><a href="#" className="hover:text-blue-400">智能合约</a></li>
              <li><a href="#" className="hover:text-blue-400">开发指南</a></li>
              <li><a href="#" className="hover:text-blue-400">测试网络</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-3 text-lg">支持帮助</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">帮助中心</a></li>
              <li><a href="#" className="hover:text-blue-400">用户指南</a></li>
              <li><a href="#" className="hover:text-blue-400">安全中心</a></li>
              <li><a href="#" className="hover:text-blue-400">状态页面</a></li>
              <li><a href="#" className="hover:text-blue-400">联系我们</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-3 text-lg">法律条款</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">服务条款</a></li>
              <li><a href="#" className="hover:text-blue-400">隐私政策</a></li>
              <li><a href="#" className="hover:text-blue-400">风险提示</a></li>
              <li><a href="#" className="hover:text-blue-400">免责声明</a></li>
              <li><a href="#" className="hover:text-blue-400">合规声明</a></li>
            </ul>
          </div>
        </div>
      </div>
      {/* 底部版权和合规等 */}
      <div className="max-w-7xl mx-auto mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:space-x-6">
          <span className="text-gray-400">© 2024 Sapphire Mall. 保留所有权利。</span>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span className="flex items-center text-green-400"><i className="fas fa-shield-alt mr-1" />合规运营</span>
            <span className="flex items-center text-blue-400"><i className="fas fa-lock mr-1" />数据加密</span>
            <span className="flex items-center text-purple-400"><i className="fas fa-certificate mr-1" />安全认证</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">支持网络:</span>
          <span className="bg-blue-700 text-white rounded px-2 py-0.5 text-xs font-bold">ETH</span>
          <span className="bg-purple-600 text-white rounded px-2 py-0.5 text-xs font-bold">MATIC</span>
          <span className="bg-yellow-400 text-gray-900 rounded px-2 py-0.5 text-xs font-bold">BSC</span>
          <span className="bg-blue-400 text-white rounded px-2 py-0.5 text-xs font-bold">ARB</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-2 flex flex-col md:flex-row md:items-center md:justify-center gap-2 text-xs text-gray-500">
        <div className='text-center'>
          网站备案号: 京ICP备2024000001号-1 &nbsp;|&nbsp; 经营许可证: 京B2-20240001 &nbsp;|&nbsp; 注册地址: 北京市海淀区中关村软件园
        </div>
      </div>
    </footer>
  );
}; 