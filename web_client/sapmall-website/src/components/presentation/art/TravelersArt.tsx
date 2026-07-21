import React from 'react';

type TravelersArtProps = {
  variant?: 'plain' | 'city';
  className?: string;
};

/** 扁平旅行者插画（无文字，可多页复用） */
const TravelersArt: React.FC<TravelersArtProps> = ({ variant = 'plain', className = '' }) => {
  return (
    <div className={`ppt-art ${className}`.trim()} aria-hidden>
      {variant === 'city' && (
        <div className="ppt-art__city">
          <span style={{ height: '55%' }} />
          <span style={{ height: '72%' }} />
          <span style={{ height: '48%' }} />
          <span style={{ height: '85%' }} />
          <span style={{ height: '62%' }} />
        </div>
      )}
      <svg className="ppt-art__svg" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="250" rx="110" ry="18" fill="#D6E8F8" opacity="0.9" />
        {/* 女性 */}
        <circle cx="118" cy="72" r="22" fill="#F0C7B0" />
        <path d="M96 72c0-14 10-26 22-26s22 12 22 26" fill="#1E3A8A" />
        <path d="M90 98h56l8 70H82l8-70z" fill="#fff" />
        <path d="M95 168h46l6 62H89l6-62z" fill="#3B6FE8" />
        <path d="M89 230h18l4 16H85l4-16z" fill="#1E293B" />
        <path d="M127 230h18l4 16h-22l4-16z" fill="#1E293B" />
        <path d="M146 110l28 8 6 36-22-4-12-40z" fill="#7EB6F0" />
        <rect x="98" y="58" width="40" height="10" rx="5" fill="#3B6FE8" />
        {/* 男性 */}
        <circle cx="198" cy="68" r="24" fill="#F0C7B0" />
        <path d="M174 68c0-16 11-28 24-28s24 12 24 28" fill="#111" />
        <path d="M168 96h60l10 78H158l10-78z" fill="#3B6FE8" />
        <path d="M170 174h56l8 56H162l8-56z" fill="#111" />
        <path d="M162 230h22l4 16h-26l4-16z" fill="#3B6FE8" />
        <path d="M204 230h22l4 16h-26l4-16z" fill="#3B6FE8" />
        {/* 行李箱 */}
        <rect x="236" y="140" width="52" height="70" rx="4" fill="#8EC5F2" />
        <rect x="248" y="132" width="28" height="10" rx="2" fill="#5BA3E0" />
        {/* 指向手臂 */}
        <path d="M228 120l62-48 10 12-58 52-14-16z" fill="#F0C7B0" />
        <path d="M220 112l18 8-8 22-18-6 8-24z" fill="#3B6FE8" />
      </svg>
    </div>
  );
};

export default TravelersArt;
