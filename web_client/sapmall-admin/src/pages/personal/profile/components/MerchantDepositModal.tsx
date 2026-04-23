import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
const FULL_TERMS_DOWNLOAD_NAME = '商家入驻与保证金服务条款（完整版）.txt';

const AGREEMENT_SECTIONS: Array<{ title: string; content: string }> = [
  {
    title: '一、商家入驻资格与主体责任',
    content:
      '申请人应保证提交信息真实、完整、合法，并具备相应民事行为能力与经营资质。若因虚假信息或资质缺失导致纠纷、处罚或损失，平台有权终止服务并追究责任。',
  },
  {
    title: '二、交易合规与用户权益保护',
    content:
      '商家应严格遵守国家及地区法律法规，禁止售卖违禁商品、侵犯知识产权商品或存在欺诈风险的商品。商家应及时处理订单、售后与投诉，保障消费者合法权益。',
  },
  {
    title: '三、保证金规则',
    content:
      '商家需按平台要求缴纳保证金，作为履约与风险处理的保障。若发生欺诈、严重违约、侵权等行为，平台可依据规则扣除部分或全部保证金并采取限制措施。',
  },
  {
    title: '四、数据与隐私保护',
    content:
      '商家在经营过程中获取的用户信息仅可用于订单履行、售后服务等合法用途，不得泄露、出售或非法使用。商家须落实安全措施，防止数据泄露与滥用。',
  },
  {
    title: '五、平台治理与违规处理',
    content:
      '平台有权基于风控、合规与运营规则对商家经营行为进行监督。对违规行为可采取警告、下架、冻结、清退等措施；涉嫌违法的，将依法移交监管或司法机关。',
  },
  {
    title: '六、争议解决与条款更新',
    content:
      '因本协议引发的争议，双方应优先协商解决；协商不成时，按平台公示的争议解决机制执行。平台可根据法律或业务变化更新条款，并通过公告等方式通知商家。',
  },
];

const MerchantDepositModal: React.FC<MerchantDepositModalProps> = ({
  open,
  loading,
  onCancel,
  onSubmitApplication,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
          <span>商家认证法律条款确认</span>
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
            <p>请完整阅读以下平台商家入驻及保证金相关条款。</p>
            <p>仅在滚动阅读完成并勾选同意后，才可提交商家认证申请。</p>
          </div>
        </div>

        <div ref={scrollRef} className={styles.merchantAgreementScroll} onScroll={checkScrollBottom}>
          {AGREEMENT_SECTIONS.map((item) => (
            <div key={item.title} className={styles.merchantAgreementSection}>
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
              我已完整阅读并同意
              <a
                href={FULL_TERMS_DOWNLOAD_HREF}
                download={FULL_TERMS_DOWNLOAD_NAME}
                className={styles.merchantTermsDocLink}
                onClick={(event) => event.stopPropagation()}
              >
                《商家入驻与保证金服务条款》
              </a>
            </span>
          </Checkbox>
          {!hasReachedBottom && (
            <span className={styles.merchantAgreementTips}>请先向下滚动，阅读至条款最底部</span>
          )}
          {hasReachedBottom && !agreed && (
            <span className={styles.merchantAgreementTipsAlert}>请勾选「我同意」后，再提交申请</span>
          )}
        </div>

        <div className={styles.merchantModalFooter}>
          <AdminButton variant="outline" icon="fas fa-times" onClick={onCancel}>
            关闭
          </AdminButton>
          <AdminButton
            variant="submit"
            icon="fas fa-file-signature"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            去申请
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

export default MerchantDepositModal;
