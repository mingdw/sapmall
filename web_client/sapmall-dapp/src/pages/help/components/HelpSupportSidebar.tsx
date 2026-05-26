import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { Clock, Hash, Headphones, LifeBuoy, Mail, PenLine, Send, Users } from 'lucide-react';
import { openLiveChat } from '../../../components/live-chat/LiveChatWidget';
import { HELP_CONTACT_CHANNELS, HELP_SUPPORT_ACTIONS } from '../mocks/helpSupport.mock';
import type { HelpContactChannel, HelpSupportAction, HelpSupportActionIcon } from '../types';
import HelpCardTitle from './HelpCardTitle';
import sharedStyles from '../styles/help.shared.module.scss';
import styles from './HelpSupportSidebar.module.scss';

const supportActionIcons: Record<HelpSupportActionIcon, React.ReactNode> = {
  headphones: <Headphones strokeWidth={1.75} aria-hidden />,
  'pen-line': <PenLine strokeWidth={1.75} aria-hidden />,
  users: <Users strokeWidth={1.75} aria-hidden />,
};

const contactChannelIcons = {
  mail: Mail,
  send: Send,
  hash: Hash,
  clock: Clock,
} as const;

const HelpSupportSidebar: React.FC = () => {
  const { t } = useTranslation();

  const onLiveChat = () => {
    openLiveChat();
  };

  const onFeedback = () => {
    message.success(t('help.toast.feedbackOpening'));
    window.open(
      'mailto:feedback@sapmall.io?subject=SapMall%20Feedback',
      '_blank',
      'noopener,noreferrer',
    );
  };

  const renderShortcut = (action: HelpSupportAction) => {
    const label = t(action.titleKey);
    const aria = `${label} — ${t(action.descKey)}`;
    const inner = (
      <>
        <span className={styles.supportShortcutIcon}>{supportActionIcons[action.icon]}</span>
        <span className={styles.supportShortcutLabel}>{label}</span>
      </>
    );

    if (action.id === 'liveChat') {
      return (
        <button
          key={action.id}
          type="button"
          className={styles.supportShortcutItem}
          aria-label={aria}
          onClick={onLiveChat}
        >
          {inner}
        </button>
      );
    }

    if (action.id === 'community' && action.href) {
      return (
        <Link key={action.id} to={action.href} className={styles.supportShortcutItem} aria-label={aria}>
          {inner}
        </Link>
      );
    }

    return (
      <button
        key={action.id}
        type="button"
        className={styles.supportShortcutItem}
        aria-label={aria}
        onClick={onFeedback}
      >
        {inner}
      </button>
    );
  };

  const renderChannel = (channel: HelpContactChannel) => {
    const Icon = contactChannelIcons[channel.icon];
    const value = t(channel.valueKey);
    const label = t(channel.labelKey);

    const row = (
      <>
        <span className={styles.supportContactIcon}>
          <Icon size={15} strokeWidth={2.25} aria-hidden />
        </span>
        <span className={styles.supportContactText}>
          <span className={styles.supportContactLabel}>{label}</span>
          <span className={styles.supportContactValue}>{value}</span>
        </span>
      </>
    );

    if (channel.href) {
      return (
        <a
          key={channel.id}
          href={channel.href}
          className={styles.supportContactRow}
          target={channel.external ? '_blank' : undefined}
          rel={channel.external ? 'noopener noreferrer' : undefined}
          onClick={() => {
            if (channel.id === 'email') {
              message.success(t('help.toast.emailOpened'));
            }
          }}
        >
          {row}
        </a>
      );
    }

    return (
      <div key={channel.id} className={`${styles.supportContactRow} ${styles.supportContactRowStatic}`}>
        {row}
      </div>
    );
  };

  return (
    <div className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard} ${styles.supportSidebarCard}`}>
      <section className={styles.supportSidebar} aria-labelledby="help-support-title">
        <div className={sharedStyles.cardSectionHead}>
          <HelpCardTitle id="help-support-title" icon={<LifeBuoy size={18} strokeWidth={2.25} />}>
            {t('help.support.title')}
          </HelpCardTitle>
        </div>

        <div className={sharedStyles.cardSectionBody}>
          <div
            className={styles.supportShortcutGrid}
            role="list"
            aria-label={t('help.support.solutionsAria')}
          >
            {HELP_SUPPORT_ACTIONS.map((action) => (
              <div key={action.id} role="listitem">
                {renderShortcut(action)}
              </div>
            ))}
          </div>

          <hr className={styles.supportDivider} />

          <div className={styles.supportContactList}>{HELP_CONTACT_CHANNELS.map(renderChannel)}</div>
        </div>
      </section>
    </div>
  );
};

export default HelpSupportSidebar;
