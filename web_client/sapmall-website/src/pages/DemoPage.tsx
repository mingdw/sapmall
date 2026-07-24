import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ContentShell from '../layout/ContentShell';
import DemoVideoRail from '../components/demo/DemoVideoRail';
import {
  DEMO_CHANNEL_NAME,
  demoVideoCategories,
  findDemoVideo,
  youtubeEmbedUrl,
  type DemoVideo,
} from '../content/demoVideos';

/** YouTube 风格：多分类横滑列表（无横向滚动条，箭头翻页，分类间分割线） */
const DemoPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? findDemoVideo(activeId) : null;

  const onPlay = (video: DemoVideo) => {
    setActiveId(video.id);
  };

  return (
    <>
      <SEO title={t('demo.seoTitle')} description={t('demo.seoDesc')} />
      <ContentShell breadcrumbCurrent={t('demo.breadcrumb')}>
        <main className="demo-page" id="main-content">
          <div className="site-container demo-layout">
            {active && (
              <div className="demo-player">
                <div className="demo-player__stage">
                  <iframe
                    className="demo-player__frame"
                    src={youtubeEmbedUrl(active.youtubeId)}
                    title={t(active.titleKey)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="demo-player__caption">
                  <h2 className="demo-player__title">{t(active.titleKey)}</h2>
                  <p className="demo-player__meta">
                    {DEMO_CHANNEL_NAME}
                    <span aria-hidden> · </span>
                    {t(active.viewsKey)}
                    <span aria-hidden> · </span>
                    {t(active.publishedKey)}
                  </p>
                </div>
              </div>
            )}

            <div className="demo-sections">
              {demoVideoCategories.map((category) => (
                <DemoVideoRail
                  key={category.id}
                  category={category}
                  activeId={activeId}
                  onPlay={onPlay}
                />
              ))}
            </div>
          </div>
        </main>
      </ContentShell>
    </>
  );
};

export default DemoPage;
