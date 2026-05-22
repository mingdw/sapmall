/** Hero 快速搜索 — labelKey 对应 help.hotTags.* */
export const HELP_HOT_SEARCH_IDS = ['payFail', 'deposit', 'wallet', 'refund', 'fee'] as const;

export type HelpHotSearchId = (typeof HELP_HOT_SEARCH_IDS)[number];
