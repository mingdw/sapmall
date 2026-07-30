import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MoreVertical, Play } from 'lucide-react';
import YoutubeThumbImg from './YoutubeThumbImg';
import {
  youtubeWatchUrl,
  type DemoVideo,
  type DemoVideoCategory,
} from '../../content/demoVideos';

type DemoVideoRailProps = {
  category: DemoVideoCategory;
  channelName: string;
  activeId: string | null;
  /** 点击封面：选中并立即播放 */
  onPlay: (video: DemoVideo) => void;
  /** 点击标题：仅选中，主预览区展示同款封面 */
  onSelect?: (video: DemoVideo) => void;
};

/**
 * 单分类横滑：隐藏滚动条，右侧圆形箭头翻页；分类间分割线由外层控制
 */
const DemoVideoRail: React.FC<DemoVideoRailProps> = ({
  category,
  channelName,
  activeId,
  onPlay,
  onSelect,
}) => {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      setCanScrollNext(false);
      return;
    }
    const remain = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setCanScrollNext(remain > 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    updateScrollState();
    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);
      ro?.disconnect();
    };
  }, [updateScrollState, category.videos]);

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.78, 260);
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const playAll = () => {
    const first = category.videos[0];
    if (first) onPlay(first);
  };

  const openExternal = (video: DemoVideo) => {
    window.open(youtubeWatchUrl(video.youtubeId), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="demo-section" aria-labelledby={`demo-cat-${category.id}`}>
      <header className="demo-rail-header">
        <h2 className="demo-rail-header__title" id={`demo-cat-${category.id}`}>
          {category.title}
        </h2>
        <button type="button" className="demo-play-all" onClick={playAll}>
          <Play size={15} strokeWidth={2} fill="currentColor" aria-hidden />
          <span>{t('demo.playAll')}</span>
        </button>
      </header>

      <div className="demo-rail-wrap">
        <div className="demo-rail" ref={scrollerRef} role="list">
          {category.videos.map((video) => {
            const isActive = video.id === activeId;
            const cardKey = `${category.id}-${video.id}`;
            return (
              <article
                key={cardKey}
                className={`demo-card ${isActive ? 'demo-card--active' : ''}`}
                role="listitem"
              >
                <button
                  type="button"
                  className="demo-card__thumb-btn"
                  onClick={() => onPlay(video)}
                  aria-label={t('demo.playVideo', { title: video.title })}
                  aria-pressed={isActive}
                >
                  <span className="demo-card__thumb">
                    <YoutubeThumbImg
                      youtubeId={video.youtubeId}
                      thumbUrl={video.thumbUrl}
                      className="demo-card__img"
                    />
                    {video.duration ? (
                      <span className="demo-card__duration">{video.duration}</span>
                    ) : null}
                    <span className="demo-card__play" aria-hidden>
                      <Play size={28} strokeWidth={1.5} fill="currentColor" />
                    </span>
                  </span>
                </button>

                <div className="demo-card__body">
                  <div className="demo-card__text">
                    <h3 className="demo-card__title">
                      <button type="button" onClick={() => (onSelect ?? onPlay)(video)}>
                        {video.title}
                      </button>
                    </h3>
                    <p className="demo-card__channel">{channelName}</p>
                    {(video.views || video.published) && (
                      <p className="demo-card__stats">
                        {video.views}
                        {video.views && video.published ? <span aria-hidden> · </span> : null}
                        {video.published}
                      </p>
                    )}
                    {video.hasCc ? (
                      <span className="demo-card__cc" title={t('demo.cc')}>
                        CC
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="demo-card__more"
                    aria-label={t('demo.openYoutube')}
                    onClick={() => openExternal(video)}
                  >
                    <MoreVertical size={18} strokeWidth={1.75} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {canScrollNext ? (
          <button
            type="button"
            className="demo-rail-next"
            onClick={scrollNext}
            aria-label={t('demo.scrollNext')}
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default DemoVideoRail;
