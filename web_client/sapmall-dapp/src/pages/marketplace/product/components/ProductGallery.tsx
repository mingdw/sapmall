import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import styles from '../ProductDetailPage.module.scss';

const LENS_RATIO = 0.32;
const LENS_MIN = 72;
const LENS_MAX = 130;

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

interface PointerSnapshot {
  clientX: number;
  clientY: number;
}

const DESKTOP_ZOOM_MQ = '(min-width: 1025px)';

function getInitialIsDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DESKTOP_ZOOM_MQ).matches;
}

function calcLensSize(mainWidth: number): number {
  const size = Math.round(mainWidth * LENS_RATIO);
  return Math.max(LENS_MIN, Math.min(LENS_MAX, size));
}

function ThumbNavChevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className={styles.thumbNavIcon}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d={direction === 'prev' ? 'M8.5 2.5L4.5 7l4 4.5' : 'M5.5 2.5L9.5 7l-4 4.5'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt }) => {
  const list = images.length ? images : ['https://via.placeholder.com/500'];
  const [current, setCurrent] = useState(0);
  const [isDesktop, setIsDesktop] = useState(getInitialIsDesktop);
  const [zoomHover, setZoomHover] = useState(false);
  const [lensSize, setLensSize] = useState(100);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomImgStyle, setZoomImgStyle] = useState<React.CSSProperties>({});
  const [panelSize, setPanelSize] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastPointerRef = useRef<PointerSnapshot>({ clientX: 0, clientY: 0 });

  const src = list[current];
  const zoomOn = isDesktop && zoomHover;

  const hideZoom = useCallback(() => {
    setZoomHover(false);
  }, []);

  const showZoom = useCallback(() => {
    setZoomHover(true);
  }, []);

  const isPointerInsideMain = useCallback((clientX: number, clientY: number) => {
    if (!mainRef.current) return false;
    const rect = mainRef.current.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_ZOOM_MQ);
    const apply = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const applyZoomAtPointer = useCallback((clientX: number, clientY: number) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const lens = calcLensSize(rect.width);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const half = lens / 2;
    const lx = Math.max(0, Math.min(x - half, rect.width - lens));
    const ly = Math.max(0, Math.min(y - half, rect.height - lens));
    const zoomRatio = rect.width / lens;

    setLensSize(lens);
    setLensPos({ x: lx, y: ly });
    setPanelSize(rect.width);
    setZoomImgStyle({
      position: 'absolute',
      width: rect.width * zoomRatio,
      height: rect.height * zoomRatio,
      maxWidth: 'none',
      left: -lx * zoomRatio,
      top: -ly * zoomRatio,
    });
  }, []);

  const syncMainMetrics = useCallback(() => {
    if (!mainRef.current) return;
    const w = mainRef.current.offsetWidth;
    if (w > 0) setPanelSize(w);
  }, []);

  useEffect(() => {
    if (!isDesktop || !mainRef.current) return;
    syncMainMetrics();
    const ro = new ResizeObserver(() => {
      syncMainMetrics();
      if (zoomHover) {
        applyZoomAtPointer(
          lastPointerRef.current.clientX,
          lastPointerRef.current.clientY
        );
      }
    });
    ro.observe(mainRef.current);
    return () => ro.disconnect();
  }, [isDesktop, zoomHover, applyZoomAtPointer, syncMainMetrics]);

  useEffect(() => {
    if (!isDesktop || !zoomHover) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerInsideMain(e.clientX, e.clientY)) {
        hideZoom();
        return;
      }
      lastPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
      applyZoomAtPointer(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isDesktop, zoomHover, hideZoom, isPointerInsideMain, applyZoomAtPointer]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!zoomHover) return;
    lastPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
    applyZoomAtPointer(e.clientX, e.clientY);
  };

  const onMouseEnter = (e: React.MouseEvent) => {
    if (!isDesktop) return;
    showZoom();
    syncMainMetrics();
    lastPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
    applyZoomAtPointer(e.clientX, e.clientY);
  };

  const onMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget;
    if (related instanceof Node && mainRef.current?.contains(related)) {
      return;
    }
    hideZoom();
  };

  const onMainImageLoad = useCallback(() => {
    syncMainMetrics();
    if (zoomHover) {
      applyZoomAtPointer(
        lastPointerRef.current.clientX,
        lastPointerRef.current.clientY
      );
    }
  }, [applyZoomAtPointer, syncMainMetrics, zoomHover]);

  useEffect(() => {
    setCurrent(0);
  }, [images.join('|')]);

  const selectImage = (idx: number) => {
    setCurrent(idx);
  };

  return (
    <div className={styles.galleryWrap}>
      <div className={styles.galleryStage}>
        <div
          ref={mainRef}
          className={styles.galleryMain}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          {isDesktop ? (
            <img
              key={src}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={onMainImageLoad}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              className={styles.galleryPreviewImg}
              preview={{ mask: <SearchOutlined /> }}
              draggable={false}
            />
          )}

          {zoomOn && (
            <div
              className={styles.zoomLens}
              style={{
                width: lensSize,
                height: lensSize,
                transform: `translate3d(${lensPos.x}px, ${lensPos.y}px, 0)`,
              }}
            />
          )}

          {isDesktop && (
            <span className={styles.zoomHint} aria-hidden>
              <SearchOutlined />
            </span>
          )}

        </div>

        {isDesktop && zoomOn && panelSize > 0 && (
          <div
            className={styles.zoomPanelSlot}
            style={{ width: panelSize, height: panelSize }}
            aria-hidden={false}
          >
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              style={zoomImgStyle}
              onLoad={onMainImageLoad}
            />
          </div>
        )}
      </div>

      <div className={styles.thumbRow}>
        <button
          type="button"
          className={styles.thumbNavBtn}
          aria-label="上一张"
          onClick={() => selectImage(current <= 0 ? list.length - 1 : current - 1)}
        >
          <ThumbNavChevron direction="prev" />
        </button>
        <div className={styles.thumbScroll}>
          {list.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              className={`${styles.thumb} ${idx === current ? styles.thumbActive : ''}`}
              aria-label={`查看图片 ${idx + 1}`}
              aria-current={idx === current ? 'true' : undefined}
              onClick={() => selectImage(idx)}
            >
              <img src={img} alt="" draggable={false} />
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.thumbNavBtn}
          aria-label="下一张"
          onClick={() => selectImage(current >= list.length - 1 ? 0 : current + 1)}
        >
          <ThumbNavChevron direction="next" />
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
