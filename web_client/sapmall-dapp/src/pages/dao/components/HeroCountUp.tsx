import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatHeroMetricNumeric, parseHeroMetricValue } from '../utils/parseHeroMetricValue';

const DURATION_MS = 1200;

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

type Props = {
  value: string;
  active: boolean;
  className?: string;
};

const HeroCountUp: React.FC<Props> = ({ value, active, className }) => {
  const parsed = useMemo(() => parseHeroMetricValue(value), [value]);
  const [display, setDisplay] = useState(() =>
    parsed.type === 'numeric'
      ? formatHeroMetricNumeric(parsed, 0)
      : parsed.text,
  );
  const [showLandBounce, setShowLandBounce] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (parsed.type === 'static') {
      setDisplay(parsed.text);
      setShowLandBounce(false);
      return;
    }

    if (!active) {
      setDisplay(formatHeroMetricNumeric(parsed, 0));
      setShowLandBounce(false);
      return;
    }

    const runNumeric = parsed;
    const startAt = performance.now();
    setShowLandBounce(false);

    const tick = (now: number) => {
      const progress = Math.min((now - startAt) / DURATION_MS, 1);
      const eased = easeOutCubic(progress);
      const current = runNumeric.target * eased;
      setDisplay(formatHeroMetricNumeric(runNumeric, current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      setDisplay(formatHeroMetricNumeric(runNumeric, runNumeric.target));
      setShowLandBounce(true);
      rafRef.current = null;
    };

    setDisplay(formatHeroMetricNumeric(runNumeric, 0));
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, parsed, value]);

  const mergedClass = [className, showLandBounce ? 'heroValueLand' : undefined].filter(Boolean).join(' ');

  return (
    <span className={mergedClass} aria-label={value}>
      {display}
    </span>
  );
};

export default HeroCountUp;
