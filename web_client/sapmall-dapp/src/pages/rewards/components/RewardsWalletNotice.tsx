import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import styles from '../RewardsPageDetail.module.scss';

const RewardsWalletNotice: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.walletNotice} aria-labelledby="rewards-wallet-notice">
      <div className={styles.walletNoticeIcon} aria-hidden>
        <Info size={20} strokeWidth={2.25} />
      </div>
      <div>
        <h2 id="rewards-wallet-notice" className={styles.walletNoticeTitle}>
          {t('rewards.walletNoticeTitle')}
        </h2>
        <p className={styles.walletNoticeBody}>{t('rewards.walletNoticeBody')}</p>
      </div>
    </section>
  );
};

export default RewardsWalletNotice;


