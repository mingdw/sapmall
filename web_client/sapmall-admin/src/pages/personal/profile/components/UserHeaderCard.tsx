import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import AdminButton from '../../../../components/common/AdminButton';
import type { KycStatus, ProfileData } from '../types';
import styles from '../ProfileManager.module.scss';

interface UserHeaderCardProps {
  profile: ProfileData;
  onCopyAddress: () => void;
  onStartKyc: () => void;
}

const getKycStatusText = (status: KycStatus, t: TFunction): string => {
  if (status === 'verified') return t('personal.profile.kyc.verified');
  if (status === 'pending') return t('personal.profile.kyc.pending');
  return t('personal.profile.kyc.notVerified');
};

const getKycStatusClass = (status: KycStatus): string => {
  if (status === 'verified') return styles.kycVerified;
  if (status === 'pending') return styles.kycPending;
  return styles.kycNotVerified;
};

const UserHeaderCard: React.FC<UserHeaderCardProps> = ({
  profile,
  onCopyAddress,
  onStartKyc,
}) => {
  const { t } = useTranslation();
  const kycButtonText =
    profile.kycStatus === 'not_verified'
      ? t('personal.profile.startKyc')
      : t('personal.profile.viewKyc');

  return (
    <div className={styles.userHeaderCard}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <i className="fas fa-user"></i>
        </div>
        <button className={styles.avatarEditButton} type="button" aria-label={t('personal.profile.editAvatar')}>
          <i className="fas fa-pen"></i>
        </button>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.userNameRow}>
          <h2 className={styles.userName}>{profile.username}</h2>
          <div className={styles.walletAddress}>
            <span>{profile.walletAddress}</span>
            <button type="button" onClick={onCopyAddress} className={styles.copyButton}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div className={styles.userStatusRow}>
          <span className={styles.userRole}>{profile.userRole}</span>
          <span className={`${styles.kycStatus} ${getKycStatusClass(profile.kycStatus)}`}>
            <i className="fas fa-id-card"></i>
            {getKycStatusText(profile.kycStatus, t)}
          </span>
          <AdminButton
            variant="primary"
            size="sm"
            icon="fas fa-shield-alt"
            onClick={onStartKyc}
          >
            {kycButtonText}
          </AdminButton>
        </div>

        <p className={styles.userBrief}>{profile.brief || profile.statusText}</p>
      </div>
    </div>
  );
};

export default UserHeaderCard;
