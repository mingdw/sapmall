import type { DaoDiscussionTopicTagFilter } from './discussionTopicTags';

const TAG_BTN_BASE =
  'inline-flex items-center rounded-md border px-[0.55rem] py-[0.28rem] text-[0.6875rem] font-semibold leading-[1.3] ' +
  'cursor-pointer transition-[border-color,background,color,box-shadow,filter]';

type TagVariant = { idle: string; active: string };

const TAG_VARIANTS: Record<string, TagVariant> = {
  all: {
    idle: 'border-slate-200 bg-slate-50 text-slate-600',
    active: 'border-slate-300 bg-white text-slate-900 shadow-sm',
  },
  pinned: {
    idle: 'border-amber-200 bg-amber-50 text-amber-800',
    active: 'border-amber-500 bg-amber-100 shadow-[0_0_0_1px_rgba(245,158,11,0.35)]',
  },
  hot: {
    idle: 'border-rose-200 bg-rose-50 text-rose-800',
    active: 'border-rose-400 bg-rose-100 shadow-[0_0_0_1px_rgba(251,113,133,0.35)]',
  },
  trendingWeek: {
    idle: 'border-violet-200 bg-violet-50 text-violet-800',
    active: 'border-violet-400 bg-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.35)]',
  },
  featured: {
    idle: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    active: 'border-emerald-400 bg-emerald-100 shadow-[0_0_0_1px_rgba(52,211,153,0.35)]',
  },
  new: {
    idle: 'border-sky-200 bg-sky-50 text-sky-700',
    active: 'border-sky-400 bg-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]',
  },
  urgent: {
    idle: 'border-red-200 bg-red-50 text-red-800',
    active: 'border-red-400 bg-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.35)]',
  },
  official: {
    idle: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    active: 'border-indigo-400 bg-indigo-100 shadow-[0_0_0_1px_rgba(129,140,248,0.35)]',
  },
  governance: {
    idle: 'border-blue-200 bg-blue-50 text-blue-800',
    active: 'border-blue-400 bg-blue-100 shadow-[0_0_0_1px_rgba(96,165,250,0.35)]',
  },
  poll: {
    idle: 'border-orange-200 bg-orange-50 text-orange-700',
    active: 'border-orange-400 bg-orange-100 shadow-[0_0_0_1px_rgba(251,146,60,0.35)]',
  },
  bounty: {
    idle: 'border-lime-200 bg-lime-50 text-lime-800',
    active: 'border-lime-400 bg-lime-100 shadow-[0_0_0_1px_rgba(163,230,53,0.35)]',
  },
  qa: {
    idle: 'border-teal-200 bg-teal-50 text-teal-800',
    active: 'border-teal-400 bg-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]',
  },
  feedback: {
    idle: 'border-pink-200 bg-pink-50 text-pink-800',
    active: 'border-pink-400 bg-pink-100 shadow-[0_0_0_1px_rgba(244,114,182,0.35)]',
  },
  resolved: {
    idle: 'border-gray-200 bg-gray-50 text-gray-600',
    active: 'border-gray-400 bg-gray-100 shadow-[0_0_0_1px_rgba(156,163,175,0.35)]',
  },
};

export function getDaoTopicTagFilterClass(
  tag: DaoDiscussionTopicTagFilter,
  isActive: boolean,
): string {
  const key = tag === 'all' ? 'all' : tag;
  const variant = TAG_VARIANTS[key] ?? TAG_VARIANTS.all;
  const state = isActive ? variant.active : `${variant.idle} hover:brightness-[0.98] hover:border-slate-300`;
  return `${TAG_BTN_BASE} ${state}`;
}
