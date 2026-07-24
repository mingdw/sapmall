import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play } from 'lucide-react';
import SEO from '../components/SEO';
import ContentShell from '../layout/ContentShell';
import SlideCanvas from '../components/presentation/SlideCanvas';
import SlideRenderer from '../components/presentation/SlideRenderer';
import { getPresentationSlides, getSlideTitleKey } from '../content/presentationSlides';

/** 自动播放间隔（毫秒） */
const AUTOPLAY_MS = 5000;

const PresentationPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const slides = useMemo(() => getPresentationSlides(), []);
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [index]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(slides.length - 1, i + 1));
  }, [slides.length]);

  /** 自动播放：到末页后停止并关闭自动播放 */
  const goNextAuto = useCallback(() => {
    setIndex((i) => {
      if (i >= slides.length - 1) {
        setAutoplay(false);
        return i;
      }
      return i + 1;
    });
  }, [slides.length]);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((v) => {
      const next = !v;
      // 若在末页开启，则从首页开始播
      if (next && indexRef.current >= slides.length - 1) {
        setIndex(0);
      }
      return next;
    });
  }, [slides.length]);

  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = window.setInterval(goNextAuto, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, goNextAuto, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 输入框内不拦截
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(slides.length - 1);
      } else if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
        setAutoplay(false);
      } else if (e.key === 'F5') {
        e.preventDefault();
        setFullscreen(true);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        toggleAutoplay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, slides.length, fullscreen, autoplay, toggleAutoplay]);

  // 退出全屏时保留页码，自动播放可继续（若用户希望退出全屏也停播，可取消下行）
  useEffect(() => {
    if (!fullscreen) return undefined;
    // 全屏时隐藏页面滚动
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

  const slide = slides[index];
  const slideTitle = t(getSlideTitleKey(slide.id));
  const atStart = index === 0;
  const atEnd = index === slides.length - 1;

  const toolbar = (
    <div
      className={`ppt-toolbar ${fullscreen ? 'ppt-toolbar--fs' : ''}`}
      role="toolbar"
      aria-label={t('presentation.toolbar')}
    >
      <button type="button" className="ppt-nav-btn" onClick={goPrev} disabled={atStart}>
        <ChevronLeft size={18} />
        <span>{t('presentation.prev')}</span>
      </button>

      <div className="ppt-toolbar__center">
        <button
          type="button"
          className={`ppt-icon-btn ${autoplay ? 'ppt-icon-btn--active' : ''}`}
          onClick={toggleAutoplay}
          aria-pressed={autoplay}
          aria-label={autoplay ? t('presentation.stopAutoplay') : t('presentation.startAutoplay')}
          title={t('presentation.autoplayHint')}
        >
          {autoplay ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="ppt-toolbar__status">
          {slideTitle} · {index + 1} / {slides.length}
          {autoplay ? ` · ${t('presentation.autoplaying')}` : ''}
        </span>
      </div>

      <div className="ppt-toolbar__actions">
        {!fullscreen ? (
          <button
            type="button"
            className="ppt-icon-btn"
            onClick={() => setFullscreen(true)}
            aria-label={t('presentation.fullscreen')}
            title="F5"
          >
            <Maximize2 size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="ppt-icon-btn"
            onClick={() => {
              setFullscreen(false);
              setAutoplay(false);
            }}
            aria-label={t('presentation.exitFullscreen')}
          >
            <Minimize2 size={16} />
          </button>
        )}
        <button
          type="button"
          className="ppt-nav-btn ppt-nav-btn--primary"
          onClick={goNext}
          disabled={atEnd}
        >
          <span>{t('presentation.next')}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={t('presentation.seoTitle')} description={t('presentation.seoDesc')} />
      <ContentShell
        breadcrumbCurrent={t('presentation.breadcrumb')}
        chromeHidden={fullscreen}
        showFooter={false}
        className={fullscreen ? 'ppt-page--fullscreen' : ''}
      >
        <main className={`ppt-page ${fullscreen ? 'ppt-page--fs' : ''}`} id="main-content">
          <div className={`site-container ppt-workspace ${fullscreen ? 'ppt-workspace--fs' : ''}`}>
            {!fullscreen && (
              <aside className="ppt-filmstrip" aria-label={t('presentation.thumbnails')}>
                <p className="ppt-filmstrip__label">{t('presentation.thumbnails')}</p>
                <div className="ppt-filmstrip__list">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      ref={(el) => {
                        thumbRefs.current[i] = el;
                      }}
                      className={`ppt-thumb ${i === index ? 'ppt-thumb--active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-current={i === index ? 'true' : undefined}
                      aria-label={`${t('presentation.slide')} ${i + 1}: ${t(getSlideTitleKey(s.id))}`}
                    >
                      <span className="ppt-thumb__num">{i + 1}</span>
                      <span className="ppt-thumb__preview">
                        <SlideCanvas compact>
                          <SlideRenderer slide={s} compact />
                        </SlideCanvas>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            <div className="ppt-main">
              <div className={`ppt-stage ${fullscreen ? 'ppt-stage--fs' : ''}`}>
                {fullscreen && (
                  <>
                    <button
                      type="button"
                      className="ppt-fs-side ppt-fs-side--prev"
                      onClick={goPrev}
                      disabled={atStart}
                      aria-label={t('presentation.prev')}
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      type="button"
                      className="ppt-fs-side ppt-fs-side--next"
                      onClick={goNext}
                      disabled={atEnd}
                      aria-label={t('presentation.next')}
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
                <article
                  key={`${slide.id}-${i18n.language}`}
                  className="ppt-slide ppt-slide--native"
                  aria-roledescription="slide"
                  aria-label={`${slideTitle} (${index + 1}/${slides.length})`}
                >
                  <SlideCanvas page={index + 1} total={slides.length}>
                    <SlideRenderer slide={slide} />
                  </SlideCanvas>
                </article>
              </div>

              {toolbar}
            </div>
          </div>
        </main>
      </ContentShell>
    </>
  );
};

export default PresentationPage;
