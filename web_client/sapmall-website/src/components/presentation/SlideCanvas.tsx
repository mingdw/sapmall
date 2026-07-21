import React from 'react';

type SlideCanvasProps = {
  children: React.ReactNode;
  page?: number;
  total?: number;
  compact?: boolean;
  className?: string;
};

/** 16:9 白底幻灯片画布 */
const SlideCanvas: React.FC<SlideCanvasProps> = ({
  children,
  page,
  total,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`ppt-canvas ${compact ? 'ppt-canvas--compact' : ''} ${className}`.trim()}>
      <div className="ppt-canvas__inner">{children}</div>
      {!compact && page != null && total != null && (
        <span className="ppt-canvas__page" aria-hidden>
          {page}
        </span>
      )}
    </div>
  );
};

export default SlideCanvas;
