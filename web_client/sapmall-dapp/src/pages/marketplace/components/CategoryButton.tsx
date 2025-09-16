import React, { useState } from 'react';
import styles from './CategoryButton.module.scss';

// 子菜单组件
interface SubMenuProps {
  children: Array<{
    id: number;
    name: string;
    icon?: string;
    children?: Array<{
      id: number;
      name: string;
      icon?: string;
    }>;
  }>;
  onSubCategoryClick?: (categoryId: number, subCategoryId: number) => void;
  level?: number;
}

const SubMenu: React.FC<SubMenuProps> = ({ children, onSubCategoryClick, level = 1 }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className="py-2">
      {children.map((child) => (
        <div key={child.id} className="relative">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onSubCategoryClick) {
                onSubCategoryClick(0, child.id); // 这里可以根据需要调整父级ID
              }
            }}
            onMouseEnter={() => setHoveredItem(child.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center space-x-2">
              <i className={`${child.icon || 'fas fa-folder'} text-xs`} style={{ fontSize: '0.75rem' }}></i>
              <span>{child.name}</span>
              {child.children && child.children.length > 0 && (
                <i className="fas fa-chevron-right text-xs opacity-50 ml-auto"></i>
              )}
            </div>
          </a>
          
          {/* 三级菜单 */}
          {child.children && child.children.length > 0 && hoveredItem === child.id && (
            <div className={`${styles.subDropdownMenu} absolute left-full top-0 mt-0`}>
              <SubMenu 
                children={child.children} 
                onSubCategoryClick={onSubCategoryClick}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface CategoryButtonProps {
  category: {
    id: number;
    name: string;
    icon?: string; // 图标可选，有默认值
    children?: Array<{
      id: number;
      name: string;
      icon?: string;
      children?: Array<{
        id: number;
        name: string;
        icon?: string;
      }>;
    }>;
  };
  isActive: boolean;
  onClick: (categoryId: number) => void;
  onSubCategoryClick?: (categoryId: number, subCategoryId: number) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isActive,
  onClick,
  onSubCategoryClick
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleSubCategoryClick = (e: React.MouseEvent, subCategoryId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubCategoryClick) {
      onSubCategoryClick(category.id, subCategoryId);
    }
  };

  return (
    <div
      className={`${styles.categoryItem} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center space-x-2">
          <i 
            className={`${category.icon || 'fas fa-th-large'} ${styles.categoryIcon}`} 
            style={{ fontSize: '0.875rem' }}
          ></i>
          <span className="text-sm font-medium">{category.name}</span>
          {category.children && category.children.length > 0 && (
            <i className="fas fa-chevron-down text-xs opacity-50 ml-1"></i>
          )}
        </div>
      </div>
      
      {/* 下拉菜单 */}
      {category.children && category.children.length > 0 && (
        <div 
          className={`${styles.dropdownMenu} ${showDropdown ? styles.show : ''}`}
        >
          <SubMenu 
            children={category.children} 
            onSubCategoryClick={onSubCategoryClick}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryButton;
