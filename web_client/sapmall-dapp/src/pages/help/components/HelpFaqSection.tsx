import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleHelp, ChevronDown } from 'lucide-react';
import { HELP_FAQ_DISPLAY_LIMIT, sliceHelpFaqWindow } from '../constants/helpGuide';
import { HELP_FAQ_ITEMS } from '../mocks/helpFaq.mock';
import type { HelpCategoryFilter, HelpFaqItem } from '../types';
import HelpCardTitle from './HelpCardTitle';
import { articleSummaryKey } from '../utils/articleI18nKey';
import { faqArticleSlugFromId } from '../utils/faqArticleSlug';
import sharedStyles from '../styles/help.shared.module.scss';

type Props = {
  category: HelpCategoryFilter;
};

const faqHeadBtn =
  'flex w-full cursor-pointer items-start justify-between gap-2 border-none bg-transparent py-[0.7rem] text-left hover:[&_.faq-q]:text-[var(--help-primary)]';

const HelpFaqSection: React.FC<Props> = ({ category }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [faqOffset, setFaqOffset] = useState(0);

  const filtered = useMemo(() => {
    return category === 'all'
      ? HELP_FAQ_ITEMS
      : HELP_FAQ_ITEMS.filter((f) => f.category === category);
  }, [category]);

  useEffect(() => {
    setExpandedId(null);
    setFaqOffset(0);
  }, [category]);

  const hasMore = filtered.length > HELP_FAQ_DISPLAY_LIMIT;
  const visibleItems = useMemo(
    () => sliceHelpFaqWindow<HelpFaqItem>(filtered, faqOffset, HELP_FAQ_DISPLAY_LIMIT),
    [filtered, faqOffset],
  );

  const onRotateFaq = useCallback(() => {
    if (!hasMore) return;
    setFaqOffset((prev) => (prev + HELP_FAQ_DISPLAY_LIMIT) % filtered.length);
    setExpandedId(null);
  }, [filtered.length, hasMore]);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (filtered.length === 0) return null;

  return (
    <div className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard}`}>
      <section className="m-0" aria-labelledby="help-faq-title">
        <div className={sharedStyles.cardSectionHead}>
          <HelpCardTitle id="help-faq-title" icon={<CircleHelp size={18} strokeWidth={2.25} />}>
            {t('help.faqTitle')}
          </HelpCardTitle>
          {hasMore && (
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center rounded-md border-none bg-transparent p-1 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500/45"
              title={t('help.faqRotateHint')}
              aria-label={t('help.faqRotateHint')}
              onClick={onRotateFaq}
            >
              <span className="pointer-events-none inline-flex items-center gap-[0.28rem]" aria-hidden>
                <span className="block h-1.5 w-1.5 rounded-full bg-[var(--help-primary-muted)] transition-transform hover:scale-110" />
                <span className="block h-1.5 w-1.5 rounded-full bg-[var(--help-primary)] opacity-85 transition-transform hover:scale-110" />
                <span className="block h-1.5 w-1.5 rounded-full bg-[var(--help-amber-soft)] transition-transform hover:scale-110" />
              </span>
            </button>
          )}
        </div>
        <div className={sharedStyles.cardSectionBody}>
          <ul className="m-0 list-none p-0">
            {visibleItems.map((faq) => {
              const isOpen = expandedId === faq.id;
              const articleSlug = faqArticleSlugFromId(faq.id);
              return (
                <li key={faq.id} className="border-b border-[#eef1f5] last:border-b-0">
                  <button
                    type="button"
                    className={faqHeadBtn}
                    aria-expanded={isOpen}
                    onClick={() => toggle(faq.id)}
                  >
                    <span className="faq-q min-w-0 flex-1 text-[0.8125rem] font-medium leading-snug text-[var(--help-panel-text)] transition-colors">
                      {t(faq.questionKey)}
                    </span>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[var(--help-primary)]' : ''
                      }`}
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-3">
                      <Link
                        to={`/help/a/${articleSlug}`}
                        className="m-0 line-clamp-3 text-[0.6875rem] font-normal leading-relaxed text-slate-500 no-underline transition-colors hover:text-[var(--help-primary)]"
                        title={t(articleSummaryKey(articleSlug))}
                      >
                        {t(articleSummaryKey(articleSlug))}
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HelpFaqSection;
