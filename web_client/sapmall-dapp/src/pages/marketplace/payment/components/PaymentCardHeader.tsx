import React from 'react';
import styles from '../PaymentPage.module.scss';

interface Props {
  icon: React.ReactNode;
  iconVariant: 'contact' | 'product' | 'pay';
  title: string;
  action?: React.ReactNode;
}

const PaymentCardHeader: React.FC<Props> = ({ icon, iconVariant, title, action }) => {
  const iconClass =
    iconVariant === 'contact'
      ? styles.sectionIconContact
      : iconVariant === 'product'
        ? styles.sectionIconProduct
        : styles.sectionIconPay;

  return (
    <div className={action ? styles.sectionHeadWithAction : styles.sectionHead}>
      <span className={`${styles.sectionIcon} ${iconClass}`} aria-hidden>
        {icon}
      </span>
      <div className={styles.sectionHeadText}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {action ? <div className={styles.sectionHeadAction}>{action}</div> : null}
    </div>
  );
};

export default PaymentCardHeader;
