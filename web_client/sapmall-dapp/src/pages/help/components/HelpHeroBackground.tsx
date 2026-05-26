import React from 'react';
import { HELP_HERO_BACKGROUND } from '../mocks/helpHero.mock';
import styles from './HelpHeroBackground.module.scss';

const HelpHeroBackground: React.FC = () => (
  <div className={styles.heroBgStack} aria-hidden>
    <div className={styles.heroBgLayer}>
      <img className={styles.heroBgImage} src={HELP_HERO_BACKGROUND} alt="" />
    </div>
    <div className={styles.heroBgMesh} />
    <div className={styles.heroBgScrim} />
  </div>
);

export default HelpHeroBackground;
