import React from 'react';
import styles from './AdminRadioButtons.module.scss';

export interface AdminRadioOption {
  value: string;
  label: string;
  icon?: string;
}

interface AdminRadioButtonsProps {
  options: AdminRadioOption[];
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const AdminRadioButtons: React.FC<AdminRadioButtonsProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`${styles.radioGroup} ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`${styles.radioItem} ${active ? styles.active : ''}`}
            onClick={() => !disabled && onChange?.(option.value)}
            disabled={disabled}
          >
            {option.icon && <i className={option.icon}></i>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AdminRadioButtons;
