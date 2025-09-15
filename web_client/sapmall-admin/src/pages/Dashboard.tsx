import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Card>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {t('dashboard.welcome')}
          </p>
          <div className="text-gray-500">
            <p>系统已准备就绪，等待配置功能模块...</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
