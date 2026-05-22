import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HelpArticleDetail from './components/HelpArticleDetail';
import { getHelpArticleBySlug } from './mocks/helpArticles.mock';
import styles from './HelpPage.module.scss';

const HelpArticlePage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, ready } = useTranslation();
  const article = getHelpArticleBySlug(slug);

  if (!ready) {
    return null;
  }

  if (!article) {
    return (
      <div className={styles.contentZoneInnerFull}>
        <div className={`${styles.panelCard} ${styles.articleDetailCard}`}>
          <div className={styles.notFound}>
            <p>{t('help.empty')}</p>
            <Link to="/help" className={styles.articleDetailBreadcrumbLink}>
              {t('help.backToHelp')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <HelpArticleDetail article={article} />;
};

export default HelpArticlePage;
