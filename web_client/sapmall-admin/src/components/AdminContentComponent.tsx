import React, { useEffect, useState } from 'react';
import { Typography, Button } from 'antd';
import { CircleHelp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ComponentMapper from './ComponentMapper';
import { CategoryTreeResp } from '../services/types/categoryTypes';
import { normalizeFaIcon } from '../utils';
import './AdminContentComponent.css';

const { Title, Text } = Typography;

interface AdminContentComponentProps {
  selectedMenu: CategoryTreeResp | null;
  firstMenuName?: string;
  onEnterDefaultMenu?: () => void;
}

const AdminContentComponent: React.FC<AdminContentComponentProps> = ({
  selectedMenu,
  firstMenuName,
  onEnterDefaultMenu,
}) => {
  const { t } = useTranslation();
  const [showWelcomeText, setShowWelcomeText] = useState(false);

  const handleHelpClick = () => {
    console.log('打开常见问题帮助');
  };

  useEffect(() => {
    if (selectedMenu) {
      setShowWelcomeText(false);
      return;
    }

    setShowWelcomeText(false);
    const timer = window.setTimeout(() => {
      setShowWelcomeText(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [selectedMenu]);

  const renderContent = () => {
    if (!selectedMenu) {
      return (
        <div className="admin-content-main default-welcome-main">
          <div className="matrix-welcome-container">
            <div className="matrix-center-content">
              <div className="ai-matrix-loader">
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="glow" />
              </div>

              <div className={`matrix-welcome-text ${showWelcomeText ? 'show' : ''}`}>
                <Title level={3} className="matrix-title">
                  {t('layout.welcomeTitle')}
                </Title>
                <Text className="matrix-subtitle">
                  {firstMenuName
                    ? t('layout.welcomeEnterNamed', { name: firstMenuName })
                    : t('layout.welcomeEnterDefault')}
                </Text>
                <div className="matrix-welcome-actions">
                  <Button
                    type="primary"
                    className="enter-overview-btn"
                    onClick={onEnterDefaultMenu}
                    disabled={!onEnterDefaultMenu}
                  >
                    {t('layout.enterOverview')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMenu.is_external && selectedMenu.external_url) {
      return (
        <div className="admin-content-external">
          <div className="external-icon">
            <i className="fas fa-external-link-alt"></i>
          </div>
          <Title level={3} type="secondary" className="external-title">
            {t('layout.externalLink')}
          </Title>
          <Text type="secondary" className="external-subtitle">
            {t('layout.externalLinkHint')}
          </Text>
          <div className="external-actions">
            <button
              className="external-button"
              onClick={() => window.open(selectedMenu.external_url, '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              {t('layout.openLink')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-content-main">
        <div className="admin-content-card-header">
          <div className="admin-content-card-title">
            <i className={normalizeFaIcon(selectedMenu.icon)}></i>
            <span>{selectedMenu.name}</span>
          </div>
          {selectedMenu.help_key && (
            <Button
              type="link"
              size="small"
              icon={<CircleHelp size={16} />}
              onClick={handleHelpClick}
              className="admin-content-help-btn"
            >
              {t('layout.faq')}
            </Button>
          )}
        </div>

        <div className="admin-content-card-body">
          <ComponentMapper
            componentName={selectedMenu.component}
            menuData={selectedMenu}
          />
        </div>
      </div>
    );
  };

  return renderContent();
};

export default AdminContentComponent;
