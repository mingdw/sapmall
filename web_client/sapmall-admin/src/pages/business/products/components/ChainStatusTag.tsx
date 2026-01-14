import React from 'react';
import { Tag } from 'antd';
import { getChainStatusConfig } from '../utils';
import type { ChainStatus } from '../types';

interface ChainStatusTagProps {
  chainStatus?: ChainStatus;
}

const ChainStatusTag: React.FC<ChainStatusTagProps> = ({ chainStatus }) => {
  const config = getChainStatusConfig(chainStatus);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default ChainStatusTag;
