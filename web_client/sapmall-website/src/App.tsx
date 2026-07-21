import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import PresentationPage from './pages/PresentationPage';
import WhitepaperPage from './pages/WhitepaperPage';
import DemoPage from './pages/DemoPage';
import './i18n';
import './App.css';
import './styles/content-pages.css';
import './styles/presentation-slides.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ConfigProvider locale={zhCN}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/presentation" element={<PresentationPage />} />
              <Route path="/whitepaper" element={<WhitepaperPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/privacy" element={<LegalPage kind="privacy" />} />
              <Route path="/terms" element={<LegalPage kind="terms" />} />
              <Route path="/cookies" element={<LegalPage kind="cookies" />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </HelmetProvider>
  );
};

export default App;