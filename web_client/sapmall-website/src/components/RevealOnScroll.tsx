import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'up' | 'fade' | 'left' | 'right';

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  /** stagger 延迟（毫秒） */
  delay?: number;
  /** 入场方向/样式 */
  variant?: RevealVariant;
};

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: 'reveal--up',
  fade: 'reveal--fade',
  left: 'reveal--left',
  right: 'reveal--right',
};

/** 滚动进入视口时的分区动效 */
const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  variant = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${VARIANT_CLASS[variant]} ${visible ? 'reveal--visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
