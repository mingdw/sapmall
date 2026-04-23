import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Form, Input, Select } from 'antd';
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
  onProfileChange: (nextProfile: ProfileData) => void;
  onOpenKyc: () => void;
  onOpenMerchantApplyModal: () => void;
  merchantIntent: MerchantDepositIntent | null;
  merchantLoading: boolean;
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
  onProfileChange,
  onOpenKyc,
  onOpenMerchantApplyModal,
  merchantIntent,
  merchantLoading,
  onMerchantOpenDapp,
  onMerchantMarkPaid,
}) => {
  const [showKycDetail, setShowKycDetail] = React.useState(false);
  const [showMerchantDetail, setShowMerchantDetail] = React.useState(false);
  const [operationLogVisibleCount, setOperationLogVisibleCount] = React.useState(OPERATION_LOG_PAGE_SIZE);

  React.useEffect(() => {
    setOperationLogVisibleCount(OPERATION_LOG_PAGE_SIZE);
  }, [profile.operationLogs]);

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
  const merchantToggleText = profile.merchantDepositStatus === 'paid' ? '查看认证详情' : '去认证';
  const isMerchantNotApplied = profile.merchantDepositStatus === 'not_applied';

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
                icon={
                  isMerchantNotApplied
                    ? 'fas fa-file-signature'
                    : showMerchantDetail
                    ? 'fas fa-chevron-up'
                    : 'fas fa-chevron-down'
                }
                className={styles.authActionUnifiedBtn}
                onClick={() => {
                  if (isMerchantNotApplied) {
                    onOpenMerchantApplyModal();
                    return;
                  }
                  setShowMerchantDetail((prev) => !prev);
                }}
              >
                {merchantToggleText}
              </AdminButton>
            </div>
          </SectionFormItem>

          {showMerchantDetail && (
            <div className={styles.merchantDetailPanel}>
              <div className={styles.merchantStatusCard}>
                <span className={styles.merchantStatusLabel}>当前状态</span>
                <span className={styles.merchantStatusValue}>
                  {getMerchantStatusText(profile.merchantDepositStatus)}
                </span>
              </div>

              {profile.merchantDepositStatus === 'not_applied' && (
                <div className={styles.merchantHintBlock}>
                  <p>请先阅读并同意平台商家入驻相关法律条款，再提交商家认证申请。</p>
                  <p>点击上方“去认证”按钮后，将在模态框中完成条款确认流程。</p>
                </div>
              )}

              {(profile.merchantDepositStatus === 'pending_payment' ||
                profile.merchantDepositStatus === 'confirming' ||
                profile.merchantDepositStatus === 'paid') &&
                merchantIntent && (
                  <div className={styles.merchantIntentPanel}>
                    <div className={styles.merchantIntentRow}>
                      <span>意图单ID</span>
                      <span>{merchantIntent.intentId}</span>
                    </div>
                    <div className={styles.merchantIntentRow}>
                      <span>保证金金额</span>
                      <span>
                        {merchantIntent.amount} {merchantIntent.token}
                      </span>
                    </div>
                    <div className={styles.merchantIntentRow}>
                      <span>链ID</span>
                      <span>{merchantIntent.chainId}</span>
                    </div>
                    <div className={styles.merchantIntentRow}>
                      <span>合约地址</span>
                      <span>{merchantIntent.contractAddress}</span>
                    </div>
                    <div className={styles.merchantIntentRow}>
                      <span>有效期至</span>
                      <span>{merchantIntent.expireAt}</span>
                    </div>
                    {merchantIntent.txHash && (
                      <div className={styles.merchantIntentRow}>
                        <span>交易哈希</span>
                        <span>{merchantIntent.txHash}</span>
                      </div>
                    )}
                  </div>
                )}

              {profile.merchantDepositStatus === 'pending_payment' && (
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

              {profile.merchantDepositStatus === 'confirming' && (
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
          )}
        </SectionForm>
      </SectionCard>

      <SectionCard icon="fa-user-circle" title="基础资料" subtitle="维护用户身份与展示信息">
        <SectionForm>
          <SectionFormItem title="用户ID" description="系统分配的唯一标识符">
            <Input className={styles.inlineField} value={profile.userId} disabled bordered={false} />
          </SectionFormItem>

          <SectionFormItem title="用户名" description="账户登录名称">
            <Input
              className={styles.inlineField}
              value={profile.username}
              onChange={(event) => updateProfileField('username', event.target.value)}
              placeholder="请输入用户名"
              bordered={false}
            />
          </SectionFormItem>

          <SectionFormItem title="昵称" description="用户展示名称">
            <Input
              className={styles.inlineField}
              value={profile.nickname}
              onChange={(event) => updateProfileField('nickname', event.target.value)}
              placeholder="请输入昵称"
              bordered={false}
            />
          </SectionFormItem>

          <SectionFormItem title="性别" description="用户性别信息">
            <Select
              className={styles.inlineField}
              value={profile.gender}
              onChange={(value) => updateProfileField('gender', value as ProfileGender)}
              bordered={false}
              options={[
                { value: 'unknown', label: getGenderText('unknown') },
                { value: 'male', label: getGenderText('male') },
                { value: 'female', label: getGenderText('female') },
              ]}
            />
          </SectionFormItem>

          <SectionFormItem title="生日" description="用户出生日期">
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
          </SectionFormItem>

          <SectionFormItem title="注册时间" description="账户创建时间">
            <Input
              className={styles.inlineField}
              value={profile.registerTime}
              disabled
              bordered={false}
            />
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
    </div>
  );
};

export default ProfileSectionList;
