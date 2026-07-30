import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import SEO from '../components/SEO';
import ContentShell from '../layout/ContentShell';
import DemoVideoRail from '../components/demo/DemoVideoRail';
import YoutubeThumbImg from '../components/demo/YoutubeThumbImg';
import { useDemoVideos } from '../hooks/useDemoVideos';
import {
  findDemoVideo,
  getDemoVideosConfigUrl,
  youtubeEmbedUrl,
  type DemoVideo,
} from '../content/demoVideos';

/** YouTube 风格：主预览区与横滑列表共用同一套封面；点击后再嵌入播放 */
const DemoPage: React.FC = () => {
  const { t } = useTranslation();
  const { catalog, loading, error } = useDemoVideos();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const active = activeId ? findDemoVideo(catalog.categories, activeId) : null;

  // 目录加载后默认选中第一支，主预览区立刻展示与列表一致的封面
  useEffect(() => {
    if (activeId || catalog.categories.length === 0) return;
    const first = catalog.categories[0]?.videos[0];
    if (first) setActiveId(first.id);
  }, [catalog, activeId]);

  const onSelect = (video: DemoVideo) => {
    setActiveId(video.id);
    setIsPlaying(false);
  };

  const onPlayFromRail = (video: DemoVideo) => {
    setActiveId(video.id);
    setIsPlaying(true);
  };

  return (
    <>
      <SEO title={t('demo.seoTitle')} description={t('demo.seoDesc')} />
      <ContentShell breadcrumbCurrent={t('demo.breadcrumb')}>
        <main className="demo-page" id="main-content">
          <div className="site-container demo-layout">
            {active && (
              <section className="demo-player" aria-label={t('demo.showcase')}>
                <div className="demo-player__stage">
                  {isPlaying ? (
                    <iframe
                      key={active.youtubeId}
                      className="demo-player__frame"
                      src={youtubeEmbedUrl(active.youtubeId, true)}
                      title={active.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button
                      type="button"
                      className="demo-player__poster"
                      onClick={() => setIsPlaying(true)}
                      aria-label={t('demo.playVideo', { title: active.title })}
                    >
                      <YoutubeThumbImg
                        youtubeId={active.youtubeId}
                        thumbUrl={active.thumbUrl}
                        alt={active.title}
                        className="demo-player__poster-img"
                        loading="eager"
                      />
                      <span className="demo-player__poster-play" aria-hidden>
                        <Play size={36} strokeWidth={1.5} fill="currentColor" />
                      </span>
                      {active.duration ? (
                        <span className="demo-player__poster-duration">{active.duration}</span>
                      ) : null}
                    </button>
                  )}
                </div>
                <div className="demo-player__caption">
                  <h2 className="demo-player__title">{active.title}</h2>
                  <p className="demo-player__meta">
                    {catalog.channelName}
                    {active.views ? (
                      <>
                        <span aria-hidden> · </span>
                        {active.views}
                      </>
                    ) : null}
                    {active.published ? (
                      <>
                        <span aria-hidden> · </span>
                        {active.published}
                      </>
                    ) : null}
                  </p>
                </div>
              </section>
            )}

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
                    activeId={activeId}
                    onPlay={onPlayFromRail}
                    onSelect={onSelect}
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
