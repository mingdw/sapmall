import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import HelpHeroBackground from './HelpHeroBackground';
import { HELP_HOT_SEARCH_IDS } from '../mocks/helpHotSearch.mock';

type Props = {
  keyword: string;
  onKeywordChange: (value: string) => void;
};

const hotTagBase =
  'rounded-full border border-violet-400/30 bg-white/5 px-[0.65rem] py-[0.28rem] text-[0.6875rem] font-medium leading-tight text-slate-300 transition-colors hover:border-violet-400/50 hover:bg-violet-500/15 hover:text-violet-200';

const hotTagActive =
  'border-violet-400/60 bg-violet-500/25 font-semibold text-violet-100';

const HelpHeroSection: React.FC<Props> = ({ keyword, onKeywordChange }) => {
  const { t } = useTranslation();

  const hotLabel = useCallback((id: string) => t(`help.hotTags.${id}`), [t]);

  const onHotSearch = (id: string) => {
    const label = hotLabel(id);
    onKeywordChange(keyword.trim() === label ? '' : label);
  };

  return (
    <section
      className="relative z-[1] flex w-full min-h-[calc(var(--help-hero-min-height)+var(--help-overlap))] flex-col overflow-hidden bg-slate-900 px-[var(--help-hero-pad-x)] pb-[calc(2.25rem+var(--help-overlap))] pt-8 box-border"
      aria-label={t('help.title')}
    >
      <HelpHeroBackground />

      <div className="relative z-[1] mx-auto flex min-h-[var(--help-hero-min-height)] w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-0 pt-3 text-center">
        <h1 className="m-0 mb-1 w-full text-[clamp(1.65rem,3.5vw,2.15rem)] font-bold leading-tight tracking-tight text-slate-50 [text-shadow:0_0_24px_rgba(139,92,246,0.25)]">
          {t('help.title')}
        </h1>

        <div className="flex w-full flex-col items-stretch gap-[0.65rem] text-left">
          <label className="flex w-full cursor-text items-center gap-3 rounded-xl border border-amber-400/35 bg-slate-900/75 px-[1.1rem] py-3 shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[border-color,box-shadow] focus-within:border-[var(--help-amber)] focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.18),0_8px_28px_rgba(0,0,0,0.4)]">
            <Search className="h-5 w-5 shrink-0 text-[var(--help-amber-soft)]" aria-hidden />
            <input
              type="search"
              className="min-w-0 flex-1 border-none bg-transparent text-[0.9375rem] text-slate-100 outline-none placeholder:text-slate-500"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder={t('help.searchPlaceholder')}
              aria-label={t('help.searchAria')}
            />
          </label>

          <div
            className="flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-2 text-left"
            role="group"
            aria-label={t('help.hotSearches')}
          >
            <span className="m-0 mr-1 shrink-0 p-0 text-[0.6875rem] font-semibold leading-tight text-slate-500 whitespace-nowrap">
              {t('help.hotSearches')}
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-[0.35rem]">
              {HELP_HOT_SEARCH_IDS.map((id) => {
                const label = hotLabel(id);
                const isActive = keyword.trim() === label;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`${hotTagBase} ${isActive ? hotTagActive : ''}`}
                    data-active={isActive}
                    onClick={() => onHotSearch(id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpHeroSection;
