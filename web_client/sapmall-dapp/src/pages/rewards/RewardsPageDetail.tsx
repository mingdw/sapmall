import React from 'react';

const RewardsPageDetail: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">奖励中心</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 space-y-4">
        <p className="text-gray-300 text-lg">
          贡献激励功能正在规划中，未来将支持任务领取、仲裁奖励和治理激励的统一查看与领取。
        </p>
        <p className="text-gray-400 text-sm">
          您仍可以在 DAO 治理、商品审核和社区任务中积累贡献积分，奖励中心上线后将第一时间为您呈现所有权益。
        </p>
      </div>
    </div>
  );
};

export default RewardsPageDetail;

