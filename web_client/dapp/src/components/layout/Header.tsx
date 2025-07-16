import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#151b27] shadow border-b border-[#232b3b]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            {/* SVG icon，可替换为FontAwesome */}
            <svg width="28" height="28" viewBox="0 0 1024 1024"><path fill="#fff" d="M512 64l448 256v384l-448 256L64 704V320z"/></svg>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Sapphire Mall
            </div>
            <div className="text-xs text-gray-400">Web3虚拟商品交易平台</div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 flex justify-center items-center space-x-10 ml-12">
          <a href="#" className="text-blue-400 font-medium text-lg">代币商城</a>
          <a href="#" className="text-gray-200 hover:text-blue-400 font-medium text-lg">质押</a>
          <a href="#" className="text-gray-200 hover:text-blue-400 font-medium text-lg">兑换</a>
          <a href="#" className="text-gray-200 hover:text-blue-400 font-medium text-lg">DAO</a>
          <a href="#" className="text-gray-200 hover:text-blue-400 font-medium text-lg">帮助中心</a>
        </nav>
        {/* Right */}
        <div className="flex items-center space-x-6">
          {/* Language Switcher */}
          <button className="flex items-center text-gray-200 hover:text-blue-400 text-lg">
            <i className="fas fa-globe mr-1" />
            中文
            <i className="fas fa-chevron-down ml-1 text-xs" />
          </button>
          {/* Wallet Button */}
          <button className="flex items-center px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-purple-600 transition">
            <i className="fas fa-wallet mr-2" />
            连接钱包
          </button>
        </div>
      </div>
    </header>
  );
}; 