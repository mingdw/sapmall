import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HelpArticleDetail from './components/HelpArticleDetail';
import { getHelpArticleBySlug } from './mocks/helpArticles.mock';
import layoutStyles from './styles/help.pageLayout.module.scss';
import sharedStyles from './styles/help.shared.module.scss';
import articlePageStyles from './HelpArticlePage.module.scss';

const HelpArticlePage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, ready } = useTranslation();
  const article = getHelpArticleBySlug(slug);

  if (!ready) {
    return null;
  }

  if (!article) {
    return (
      <div className={layoutStyles.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} ${articlePageStyles.notFoundWrap}`}>
          <div className={articlePageStyles.notFound}>
            <p>{t('help.empty')}</p>
            <Link to="/help" className={articlePageStyles.notFoundLink}>
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
