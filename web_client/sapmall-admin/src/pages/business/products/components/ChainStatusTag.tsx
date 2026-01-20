import React from 'react';
import { getChainStatusConfig } from '../utils';
import type { ChainStatus } from '../types';
import styles from './StatusTag.module.scss';

interface ChainStatusTagProps {
  chainStatus?: ChainStatus;
}

const ChainStatusTag: React.FC<ChainStatusTagProps> = ({ chainStatus }) => {
  const config = getChainStatusConfig(chainStatus);
  
  // 根据链上状态获取对应的样式类名
  const getChainStatusClassName = (chainStatus?: ChainStatus): string => {
    switch (chainStatus) {
      case '未上链':
        return styles.notChained;
      case '同步中':
        return styles.syncing;
      case '已上链':
        return styles.chained;
      case '同步失败':
        return styles.syncFailed;
      default:
        return styles.notChained;
    }
  };

  return (
    <span className={`${styles.statusTag} ${getChainStatusClassName(chainStatus)}`}>
      {config.text}
    </span>
  );
};

export default ChainStatusTag;
