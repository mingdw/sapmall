import React, { useCallback, useState } from 'react';
import { DAO_HERO_BACKGROUNDS, DAO_HERO_BACKGROUNDS_FALLBACK } from '../constants';
import { DAO_HERO_SLIDES } from '../mocks/daoHero.mock';
import type { DaoHeroDimension } from '../types';

type Props = {
  slideIndex: number;
};

const DaoHeroBackground: React.FC<Props> = ({ slideIndex }) => {
  const activeDimension = DAO_HERO_SLIDES[slideIndex]?.id ?? 'events';

  const [srcByDimension, setSrcByDimension] = useState<Record<DaoHeroDimension, string>>(() => ({
    discussions: DAO_HERO_BACKGROUNDS.discussions,
    proposals: DAO_HERO_BACKGROUNDS.proposals,
    events: DAO_HERO_BACKGROUNDS.events,
  }));

  const onImgError = useCallback((dimension: DaoHeroDimension) => {
    setSrcByDimension((prev) => {
      const fallback = DAO_HERO_BACKGROUNDS_FALLBACK[dimension];
      if (prev[dimension] === fallback) return prev;
      return { ...prev, [dimension]: fallback };
    });
  }, []);

  return (
    <div className="heroBgStack" data-dimension={activeDimension} aria-hidden>
      {DAO_HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="heroBgLayer"
          data-active={i === slideIndex ? 'true' : 'false'}
          data-dimension={slide.id}
        >
          <img
            className="heroBgImage"
            src={srcByDimension[slide.id]}
            alt=""
            decoding="async"
            onError={() => onImgError(slide.id)}
          />
        </div>
      ))}

      <div className="heroBgFx" data-dimension={activeDimension}>
        <div className="heroBgAurora" />
        <div className="heroBgBeam" />
        <span className="heroBgOrbA" />
        <span className="heroBgOrbB" />
        <span className="heroBgOrbC" />
        <div className="heroBgParticles" />
        <div className="heroBgRipple" />
      </div>

      <div className="heroBgMesh" />
      <div className="heroBgScrim" data-dimension={activeDimension} />
    </div>
  );
};

export default DaoHeroBackground;
