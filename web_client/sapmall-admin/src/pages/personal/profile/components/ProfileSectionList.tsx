import React from 'react';
import dayjs from 'dayjs';
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

const SectionCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, children }) => (
  <section className={styles.infoCard}>
    <div className={styles.cardHeader}>
      <div className={styles.cardTitleRow}>
        <div className={styles.cardTitle}>
          <i className={`fas ${icon}`}></i>
          <span>{title}</span>
        </div>
        <div className={styles.cardSubtitle}>{subtitle}</div>
      </div>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </section>
);

const getGenderText = (gender: ProfileGender): string => {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未设置';
};

const formatWalletAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getKycText = (status: KycStatus): string => {
  if (status === 'verified') return '已认证';
  if (status === 'pending') return '审核中';
  return '未认证';
};

const getMerchantStatusMeta = (
  status: MerchantDepositStatus,
): {
  text: string;
  className: string;
  icon: string;
  actionText: string;
} => {
  if (status === 'pending_payment') {
    return {
      text: '待缴纳保证金',
      className: styles.authStatusPending,
      icon: 'fas fa-wallet',
      actionText: '去缴纳保证金',
    };
  }
  if (status === 'confirming') {
    return {
      text: '链上确认中',
      className: styles.authStatusPending,
      icon: 'fas fa-clock',
      actionText: '查看支付进度',
    };
  }
  if (status === 'paid') {
    return {
      text: '已开通',
      className: styles.authStatusSuccess,
      icon: 'fas fa-check-circle',
      actionText: '查看状态',
    };
  }
  return {
    text: '未申请',
    className: styles.authStatusDanger,
    icon: 'fas fa-store-slash',
    actionText: '去申请',
  };
};

const getMerchantStatusText = (status: MerchantDepositStatus): string => {
  if (status === 'pending_payment') return '待缴纳保证金';
  if (status === 'confirming') return '链上确认中';
  if (status === 'paid') return '已认证';
  return '未认证';
};

const getIntentStatusMeta = (
  depositStatus?: number,
): {
  title: string;
  description: string;
  icon: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
} => {
  if (depositStatus === 1) {
    return {
      title: '待支付保证金',
      description: '请在有效期内前往 DApp 完成保证金支付，超时后申请单将失效。',
      icon: 'fas fa-wallet',
      tone: 'warning',
    };
  }
  if (depositStatus === 2) {
    return {
      title: '链上确认中',
      description: '系统正在等待区块确认，确认完成后将自动更新商家认证状态。',
      icon: 'fas fa-spinner',
      tone: 'info',
    };
  }
  if (depositStatus === 3) {
    return {
      title: '申请完成',
      description: '保证金已确认到账，当前账户已具备商家认证资格。',
      icon: 'fas fa-check-circle',
      tone: 'success',
    };
  }
  if (depositStatus === 4) {
    return {
      title: '保证金已退还',
      description: '当前申请单已完成退款流程，请关注退还交易哈希。',
      icon: 'fas fa-rotate-left',
      tone: 'info',
    };
  }
  if (depositStatus === 5) {
    return {
      title: '申请失败',
      description: '申请流程执行失败，请查看失败原因并重新发起申请。',
      icon: 'fas fa-circle-xmark',
      tone: 'danger',
    };
  }
  if (depositStatus === 6) {
    return {
      title: '申请已过期',
      description: '申请单已过有效期，请重新发起申请并及时完成支付。',
      icon: 'fas fa-hourglass-end',
      tone: 'danger',
    };
  }
  return {
    title: '申请处理中',
    description: '系统正在处理申请单信息，请稍后刷新查看最新状态。',
    icon: 'fas fa-file-lines',
    tone: 'info',
  };
};

const getOperationBizLabel = (module: string): string => {
  const map: Record<string, string> = {
    profile: '资料',
    security: '安全',
    kyc: '认证',
    merchant: '商家',
    deposit: '保证金',
    auth: '登录',
  };
  return map[module] || module || '其他';
};

const getOperationResultMeta = (
  status: ProfileOperationLogItem['resultStatus'],
): { className: string; text: string } => {
  if (status === 'failed') {
    return { className: styles.operationLogResultFail, text: '失败' };
  }
  if (status === 'partial') {
    return { className: styles.operationLogResultPartial, text: '部分' };
  }
  return { className: styles.operationLogResultOk, text: '成功' };
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
    MessageUtils.success(`${fieldLabel}修改成功`);
  };

  const handleSubmitNickname = async () => {
    const trimmedNickname = profile.nickname.trim();
    if (!trimmedNickname) {
      MessageUtils.warning('昵称不能为空');
      return;
    }
    setSubmittingNickname(true);
    const success = await onSubmitProfileField({ nickname: trimmedNickname });
    setSubmittingNickname(false);
    if (success) {
      setLastSubmittedNickname(trimmedNickname);
      handleSubmitField('昵称');
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
      MessageUtils.success(`性别已更新为${getGenderText(nextGender)}`);
      return;
    }
    updateProfileField('gender', previousGender);
  };

  const handleSubmitBirthday = async () => {
    if (!profile.birthday) {
      MessageUtils.warning('请先选择生日');
      return;
    }
    setSubmittingBirthday(true);
    const success = await onSubmitProfileField({ birthday: profile.birthday });
    setSubmittingBirthday(false);
    if (success) {
      setLastSubmittedBirthday(profile.birthday);
      handleSubmitField('生日');
    }
  };

  const isKycVerified = profile.kycStatus === 'verified';
  const kycStatusClass =
    profile.kycStatus === 'verified'
      ? styles.authStatusSuccess
      : profile.kycStatus === 'pending'
      ? styles.authStatusPending
      : styles.authStatusDanger;
  const kycStatusIcon =
    profile.kycStatus === 'verified'
      ? 'fas fa-check-circle'
      : profile.kycStatus === 'pending'
      ? 'fas fa-clock'
      : 'fas fa-times-circle';

  const securityEnabled = profile.emailVerified && profile.phoneVerified;
  const securityStatusClass = securityEnabled ? styles.authStatusSuccess : styles.authStatusDanger;
  const securityStatusText = securityEnabled ? '已启用保护' : '未启用保护';
  const securityStatusIcon = securityEnabled ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';

  const merchantMeta = getMerchantStatusMeta(profile.merchantDepositStatus);
  const isMerchantNotApplied = profile.merchantDepositStatus === 'not_applied';
  const merchantActionText = isMerchantNotApplied ? '申请成为商家' : '查看申请单';
  const intentStatusMeta = getIntentStatusMeta(merchantIntent?.depositStatus);
  const intentTimelineSteps = [
    {
      key: 'apply',
      title: '提交申请',
      time: merchantIntent?.createdAt || '--',
      state: merchantIntent ? 'done' : 'pending',
    },
    {
      key: 'pay',
      title: '支付保证金',
      time: merchantIntent?.paidAt || '--',
      state: merchantIntent?.depositStatus && merchantIntent.depositStatus >= 2 ? 'done' : 'active',
    },
    {
      key: 'confirm',
      title: '链上确认',
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
      <SectionCard icon="fa-shield-alt" title="认证信息" subtitle="统一管理KYC、安全认证与商家认证状态">
        <SectionForm>
          <SectionFormItem
            title="KYC认证"
            description="身份实名与证件信息审核"
            statusNode={
              <span className={`${styles.labelStatusPill} ${kycStatusClass}`}>
                <i className={kycStatusIcon}></i>
                {getKycText(profile.kycStatus)}
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
                  去认证
                </AdminButton>
              ) : profile.kycStatus === 'pending' ? (
                <AdminButton
                  variant="submit"
                  size="xs"
                  icon="fas fa-hourglass-half"
                  className={styles.authActionUnifiedBtn}
                  onClick={onOpenKyc}
                >
                  查看进度
                </AdminButton>
              ) : (
                <AdminButton
                  variant="view"
                  size="xs"
                  icon="fas fa-id-card"
                  className={styles.authActionUnifiedBtn}
                  onClick={() => setShowKycDetail((prev) => !prev)}
                >
                  {showKycDetail ? '收起详情' : '查看认证信息'}
                </AdminButton>
              )}
            </div>
          </SectionFormItem>

          {isKycVerified && showKycDetail && (
            <div className={styles.kycDetailPanel}>
              <div className={styles.kycDetailRow}>
                <span>认证姓名</span>
                <span>{profile.nickname || profile.username}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>认证手机</span>
                <span>{profile.phone}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>认证邮箱</span>
                <span>{profile.email}</span>
              </div>
              <div className={styles.kycDetailRow}>
                <span>认证状态</span>
                <span>{getKycText(profile.kycStatus)}</span>
              </div>
            </div>
          )}

          <SectionFormItem
            title="安全认证"
            description="账户安全保护机制状态"
            statusNode={
              <span className={`${styles.labelStatusPill} ${securityStatusClass}`}>
                <i className={securityStatusIcon}></i>
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
                查看详情
              </AdminButton>
            </div>
          </SectionFormItem>

          <SectionFormItem
            title="商家认证"
            description="商家身份审核与资质认证"
            statusNode={
              <span className={`${styles.labelStatusPill} ${merchantMeta.className}`}>
                <i className={merchantMeta.icon}></i>
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

      <SectionCard icon="fa-user-circle" title="基础资料" subtitle="维护用户身份与展示信息">
        <SectionForm>
          <SectionFormItem title="用户ID" description="系统分配的唯一标识符">
            <div className={styles.readonlyFieldRow}>
              <Input className={styles.inlineField} value={profile.userId} disabled bordered={false} />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title="禁止修改">
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="用户名" description="登录账号即钱包地址">
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={formatWalletAddress(profile.walletAddress || profile.username)}
                disabled
                bordered={false}
                placeholder="钱包地址"
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title="禁止修改">
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="注册时间" description="账户创建时间">
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.registerTime}
                disabled
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title="禁止修改">
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="昵称" description="用户展示名称">
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.nickname}
                onChange={(event) => updateProfileField('nickname', event.target.value)}
                placeholder="请输入昵称"
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                {showNicknameSubmit && !nicknameSubmitted ? (
                  <button
                    type="button"
                    className={styles.fieldSubmitIconBtn}
                    title="提交昵称修改"
                    aria-label="提交昵称修改"
                    disabled={submittingNickname}
                    onClick={handleSubmitNickname}
                  >
                    <i className={`fas ${submittingNickname ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  </button>
                ) : null}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="性别" description="用户性别信息">
            <div className={styles.readonlyFieldRow}>
              <Radio.Group
                className={styles.genderRadioGroup}
                value={profile.gender === 'unknown' ? undefined : profile.gender}
                disabled={submittingGender}
                onChange={(event) => handleGenderChange(event.target.value as ProfileGender)}
              >
                <Radio value="male">{getGenderText('male')}</Radio>
                <Radio value="female">{getGenderText('female')}</Radio>
              </Radio.Group>
              <span className={styles.fieldActionSlot}></span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="生日" description="用户出生日期">
            <div className={styles.readonlyFieldRow}>
              <DatePicker
                className={styles.inlineField}
                value={profile.birthday ? dayjs(profile.birthday, 'YYYY-MM-DD') : null}
                onChange={(value) =>
                  updateProfileField('birthday', value ? value.format('YYYY-MM-DD') : '')
                }
                format="YYYY-MM-DD"
                placeholder="请选择生日"
                allowClear
                bordered={false}
                inputReadOnly
              />
              <span className={styles.fieldActionSlot}>
                {showBirthdaySubmit ? (
                  <button
                    type="button"
                    className={styles.fieldSubmitIconBtn}
                    title="提交生日修改"
                    aria-label="提交生日修改"
                    disabled={submittingBirthday}
                    onClick={handleSubmitBirthday}
                  >
                    <i className={`fas ${submittingBirthday ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  </button>
                ) : null}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="注册时间" description="账户创建时间">
            <div className={styles.readonlyFieldRow}>
              <Input
                className={styles.inlineField}
                value={profile.registerTime}
                disabled
                bordered={false}
              />
              <span className={styles.fieldActionSlot}>
                <span className={styles.readonlyFieldAction} title="禁止修改">
                  <i className="fas fa-lock"></i>
                </span>
              </span>
            </div>
          </SectionFormItem>

        </SectionForm>
      </SectionCard>

      <SectionCard icon="fa-address-book" title="联系方式" subtitle="用于通知、验证和安全告警">
        <SectionForm>
          <SectionFormItem title="电子邮箱" description="用于接收重要通知和验证">
            <div className={styles.fieldWithMeta}>
              <Input
                className={styles.inlineField}
                value={profile.email}
                onChange={(event) => updateProfileField('email', event.target.value)}
                placeholder="请输入电子邮箱"
                bordered={false}
              />
              <span className={`${styles.verifyTag} ${profile.emailVerified ? styles.verifyOk : styles.verifyWarn}`}>
                <i className={`fas ${profile.emailVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {profile.emailVerified ? '已验证' : '未验证'}
              </span>
            </div>
          </SectionFormItem>

          <SectionFormItem title="手机号码" description="用于安全验证和重要通知">
            <div className={styles.fieldWithMeta}>
              <Input
                className={styles.inlineField}
                value={profile.phone}
                onChange={(event) => updateProfileField('phone', event.target.value)}
                placeholder="请输入手机号码"
                bordered={false}
              />
              <span className={`${styles.verifyTag} ${profile.phoneVerified ? styles.verifyOk : styles.verifyWarn}`}>
                <i className={`fas ${profile.phoneVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {profile.phoneVerified ? '已验证' : '未验证'}
              </span>
            </div>
          </SectionFormItem>
        </SectionForm>
      </SectionCard>

      <SectionCard icon="fa-history" title="操作记录" subtitle="近期账户相关操作，便于自查与安全审计">
        <div className={styles.operationLogPanel}>
          {profile.operationLogs.length === 0 ? (
            <div className={styles.operationLogEmpty}>暂无操作记录</div>
          ) : (
            <>
              <ul className={styles.operationLogList}>
                {operationLogsVisible.map((item) => {
                  const resultMeta = getOperationResultMeta(item.resultStatus);
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
                          <span className={styles.operationLogModule}>{getOperationBizLabel(item.bizModule)}</span>
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
                    加载更多
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </SectionCard>

      <Modal
        title="商家申请单详情"
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
              <span>正在加载申请单详情...</span>
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
                  {merchantIntent.depositStatusDesc || `状态码 ${merchantIntent.depositStatus}`}
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
                  <div className={styles.merchantPanelTitle}>申请单信息</div>
                  <div className={styles.merchantIntentRow}>
                    <span>意图单ID</span>
                    <span>{merchantIntent.intentId || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>保证金金额</span>
                    <span>
                      {merchantIntent.amount || '--'} {merchantIntent.token || ''}
                    </span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>有效期至</span>
                    <span>{merchantIntent.expireAt || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>创建时间</span>
                    <span>{merchantIntent.createdAt || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>更新时间</span>
                    <span>{merchantIntent.updatedAt || '--'}</span>
                  </div>
                </div>

                <div className={styles.merchantIntentPanel}>
                  <div className={styles.merchantPanelTitle}>链上与交易信息</div>
                  <div className={styles.merchantIntentRow}>
                    <span>链ID</span>
                    <span>{merchantIntent.chainId || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>合约地址</span>
                    <span>{merchantIntent.contractAddress || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>代币地址</span>
                    <span>{merchantIntent.tokenAddress || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>交易哈希</span>
                    <span>{merchantIntent.txHash || '--'}</span>
                  </div>
                  <div className={styles.merchantIntentRow}>
                    <span>确认数</span>
                    <span>{merchantIntent.confirmations ?? '--'}</span>
                  </div>
                </div>
              </div>

              {(merchantIntent.failReason || merchantIntent.refundTxHash) && (
                <div className={styles.merchantHintBlock}>
                  {merchantIntent.failReason ? <p>失败原因：{merchantIntent.failReason}</p> : null}
                  {merchantIntent.refundTxHash ? <p>退还哈希：{merchantIntent.refundTxHash}</p> : null}
                </div>
              )}
            </>
          )}

          {!merchantDetailLoading && !merchantIntent && (
            <div className={styles.merchantHintBlock}>
              <p>当前未查询到申请单详情，请稍后刷新页面重试。</p>
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
                前往DApp缴纳保证金
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
                我已完成支付
              </AdminButton>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSectionList;
