import React from 'react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
  highlight: string;
  delay?: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  desc,
  highlight,
  delay = 0,
}) => (
  <RevealOnScroll variant="up" delay={delay} className="capability-grid__item">
    <div className="surface-card feature-card h-full">
      <div className="card-head card-head--md">
        <span className="card-head__icon" aria-hidden><Icon strokeWidth={2.25} /></span>
        <h3 className="card-head__title">{title}</h3>
      </div>
      <p className="text-[var(--color-text-secondary)] leading-relaxed grow">{desc}</p>
      <div className="feature-highlight">{highlight}</div>
    </div>
  </RevealOnScroll>
);

export default FeatureCard;
