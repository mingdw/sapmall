import React, { useState } from 'react';
import { getChainIconFallbackLetter, getChainIconUrl } from '../../../config/chainIcons';
import styles from './ChainNetworkIcon.module.scss';

type Props = {
  chainId: number;
  alt: string;
  className?: string;
};

const ChainNetworkIcon: React.FC<Props> = ({ chainId, alt, className }) => {
  const [failed, setFailed] = useState(false);
  const src = getChainIconUrl(chainId);

  if (!src || failed) {
    return (
      <span
        className={[styles.fallback, className].filter(Boolean).join(' ')}
        aria-hidden
      >
        {getChainIconFallbackLetter(chainId)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

export default ChainNetworkIcon;
