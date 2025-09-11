import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sapphire Mall</h3>
            <p className="text-gray-300">
              The leading Web3 virtual goods trading platform.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Marketplace</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">NFT Trading</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Virtual Assets</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Sapphire Mall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
