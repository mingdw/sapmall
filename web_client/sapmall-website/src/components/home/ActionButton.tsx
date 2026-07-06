import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type ActionButtonProps = {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'primary' | 'outline-accent' | 'outline-muted';
  size?: 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  href,
  external,
  disabled,
  type = 'button',
}) => {
  const iconSize = size === 'lg' ? 18 : 16;
  const classes = `action-btn action-btn--${variant} action-btn--${size} ${className}`.trim();

  const content = (
    <>
      {Icon ? (
        <span className="action-btn__icon" aria-hidden>
          <Icon size={iconSize} strokeWidth={1.75} />
        </span>
      ) : null}
      <span className="action-btn__label">{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
};

export default ActionButton;
