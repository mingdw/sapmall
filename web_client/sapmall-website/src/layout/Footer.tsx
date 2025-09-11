import React from 'react';
import { Layout, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="bg-gray-900 border-t border-gray-700 py-12 px-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">💎</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sapphire Mall
            </span>
          </div>
          <Text className="text-gray-400 mb-6 block">
            Web3虚拟商品交易的未来
          </Text>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FontAwesomeIcon icon={faTwitter} className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FontAwesomeIcon icon={faTelegram} className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FontAwesomeIcon icon={faDiscord} className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FontAwesomeIcon icon={faGithub} className="text-xl" />
            </a>
          </div>
          <Text className="text-sm text-gray-500">
            © 2025 Sapphire Mall. 保留所有权利。
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;