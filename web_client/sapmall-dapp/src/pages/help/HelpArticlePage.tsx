import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HelpArticleDetail from './components/HelpArticleDetail';
import { getHelpArticleBySlug } from './mocks/helpArticles.mock';
import { HELP_LAYOUT } from './constants/helpLayoutClasses';
import sharedStyles from './styles/help.shared.module.scss';

const HelpArticlePage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, ready } = useTranslation();
  const article = getHelpArticleBySlug(slug);

  if (!ready) {
    return null;
  }

  if (!article) {
    return (
      <div className={HELP_LAYOUT.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} px-[1.15rem] py-[1.15rem] md:px-[1.35rem]`}>
          <div className="px-6 py-12 text-center text-slate-400">
            <p>{t('help.empty')}</p>
            <Link
              to="/help"
              className="mt-2 inline-block font-medium text-[var(--help-primary)] no-underline hover:underline"
            >
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
