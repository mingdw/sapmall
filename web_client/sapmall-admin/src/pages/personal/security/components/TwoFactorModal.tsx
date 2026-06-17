import React from 'react';
import { Modal, Input, Button } from 'antd';

interface Props {
  open: boolean;
  step: number;
  verificationCode: string;
  onStepChange: (step: number) => void;
  onCodeChange: (code: string) => void;
  onComplete: () => void;
  onClose: () => void;
}

const TwoFactorModal: React.FC<Props> = ({
  open,
  step,
  verificationCode,
  onStepChange,
  onCodeChange,
  onComplete,
  onClose,
}) => {
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>
              请在您的手机上下载并安装以下任一认证应用：
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Google Authenticator (推荐)', 'Microsoft Authenticator', 'Authy'].map((app) => (
                <li key={app} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                  <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i>
                  {app}
                </li>
              ))}
            </ul>
            <Button type="primary" onClick={() => onStepChange(2)}>
              下一步
            </Button>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>使用认证应用扫描下方二维码：</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 192, height: 192, background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ textAlign: 'center', color: '#475569' }}>
                  <i className="fas fa-qrcode" style={{ fontSize: 48, marginBottom: 8 }}></i>
                  <p style={{ fontSize: 12, margin: 0 }}>QR Code</p>
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)', borderRadius: 8, padding: 12, textAlign: 'center',
            }}>
              <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 4px' }}>
                如果无法扫描，请手动输入密钥：
              </p>
              <code style={{ color: '#60a5fa', fontFamily: 'ui-monospace, monospace', fontSize: 13, letterSpacing: 1 }}>
                JBSWY3DPEHPK3PXP
              </code>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => onStepChange(1)}>上一步</Button>
              <Button type="primary" onClick={() => onStepChange(3)}>下一步</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>
              请输入认证应用显示的6位验证码：
            </p>
            <Input
              placeholder="验证码"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => onCodeChange(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => onStepChange(2)}>上一步</Button>
              <Button type="primary" onClick={onComplete}>完成设置</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="设置双重认证"
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnClose
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
              background: step >= s ? '#2563eb' : '#334155',
              color: step >= s ? '#fff' : '#94a3b8',
              transition: 'background 0.2s',
            }}>
              {s}
            </div>
            {s < 3 && (
              <div style={{
                width: 48, height: 2, borderRadius: 1,
                background: step > s ? '#2563eb' : '#334155',
                transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
      {renderContent()}
    </Modal>
  );
};

export default TwoFactorModal;
