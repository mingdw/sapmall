import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Tag, Tooltip } from 'antd';
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

const ProfileManager: React.FC = () => {
  const [savedProfile, setSavedProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [initializing, setInitializing] = useState(true);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [merchantLoading, setMerchantLoading] = useState(false);
  const [merchantIntent, setMerchantIntent] = useState<MerchantDepositIntent | null>(null);
  const [userStatusCode, setUserStatusCode] = useState<number>(0);

  const loadProfile = useCallback(async (silent = false) => {
    const currentUser = useUserStore.getState().getCurrentUser();
    const userId = currentUser?.userId;
    if (!userId) {
      throw new Error('未获取到用户ID，请先登录');
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
      userRole: roles[0]?.roleName || '普通用户',
      statusText: basicInfo?.status === 1 ? '账户已禁用' : '账户状态正常',
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
      MessageUtils.success('用户信息已同步');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const initProfile = async () => {
      try {
        setInitializing(true);
        await loadProfile(true);
      } catch {
        if (!cancelled) MessageUtils.error('加载用户信息失败');
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
      MessageUtils.success('钱包地址复制成功');
    } catch {
      MessageUtils.error('复制失败，请手动复制');
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
        MessageUtils.warning('没有可提交的修改内容');
        return false;
      }

      await userApi.modifyUserInfo(apiPayload);
      await loadProfile(true);
      return true;
    } catch {
      MessageUtils.error('修改失败，请稍后重试');
      return false;
    }
  };

  const handleKycCompleted = (payload: KycSubmitPayload) => {
    setKycModalOpen(false);
    MessageUtils.success(`KYC申请已提交：${payload.basicInfo.realName}`);
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
    userApi
      .applyMerchantCert()
      .then((resp) => {
        if (resp?.intent) {
          setMerchantIntent(resp.intent as MerchantDepositIntent);
        }
        MessageUtils.success('商家申请已提交，请前往DApp缴纳保证金');
        return loadProfile(true);
      })
      .catch(() => {
        MessageUtils.error('提交商家申请失败');
      })
      .finally(() => {
        setMerchantLoading(false);
      });
  };

  const handleMerchantOpenDapp = () => {
    if (!merchantIntent) {
      MessageUtils.warning('保证金意图单不存在，请重新提交申请');
      return;
    }
    openMerchantDepositPage(merchantIntent);
    loadProfile(true).catch(() => undefined);
  };

  const handleMerchantMarkPaid = () => {
    MessageUtils.info('请等待链上回调，页面将以后端状态为准');
    loadProfile(true).catch(() => undefined);
  };

  return (
    <div className={styles.profileManager}>
      {initializing && <Alert className={styles.unsavedAlert} type="info" showIcon message="正在加载用户信息..." />}

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
                {userStatusCode === 1 ? '禁用' : '正常'}
              </span>
            </div>
            <div className={styles.walletLine}>
              <span className={styles.walletLabel}>钱包地址</span>
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
              <span>{draftProfile.statusText || '账户状态正常'}</span>
              <span>用户编号：{draftProfile.userId || '--'}</span>
              <span className={styles.savedBadge}>已同步最新数据</span>
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
