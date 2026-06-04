import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAO_HERO_SLIDES } from '../mocks/daoHero.mock';
import DaoHeroBackground from './DaoHeroBackground';
import DaoHeroCarousel from './DaoHeroCarousel';

const SLIDE_COUNT = DAO_HERO_SLIDES.length;

const heroZone =
  'relative z-[1] flex w-full flex-col overflow-hidden bg-slate-900 box-border ' +
  'h-[calc(var(--dao-hero-body-height)+var(--dao-hero-pad-top)+var(--dao-hero-pad-bottom)+var(--dao-content-overlap))] ' +
  'px-[var(--dao-hero-pad-x)] pt-[var(--dao-hero-pad-top)] pb-[calc(var(--dao-hero-pad-bottom)+var(--dao-content-overlap))]';

const heroContent =
  'relative z-[1] grid h-full min-h-0 w-full flex-1 grid-cols-[var(--dao-hero-nav-size)_minmax(0,1fr)_var(--dao-hero-nav-size)] items-start gap-x-[var(--dao-hero-nav-gap)]';

const heroNavBtn =
  'flex h-[var(--dao-hero-nav-size)] w-[var(--dao-hero-nav-size)] shrink-0 cursor-pointer items-center justify-center self-center rounded-full ' +
  'border border-amber-300/65 bg-slate-900/92 text-amber-200 shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition-[border-color,color,background,box-shadow] ' +
  'hover:border-[var(--dao-amber)] hover:bg-slate-800/95 hover:text-white hover:shadow-[0_0_16px_rgba(245,158,11,0.25)] ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dao-amber-soft)]';

const DaoHeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const go = (delta: number) => {
    setSlideIndex((i) => (i + delta + SLIDE_COUNT) % SLIDE_COUNT);
  };

  return (
    <section className={heroZone} aria-label={t('dao.title')}>
      <DaoHeroBackground slideIndex={slideIndex} />

      <div className={heroContent}>
        <button
          type="button"
          className={`${heroNavBtn} justify-self-end`}
          data-side="left"
          aria-label={t('dao.hero.slidePrev')}
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex h-full min-h-0 min-w-0 flex-col justify-start self-stretch">
          <DaoHeroCarousel
            slides={DAO_HERO_SLIDES}
            slideIndex={slideIndex}
            onSlideIndexChange={setSlideIndex}
          />
        </div>

        <button
          type="button"
          className={`${heroNavBtn} justify-self-start`}
          data-side="right"
          aria-label={t('dao.hero.slideNext')}
          onClick={() => go(1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  );
};

export default DaoHeroSection;
