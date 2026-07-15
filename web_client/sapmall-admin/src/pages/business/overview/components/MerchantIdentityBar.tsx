import React, { useMemo, useState } from 'react';
import type {
  CertStatus,
  CustomerConversation,
  MerchantIdentity,
  RecentOrder,
  TopProduct,
} from '../types';
import CustomerServicePanel from './CustomerServiceFab';
import styles from '../StoreOverview.module.scss';

interface MerchantIdentityBarProps {
  merchant: MerchantIdentity;
  conversations: CustomerConversation[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

/** 钱包地址缩写展示 */
function shortenWallet(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

const certLabelMap: Record<CertStatus, string> = {
  verified: '已认证',
  pending: '认证中',
  unverified: '未认证',
};

const MerchantIdentityBar: React.FC<MerchantIdentityBarProps> = ({
  merchant,
  conversations,
  recentOrders,
  topProducts,
}) => {
  const [csOpen, setCsOpen] = useState(false);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  );

  return (
    <div className={styles.identityBar}>
      <div className={styles.identityMain}>
        <div className={styles.walletBlock}>
          <span className={styles.walletLabel}>商家钱包</span>
          <span className={styles.walletAddr} title={merchant.walletAddress}>
            {shortenWallet(merchant.walletAddress)}
          </span>
        </div>

        <div className={styles.identityMeta}>
          <span className={styles.metaChip}>
            <i className="fas fa-medal" />
            {merchant.level}
          </span>
          <span className={styles.metaChip}>
            <i className="fas fa-star" />
            {merchant.rating.toFixed(1)}
          </span>
          <span className={`${styles.certBadge} ${styles[`cert_${merchant.certStatus}`]}`}>
            <i className="fas fa-certificate" />
            {certLabelMap[merchant.certStatus]}
          </span>

          <button
            type="button"
            className={styles.csEntryBtn}
            onClick={() => setCsOpen(true)}
            aria-label="打开客服会话"
          >
            <i className="fas fa-headset" />
            客户咨询
            {unreadTotal > 0 ? <span className={styles.csEntryBadge}>{unreadTotal}</span> : null}
          </button>
        </div>
      </div>

      <CustomerServicePanel
        open={csOpen}
        conversations={conversations}
        recentOrders={recentOrders}
        topProducts={topProducts}
        onClose={() => setCsOpen(false)}
      />
    </div>
  );
};

export default MerchantIdentityBar;
