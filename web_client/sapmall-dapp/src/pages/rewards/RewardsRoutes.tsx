import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RewardsLayout from './RewardsLayout';
import RewardsPageDetail from './RewardsPageDetail';
import RewardsCampaignPage from './RewardsCampaignPage';

const RewardsRoutes: React.FC = () => (
  <Routes>
    <Route element={<RewardsLayout />}>
      <Route index element={<RewardsPageDetail />} />
      <Route path=":slug" element={<RewardsCampaignPage />} />
    </Route>
  </Routes>
);

export default RewardsRoutes;


