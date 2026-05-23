import type { DaoHeroSlide } from '../types';

/** 顺序与下区左侧 Tab 一致：大事件 → 热门讨论 → 提案治理 */
export const DAO_HERO_SLIDES: DaoHeroSlide[] = [
  {
    id: 'events',
    icon: 'events',
    layout: 'split',
    titleKey: 'dao.hero.slides.events.title',
    subtitleKey: 'dao.hero.slides.events.subtitle',
    descriptionKey: 'dao.hero.slides.events.description',
    asideKind: 'spotlight',
    spotlight: {
      headlineKey: 'dao.hero.slides.events.highlight',
      metaKey: 'dao.hero.aside.events.liveTag',
      footnoteKey: 'dao.hero.aside.events.footnote',
    },
    asideItems: [
      { id: 'grant', icon: 'coins', labelKey: 'dao.hero.aside.events.grantOpen', value: 'S2' },
      { id: 'milestone', icon: 'flag', labelKey: 'dao.hero.aside.events.milestone', value: '#5' },
    ],
  },
  {
    id: 'discussions',
    icon: 'discussions',
    layout: 'split',
    titleKey: 'dao.hero.slides.discussions.title',
    subtitleKey: 'dao.hero.slides.discussions.subtitle',
    descriptionKey: 'dao.hero.slides.discussions.description',
    asideKind: 'inlineStats',
    asideItems: [
      { id: 'hot', icon: 'message', labelKey: 'dao.metrics.discussions.hot', value: '128' },
      { id: 'marketplace', icon: 'store', labelKey: 'dao.metrics.discussions.marketplace', value: '86' },
      { id: 'community', icon: 'users', labelKey: 'dao.metrics.discussions.community', value: '54' },
      { id: 'members', icon: 'users', labelKey: 'dao.metrics.discussions.members', value: '2.8K', externalLink: 'discord' },
    ],
  },
  {
    id: 'proposals',
    icon: 'proposals',
    layout: 'split',
    titleKey: 'dao.hero.slides.proposals.title',
    subtitleKey: 'dao.hero.slides.proposals.subtitle',
    descriptionKey: 'dao.hero.slides.proposals.description',
    asideKind: 'governance',
    asideItems: [
      { id: 'active', icon: 'vote', labelKey: 'dao.hero.aside.proposals.activeVotes', value: '12' },
      { id: 'quorum', icon: 'check', labelKey: 'dao.hero.aside.proposals.quorum', value: '68%' },
      { id: 'window', icon: 'clock', labelKey: 'dao.hero.aside.proposals.voteWindow', value: '3d' },
    ],
  },
];
