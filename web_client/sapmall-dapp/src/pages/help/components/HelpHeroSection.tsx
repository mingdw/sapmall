import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import HelpHeroBackground from './HelpHeroBackground';
import { HELP_HOT_SEARCH_IDS } from '../mocks/helpHotSearch.mock';
import styles from '../HelpPage.module.scss';

type Props = {
  keyword: string;
  onKeywordChange: (value: string) => void;
};

const HelpHeroSection: React.FC<Props> = ({ keyword, onKeywordChange }) => {
  const { t } = useTranslation();

  const hotLabel = useCallback((id: string) => t(`help.hotTags.${id}`), [t]);

  const onHotSearch = (id: string) => {
    const label = hotLabel(id);
    onKeywordChange(keyword.trim() === label ? '' : label);
  };

  return (
    <section className={styles.heroZone} aria-label={t('help.title')}>
      <HelpHeroBackground />

      <div className={`${styles.heroContent} ${styles.heroContentCenter}`}>
        <h1 className={styles.heroTitle}>{t('help.title')}</h1>

        <div className={styles.heroSearchBlock}>
          <label className={styles.searchCard}>
            <Search className={styles.searchIcon} aria-hidden />
            <input
              type="search"
              className={styles.searchInput}
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder={t('help.searchPlaceholder')}
              aria-label={t('help.searchAria')}
            />
          </label>

          <div className={styles.hotTagsWrap} role="group" aria-label={t('help.hotSearches')}>
            <span className={styles.hotTagsLabel}>{t('help.hotSearches')}</span>
            <div className={styles.hotTagsList}>
              {HELP_HOT_SEARCH_IDS.map((id) => {
                const label = hotLabel(id);
                const isActive = keyword.trim() === label;
                return (
                  <button
                    key={id}
                    type="button"
                    className={styles.hotTag}
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
