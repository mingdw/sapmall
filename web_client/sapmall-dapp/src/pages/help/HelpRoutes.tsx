import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HelpLayout from './HelpLayout';
import HelpHomePage from './HelpHomePage';
import HelpArticlePage from './HelpArticlePage';

/**
 * 帮助中心路由（详见 ./README.md）
 * - /help           → HelpHomePage
 * - /help/a/:slug   → HelpArticlePage
 */
const HelpRoutes: React.FC = () => (
  <Routes>
    <Route element={<HelpLayout />}>
      <Route index element={<HelpHomePage />} />
      <Route path="a/:slug" element={<HelpArticlePage />} />
    </Route>
  </Routes>
);

export default HelpRoutes;
