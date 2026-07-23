﻿import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, message } from 'antd';
import type {
  SecurityData,
  ActivityFilterType,
  WalletSecuritySettings,
  AccessControlSettings,
} from './types';
import { mockSecurityData, ACTIVITY_PAGE_SIZE } from './constants';
import {
  SecurityScoreCard,
  WalletSecurityCard,
  AccessControlCard,
  DeviceManagementCard,
  EmergencyOperationsCard,
  ActivityHistoryCard,
  TwoFactorModal,
  WhitelistModal,
  FreezeModal,
  RecoveryModal,
} from './components';
import { formatDate } from './utils/securityUtils';
import styles from './SecurityManager.module.scss';

const SecurityManager: React.FC = () => {
  const { t } = useTranslation();
  const [securityData, setSecurityData] = useState<SecurityData>(mockSecurityData);
  const [activityFilter, setActivityFilter] = useState<ActivityFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityPage, setActivityPage] = useState(1);

  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);
  const [newWhitelistAddress, setNewWhitelistAddress] = useState('');

  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezeConfirmation, setFreezeConfirmation] = useState('');

  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);

  // TODO: Replace mock with API call
  const loadData = useCallback(async () => {
    // const resp = await securityApi.getSecuritySettings();
    // setSecurityData(resp);
    setSecurityData(mockSecurityData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredActivities = useMemo(() => {
    let items = securityData.activities;
    if (activityFilter !== 'all') {
      items = items.filter((a) => a.type === activityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (a) => a.title.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q),
      );
    }
    return items;
  }, [securityData.activities, activityFilter, searchQuery]);

  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice(0, activityPage * ACTIVITY_PAGE_SIZE);
  }, [filteredActivities, activityPage]);

  const totalActivities = filteredActivities.length;

  const handleToggleWalletSecurity = (key: keyof WalletSecuritySettings) => {
    setSecurityData((prev) => ({
      ...prev,
      walletSecurity: { ...prev.walletSecurity, [key]: !prev.walletSecurity[key] },
    }));
    // TODO: Call API
    // securityApi.updateWalletSecurity({ [key]: !prev.walletSecurity[key] });
  };

  const handleToggleAccessControl = (key: keyof AccessControlSettings) => {
    setSecurityData((prev) => ({
      ...prev,
      accessControl: { ...prev.accessControl, [key]: !prev.accessControl[key] },
    }));
    // TODO: Call API
    // securityApi.updateAccessControl({ [key]: !prev.accessControl[key] });
  };

  const handleDisconnectDevice = (deviceId: string) => {
    Modal.confirm({
      title: t('personal.security.disconnectDevice'),
      content: t('personal.security.disconnectDeviceConfirm'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: () => {
        setSecurityData((prev) => ({
          ...prev,
          devices: prev.devices.filter((d) => d.id !== deviceId),
        }));
        message.success(t('personal.security.deviceDisconnected'));
        // TODO: Call API
        // securityApi.disconnectDevice(deviceId);
      },
    });
  };

  const handleOpenTwoFactorModal = () => {
    if (securityData.accessControl.twoFactorEnabled) {
      Modal.confirm({
        title: t('personal.security.modal.closeTwoFactorTitle'),
        content: t('personal.security.modal.closeTwoFactorDesc'),
        okText: t('personal.security.modal.confirmClose'),
        cancelText: t('personal.security.modal.cancel'),
        okButtonProps: { danger: true },
        onOk: () => {
          handleToggleAccessControl('twoFactorEnabled');
          message.success(t('personal.security.msg.twoFactorDisabled'));
        },
      });
      return;
    }
    setTwoFactorStep(1);
    setVerificationCode('');
    setTwoFactorModalOpen(true);
  };

  const handleCompleteTwoFactor = () => {
    if (verificationCode.length !== 6) {
      message.warning(t('personal.security.msg.enterVerificationCode'));
      return;
    }
    // TODO: Call API
    // await securityApi.enableTwoFactor(verificationCode);
    handleToggleAccessControl('twoFactorEnabled');
    setTwoFactorModalOpen(false);
    message.success(t('personal.security.msg.twoFactorEnabled'));
  };

  const handleAddWhitelistAddress = () => {
    if (!newWhitelistAddress.trim()) {
      message.warning(t('personal.security.msg.enterWalletAddress'));
      return;
    }
    setSecurityData((prev) => ({
      ...prev,
      whitelistAddresses: [
        ...prev.whitelistAddresses,
        { address: newWhitelistAddress.trim(), addedAt: formatDate(new Date()) },
      ],
    }));
    setNewWhitelistAddress('');
    message.success(t('personal.security.modal.addressAdded'));
    // TODO: Call API
    // securityApi.addWhitelistAddress(newWhitelistAddress);
  };

  const handleRemoveWhitelistAddress = (address: string) => {
    setSecurityData((prev) => ({
      ...prev,
      whitelistAddresses: prev.whitelistAddresses.filter((a) => a.address !== address),
    }));
    message.success(t('personal.security.modal.addressRemoved'));
    // TODO: Call API
    // securityApi.removeWhitelistAddress(address);
  };

  const handleConfirmFreeze = () => {
    if (freezeConfirmation !== 'FREEZE') {
      message.warning(t('personal.security.msg.enterFreezeConfirm'));
      return;
    }
    setFreezeModalOpen(false);
    setFreezeConfirmation('');
    message.success(t('personal.security.modal.accountFrozen'));
    // TODO: Call API
    // securityApi.freezeAccount();
  };

  const handleReassessScore = (newScore: number) => {
    setSecurityData((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        score: newScore,
        level: newScore <= 30 ? 'low' : newScore <= 60 ? 'medium' : 'high',
      },
    }));
    // TODO: Call API
    // securityApi.updateScore(newScore);
  };

  return (
    <div className={styles.securityPage}>
      <h4 className={styles.sectionLabel}>{t('personal.security.title')}</h4>
      <SecurityScoreCard score={securityData.score} onReassess={handleReassessScore} />

      <WalletSecurityCard
        settings={securityData.walletSecurity}
        onToggle={handleToggleWalletSecurity}
      />

      <AccessControlCard
        settings={securityData.accessControl}
        onToggle={handleToggleAccessControl}
        onOpenTwoFactor={handleOpenTwoFactorModal}
        onOpenWhitelist={() => setWhitelistModalOpen(true)}
      />

      <DeviceManagementCard
        devices={securityData.devices}
        onDisconnect={handleDisconnectDevice}
      />

      <EmergencyOperationsCard
        onOpenFreeze={() => setFreezeModalOpen(true)}
        onOpenRecovery={() => setRecoveryModalOpen(true)}
      />

      <ActivityHistoryCard
        activities={paginatedActivities}
        total={totalActivities}
        page={activityPage}
        filter={activityFilter}
        searchQuery={searchQuery}
        onFilterChange={setActivityFilter}
        onSearchChange={setSearchQuery}
        onPageChange={setActivityPage}
        onDisconnect={handleDisconnectDevice}
      />

      <TwoFactorModal
        open={twoFactorModalOpen}
        step={twoFactorStep}
        verificationCode={verificationCode}
        onStepChange={setTwoFactorStep}
        onCodeChange={setVerificationCode}
        onComplete={handleCompleteTwoFactor}
        onClose={() => setTwoFactorModalOpen(false)}
      />

      <WhitelistModal
        open={whitelistModalOpen}
        addresses={securityData.whitelistAddresses}
        newAddress={newWhitelistAddress}
        onNewAddressChange={setNewWhitelistAddress}
        onAdd={handleAddWhitelistAddress}
        onRemove={handleRemoveWhitelistAddress}
        onClose={() => setWhitelistModalOpen(false)}
      />

      <FreezeModal
        open={freezeModalOpen}
        confirmation={freezeConfirmation}
        onConfirmationChange={setFreezeConfirmation}
        onConfirm={handleConfirmFreeze}
        onClose={() => { setFreezeModalOpen(false); setFreezeConfirmation(''); }}
      />

      <RecoveryModal
        open={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
      />
    </div>
  );
};

export default SecurityManager;
