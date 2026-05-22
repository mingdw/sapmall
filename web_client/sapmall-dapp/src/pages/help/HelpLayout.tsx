import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HelpHeroSection from './components/HelpHeroSection';
import { HELP_ARTICLES } from './mocks/helpArticles.mock';
import type { HelpCategoryFilter } from './types';
import type { HelpOutletContext } from './helpOutletContext';
import { readHelpTopicFromSearch } from './utils/helpTopicNavigation';
import { filterHelpArticles } from './utils/helpSearch';
import styles from './HelpPage.module.scss';

const HelpLayout: React.FC = () => {
  const { t, ready } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<HelpCategoryFilter>('all');

  useEffect(() => {
    const isHelpHome =
      location.pathname === '/help' || location.pathname.replace(/\/$/, '') === '/help';
    if (!isHelpHome) return;

    const topic = readHelpTopicFromSearch(location.search);
    if (topic) {
      setCategory(topic);
      setKeyword('');
    }
  }, [location.pathname, location.search]);

  const filteredArticles = useMemo(
    () => filterHelpArticles(HELP_ARTICLES, category, keyword, t),
    [category, keyword, t],
  );

  const onKeywordChange = useCallback(
    (value: string) => {
      setKeyword(value);
      if (value.trim()) {
        setCategory('all');
        if (location.pathname.includes('/a/')) {
          navigate('/help');
        }
      }
    },
    [location.pathname, navigate],
  );

  const onTopicSelect = useCallback((topic: HelpCategoryFilter) => {
    if (topic === 'all') {
      setCategory('all');
      setKeyword('');
      return;
    }
    setCategory((prev) => (prev === topic ? 'all' : topic));
    setKeyword('');
  }, []);

  const outletContext = useMemo<HelpOutletContext>(
    () => ({
      keyword,
      category,
      filteredArticles,
      onKeywordChange,
      onTopicSelect,
    }),
    [keyword, category, filteredArticles, onKeywordChange, onTopicSelect],
  );

  if (!ready) {
    return (
      <div className="p-6 text-sm text-slate-400" aria-busy="true">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      <div className={styles.pageShell}>
        <HelpHeroSection keyword={keyword} onKeywordChange={onKeywordChange} />

        <section
          id="help-content-zone"
          className={styles.contentZone}
          aria-label={t('help.guide.aria')}
        >
          <Outlet context={outletContext} />
        </section>
      </div>
    </div>
  );
};

export default HelpLayout;
