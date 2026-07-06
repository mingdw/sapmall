import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import './i18n';
import './App.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ConfigProvider locale={zhCN}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
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