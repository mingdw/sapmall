import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DaoLayout from './DaoLayout';
import DaoHomePage from './DaoHomePage';
import DaoEventDetailPage from './DaoEventDetailPage';
import DaoProposalDetailPage from './DaoProposalDetailPage';
import DaoProposalCreatePage from './DaoProposalCreatePage';
import DaoDiscussionDetailPage from './DaoDiscussionDetailPage';

const DaoRoutes: React.FC = () => (
  <Routes>
    <Route element={<DaoLayout />}>
      <Route index element={<DaoHomePage />} />
      <Route path="events/:id" element={<DaoEventDetailPage />} />
      <Route path="discussions/:id" element={<DaoDiscussionDetailPage />} />
      <Route path="proposals/new" element={<DaoProposalCreatePage />} />
      <Route path="proposals/:id" element={<DaoProposalDetailPage />} />
    </Route>
  </Routes>
);

export default DaoRoutes;



