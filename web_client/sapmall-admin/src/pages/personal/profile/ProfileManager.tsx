import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Tag, Tooltip } from 'antd';
import MessageUtils from '../../../utils/messageUtils';
import { profileMockData } from './mock';
import type { KycSubmitPayload, MerchantDepositIntent, ProfileData } from './types';
import ProfileSectionList from './components/ProfileSectionList';
import KycModal from './components/KycModal';
import MerchantDepositModal from './components/MerchantDepositModal';
import styles from './ProfileManager.module.scss';

const ProfileManager: React.FC = () => {
  // TODO: 接入用户信息、KYC提交流程的真实后端 API（保留当前 mock 逻辑作为联调兜底）
  const [savedProfile, setSavedProfile] = useState<ProfileData>(profileMockData);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(profileMockData);
  const [saving, setSaving] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [merchantLoading, setMerchantLoading] = useState(false);
  const [merchantIntent, setMerchantIntent] = useState<MerchantDepositIntent | null>(null);
  const hasChanges = useMemo(
    () => JSON.stringify(draftProfile) !== JSON.stringify(savedProfile),
    [draftProfile, savedProfile],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(draftProfile.walletAddress);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = draftProfile.walletAddress;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      MessageUtils.success('钱包地址已复制');
    } catch {
      MessageUtils.error('复制失败，请手动复制');
    }
  };

  const handleProfileChange = (nextProfile: ProfileData) => {
    setDraftProfile(nextProfile);
  };

  const handleReset = () => {
    setDraftProfile(savedProfile);
    MessageUtils.info('已恢复到上次保存状态');
  };

  const handleSave = () => {
    if (!hasChanges) return;
    setSaving(true);
    window.setTimeout(() => {
      setSavedProfile(draftProfile);
      setSaving(false);
      MessageUtils.success('个人信息已保存');
    }, 500);
  };

  const handleKycCompleted = (payload: KycSubmitPayload) => {
    setSavedProfile((prev) => ({
      ...prev,
      kycStatus: 'pending',
    }));
    setDraftProfile((prev) => ({
      ...prev,
      kycStatus: 'pending',
    }));
    setKycModalOpen(false);
    MessageUtils.success(`KYC申请已提交：${payload.basicInfo.realName}`);
  };

  const buildMockIntent = (): MerchantDepositIntent => {
    const now = Date.now();
    return {
      intentId: `INTENT_${now}`,
      amount: '100',
      token: 'USDT',
      chainId: 8453,
      contractAddress: '0xAaBbCcDdEeFf00112233445566778899AaBbCcDd',
      expireAt: new Date(now + 30 * 60 * 1000).toLocaleString(),
    };
  };

  const openMerchantDepositPage = (intent: MerchantDepositIntent) => {
    const messagePayload = {
      type: 'OPEN_MERCHANT_DEPOSIT',
      payload: {
        intentId: intent.intentId,
        amount: intent.amount,
        token: intent.token,
        chainId: intent.chainId,
        contractAddress: intent.contractAddress,
        returnPath: '/admin?menu=profile',
      },
    };

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(messagePayload, '*');
      MessageUtils.info('已通知DApp打开保证金缴纳页面');
      return;
    }

    const depositUrl = `/merchant/deposit?intentId=${encodeURIComponent(intent.intentId)}&returnPath=${encodeURIComponent(
      '/admin?menu=profile',
    )}`;
    window.open(depositUrl, '_blank');
    MessageUtils.info('已在新页面打开保证金缴纳入口');
  };

  const handleMerchantSubmitApplication = () => {
    setMerchantLoading(true);
    window.setTimeout(() => {
      const nextIntent = buildMockIntent();
      setMerchantIntent(nextIntent);
      setSavedProfile((prev) => ({ ...prev, merchantDepositStatus: 'pending_payment' }));
      setDraftProfile((prev) => ({ ...prev, merchantDepositStatus: 'pending_payment' }));
      setMerchantLoading(false);
      MessageUtils.success('商家申请已提交，请前往DApp缴纳保证金');
    }, 500);
  };

  const handleMerchantOpenDapp = () => {
    if (!merchantIntent) {
      MessageUtils.warning('保证金意图单不存在，请重新提交申请');
      return;
    }
    openMerchantDepositPage(merchantIntent);
    setSavedProfile((prev) => ({ ...prev, merchantDepositStatus: 'confirming' }));
    setDraftProfile((prev) => ({ ...prev, merchantDepositStatus: 'confirming' }));
  };

  const handleMerchantMarkPaid = () => {
    setMerchantLoading(true);
    window.setTimeout(() => {
      setMerchantIntent((prev) =>
        prev
          ? {
              ...prev,
              txHash: `0x${Date.now().toString(16)}abcdef`,
            }
          : prev,
      );
      setSavedProfile((prev) => ({ ...prev, merchantDepositStatus: 'paid' }));
      setDraftProfile((prev) => ({ ...prev, merchantDepositStatus: 'paid' }));
      setMerchantLoading(false);
      MessageUtils.success('保证金到账确认成功，商家功能已开通（模拟）');
    }, 600);
  };

  return (
    <div className={styles.profileManager}>
      {hasChanges && (
        <Alert
          className={styles.unsavedAlert}
          type="warning"
          showIcon
          message="你有未保存的个人信息修改"
          description="可点击右上方“保存更改”提交，或点击“重置”放弃本次修改。"
        />
      )}

      <section className={styles.overviewCard}>
        <div className={styles.overviewMain}>
          <div className={styles.avatarBox}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.overviewMeta}>
            <div className={styles.overviewTopRow}>
              <h2 className={styles.overviewName}>{draftProfile.nickname || draftProfile.username}</h2>
              <Tag className={styles.roleTag}>{draftProfile.userRole}</Tag>
            </div>
            <div className={styles.walletLine}>
              <span className={styles.walletLabel}>钱包地址</span>
              <Tooltip title={draftProfile.walletAddress}>
                <span className={styles.walletValue}>{draftProfile.walletAddress}</span>
              </Tooltip>
              <Button
                type="text"
                size="small"
                className={styles.copyIconButton}
                icon={<i className="fas fa-copy"></i>}
                onClick={handleCopyAddress}
              />
            </div>
            <div className={styles.overviewHint}>
              <span>{draftProfile.statusText || '账户状态正常'}</span>
              {hasChanges ? (
                <span className={styles.unsavedBadge}>存在未保存更改</span>
              ) : (
                <span className={styles.savedBadge}>已同步最新数据</span>
              )}
            </div>
          </div>
        </div>
        {(hasChanges || saving) && (
          <div className={styles.overviewActions}>
            <Button onClick={handleReset} disabled={saving}>
              重置
            </Button>
            <Button type="primary" onClick={handleSave} loading={saving}>
              保存更改
            </Button>
          </div>
        )}
      </section>

      <ProfileSectionList
        profile={draftProfile}
        onProfileChange={handleProfileChange}
        onOpenKyc={() => setKycModalOpen(true)}
        onOpenMerchantApplyModal={() => setMerchantModalOpen(true)}
        merchantIntent={merchantIntent}
        merchantLoading={merchantLoading}
        onMerchantOpenDapp={handleMerchantOpenDapp}
        onMerchantMarkPaid={handleMerchantMarkPaid}
      />

      <KycModal
        open={kycModalOpen}
        onCancel={() => setKycModalOpen(false)}
        onCompleted={handleKycCompleted}
      />

      <MerchantDepositModal
        open={merchantModalOpen}
        loading={merchantLoading}
        onCancel={() => setMerchantModalOpen(false)}
        onSubmitApplication={() => {
          handleMerchantSubmitApplication();
          setMerchantModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProfileManager;
