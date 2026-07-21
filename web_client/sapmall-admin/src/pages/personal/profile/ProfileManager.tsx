import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Tooltip } from 'antd';
import MessageUtils from '../../../utils/messageUtils';
import type { KycSubmitPayload, MerchantDepositIntent, ProfileData } from './types';
import ProfileSectionList from './components/ProfileSectionList';
import KycModal from './components/KycModal';
import MerchantDepositModal from './components/MerchantDepositModal';
import { userApi } from '../../../services/api/userApi';
import { useUserStore } from '../../../store/userStore';
import styles from './ProfileManager.module.scss';

const EMPTY_PROFILE: ProfileData = {
  userId: '',
  username: '',
  nickname: '',
  walletAddress: '',
  userRole: '',
  statusText: '',
  brief: '',
  gender: 'unknown',
  birthday: '',
  registerTime: '',
  email: '',
  phone: '',
  emailVerified: false,
  phoneVerified: false,
  kycStatus: 'not_verified',
  merchantDepositStatus: 'not_applied',
  settings: {
    profilePublic: true,
    marketingEmails: false,
    transactionNotifications: true,
  },
  operationLogs: [],
};

const mapGender = (gender?: number): ProfileData['gender'] => {
  if (gender === 1) return 'male';
  if (gender === 2) return 'female';
  return 'unknown';
};

const mapKycStatus = (status?: number): ProfileData['kycStatus'] => {
  if (status === 1) return 'pending';
  if (status === 2) return 'verified';
  return 'not_verified';
};

const mapMerchantDepositStatus = (status?: number): ProfileData['merchantDepositStatus'] => {
  if (status === 1) return 'pending_payment';
  if (status === 2) return 'confirming';
  if (status === 3) return 'paid';
  return 'not_applied';
};

const mapOperationResult = (status?: number): 'success' | 'failed' | 'partial' => {
  if (status === 2) return 'failed';
  if (status === 3) return 'partial';
  return 'success';
};

const formatWalletAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const mapGenderToApi = (gender: ProfileData['gender']): number | undefined => {
  if (gender === 'male') return 1;
  if (gender === 'female') return 2;
  return undefined;
};

const formatAmountTo2 = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toFixed(2);
};

const mapDepositToIntent = (deposit?: any): MerchantDepositIntent | null => {
  if (!deposit || !deposit.intentId) {
    return null;
  }
  return {
    id: deposit.id,
    intentId: deposit.intentId,
    businessType: deposit.businessType,
    depositStatus: Number(deposit.depositStatus ?? 0),
    depositStatusDesc: deposit.depositStatusDesc || '',
    amount: formatAmountTo2(deposit.amount),
    token: deposit.token || deposit.tokenSymbol || '',
    chainId: Number(deposit.chainId ?? 0),
    contractAddress: deposit.contractAddress || '',
    expireAt: deposit.expireAt || '',
    tokenAddress: deposit.tokenAddress || '',
    txHash: deposit.txHash || '',
    refundTxHash: deposit.refundTxHash || '',
    blockNumber: deposit.blockNumber !== undefined ? Number(deposit.blockNumber) : undefined,
    confirmations: deposit.confirmations !== undefined ? Number(deposit.confirmations) : undefined,
    failReason: deposit.failReason || '',
    remark: deposit.remark || '',
    paidAt: deposit.paidAt || '',
    confirmedAt: deposit.confirmedAt || '',
    refundedAt: deposit.refundedAt || '',
    createdAt: deposit.createdAt || '',
    updatedAt: deposit.updatedAt || '',
  };
};

const ProfileManager: React.FC = () => {
  const { t } = useTranslation();
  const [savedProfile, setSavedProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [initializing, setInitializing] = useState(true);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [merchantLoading, setMerchantLoading] = useState(false);
  const [merchantDetailLoading, setMerchantDetailLoading] = useState(false);
  const [merchantIntent, setMerchantIntent] = useState<MerchantDepositIntent | null>(null);
  const [userStatusCode, setUserStatusCode] = useState<number>(0);

  const loadProfile = useCallback(async (silent = false) => {
    const currentUser = useUserStore.getState().getCurrentUser();
    const userId = currentUser?.userId;
    if (!userId) {
      throw new Error(t('personal.profile.msg.userIdNotFound'));
    }

    const resp = await userApi.getUserInfo(userId);
    const basicInfo = resp?.basicInfo;
    const roles = Array.isArray(resp?.roles) ? resp.roles : [];
    const operationLogs = Array.isArray(resp?.operationLogs) ? resp.operationLogs : [];

    const profile: ProfileData = {
      userId: String(basicInfo?.id ?? userId),
      username: currentUser?.userAddress || basicInfo?.userCode || '',
      nickname: basicInfo?.nickname || '',
      walletAddress: currentUser?.userAddress || basicInfo?.userCode || '',
      userRole: roles[0]?.roleName || t('personal.profile.defaultRole'),
      statusText:
        basicInfo?.status === 1
          ? t('personal.profile.accountStatusDisabledFull')
          : t('personal.profile.accountStatusNormalFull'),
      brief: basicInfo?.typeDesc || '',
      gender: mapGender(basicInfo?.gender),
      birthday: basicInfo?.birthday || '',
      registerTime: basicInfo?.createdAt || '',
      email: basicInfo?.email || '',
      phone: basicInfo?.phone || '',
      emailVerified: Boolean(basicInfo?.email),
      phoneVerified: Boolean(basicInfo?.phone),
      kycStatus: mapKycStatus(basicInfo?.kycStatus),
      merchantDepositStatus: mapMerchantDepositStatus(basicInfo?.merchantDepositStatus),
      settings: {
        profilePublic: true,
        marketingEmails: false,
        transactionNotifications: true,
      },
      operationLogs: operationLogs.map((item: any) => ({
        id: String(item.id ?? ''),
        createdAt: item.createdAt || '',
        bizModule: item.bizModule || '',
        actionType: item.actionType || '',
        summary: item.actionSummary || '',
        resultStatus: mapOperationResult(item.resultStatus),
      })),
    };

    setUserStatusCode(Number(basicInfo?.status ?? 0));
    setSavedProfile(profile);
    setDraftProfile(profile);
    if (!silent) {
      MessageUtils.success(t('personal.profile.msg.profileSynced'));
    }
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    const initProfile = async () => {
      try {
        setInitializing(true);
        await loadProfile(true);
      } catch {
        if (!cancelled) MessageUtils.error(t('personal.profile.msg.loadProfileFailed'));
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };
    initProfile();
    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

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
      MessageUtils.success(t('personal.profile.msg.walletCopied'));
    } catch {
      MessageUtils.error(t('personal.profile.msg.copyFailed'));
    }
  };

  const handleProfileChange = (nextProfile: ProfileData) => {
    setDraftProfile(nextProfile);
  };

  const handleSubmitProfileField = async (payload: {
    nickname?: string;
    gender?: ProfileData['gender'];
    birthday?: string;
  }): Promise<boolean> => {
    try {
      const apiPayload: Record<string, string | number> = {};
      if (payload.nickname !== undefined) {
        apiPayload.nickname = payload.nickname.trim();
      }
      if (payload.gender !== undefined) {
        const genderValue = mapGenderToApi(payload.gender);
        if (genderValue !== undefined) {
          apiPayload.gender = genderValue;
        }
      }
      if (payload.birthday !== undefined) {
        apiPayload.birthday = payload.birthday;
      }
      if (Object.keys(apiPayload).length === 0) {
        MessageUtils.warning(t('personal.profile.msg.noChanges'));
        return false;
      }

      await userApi.modifyUserInfo(apiPayload);
      await loadProfile(true);
      return true;
    } catch {
      MessageUtils.error(t('personal.profile.msg.modifyFailed'));
      return false;
    }
  };

  const handleKycCompleted = (payload: KycSubmitPayload) => {
    setKycModalOpen(false);
    MessageUtils.success(t('personal.profile.msg.kycSubmitted', { name: payload.basicInfo.realName }));
    loadProfile(true).catch(() => undefined);
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
        tokenAddress: intent.tokenAddress,
        depositStatus: intent.depositStatus,
        returnPath: '/admin?menu=profile',
      },
    };

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(messagePayload, '*');
      MessageUtils.info(t('personal.profile.msg.dappDepositNotified'));
      return;
    }

    const dappBaseUrl = window.location.origin.includes(':7101')
      ? window.location.origin.replace(':7101', ':7100')
      : 'http://localhost:7100';
    const depositUrl = `${dappBaseUrl}/exchange?tab=merchantDeposit&intentId=${encodeURIComponent(
      intent.intentId,
    )}&amount=${encodeURIComponent(intent.amount || '')}&token=${encodeURIComponent(
      intent.token || 'USDT',
    )}&chainId=${encodeURIComponent(String(intent.chainId || ''))}&contractAddress=${encodeURIComponent(
      intent.contractAddress || '',
    )}&tokenAddress=${encodeURIComponent(intent.tokenAddress || '')}&expireAt=${encodeURIComponent(
      intent.expireAt || '',
    )}&returnPath=${encodeURIComponent('/admin?menu=profile')}`;
    window.open(depositUrl, '_blank');
    MessageUtils.info(t('personal.profile.msg.depositPageOpened'));
  };

  const handleMerchantSubmitApplication = () => {
    setMerchantLoading(true);
    userApi
      .applyMerchantCert()
      .then(() => {
        MessageUtils.success(t('personal.profile.msg.merchantApplied'));
        return loadProfile(true);
      })
      .catch(() => {
        MessageUtils.error(t('personal.profile.msg.merchantApplyFailed'));
      })
      .finally(() => {
        setMerchantLoading(false);
      });
  };

  const handleLoadMerchantDepositLatest = async (showFailedMessage = true): Promise<boolean> => {
    setMerchantDetailLoading(true);
    try {
      const resp = await userApi.getUserDepositLatest();
      if (!resp?.exists || !resp?.deposit) {
        setMerchantIntent(null);
        if (showFailedMessage) {
          MessageUtils.warning(t('personal.profile.msg.noApplicationFound'));
        }
        return false;
      }
      setMerchantIntent(mapDepositToIntent(resp.deposit));
      return true;
    } catch {
      if (showFailedMessage) {
        MessageUtils.error(t('personal.profile.msg.queryApplicationFailed'));
      }
      return false;
    } finally {
      setMerchantDetailLoading(false);
    }
  };

  const handleOpenMerchantDetailModal = async (): Promise<boolean> => {
    return handleLoadMerchantDepositLatest(true);
  };

  const handleMerchantOpenDapp = () => {
    if (!merchantIntent) {
      MessageUtils.warning(t('personal.profile.msg.applicationMissing'));
      return;
    }
    openMerchantDepositPage(merchantIntent);
    loadProfile(true).catch(() => undefined);
  };

  const handleMerchantMarkPaid = () => {
    MessageUtils.info(t('personal.profile.msg.waitChainCallback'));
    loadProfile(true).catch(() => undefined);
  };

  return (
    <div className={styles.profileManager}>
      <h4 className={styles.sectionLabel}>{t('personal.profile.title')}</h4>
      <section className={styles.overviewCard}>
        <div className={styles.overviewMain}>
          <div className={styles.avatarBox}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.overviewMeta}>
            <div className={styles.overviewTopRow}>
              <h2 className={styles.overviewName}>
                {draftProfile.nickname?.trim() || formatWalletAddress(draftProfile.walletAddress)}
              </h2>
              <Tag className={styles.roleTag}>{draftProfile.userRole}</Tag>
              <span
                className={`${styles.userStatusPill} ${
                  userStatusCode === 1 ? styles.userStatusDisabled : styles.userStatusNormal
                }`}
              >
                <i className={`fas ${userStatusCode === 1 ? 'fa-ban' : 'fa-check-circle'}`}></i>
                {userStatusCode === 1
                  ? t('personal.profile.accountStatusDisabled')
                  : t('personal.profile.accountStatusNormal')}
              </span>
            </div>
            <div className={styles.walletLine}>
              <span className={styles.walletLabel}>{t('personal.profile.walletAddress')}</span>
              <Tooltip title={draftProfile.walletAddress}>
                <span className={styles.walletValue}>{formatWalletAddress(draftProfile.walletAddress)}</span>
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
              <span>{draftProfile.statusText || t('personal.profile.accountStatusNormalFull')}</span>
              <span>
                {t('personal.profile.userIdLabel')}：{draftProfile.userId || '--'}
              </span>
              <span className={styles.savedBadge}>{t('personal.profile.syncedBadge')}</span>
            </div>
          </div>
        </div>
      </section>

      <ProfileSectionList
        profile={draftProfile}
        initialProfile={savedProfile}
        onProfileChange={handleProfileChange}
        onSubmitProfileField={handleSubmitProfileField}
        onOpenKyc={() => setKycModalOpen(true)}
        onOpenMerchantApplyModal={() => setMerchantModalOpen(true)}
        onOpenMerchantDetailModal={handleOpenMerchantDetailModal}
        merchantIntent={merchantIntent}
        merchantLoading={merchantLoading}
        merchantDetailLoading={merchantDetailLoading}
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
