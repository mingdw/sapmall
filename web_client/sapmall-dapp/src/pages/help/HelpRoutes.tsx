import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HelpLayout from './HelpLayout';
import HelpPage from './HelpPage';
import HelpArticlePage from './HelpArticlePage';

const HelpRoutes: React.FC = () => (
  <Routes>
    <Route element={<HelpLayout />}>
      <Route index element={<HelpPage />} />
      <Route path="a/:slug" element={<HelpArticlePage />} />
    </Route>
  </Routes>
);

export default HelpRoutes;
