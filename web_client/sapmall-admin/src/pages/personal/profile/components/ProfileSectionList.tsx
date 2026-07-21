import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { DatePicker, Form, Input, Modal, Radio, Spin } from 'antd';
import MessageUtils from '../../../../utils/messageUtils';
import type {
  KycStatus,
  MerchantDepositIntent,
  MerchantDepositStatus,
  ProfileData,
  ProfileGender,
  ProfileOperationLogItem,
} from '../types';
import AdminButton from '../../../../components/common/AdminButton';
import styles from '../ProfileManager.module.scss';

const OPERATION_LOG_PAGE_SIZE = 5;

interface ProfileSectionListProps {
  profile: ProfileData;
  initialProfile: ProfileData;
  onProfileChange: (nextProfile: ProfileData) => void;
  onSubmitProfileField: (payload: {
    nickname?: string;
    gender?: ProfileGender;
    birthday?: string;
  }) => Promise<boolean>;
  onOpenKyc: () => void;
  onOpenMerchantApplyModal: () => void;
  onOpenMerchantDetailModal: () => Promise<boolean>;
  merchantIntent: MerchantDepositIntent | null;
  merchantLoading: boolean;
  merchantDetailLoading: boolean;
  onMerchantOpenDapp: () => void;
  onMerchantMarkPaid: () => void;
}

interface FormLabelProps {
  title: string;
  description: string;
  statusNode?: React.ReactNode;
}

const FormLabel: React.FC<FormLabelProps> = ({ title, description, statusNode }) => (
  <div className={styles.formLabel}>
    <div className={styles.formLabelTitleRow}>
      <span className={styles.formLabelTitle}>{title}</span>
      {statusNode}
    </div>
    <span className={styles.formLabelDesc}>{description}</span>
  </div>
);

const SectionForm: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Form
    layout="horizontal"
    colon={false}
    labelAlign="left"
    className={styles.sectionForm}
    labelCol={{ flex: '260px' }}
    wrapperCol={{ flex: '460px' }}
  >
    {children}
  </Form>
);

const SectionFormItem: React.FC<{
  title: string;
  description: string;
  statusNode?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, statusNode, children }) => (
  <Form.Item
    className={styles.sectionFormItem}
    label={<FormLabel title={title} description={description} statusNode={statusNode} />}
  >
    <div className={styles.sectionField}>{children}</div>
  </Form.Item>
);

const SECTION_ICON_COLORS: Record<string, string> = {
  'fa-shield-alt': styles.cardIconShield,
  'fa-user-circle': styles.cardIconUser,
  'fa-address-book': styles.cardIconContact,
  'fa-history': styles.cardIconHistory,
};

const SectionCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, children }) => {
  const iconColorClass = SECTION_ICON_COLORS[icon] || '';
  return (
    <section className={styles.infoCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitle}>
            <i className={`fas ${icon} ${iconColorClass}`}></i>
            <span>{title}</span>
          </div>
          <div className={styles.cardSubtitle}>{subtitle}</div>
        </div>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
};

const getGenderText = (gender: ProfileGender, t: TFunction): string => {
  if (gender === 'male') return t('personal.profile.gender.male');
  if (gender === 'female') return t('personal.profile.gender.female');
  return t('personal.profile.gender.unknown');
};

const formatWalletAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getKycText = (status: KycStatus, t: TFunction): string => {
  if (status === 'verified') return t('personal.profile.kyc.verified');
  if (status === 'pending') return t('personal.profile.kyc.pending');
  return t('personal.profile.kyc.notVerified');
};

const getMerchantStatusMeta = (
  status: MerchantDepositStatus,
  t: TFunction,
): {
  text: string;
  className: string;
  icon: string;
  actionText: string;
} => {
  if (status === 'pending_payment') {
    return {
      text: t('personal.profile.merchant.status.pendingPayment'),
      className: styles.authStatusPending,
      icon: 'fas fa-wallet',
      actionText: t('personal.profile.merchant.action.payDeposit'),
    };
  }
  if (status === 'confirming') {
    return {
      text: t('personal.profile.merchant.status.confirming'),
      className: styles.authStatusPending,
      icon: 'fas fa-clock',
      actionText: t('personal.profile.merchant.action.viewPayProgress'),
    };
  }
  if (status === 'paid') {
    return {
      text: t('personal.profile.merchant.status.paid'),
      className: styles.authStatusSuccess,
      icon: 'fas fa-check-circle',
      actionText: t('personal.profile.merchant.action.viewStatus'),
    };
  }
  return {
    text: t('personal.profile.merchant.status.notApplied'),
    className: styles.authStatusDanger,
    icon: 'fas fa-store-slash',
    actionText: t('personal.profile.merchant.action.apply'),
  };
};

const getIntentStatusMeta = (
  depositStatus: number | undefined,
  t: TFunction,
): {
  title: string;
  description: string;
  icon: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
} => {
  if (depositStatus === 1) {
    return {
      title: t('personal.profile.merchant.intent.pendingPaymentTitle'),
      description: t('personal.profile.merchant.intent.pendingPaymentDesc'),
      icon: 'fas fa-wallet',
      tone: 'warning',
    };
  }
  if (depositStatus === 2) {
    return {
      title: t('personal.profile.merchant.intent.confirmingTitle'),
      description: t('personal.profile.merchant.intent.confirmingDesc'),
      icon: 'fas fa-spinner',
      tone: 'info',
    };
  }
  if (depositStatus === 3) {
    return {
      title: t('personal.profile.merchant.intent.completedTitle'),
      description: t('personal.profile.merchant.intent.completedDesc'),
      icon: 'fas fa-check-circle',
      tone: 'success',
    };
  }
  if (depositStatus === 4) {
    return {
      title: t('personal.profile.merchant.intent.refundedTitle'),
      description: t('personal.profile.merchant.intent.refundedDesc'),
      icon: 'fas fa-rotate-left',
      tone: 'info',
    };
  }
  if (depositStatus === 5) {
    return {
      title: t('personal.profile.merchant.intent.failedTitle'),
      description: t('personal.profile.merchant.intent.failedDesc'),
      icon: 'fas fa-circle-xmark',
      tone: 'danger',
    };
  }
  if (depositStatus === 6) {
    return {
      title: t('personal.profile.merchant.intent.expiredTitle'),
      description: t('personal.profile.merchant.intent.expiredDesc'),
      icon: 'fas fa-hourglass-end',
      tone: 'danger',
    };
  }
  return {
    title: t('personal.profile.merchant.intent.processingTitle'),
    description: t('personal.profile.merchant.intent.processingDesc'),
    icon: 'fas fa-file-lines',
    tone: 'info',
  };
};

const getOperationBizLabel = (module: string, t: TFunction): string => {
  const key = `personal.profile.logs.biz.${module}`;
  const translated = t(key, { defaultValue: '' });
  if (translated && translated !== key) {
    return translated;
  }
  return module || t('personal.profile.logs.biz.other');
};

const getOperationResultMeta = (
  status: ProfileOperationLogItem['resultStatus'],
  t: TFunction,
): { className: string; text: string } => {
  if (status === 'failed') {
    return { className: styles.operationLogResultFail, text: t('personal.profile.logs.result.failed') };
  }
  if (status === 'partial') {
    return { className: styles.operationLogResultPartial, text: t('personal.profile.logs.result.partial') };
  }
  return { className: styles.operationLogResultOk, text: t('personal.profile.logs.result.success') };
};

const ProfileSectionList: React.FC<ProfileSectionListProps> = ({
  profile,
  initialProfile,
  onProfileChange,
  onSubmitProfileField,
  onOpenKyc,
  onOpenMerchantApplyModal,
  onOpenMerchantDetailModal,
  merchantIntent,
  merchantLoading,
  merchantDetailLoading,
  onMerchantOpenDapp,
  onMerchantMarkPaid,
}) => {
  const { t } = useTranslation();
  const [showKycDetail, setShowKycDetail] = React.useState(false);
  const [showMerchantDetailModal, setShowMerchantDetailModal] = React.useState(false);
  const [operationLogVisibleCount, setOperationLogVisibleCount] = React.useState(OPERATION_LOG_PAGE_SIZE);
  const [lastSubmittedNickname, setLastSubmittedNickname] = React.useState(
    (initialProfile.nickname || '').trim(),
  );
  const [lastSubmittedBirthday, setLastSubmittedBirthday] = React.useState(initialProfile.birthday || '');
  const [submittingNickname, setSubmittingNickname] = React.useState(false);
  const [submittingBirthday, setSubmittingBirthday] = React.useState(false);
  const [submittingGender, setSubmittingGender] = React.useState(false);

  React.useEffect(() => {
    setOperationLogVisibleCount(OPERATION_LOG_PAGE_SIZE);
  }, [profile.operationLogs]);

  React.useEffect(() => {
    setLastSubmittedNickname((initialProfile.nickname || '').trim());
  }, [initialProfile.nickname]);

  React.useEffect(() => {
    setLastSubmittedBirthday(initialProfile.birthday || '');
  }, [initialProfile.birthday]);

  const operationLogsVisible = profile.operationLogs.slice(0, operationLogVisibleCount);
  const operationLogHasMore = profile.operationLogs.length > operationLogVisibleCount;

  const handleOperationLogLoadMore = () => {
    setOperationLogVisibleCount((n) =>
      Math.min(n + OPERATION_LOG_PAGE_SIZE, profile.operationLogs.length),
    );
  };

  const updateProfileField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  const handleSubmitField = (fieldLabel: string) => {
    MessageUtils.success(t('personal.profile.msg.fieldUpdateSuccess', { field: fieldLabel }));
  };

  const handleSubmitNickname = async () => {
    const trimmedNickname = profile.nickname.trim();
    if (!trimmedNickname) {
      MessageUtils.warning(t('personal.profile.msg.nicknameEmpty'));
      return;
    }
    setSubmittingNickname(true);
    const success = await onSubmitProfileField({ nickname: trimmedNickname });
    setSubmittingNickname(false);
    if (success) {
      setLastSubmittedNickname(trimmedNickname);
      handleSubmitField(t('personal.profile.forms.nickname.title'));
    }
  };

  const handleGenderChange = async (nextGender: ProfileGender) => {
    const previousGender = profile.gender;
    if (nextGender === previousGender || submittingGender) {
      return;
    }
    updateProfileField('gender', nextGender);
    setSubmittingGender(true);
    const success = await onSubmitProfileField({ gender: nextGender });
    setSubmittingGender(false);
    if (success) {
      MessageUtils.success(
        t('personal.profile.msg.genderUpdated', { gender: getGenderText(nextGender, t) }),
      );
      return;
    }
    updateProfileField('gender', previousGender);
  };

  const handleSubmitBirthday = async () => {
    if (!profile.birthday) {
      MessageUtils.warning(t('personal.profile.msg.selectBirthdayFirst'));
      return;
    }
    setSubmittingBirthday(true);
    const success = await onSubmitProfileField({ birthday: profile.birthday });
    setSubmittingBirthday(false);
    if (success) {
      setLastSubmittedBirthday(profile.birthday);
      handleSubmitField(t('personal.profile.forms.birthday.title'));
    }
  };

  const isKycVerified = profile.kycStatus === 'verified';
  const kycStatusClass =
    profile.kycStatus === 'verified'
      ? styles.authStatusSuccess
      : profile.kycStatus === 'pending'
      ? styles.authStatusPending
      : styles.authStatusDanger;
  const securityEnabled = profile.emailVerified && profile.phoneVerified;
  const securityStatusClass = securityEnabled ? styles.authStatusSuccess : styles.authStatusDanger;
  const securityStatusText = securityEnabled
    ? t('personal.profile.forms.securityEnabled')
    : t('personal.profile.forms.securityDisabled');
  const merchantMeta = getMerchantStatusMeta(profile.merchantDepositStatus, t);
  const isMerchantNotApplied = profile.merchantDepositStatus === 'not_applied';
  const merchantActionText = isMerchantNotApplied
    ? t('personal.profile.sections.auth.applyMerchant')
    : t('personal.profile.sections.auth.viewApplication');
  const intentStatusMeta = getIntentStatusMeta(merchantIntent?.depositStatus, t);
  const intentTimelineSteps = [
    {
      key: 'apply',
      title: t('personal.profile.merchant.timeline.apply'),
      time: merchantIntent?.createdAt || '--',
      state: merchantIntent ? 'done' : 'pending',
    },
    {
      key: 'pay',
      title: t('personal.profile.merchant.timeline.pay'),
      time: merchantIntent?.paidAt || '--',
      state: merchantIntent?.depositStatus && merchantIntent.depositStatus >= 2 ? 'done' : 'active',
    },
    {
      key: 'confirm',
      title: t('personal.profile.merchant.timeline.confirm'),
      time: merchantIntent?.confirmedAt || '--',
      state: merchantIntent?.depositStatus === 3 ? 'done' : 'pending',
    },
  ] as const;
  const nicknameChanged = profile.nickname.trim() !== (initialProfile.nickname || '').trim();
  const nicknameSubmitted = profile.nickname.trim() === lastSubmittedNickname;
  const showNicknameSubmit = nicknameChanged && profile.nickname.trim().length > 0;
  const birthdayChanged = (profile.birthday || '') !== (initialProfile.birthday || '');
  const birthdaySubmitted = (profile.birthday || '') === lastSubmittedBirthday;
  const showBirthdaySubmit = birthdayChanged && Boolean(profile.birthday) && !birthdaySubmitted;

  return (
    <div className={styles.sectionList}>
      <SectionCard
        icon="fa-shield-alt"
        title={t('personal.profile.sections.auth.title')}
        subtitle={t('personal.profile.sections.auth.subtitle')}
      >
        <SectionForm>
          <SectionFormItem
            title={t('personal.profile.sections.auth.kycTitle')}
            description={t('personal.profile.sections.auth.kycDesc')}
            statusNode={
              <span className={`${styles.labelStatusPill} ${kycStatusClass}`}>
                {getKycText(profile.kycStatus, t)}
              </span>
            }
          >
            <div className={styles.authControlWrap}>
              {profile.kycStatus === 'not_verified' ? (
                <AdminButton
                  variant="submit"
                  size="xs"
                  icon="fas fa-shield-alt"
                  className={styles.authActionUnifiedBtn}
                  onClick={onOpenKyc}
                >
                  {t('personal.profile.sections.auth.goVerify')}
                </AdminButton>
              ) : profile.kycStatus === 'pending' ? (
                <AdminButton
                  variant="submit"
                  size="xs"
                  icon="fas fa-hourglass-half"
                  className={styles.authActionUnifiedBtn}
                  onClick={onOpenKyc}
                >
                  {t('personal.profile.sections.auth.viewProgress')}
                </AdminButton>
              ) : (
                <AdminButton
                  variant="view"
                  size="xs"
                  icon="fas fa-id-card"
                  className={styles.authActionUnifiedBtn}
                  onClick={() => setShowKycDetail((prev) => !prev)}
                >
                  {showKycDetail
                    ? t('personal.profile.sections.auth.collapseDetail')
                    : t('personal.profile.sections.auth.viewDetail')}
                </AdminButton>
              )}
            </div>
          </SectionFormItem>

          {isKycVerified && showKycDetail && (
            <div className={styles.kycDetailPanel}>
              <div className={styles.kycDetailRow}>
                <span>{t('personal.profile.sections.auth.verifiedName')}</span>
                <span>{profile.nickname || profile.username}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>{t('personal.profile.sections.auth.verifiedPhone')}</span>
                <span>{profile.phone}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>{t('personal.profile.sections.auth.verifiedEmail')}</span>
                <span>{profile.email}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>{t('personal.profile.sections.auth.verifiedStatus')}</span>
                <span>{getKycText(profile.kycStatus, t)}</span>
              </div>
            </div>
          )}

          <SectionFormItem
            title={t('personal.profile.sections.auth.securityTitle')}
            description={t('personal.profile.sections.auth.securityDesc')}
            statusNode={
              <span className={`${styles.labelStatusPill} ${securityStatusClass}`}>
                {securityStatusText}
              </span>
            }
          >
            <div className={styles.authControlWrap}>
              <AdminButton
                variant="submit"
                size="xs"
                icon="fas fa-eye"
                className={styles.authActionUnifiedBtn}
              >
                {t('personal.profile.sections.auth.securityViewDetail')}
              </AdminButton>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.sections.auth.merchantTitle')}
            description={t('personal.profile.sections.auth.merchantDesc')}
            statusNode={
              <span className={`${styles.labelStatusPill} ${merchantMeta.className}`}>
                {merchantMeta.text}
              </span>
            }
          >
            <div className={styles.authControlWrap}>
              <AdminButton
                variant={profile.merchantDepositStatus === 'paid' ? 'view' : 'submit'}
                size="xs"
                icon={isMerchantNotApplied ? 'fas fa-file-signature' : 'fas fa-file-lines'}
                className={styles.authActionUnifiedBtn}
                onClick={async () => {
                  if (isMerchantNotApplied) {
                    onOpenMerchantApplyModal();
                    return;
                  }
                  const loaded = await onOpenMerchantDetailModal();
                  if (loaded) {
                    setShowMerchantDetailModal(true);
                  }
                }}
              >
                {merchantActionText}
              </AdminButton>
            </div>
          </SectionFormItem>
        </SectionForm>
      </SectionCard>
      <SectionCard
        icon="fa-user-circle"
        title={t('personal.profile.sections.basic.title')}
        subtitle={t('personal.profile.sections.basic.subtitle')}
      >
        <SectionForm>
          <SectionFormItem
            title={t('personal.profile.forms.userId.title')}
            description={t('personal.profile.forms.userId.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Input className={styles.inlineField} value={profile.userId} disabled bordered={false} />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title={t('personal.profile.forms.readonlyHint')}>
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.username.title')}
            description={t('personal.profile.forms.username.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={formatWalletAddress(profile.walletAddress || profile.username)}
                disabled
                bordered={false}
                placeholder={t('personal.profile.walletAddress')}
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title={t('personal.profile.forms.readonlyHint')}>
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.registerTime.title')}
            description={t('personal.profile.forms.registerTime.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.registerTime}
                disabled
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title={t('personal.profile.forms.readonlyHint')}>
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.nickname.title')}
            description={t('personal.profile.forms.nickname.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.nickname}
                onChange={(event) => updateProfileField('nickname', event.target.value)}
                placeholder={t('personal.profile.forms.nickname.placeholder')}
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                {showNicknameSubmit && !nicknameSubmitted ? (
                  <button
                    type="button"
                    className={styles.fieldSubmitIconBtn}
                    title={t('personal.profile.forms.nickname.submitTitle')}
                    aria-label={t('personal.profile.forms.nickname.submitAria')}
                    disabled={submittingNickname}
                    onClick={handleSubmitNickname}
                  >
                    <i className={`fas ${submittingNickname ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  </button>
                ) : null}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.gender.title')}
            description={t('personal.profile.forms.gender.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Radio.Group
                className={styles.genderRadioGroup}
                value={profile.gender === 'unknown' ? undefined : profile.gender}
                disabled={submittingGender}
                onChange={(event) => handleGenderChange(event.target.value as ProfileGender)}
              >
                <Radio value="male">{getGenderText('male', t)}</Radio>
                <Radio value="female">{getGenderText('female', t)}</Radio>
              </Radio.Group>
              <span className={styles.fieldActionSlot}></span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.birthday.title')}
            description={t('personal.profile.forms.birthday.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <DatePicker
                className={styles.inlineField}
                value={profile.birthday ? dayjs(profile.birthday, 'YYYY-MM-DD') : null}
                onChange={(value) =>
                  updateProfileField('birthday', value ? value.format('YYYY-MM-DD') : '')
                }
                format="YYYY-MM-DD"
                placeholder={t('personal.profile.forms.birthday.placeholder')}
                allowClear
                bordered={false}
                inputReadOnly
              />
              <span className={styles.fieldActionSlot}>
                {showBirthdaySubmit ? (
                  <button
                    type="button"
                    className={styles.fieldSubmitIconBtn}
                    title={t('personal.profile.forms.birthday.submitTitle')}
                    aria-label={t('personal.profile.forms.birthday.submitAria')}
                    disabled={submittingBirthday}
                    onClick={handleSubmitBirthday}
                  >
                    <i className={`fas ${submittingBirthday ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  </button>
                ) : null}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.registerTime.title')}
            description={t('personal.profile.forms.registerTime.description')}
          >
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.registerTime}
                disabled
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title={t('personal.profile.forms.readonlyHint')}>
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>
        </SectionForm>
      </SectionCard>

      <SectionCard
        icon="fa-address-book"
        title={t('personal.profile.sections.contact.title')}
        subtitle={t('personal.profile.sections.contact.subtitle')}
      >
        <SectionForm>
          <SectionFormItem
            title={t('personal.profile.forms.email.title')}
            description={t('personal.profile.forms.email.description')}
          >
            <div className={styles.fieldWithMeta}>
              <Input
                className={styles.inlineField}
                value={profile.email}
                onChange={(event) => updateProfileField('email', event.target.value)}
                placeholder={t('personal.profile.forms.email.placeholder')}
                bordered={false}
              />
              <span className={`${styles.verifyTag} ${profile.emailVerified ? styles.verifyOk : styles.verifyWarn}`}>
                <i className={`fas ${profile.emailVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {profile.emailVerified
                  ? t('personal.profile.forms.email.verified')
                  : t('personal.profile.forms.email.unverified')}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title={t('personal.profile.forms.phone.title')}
            description={t('personal.profile.forms.phone.description')}
          >
            <div className={styles.fieldWithMeta}>
              <Input
                className={styles.inlineField}
                value={profile.phone}
                onChange={(event) => updateProfileField('phone', event.target.value)}
                placeholder={t('personal.profile.forms.phone.placeholder')}
                bordered={false}
              />
              <span className={`${styles.verifyTag} ${profile.phoneVerified ? styles.verifyOk : styles.verifyWarn}`}>
                <i className={`fas ${profile.phoneVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {profile.phoneVerified
                  ? t('personal.profile.forms.phone.verified')
                  : t('personal.profile.forms.phone.unverified')}
              </span>
            </div>
          </SectionFormItem>
        </SectionForm>
      </SectionCard>

      <SectionCard
        icon="fa-history"
        title={t('personal.profile.sections.logs.title')}
        subtitle={t('personal.profile.sections.logs.subtitle')}
      >
        <div className={styles.operationLogPanel}>
          {profile.operationLogs.length === 0 ? (
            <div className={styles.operationLogEmpty}>{t('personal.profile.sections.logs.empty')}</div>
          ) : (
            <>
              <ul className={styles.operationLogList}>
                {operationLogsVisible.map((item) => {
                  const resultMeta = getOperationResultMeta(item.resultStatus, t);
                  return (
                    <li key={item.id} className={styles.operationLogItem}>
                      <div className={styles.operationLogIcon}>
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className={styles.operationLogBody}>
                        <div className={styles.operationLogTitleRow}>
                          <span className={styles.operationLogSummary}>{item.summary}</span>
                          <span className={`${styles.operationLogResult} ${resultMeta.className}`}>
                            {resultMeta.text}
                          </span>
                        </div>
                        <div className={styles.operationLogMeta}>
                          <span className={styles.operationLogTime}>{item.createdAt}</span>
                          <span className={styles.operationLogDot}>·</span>
                          <span className={styles.operationLogModule}>
                            {getOperationBizLabel(item.bizModule, t)}
                          </span>
                          <span className={styles.operationLogDot}>·</span>
                          <span className={styles.operationLogAction}>{item.actionType}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {operationLogHasMore && (
                <div className={styles.operationLogLoadMoreWrap}>
                  <button
                    type="button"
                    className={styles.operationLogLoadMoreBtn}
                    onClick={handleOperationLogLoadMore}
                  >
                    <i className="fas fa-chevron-down"></i>
                    {t('personal.profile.sections.logs.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </SectionCard>

      <Modal
        title={t('personal.profile.merchant.detailModalTitle')}
        open={showMerchantDetailModal}
        onCancel={() => setShowMerchantDetailModal(false)}
        footer={null}
        width={760}
        destroyOnClose
      >
        <div className={styles.merchantDetailPanel}>
          {merchantDetailLoading && (
            <div className={styles.merchantDetailLoadingWrap}>
              <Spin size="large" />
              <span>{t('personal.profile.merchant.loadingDetail')}</span>
            </div>
          )}

          {!merchantDetailLoading && merchantIntent && (
            <>
              <div className={`${styles.merchantStatusHero} ${styles[`merchantStatusHero${intentStatusMeta.tone}`]}`}>
                <div className={styles.merchantStatusHeroMain}>
                  <span className={styles.merchantStatusHeroIcon}>
                    <i className={intentStatusMeta.icon}></i>
                  </span>
                  <div>
                    <div className={styles.merchantStatusHeroTitle}>{intentStatusMeta.title}</div>
                    <div className={styles.merchantStatusHeroDesc}>{intentStatusMeta.description}</div>
                  </div>
                </div>
                <span className={styles.merchantStatusChip}>
                  {merchantIntent.depositStatusDesc ||
                    t('personal.profile.merchant.intent.statusCodeFallback', {
                      code: merchantIntent.depositStatus,
                    })}
                </span>
              </div>

              <div className={styles.merchantTimeline}>
                {intentTimelineSteps.map((step) => (
                  <div key={step.key} className={styles.merchantTimelineItem}>
                    <span
                      className={`${styles.merchantTimelineDot} ${
                        step.state === 'done'
                          ? styles.merchantTimelineDotDone
                          : step.state === 'active'
                          ? styles.merchantTimelineDotActive
                          : styles.merchantTimelineDotPending
                      }`}
                    />
                    <div className={styles.merchantTimelineContent}>
                      <div className={styles.merchantTimelineTitle}>{step.title}</div>
                      <div className={styles.merchantTimelineTime}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.merchantInfoGrid}>
                <div className={styles.merchantIntentPanel}>
                  <div className={styles.merchantPanelTitle}>
                    {t('personal.profile.merchant.panelApplication')}
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.intentId')}</span>
                    <span>{merchantIntent.intentId || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.depositAmount')}</span>
                    <span>
                      {merchantIntent.amount || '--'} {merchantIntent.token || ''}
                    </span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.expireAt')}</span>
                    <span>{merchantIntent.expireAt || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.createdAt')}</span>
                    <span>{merchantIntent.createdAt || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.updatedAt')}</span>
                    <span>{merchantIntent.updatedAt || '--'}</span>
                  </div>
                </div>

                <div className={styles.merchantIntentPanel}>
                  <div className={styles.merchantPanelTitle}>{t('personal.profile.merchant.panelChain')}</div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.chainId')}</span>
                    <span>{merchantIntent.chainId || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.contractAddress')}</span>
                    <span>{merchantIntent.contractAddress || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.tokenAddress')}</span>
                    <span>{merchantIntent.tokenAddress || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.txHash')}</span>
                    <span>{merchantIntent.txHash || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>{t('personal.profile.merchant.confirmations')}</span>
                    <span>{merchantIntent.confirmations ?? '--'}</span>
                  </div>
                </div>
              </div>

              {(merchantIntent.failReason || merchantIntent.refundTxHash) && (
                <div className={styles.merchantHintBlock}>
                  {merchantIntent.failReason ? (
                    <p>{t('personal.profile.merchant.failReason', { reason: merchantIntent.failReason })}</p>
                  ) : null}
                  {merchantIntent.refundTxHash ? (
                    <p>{t('personal.profile.merchant.refundHash', { hash: merchantIntent.refundTxHash })}</p>
                  ) : null}
                </div>
              )}
            </>
          )}

          {!merchantDetailLoading && !merchantIntent && (
            <div className={styles.merchantHintBlock}>
              <p>{t('personal.profile.merchant.noDetail')}</p>
            </div>
          )}

          {!merchantDetailLoading && merchantIntent && profile.merchantDepositStatus === 'pending_payment' && (
            <div className={styles.merchantActionGroup}>
              <AdminButton
                variant="submit"
                size="xs"
                icon="fas fa-wallet"
                loading={merchantLoading}
                onClick={onMerchantOpenDapp}
              >
                {t('personal.profile.merchant.goDappPay')}
              </AdminButton>
            </div>
          )}

          {!merchantDetailLoading && merchantIntent && profile.merchantDepositStatus === 'confirming' && (
            <div className={styles.merchantActionGroup}>
              <AdminButton
                variant="confirm"
                size="xs"
                icon="fas fa-check-circle"
                loading={merchantLoading}
                onClick={onMerchantMarkPaid}
              >
                {t('personal.profile.merchant.markPaid')}
              </AdminButton>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSectionList;
