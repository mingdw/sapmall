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
  return (
    <div className="flex flex-wrap gap-2 items-center flex-1">
      <span className="text-xs font-medium text-gray-400 min-w-[50px]">
        {attrGroup.name}
      </span>
      <div className="flex flex-wrap gap-2">
        {attrGroup.attrs.map((attr: AttrResp) => (
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
