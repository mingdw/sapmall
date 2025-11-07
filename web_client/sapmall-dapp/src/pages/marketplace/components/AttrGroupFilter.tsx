import React from 'react';
import { AttrGroupResp, AttrResp } from '../../../services/types/categoryTypes';
import styles from './AttrGroupFilter.module.scss';

interface AttrGroupFilterProps {
  attrGroup: AttrGroupResp;
  selectedAttrs: number[];
  onAttrSelect: (groupId: number, attrId: number) => void;
}

const AttrGroupFilter: React.FC<AttrGroupFilterProps> = ({
  attrGroup,
  selectedAttrs,
  onAttrSelect
}) => {
  // 注意：0=启用，1=禁用
  // 只显示启用状态的属性组
  if (attrGroup.status !== 0) {
    return null;
  }
  
  // 确保 attrs 存在且为数组，并过滤出启用状态的属性
  // 注意：0=启用，1=禁用，只显示启用状态的属性
  const allAttrs = attrGroup.attrs || [];
  const enabledAttrs = allAttrs.filter(attr => attr.status === 0);
  
  // 如果没有启用的属性，不渲染该属性组
  if (enabledAttrs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center flex-1">
      <span className="text-xs font-medium text-gray-400 min-w-[50px]">
        {attrGroup.name}
      </span>
      <div className="flex flex-wrap gap-2">
        {enabledAttrs.map((attr: AttrResp) => (
          <button
            key={attr.id}
            className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
              selectedAttrs.includes(attr.id) ? styles.active : ''
            }`}
            onClick={() => onAttrSelect(attrGroup.id, attr.id)}
          >
            {attr.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AttrGroupFilter;
