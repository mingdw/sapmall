import React from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PaymentMethod } from '../types/paymentTypes';
import {
  formatTokenToUsdcRate,
  formatUsdcToTokenRate,
  PAYMENT_TOKEN_RATES_AS_OF,
} from '../utils/paymentTokenRates';
import styles from '../PaymentPage.module.scss';

interface Props {
  method: PaymentMethod;
}

const PaymentCurrencyRatePanel: React.FC<Props> = ({ method }) => {
  const { t } = useTranslation();
  const rateLine = formatTokenToUsdcRate(method);
  const inverseLine = formatUsdcToTokenRate(method);

  return (
    <div className={styles.payRatePanel}>
      <div className={styles.payRatePanelHead}>
        <p className={styles.payRatePanelTitle}>{t('payment.pay.ratePanelTitle')}</p>
        <span className={styles.payRatePanelAsOf}>
          {t('payment.pay.rateAsOf', { date: PAYMENT_TOKEN_RATES_AS_OF })}
        </span>
      </div>
      <dl className={styles.payRatePanelList}>
        <div className={styles.payRatePanelRow}>
          <dt>{t('payment.pay.rateLine')}</dt>
          <dd>{rateLine}</dd>
        </div>
        {inverseLine ? (
          <div className={styles.payRatePanelRow}>
            <dt>{t('payment.pay.rateInverseLine')}</dt>
            <dd>{inverseLine}</dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.payRatePanelOracle}>
        <Info size={12} strokeWidth={2} aria-hidden />
        {t('payment.pay.oracleDisclaimer')}
      </p>
    </div>
  );
};

export default PaymentCurrencyRatePanel;
