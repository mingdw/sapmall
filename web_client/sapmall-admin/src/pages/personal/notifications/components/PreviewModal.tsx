import React, { useState } from 'react';
import { Modal } from 'antd';
import { PREVIEW_CONTENT } from '../constants';
import styles from '../NotificationManager.module.scss';

interface Props {
  open: boolean;
  notificationId: string | null;
  onClose: () => void;
}

type PreviewTab = 'email' | 'mobile' | 'browser';

const PreviewModal: React.FC<Props> = ({ open, notificationId, onClose }) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('email');
  const content = notificationId ? PREVIEW_CONTENT[notificationId] : null;

  const tabs: { key: PreviewTab; label: string; icon: string }[] = [
    { key: 'email', label: '邮件通知', icon: 'fa-envelope' },
    { key: 'mobile', label: '手机通知', icon: 'fa-mobile-alt' },
    { key: 'browser', label: '浏览器通知', icon: 'fa-desktop' },
  ];

  return (
    <Modal
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-eye" style={{ color: '#60a5fa' }}></i>
          通知预览
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      destroyOnClose
    >
      <div className={styles.previewTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`${styles.previewTab} ${activeTab === tab.key ? styles.previewTabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Email Preview */}
      <div className={`${styles.previewPanel} ${activeTab === 'email' ? styles.previewPanelActive : ''}`}>
        <div className={styles.emailPreview}>
          <div className={styles.emailHeader}>
            <div className={styles.emailControls}>
              <span className={styles.emailDot} style={{ background: '#ff6054' }}></span>
              <span className={styles.emailDot} style={{ background: '#ffbd2e' }}></span>
              <span className={styles.emailDot} style={{ background: '#28ca41' }}></span>
            </div>
            <div className={styles.emailAddressBar}>
              <i className="fas fa-envelope"></i>
              <span>user@example.com</span>
            </div>
          </div>
          <div className={styles.emailContent}>
            <div className={styles.emailSubject}>
              <span>主题: </span>
              <span className={styles.emailSubjectText}>{content?.title || '--'}</span>
            </div>
            <div className={styles.emailBody}>
              <p className={styles.emailGreeting}>尊敬的用户：</p>
              <p className={styles.emailParagraph}>{content?.body || '--'}</p>
              <button className={styles.emailActionBtn} type="button">查看详情</button>
              <p className={styles.emailSignature}>
                此致，<br />Sapphire Mall 团队
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className={`${styles.previewPanel} ${activeTab === 'mobile' ? styles.previewPanelActive : ''}`}>
        <div className={styles.mobilePreview}>
          <div className={styles.mobileDevice}>
            <div className={styles.mobileNotch}></div>
            <div className={styles.mobileScreen}>
              <div className={styles.mobileStatusBar}>
                <div>10:30</div>
                <div className={styles.mobileStatusIcons}>
                  <i className="fas fa-wifi"></i>
                  <i className="fas fa-signal"></i>
                  <i className="fas fa-battery-full"></i>
                </div>
              </div>
              <div className={styles.mobileNotification}>
                <div className={styles.mobileNotifHeader}>
                  <div className={styles.mobileAppIcon}>
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div>
                    <div className={styles.mobileAppName}>Sapphire Mall</div>
                    <div className={styles.mobileNotifTime}>刚刚</div>
                  </div>
                </div>
                <div className={styles.mobileNotifTitle}>{content?.title || '--'}</div>
                <div className={styles.mobileNotifBody}>{content?.body || '--'}</div>
              </div>
            </div>
            <div className={styles.mobileHomeBtn}></div>
          </div>
        </div>
      </div>

      {/* Browser Preview */}
      <div className={`${styles.previewPanel} ${activeTab === 'browser' ? styles.previewPanelActive : ''}`}>
        <div className={styles.browserPreview}>
          <div className={styles.browserNotif}>
            <div className={styles.browserNotifHeader}>
              <div className={styles.browserNotifIcon}>
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div>
                <div className={styles.browserNotifSite}>Sapphire Mall</div>
                <div className={styles.browserNotifTime}>刚刚</div>
              </div>
              <span className={styles.browserNotifClose}>×</span>
            </div>
            <div className={styles.browserNotifTitle}>{content?.title || '--'}</div>
            <div className={styles.browserNotifBody}>{content?.body || '--'}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
