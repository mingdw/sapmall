import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAO_HERO_SLIDES } from '../mocks/daoHero.mock';
import DaoHeroBackground from './DaoHeroBackground';
import DaoHeroCarousel from './DaoHeroCarousel';
import styles from '../DaoPage.module.scss';

const SLIDE_COUNT = DAO_HERO_SLIDES.length;

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
    <section className={styles.heroZone} aria-label={t('dao.title')}>
      <DaoHeroBackground slideIndex={slideIndex} />

      <div className={styles.heroContent}>
        <button
          type="button"
          className={styles.heroNavBtn}
          data-side="left"
          aria-label={t('dao.hero.slidePrev')}
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className={styles.heroContentMain}>
          <DaoHeroCarousel
            slides={DAO_HERO_SLIDES}
            slideIndex={slideIndex}
            onSlideIndexChange={setSlideIndex}
          />
        </div>

        <button
          type="button"
          className={styles.heroNavBtn}
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
