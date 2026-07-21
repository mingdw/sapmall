import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'antd';
import AdminModal from '../../../../components/common/AdminModal';
import AdminButton from '../../../../components/common/AdminButton';
import styles from '../ProfileManager.module.scss';

interface MerchantDepositModalProps {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmitApplication: () => void;
}

/** 完整条款静态文件（置于 public/legal，便于运维替换为 PDF 等格式） */
const FULL_TERMS_DOWNLOAD_HREF = '/legal/merchant-onboarding-deposit-terms-full.txt';

const AGREEMENT_SECTION_KEYS = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6'] as const;

const MerchantDepositModal: React.FC<MerchantDepositModalProps> = ({
  open,
  loading,
  onCancel,
  onSubmitApplication,
}) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const agreementSections = useMemo(
    () =>
      AGREEMENT_SECTION_KEYS.map((key) => ({
        key,
        title: t(`personal.profile.merchant.terms.${key}.title`),
        content: t(`personal.profile.merchant.terms.${key}.content`),
      })),
    [t],
  );

  const fullTermsDownloadName = t('personal.profile.merchant.terms.downloadName');

  /** 滚到底或内容不足以产生滚动时，视为已读完，才允许勾选「我同意」 */
  const checkScrollBottom = useCallback(() => {
    const target = scrollRef.current;
    if (!target) return;
    const { scrollTop, clientHeight, scrollHeight } = target;
    const epsilon = 8;
    const fitsWithoutScroll = scrollHeight <= clientHeight + epsilon;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - epsilon;
    if (fitsWithoutScroll || scrolledToBottom) {
      setHasReachedBottom(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    setHasReachedBottom(false);
    setAgreed(false);
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
    const id = window.requestAnimationFrame(() => {
      checkScrollBottom();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, checkScrollBottom]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      checkScrollBottom();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, checkScrollBottom]);

  const canSubmit = useMemo(() => hasReachedBottom && agreed && !loading, [agreed, hasReachedBottom, loading]);

  const handleSubmit = () => {
    if (!hasReachedBottom || !agreed || loading) return;
    onSubmitApplication();
  };

  return (
    <AdminModal
      open={open}
      onCancel={onCancel}
      title={
        <div className={styles.merchantModalTitle}>
          <i className="fas fa-balance-scale"></i>
          <span>{t('personal.profile.merchant.terms.modalTitle')}</span>
        </div>
      }
      footer={null}
      size="medium"
    >
      <div className={styles.merchantModalBody}>
        <div className={styles.merchantModalTermsIntro}>
          <i
            className={`fas fa-exclamation-triangle ${styles.merchantModalTermsIntroIcon}`}
            aria-hidden
          />
          <div className={styles.merchantModalTermsIntroText}>
            <p>{t('personal.profile.merchant.terms.intro1')}</p>
            <p>{t('personal.profile.merchant.terms.intro2')}</p>
          </div>
        </div>

        <div ref={scrollRef} className={styles.merchantAgreementScroll} onScroll={checkScrollBottom}>
          {agreementSections.map((item) => (
            <div key={item.key} className={styles.merchantAgreementSection}>
              <h4>{item.title}</h4>
              <p>{item.content}</p>
            </div>
          ))}
        </div>

        <div className={styles.merchantAgreementCheck}>
          <Checkbox
            checked={agreed}
            disabled={!hasReachedBottom}
            onChange={(event) => setAgreed(event.target.checked)}
          >
            <span className={styles.merchantAgreementCheckboxLabel}>
              {t('personal.profile.merchant.terms.agreePrefix')}
              <a
                href={FULL_TERMS_DOWNLOAD_HREF}
                download={fullTermsDownloadName}
                className={styles.merchantTermsDocLink}
                onClick={(event) => event.stopPropagation()}
              >
                {t('personal.profile.merchant.terms.agreeLink')}
              </a>
            </span>
          </Checkbox>
          {!hasReachedBottom && (
            <span className={styles.merchantAgreementTips}>
              {t('personal.profile.merchant.terms.scrollTip')}
            </span>
          )}
          {hasReachedBottom && !agreed && (
            <span className={styles.merchantAgreementTipsAlert}>
              {t('personal.profile.merchant.terms.checkTip')}
            </span>
          )}
        </div>

        <div className={styles.merchantModalFooter}>
          <AdminButton variant="outline" icon="fas fa-times" onClick={onCancel}>
            {t('personal.profile.merchant.terms.close')}
          </AdminButton>
          <AdminButton
            variant="submit"
            icon="fas fa-file-signature"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {t('personal.profile.merchant.terms.submit')}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

export default MerchantDepositModal;
