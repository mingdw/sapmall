import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { isInternalPath } from '../../config/siteLinks';

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
    const openExternal = external || !isInternalPath(href);
    if (!openExternal && isInternalPath(href)) {
      return (
        <Link to={href} className={classes} onClick={onClick}>
          {content}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={classes}
        target={openExternal ? '_blank' : undefined}
        rel={openExternal ? 'noopener noreferrer' : undefined}
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
