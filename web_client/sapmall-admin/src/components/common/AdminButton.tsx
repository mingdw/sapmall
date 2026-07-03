import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './AdminButton.module.scss';

interface AdminButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger' | 'warning' | 'query' | 'reset' | 'add' | 'delete' | 'export' | 'save' | 'next' | 'cancel' | 'draft' | 'prev' | 'edit' | 'view' | 'confirm' | 'back' | 'submit';
  size?: 'sm' | 'md' | 'xs';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const buttonClasses = [
    styles.adminBtn,
    styles[`adminBtn${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`adminBtn${size.charAt(0).toUpperCase() + size.slice(1)}`],
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

export default AdminButton;

