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
  onAttrSelect,
}) => {
  if (attrGroup.status !== 0) {
    return null;
  }

  const allAttrs = attrGroup.attrs || [];
  const enabledAttrs = allAttrs.filter((attr) => attr.status === 0);

  if (enabledAttrs.length === 0) {
    return null;
  }

  return (
    <div className={styles.filterGroupRow}>
      <span className={styles.filterGroupLabel}>{attrGroup.name}</span>
      <div className={styles.filterGroupTags}>
        {enabledAttrs.map((attr: AttrResp) => (
          <button
            key={attr.id}
            type="button"
            className={`${styles.filterTag} ${styles.filterTagCompact} ${
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
