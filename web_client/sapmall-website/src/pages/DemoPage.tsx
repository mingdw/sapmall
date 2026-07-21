import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, FileText, Presentation } from 'lucide-react';
import SEO from '../components/SEO';
import SubpageChrome from '../layout/SubpageChrome';
import { siteLinks } from '../config/siteLinks';

/** YouTube 嵌入页：简练标题 + 16:9 播放器 + 次要入口 */
const DemoPage: React.FC = () => {
  const { t } = useTranslation();
  const embedSrc = `https://www.youtube.com/embed/${siteLinks.demoVideoId}?rel=0&modestbranding=1`;

  return (
    <>
      <SEO title={t('demo.seoTitle')} description={t('demo.seoDesc')} />
      <SubpageChrome>
        <main className="demo-page" id="main-content">
          <div className="site-container demo-layout">
            <header className="demo-header">
              <h1 className="demo-header__title">{t('demo.title')}</h1>
              <p className="demo-header__desc">{t('demo.subtitle')}</p>
            </header>

            <div className="demo-player">
              <div className="demo-player__stage">
                <iframe
                  className="demo-player__frame"
                  src={embedSrc}
                  title={t('demo.title')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            <div className="demo-meta">
              <a
                className="demo-meta__youtube"
                href={siteLinks.demoYoutube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={15} strokeWidth={1.75} aria-hidden />
                <span>{t('demo.openYoutube')}</span>
              </a>

              <div className="demo-actions">
                <Link to={siteLinks.presentation} className="demo-actions__link">
                  <Presentation size={15} strokeWidth={1.75} aria-hidden />
                  {t('demo.toPresentation')}
                </Link>
                <Link to={siteLinks.whitepaper} className="demo-actions__link">
                  <FileText size={15} strokeWidth={1.75} aria-hidden />
                  {t('demo.toWhitepaper')}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </SubpageChrome>
    </>
  );
};

export default DemoPage;
