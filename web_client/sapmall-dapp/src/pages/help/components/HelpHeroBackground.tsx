import React from 'react';
import { HELP_HERO_BACKGROUND } from '../mocks/helpHero.mock';
import { HELP_HERO_SCRIM_STYLE } from '../constants/helpVisualStyles';

const HelpHeroBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
    <div className="absolute inset-0 overflow-hidden opacity-100">
      <img
        className="block h-full w-full scale-[1.04] object-cover object-[center_30%] saturate-[0.85] hue-rotate-[4deg]"
        src={HELP_HERO_BACKGROUND}
        alt=""
      />
    </div>
    <div
      className="absolute inset-0 opacity-[0.32] bg-[length:44px_44px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.45)_0%,transparent_72%)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      }}
    />
    <div className="absolute inset-0" style={HELP_HERO_SCRIM_STYLE} />
  </div>
);

export default HelpHeroBackground;
