import type { HelpContactChannel, HelpSupportAction } from '../types';

/** 三列快捷入口：在线客服 · 社区求助 · 意见建议 */
export const HELP_SUPPORT_ACTIONS: HelpSupportAction[] = [
  {
    id: 'liveChat',
    icon: 'headphones',
    titleKey: 'help.support.actions.liveChat.title',
    descKey: 'help.support.actions.liveChat.desc',
  },
  {
    id: 'community',
    icon: 'users',
    titleKey: 'help.support.actions.community.title',
    descKey: 'help.support.actions.community.desc',
    href: '/dao',
  },
  {
    id: 'feedback',
    icon: 'pen-line',
    titleKey: 'help.support.actions.feedback.title',
    descKey: 'help.support.actions.feedback.desc',
    href: 'mailto:feedback@sapmall.io?subject=SapMall%20Feedback',
    external: true,
  },
];

export const HELP_CONTACT_CHANNELS: HelpContactChannel[] = [
  {
    id: 'email',
    icon: 'mail',
    labelKey: 'help.support.channels.email.label',
    valueKey: 'help.support.channels.email.value',
    href: 'mailto:support@sapmall.io',
    external: true,
  },
  {
    id: 'telegram',
    icon: 'send',
    labelKey: 'help.support.channels.telegram.label',
    valueKey: 'help.support.channels.telegram.value',
    href: 'https://t.me/SapMallSupport',
    external: true,
  },
  {
    id: 'discord',
    icon: 'hash',
    labelKey: 'help.support.channels.discord.label',
    valueKey: 'help.support.channels.discord.value',
    href: 'https://discord.gg/sapmall',
    external: true,
  },
  {
    id: 'hours',
    icon: 'clock',
    labelKey: 'help.support.channels.hours.label',
    valueKey: 'help.support.channels.hours.value',
  },
];
