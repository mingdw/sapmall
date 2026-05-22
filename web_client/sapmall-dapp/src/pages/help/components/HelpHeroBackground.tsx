import React, { useCallback, useState } from 'react';
import {
  HELP_HERO_BACKGROUND,
  HELP_HERO_BACKGROUND_FALLBACK,
} from '../mocks/helpHero.mock';
import styles from '../HelpPage.module.scss';

const HelpHeroBackground: React.FC = () => {
  const [src, setSrc] = useState(HELP_HERO_BACKGROUND);

  const onError = useCallback(() => {
    setSrc((prev) => (prev === HELP_HERO_BACKGROUND_FALLBACK ? prev : HELP_HERO_BACKGROUND_FALLBACK));
  }, []);

  return (
    <div className={styles.heroBgStack} aria-hidden>
      <div className={styles.heroBgLayer} data-active="true">
        <img className={styles.heroBgImage} src={src} alt="" decoding="async" onError={onError} />
      </div>
      <div className={styles.heroBgMesh} />
      <div className={styles.heroBgScrim} />
    </div>
  );
};

export default HelpHeroBackground;
