import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './ConnectWalletComponent.module.scss';

interface ConnectWalletComponentProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const ConnectWalletComponent: React.FC<ConnectWalletComponentProps> = ({
  title = "连接钱包",
  description = "请先连接您的钱包以继续操作",
  showBackButton = true,
  onBack,
  className = ""
}) => {
  return (
    <div className={`${styles.connectWalletContainer} ${className}`}>
      {/* 背景装饰 */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.floatingOrb}></div>
        <div className={styles.floatingOrb}></div>
        <div className={styles.floatingOrb}></div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* 主要内容 */}
      <div className={styles.content}>
        {/* 返回按钮 */}
        {showBackButton && (
          <button 
            className={styles.backButton}
            onClick={onBack}
          >
            <i className="fas fa-arrow-left"></i>
            <span>返回</span>
          </button>
        )}

        {/* 钱包图标 */}
        <div className={styles.walletIcon}>
          <div className={styles.iconContainer}>
            <i className="fas fa-wallet"></i>
            <div className={styles.iconGlow}></div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        {/* 连接钱包按钮 */}
        <div className={styles.connectButtonContainer}>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button 
                          onClick={openConnectModal} 
                          className={styles.connectButton}
                        >
                          <i className="fas fa-plug"></i>
                          <span>连接钱包</span>
                          <div className={styles.buttonGlow}></div>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button 
                          onClick={openChainModal} 
                          className={styles.switchChainButton}
                        >
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>切换网络</span>
                        </button>
                      );
                    }

                    return (
                      <button 
                        onClick={openAccountModal} 
                        className={styles.accountButton}
                      >
                        <i className="fas fa-user-circle"></i>
                        <span>查看账户</span>
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* 支持的钱包列表 */}
        <div className={styles.supportedWallets}>
          <p className={styles.supportedTitle}>支持的钱包</p>
          <div className={styles.walletList}>
            <div className={styles.walletItem}>
              <i className="fab fa-ethereum"></i>
              <span>MetaMask</span>
            </div>
            <div className={styles.walletItem}>
              <i className="fas fa-mobile-alt"></i>
              <span>WalletConnect</span>
            </div>
            <div className={styles.walletItem}>
              <i className="fas fa-coins"></i>
              <span>Coinbase</span>
            </div>
            <div className={styles.walletItem}>
              <i className="fas fa-shield-alt"></i>
              <span>Trust Wallet</span>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className={styles.footerTip}>
          <i className="fas fa-info-circle"></i>
          <span>连接钱包后即可开始使用所有功能</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletComponent;
