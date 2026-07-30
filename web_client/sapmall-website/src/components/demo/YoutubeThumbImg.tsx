import React, { useEffect, useMemo, useState } from 'react';
import { youtubeThumbCandidates } from '../../content/demoVideos';

type YoutubeThumbImgProps = {
  youtubeId: string;
  thumbUrl?: string;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

/**
 * 与列表卡片共用同一套封面候选，加载失败自动降级，避免主预览区黑屏无图
 */
const YoutubeThumbImg: React.FC<YoutubeThumbImgProps> = ({
  youtubeId,
  thumbUrl,
  alt = '',
  className,
  loading = 'lazy',
}) => {
  const candidates = useMemo(
    () => youtubeThumbCandidates(youtubeId, thumbUrl),
    [youtubeId, thumbUrl],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [youtubeId, thumbUrl]);

  const src = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        setIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
      }}
    />
  );
};

export default YoutubeThumbImg;
