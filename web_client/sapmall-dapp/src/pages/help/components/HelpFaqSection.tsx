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
import styles from './HelpFaqSection.module.scss';

type Props = {
  category: HelpCategoryFilter;
  variant?: 'main' | 'sidebar';
};

const HelpFaqSection: React.FC<Props> = ({ category, variant = 'main' }) => {
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

  const titleRow = () => (
    <div className={sharedStyles.cardSectionHead}>
      <HelpCardTitle id="help-faq-title" icon={<CircleHelp size={18} strokeWidth={2.25} />}>
        {t('help.faqTitle')}
      </HelpCardTitle>
      {hasMore && (
        <button
          type="button"
          className={styles.faqMoreDotsBtn}
          title={t('help.faqRotateHint')}
          aria-label={t('help.faqRotateHint')}
          onClick={onRotateFaq}
        >
          <span className={styles.faqMoreDots} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      )}
    </div>
  );

  const list = (
    <ul className={styles.faqRows}>
      {visibleItems.map((faq) => {
        const isOpen = expandedId === faq.id;
        const articleSlug = faqArticleSlugFromId(faq.id);
        return (
          <li key={faq.id} className={styles.faqRowItem}>
            <button
              type="button"
              className={styles.faqRowHead}
              aria-expanded={isOpen}
              onClick={() => toggle(faq.id)}
            >
              <span className={styles.faqRowQuestion}>{t(faq.questionKey)}</span>
              <ChevronDown
                className={styles.faqRowChevron}
                data-expanded={isOpen}
                size={16}
                strokeWidth={2.25}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className={styles.faqRowAnswer}>
                <Link
                  to={`/help/a/${articleSlug}`}
                  className={styles.faqRowAnswerLink}
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
  );

  if (variant === 'sidebar') {
    return (
      <div className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard}`}>
        <section className={styles.faqSidebar} aria-labelledby="help-faq-title">
          {titleRow()}
          <div className={sharedStyles.cardSectionBody}>{list}</div>
        </section>
      </div>
    );
  }

  return (
    <section aria-labelledby="help-faq-title">
      {titleRow()}
      <div className={sharedStyles.cardSectionBody}>
        <p className={styles.panelHint}>{t('help.faqHint')}</p>
        {list}
      </div>
    </section>
  );
};

export default HelpFaqSection;
