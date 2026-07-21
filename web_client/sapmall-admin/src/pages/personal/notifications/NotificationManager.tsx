﻿import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import type {
  NotificationData,
  TypeFilterTab,
  NotificationChannel,
  FrequencyOption,
} from './types';
import { mockNotificationData } from './constants';
import {
  ChannelSettingsCard,
  NotificationTypeCard,
  PreviewModal,
} from './components';
import styles from './NotificationManager.module.scss';

const NotificationManager: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<NotificationData>(mockNotificationData);
  const [typeFilter, setTypeFilter] = useState<TypeFilterTab>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  // TODO: Replace mock with API call
  // const loadData = async () => {
  //   const resp = await notificationApi.getSettings();
  //   setData(resp);
  // };

  const handleChannelToggle = (channel: NotificationChannel) => {
    setData((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: { ...prev.channels[channel], enabled: !prev.channels[channel].enabled },
      },
    }));
    // TODO: Call API
  };

  const handleChannelValueChange = (channel: NotificationChannel, value: string) => {
    setData((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: { ...prev.channels[channel], value },
      },
    }));
  };

  const handleSaveChannels = () => {
    message.success(t('personal.notifications.channelSaved'));
    // TODO: Call API
    // notificationApi.updateChannels(data.channels);
  };

  const handleToggleType = (id: string) => {
    setData((prev) => ({
      ...prev,
      types: prev.types.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    }));
    // TODO: Call API
  };

  const handleToggleChannel = (id: string, channel: NotificationChannel) => {
    setData((prev) => ({
      ...prev,
      types: prev.types.map((t) =>
        t.id === id ? { ...t, channels: { ...t.channels, [channel]: !t.channels[channel] } } : t,
      ),
    }));
    // TODO: Call API
  };

  const handleFrequencyChange = (id: string, freq: FrequencyOption) => {
    setData((prev) => ({
      ...prev,
      types: prev.types.map((t) => (t.id === id ? { ...t, frequency: freq } : t)),
    }));
    // TODO: Call API
  };

  const handleEnableAll = () => {
    setData((prev) => ({
      ...prev,
      types: prev.types.map((t) => ({ ...t, enabled: true })),
    }));
    message.success(t('personal.notifications.allEnabled'));
    // TODO: Call API
  };

  const handleDisableAll = () => {
    setData((prev) => ({
      ...prev,
      types: prev.types.map((t) => ({ ...t, enabled: false })),
    }));
    message.success(t('personal.notifications.allDisabled'));
    // TODO: Call API
  };

  const handlePreview = (id: string) => {
    setPreviewId(id);
    setPreviewOpen(true);
  };

  const handleSaveTypes = () => {
    message.success(t('personal.notifications.typeSaved'));
    // TODO: Call API
    // notificationApi.updateTypes(data.types);
  };

  return (
    <div className={styles.notificationPage}>
      <h4 className={styles.sectionLabel}>{t('personal.notifications.title')}</h4>
      <ChannelSettingsCard
        channels={data.channels}
        onToggle={handleChannelToggle}
        onValueChange={handleChannelValueChange}
        onSave={handleSaveChannels}
      />

      <NotificationTypeCard
        types={data.types}
        filter={typeFilter}
        onFilterChange={setTypeFilter}
        onToggleType={handleToggleType}
        onToggleChannel={handleToggleChannel}
        onFrequencyChange={handleFrequencyChange}
        onEnableAll={handleEnableAll}
        onDisableAll={handleDisableAll}
        onPreview={handlePreview}
        onSave={handleSaveTypes}
      />

      <PreviewModal
        open={previewOpen}
        notificationId={previewId}
        onClose={() => { setPreviewOpen(false); setPreviewId(null); }}
      />
    </div>
  );
};

export default NotificationManager;
