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

const shortcutItem =
  'group relative flex min-h-14 w-full cursor-pointer flex-col items-start justify-start gap-[0.4rem] border-none bg-transparent px-[0.35rem] pt-[0.15rem] text-inherit no-underline transition-colors hover:[&_.shortcut-icon]:-translate-y-px hover:[&_.shortcut-icon]:text-[var(--help-amber-deep)] hover:[&_.shortcut-label]:text-[var(--help-amber-deep)]';

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
        <span className="shortcut-icon flex h-[1.65rem] w-7 items-center justify-start text-[var(--help-amber)] transition-[color,transform] [&_svg]:h-6 [&_svg]:w-6">
          {supportActionIcons[action.icon]}
        </span>
        <span className="shortcut-label break-keep text-left text-[0.6875rem] font-medium leading-snug text-[var(--help-panel-text)] transition-colors">
          {label}
        </span>
      </>
    );

    if (action.id === 'liveChat') {
      return (
        <button key={action.id} type="button" className={shortcutItem} aria-label={aria} onClick={onLiveChat}>
          {inner}
        </button>
      );
    }

    if (action.id === 'community' && action.href) {
      return (
        <Link key={action.id} to={action.href} className={shortcutItem} aria-label={aria}>
          {inner}
        </Link>
      );
    }

    return (
      <button key={action.id} type="button" className={shortcutItem} aria-label={aria} onClick={onFeedback}>
        {inner}
      </button>
    );
  };

  const renderChannel = (channel: HelpContactChannel) => {
    const Icon = contactChannelIcons[channel.icon];
    const value = t(channel.valueKey);
    const label = t(channel.labelKey);

    const rowInner = (
      <>
        <span className="mt-0.5 flex h-[1.65rem] w-7 shrink-0 items-center justify-start rounded-md bg-slate-100 text-[var(--help-primary)]">
          <Icon size={15} strokeWidth={2.25} aria-hidden />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[0.6875rem] font-medium text-slate-400">{label}</span>
          <span className="channel-value break-words text-[0.8125rem] font-semibold leading-snug text-[var(--help-panel-text)] transition-colors">
            {value}
          </span>
        </span>
      </>
    );

    if (channel.href) {
      return (
        <a
          key={channel.id}
          href={channel.href}
          className="group flex items-start gap-2 rounded-lg px-0 py-[0.35rem] text-inherit no-underline transition-colors hover:bg-slate-100 hover:[&_.channel-value]:text-[var(--help-primary)]"
          target={channel.external ? '_blank' : undefined}
          rel={channel.external ? 'noopener noreferrer' : undefined}
          onClick={() => {
            if (channel.id === 'email') {
              message.success(t('help.toast.emailOpened'));
            }
          }}
        >
          {rowInner}
        </a>
      );
    }

    return (
      <div
        key={channel.id}
        className="flex cursor-default items-start gap-2 rounded-lg px-0 py-[0.35rem]"
      >
        {rowInner}
      </div>
    );
  };

  return (
    <div
      className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard} bg-gradient-to-b from-white to-[#fafbff]`}
    >
      <section className="m-0" aria-labelledby="help-support-title">
        <div className={sharedStyles.cardSectionHead}>
          <HelpCardTitle id="help-support-title" icon={<LifeBuoy size={18} strokeWidth={2.25} />}>
            {t('help.support.title')}
          </HelpCardTitle>
        </div>

        <div className={sharedStyles.cardSectionBody}>
          <div
            className="grid grid-cols-3 items-stretch"
            role="list"
            aria-label={t('help.support.solutionsAria')}
          >
            {HELP_SUPPORT_ACTIONS.map((action) => (
              <div key={action.id} role="listitem">
                {renderShortcut(action)}
              </div>
            ))}
          </div>

          <hr className="my-2 border-0 border-t border-[#eef1f5]" />

          <div className="flex flex-col gap-[0.35rem]">{HELP_CONTACT_CHANNELS.map(renderChannel)}</div>
        </div>
      </section>
    </div>
  );
};

export default HelpSupportSidebar;
