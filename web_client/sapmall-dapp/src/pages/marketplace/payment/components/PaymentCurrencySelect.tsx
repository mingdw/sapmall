import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAvailablePaymentCurrencies, isSapPayment } from '../../../../config/paymentCurrencies';
import { PaymentMethod } from '../types/paymentTypes';
import PaymentTokenIcon from './PaymentTokenIcon';
import styles from '../PaymentPage.module.scss';

const COLLAPSED_VISIBLE = 3;

interface Props {
  chainId?: number;
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

function splitStableVisible(
  stables: PaymentMethod[],
  selected: PaymentMethod,
  expanded: boolean,
): { visible: PaymentMethod[]; hidden: PaymentMethod[] } {
  if (expanded || stables.length <= COLLAPSED_VISIBLE) {
    return { visible: stables, hidden: [] };
  }

  const head = stables.slice(0, COLLAPSED_VISIBLE);
  const tail = stables.slice(COLLAPSED_VISIBLE);

  if (!tail.includes(selected) || isSapPayment(selected)) {
    return { visible: head, hidden: tail };
  }

  const visible = [...stables.filter((m) => m !== selected).slice(0, COLLAPSED_VISIBLE - 1), selected];
  const hidden = stables.filter((m) => !visible.includes(m));
  return { visible, hidden };
}

function resolveCurrencyDesc(
  method: PaymentMethod,
  t: (key: string, opts?: { defaultValue?: string }) => string,
): string {
  const key = `payment.pay.currencies.${method}.desc`;
  const text = t(key);
  return text === key ? '' : text;
}

function resolveCurrencyLabel(method: PaymentMethod, t: (key: string) => string): string {
  if (isSapPayment(method)) return t('payment.pay.methodSap');
  return method;
}

const PaymentCurrencySelect: React.FC<Props> = ({ chainId, value, onChange, disabled }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const { stables, sapMethods } = useMemo(() => {
    const all = getAvailablePaymentCurrencies(chainId);
    return {
      stables: all.filter((m) => !isSapPayment(m)),
      sapMethods: all.filter(isSapPayment),
    };
  }, [chainId]);

  useEffect(() => {
    setExpanded(false);
  }, [chainId]);

  const { visible } = useMemo(
    () => splitStableVisible(stables, value, expanded),
    [stables, value, expanded],
  );

  const renderRow = (method: PaymentMethod, variant: 'stable' | 'sap') => {
    const selected = value === method;
    return (
      <button
        key={method}
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        className={[
          styles.payCurrencyOption,
          selected ? styles.payCurrencyOptionActive : '',
          variant === 'sap' ? styles.payCurrencyOptionSap : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange(method)}
      >
        <PaymentTokenIcon symbol={method} />
        <span className={styles.payCurrencyMain}>
          <span className={styles.payCurrencyTitleRow}>
            <span className={styles.payCurrencyName}>{resolveCurrencyLabel(method, t)}</span>
            {variant === 'sap' ? (
              <>
                <span className={styles.payCurrencyBadge}>{t('payment.pay.sapFeeBadge')}</span>
                <span className={styles.payCurrencyPlatformTag}>{t('payment.pay.sapSectionLabel')}</span>
              </>
            ) : null}
          </span>
          <span className={styles.payCurrencyHint}>{resolveCurrencyDesc(method, t)}</span>
        </span>
        <span className={styles.payCurrencyCheck} aria-hidden>
          {selected ? <Check size={10} strokeWidth={3} /> : null}
        </span>
      </button>
    );
  };

  const canFold = stables.length > COLLAPSED_VISIBLE;

  const displayedStables = expanded ? stables : visible;

  return (
    <div className={styles.payCurrencyWrap}>
      <div
        className={styles.payCurrencyStableBlock}
        role="radiogroup"
        aria-label={t('payment.pay.currencyAria')}
      >
        <div className={styles.payCurrencyList}>
          {displayedStables.map((m) => renderRow(m, 'stable'))}
        </div>

        {canFold && !expanded ? (
          <button
            type="button"
            className={styles.payCurrencyFoldBtn}
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            aria-label={t('payment.pay.expandCurrencies')}
          >
            <ChevronDown size={18} strokeWidth={2} aria-hidden />
          </button>
        ) : null}

        {canFold && expanded ? (
          <button
            type="button"
            className={styles.payCurrencyFoldBtn}
            onClick={() => setExpanded(false)}
            aria-expanded
            aria-label={t('payment.pay.collapseCurrencies')}
          >
            <ChevronUp size={18} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </div>

      {sapMethods.length > 0 ? (
        <div className={styles.payCurrencySapSection} role="presentation">
          <div className={styles.payCurrencyList} role="presentation">
            {sapMethods.map((m) => renderRow(m, 'sap'))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentCurrencySelect;
