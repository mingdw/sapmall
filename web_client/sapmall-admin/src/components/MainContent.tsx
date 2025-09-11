import React from 'react'

const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to Sapphire Mall
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Web3 Virtual Goods Trading Platform
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shopping-cart text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Virtual Marketplace</h3>
            <p className="text-gray-600">Trade virtual goods in a secure Web3 environment</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-2xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
            <p className="text-gray-600">Blockchain-powered security for all transactions</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-coins text-2xl text-purple-600"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Crypto Payments</h3>
            <p className="text-gray-600">Accept and make payments with cryptocurrency</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
