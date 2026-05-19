import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DaoHomePage from './pages/DaoHomePage';
import ProposalListPage from './pages/ProposalListPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import NewProposalPage from './pages/NewProposalPage';
import DelegatesPlaceholderPage from './pages/DelegatesPlaceholderPage';

const DaoRoutes: React.FC = () => (
  <Routes>
    <Route index element={<DaoHomePage />} />
    <Route path="proposals" element={<ProposalListPage />} />
    <Route path="proposal/:id" element={<ProposalDetailPage />} />
    <Route path="new" element={<NewProposalPage />} />
    <Route path="delegates" element={<DelegatesPlaceholderPage />} />
    <Route path="*" element={<Navigate to="/dao" replace />} />
  </Routes>
);

export default DaoRoutes;
