import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ContentShell from '../layout/ContentShell';
import DemoVideoRail from '../components/demo/DemoVideoRail';
import { useDemoVideos } from '../hooks/useDemoVideos';
import { getDemoVideosConfigUrl, youtubeWatchUrl, type DemoVideo } from '../content/demoVideos';

/** 演示页：仅展示分类视频列表，点击封面在 YouTube 打开 */
const DemoPage: React.FC = () => {
  const { t } = useTranslation();
  const { catalog, loading, error } = useDemoVideos();

  const openVideo = (video: DemoVideo) => {
    window.open(youtubeWatchUrl(video.youtubeId), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO title={t('demo.seoTitle')} description={t('demo.seoDesc')} />
      <ContentShell breadcrumbCurrent={t('demo.breadcrumb')}>
        <main className="demo-page" id="main-content">
          <div className="site-container demo-layout">
            {loading && (
              <p className="demo-status" role="status">
                {t('demo.loading')}
              </p>
            )}

            {!loading && error && (
              <p className="demo-status demo-status--error" role="alert">
                {t('demo.loadError')}
                <span className="demo-status__hint">{getDemoVideosConfigUrl()}</span>
              </p>
            )}

            {!loading && !error && catalog.categories.length === 0 && (
              <p className="demo-status" role="status">
                {t('demo.empty')}
              </p>
            )}

            {!loading && catalog.categories.length > 0 && (
              <div className="demo-sections">
                {catalog.categories.map((category) => (
                  <DemoVideoRail
                    key={category.id}
                    category={category}
                    channelName={catalog.channelName}
                    onPlay={openVideo}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </ContentShell>
    </>
  );
};

export default DemoPage;
