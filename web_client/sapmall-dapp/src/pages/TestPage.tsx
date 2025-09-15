import React from 'react';
import { useTranslation } from 'react-i18next';

const TestPage: React.FC = () => {
  const { t, i18n, ready } = useTranslation();

  if (!ready) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-4">国际化测试页面</h1>
        
        <div className="space-y-4">
          <div>
            <strong>当前语言:</strong> {i18n.language}
          </div>
          
          <div>
            <strong>翻译测试:</strong>
            <ul className="mt-2 space-y-2">
              <li>连接: {t('common.connect')}</li>
              <li>代币商城: {t('navigation.marketplace')}</li>
              <li>质押挖矿: {t('navigation.staking')}</li>
              <li>DEX交易: {t('navigation.exchange')}</li>
              <li>DAO治理: {t('navigation.dao')}</li>
              <li>帮助中心: {t('navigation.help')}</li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => i18n.changeLanguage('zh')}
              className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              切换到中文
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Switch to English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
