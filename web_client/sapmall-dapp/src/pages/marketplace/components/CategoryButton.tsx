import React, { useState } from 'react';
import styles from './CategoryButton.module.scss';
import {
  categoryPlainIconStyle,
  resolveCategoryIconTheme,
  type CategoryIconTheme,
  type CategoryIconThemeTier,
} from '../utils/categoryIconTheme';

type CategoryNode = {
  id: number;
  code?: string;
  name: string;
  icon?: string;
  children?: CategoryNode[];
};

const CategoryPlainIcon: React.FC<{
  theme: CategoryIconTheme;
  size?: 'sm' | 'md';
  active?: boolean;
  tier?: CategoryIconThemeTier;
}> = ({ theme, size = 'md', active = false, tier = 'primary' }) => (
  <span
    className={`${styles.categoryPlainIcon} ${size === 'sm' ? styles.categoryPlainIconSm : ''}`}
    style={categoryPlainIconStyle(theme, { tier, active })}
  >
    <i className={theme.icon} aria-hidden />
  </span>
);

interface SubMenuProps {
  children: CategoryNode[];
  onSubCategoryClick?: (categoryId: number, subCategoryId: number) => void;
  parentCode?: string;
  level?: number;
}

const SubMenu: React.FC<SubMenuProps> = ({
  children,
  onSubCategoryClick,
  parentCode,
  level = 1,
}) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className={styles.subMenuList}>
      {children.map((child) => {
        const theme = resolveCategoryIconTheme(child.code, child.icon, parentCode, {
          tier: 'submenu',
        });

        return (
          <div key={child.id} className={styles.subMenuItem}>
            <a
              href="#"
              className={styles.subMenuLink}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSubCategoryClick?.(0, child.id);
              }}
              onMouseEnter={() => setHoveredItem(child.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CategoryPlainIcon theme={theme} size="sm" tier="submenu" />
              <span className={styles.subMenuLabel}>{child.name}</span>
              {child.children && child.children.length > 0 && (
                <i className={`fas fa-chevron-right ${styles.subMenuChevron}`} aria-hidden />
              )}
            </a>

            {child.children && child.children.length > 0 && hoveredItem === child.id && (
              <div className={`${styles.subDropdownMenu} ${styles.show} absolute left-full top-0 mt-0`}>
                <SubMenu
                  children={child.children}
                  onSubCategoryClick={onSubCategoryClick}
                  parentCode={child.code ?? parentCode}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface CategoryButtonProps {
  category: CategoryNode;
  isActive: boolean;
  onClick: (categoryId: number) => void;
  onSubCategoryClick?: (categoryId: number, subCategoryId: number) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isActive,
  onClick,
  onSubCategoryClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const theme = resolveCategoryIconTheme(category.code, category.icon);

  const handleClick = () => {
    onClick(category.id);
  };

  const handleMouseEnter = () => {
    if (category.children && category.children.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <div
      className={`${styles.categoryItem} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.categoryRow}>
        <CategoryPlainIcon theme={theme} active={isActive} />
        <span className={styles.categoryLabel}>{category.name}</span>
        {category.children && category.children.length > 0 && (
          <i className={`fas fa-chevron-down ${styles.categoryChevron}`} aria-hidden />
        )}
      </div>

      {category.children && category.children.length > 0 && (
        <div className={`${styles.dropdownMenu} ${showDropdown ? styles.show : ''}`}>
          <SubMenu
            children={category.children}
            onSubCategoryClick={onSubCategoryClick}
            parentCode={category.code}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryButton;
