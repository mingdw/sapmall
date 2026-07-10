import styles from '../ExchangePageDetail.module.scss';

interface TokenIconProps {
  symbol?: string;
  size?: number;
  glowColor?: string;
}

/* ========== SVG 图标：真实币种样式 ========== */

/** USDC — 官方蓝色圆形 + 白色 $ 符号 */
function UsdcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        d="M20.2 18.2c0-2.1-1.3-2.9-3.9-3.2c-1.8-.2-2.2-.7-2.2-1.5c0-.8.6-1.3 1.8-1.3c1.1 0 1.7.4 1.9 1.3c.1.3.4.5.7.5h.5c.4 0 .7-.3.7-.7c0-.1 0-.1-.1-.2c-.3-1.3-1.4-2.3-2.7-2.4V9.4c0-.4-.3-.7-.7-.7h-.5c-.4 0-.7.3-.7.7v1.2c-1.8.2-3 1.5-3 3c0 2 1.3 2.9 3.8 3.2c1.7.3 2.2.6 2.2 1.5c0 .9-.8 1.5-1.9 1.5c-1.5 0-2-.6-2.2-1.4c-.1-.4-.4-.6-.7-.6h-.5c-.4 0-.7.3-.7.7c0 .1 0 .1.1.2c.3 1.5 1.3 2.5 3 2.7v1.3c0 .4.3.7.7.7h.5c.4 0 .7-.3.7-.7v-1.3c1.9-.3 3.1-1.6 3.1-3.3z"
        fill="#fff"
      />
      <path
        d="M12.5 22.3c-2.8-1-4.3-4-3.3-6.9c.5-1.5 1.6-2.5 3.3-3.1c.3-.1.4-.3.4-.6v-.5c0-.4-.3-.6-.7-.5c-3.4 1.1-5.3 4.7-4.2 8.1c.7 2.1 2.3 3.7 4.2 4.4c.4.2.7 0 .7-.4v-.5c0-.2-.2-.5-.4-.5zm7-11.6c-.4-.2-.7 0-.7.4v.5c0 .3.2.5.4.6c2.8 1 4.3 4 3.3 6.9c-.5 1.5-1.6 2.5-3.3 3.1c-.3.1-.4.3-.4.6v.5c0 .4.3.6.7.5c3.4-1.1 5.3-4.7 4.2-8.1c-.7-2.2-2.3-3.7-4.2-4.5z"
        fill="#fff"
      />
    </svg>
  );
}

/** EURC — Circle 欧元稳定币，深蓝底 + 白色 € 符号 */
function EurcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0052FF" />
      <path
        d="M16 6.5c-5.2 0-9.5 4.3-9.5 9.5s4.3 9.5 9.5 9.5c4.6 0 8.5-3.3 9.3-7.7h-3.2c-.7 2.6-3 4.5-5.8 4.5h-3.5c.4.7.9 1.3 1.6 1.8h2c2.2 0 4-1.2 5-3H16v-2h5.7c.1-.5.2-1 .2-1.5h-6v-2h5.9c-.1-.5-.3-1-.5-1.5H16v-2h4.6c-1-.9-2.3-1.5-3.8-1.5h-1.4c-.5.5-.9 1.1-1.2 1.8H16v2h-2.2c-.1.5-.2 1-.2 1.5h2.5v2h-2.5c.1.5.3 1 .5 1.5h2v.1h-.1c-1.1 0-2.1-.4-2.9-1c-.3.8-.5 1.6-.5 2.5c0 .3 0 .5.1.8h3.2c-.1-.3-.1-.5-.1-.8h6.3c.1-.5.2-1 .2-1.5h2.7c0-.3.1-.5.1-.8c0-.4 0-.7-.1-1H25c0-.3.1-.5.1-.8c0-.4 0-.7-.1-1h-2.9c-.2-.5-.4-1-.7-1.5h2.3c-.3-.5-.6-1-1-1.5h-1.3c.3.5.6 1 .8 1.5H19c-.2-.5-.5-1-.9-1.5h-1.4c.4.5.7 1 .9 1.5h-2.2c.3-.5.6-1 1-1.5h-1c-.3.5-.6 1-.8 1.5h-2.5c.7-1.8 2.5-3 4.6-3c1.4 0 2.7.5 3.7 1.4l1.5-1.5C18.9 7.1 17.5 6.5 16 6.5z"
        fill="#fff"
      />
    </svg>
  );
}

/** cirBTC — 比特币风格，橙色底 + 白色 ₿ 符号 */
function CirBtcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M21.5 14.2c.3-2-1.2-3-3.3-3.7l.7-2.7l-1.7-.4l-.7 2.6l-1.3-.3l.7-2.6l-1.7-.4l-.7 2.7c-.4-.1-.7-.2-1.1-.3l-2.3-.6l-.4 1.8s1.2.3 1.2.3c.7.2.8.6.8.9l-.8 3.1c.1 0 .1 0 .2.1l-.2-.1l-1.1 4.4c-.1.2-.3.5-.7.4c0 0-1.2-.3-1.2-.3l-.8 2l2.2.5c.4.1.8.2 1.2.3l-.7 2.7l1.7.4l.7-2.7l1.3.3l-.7 2.7l1.7.4l.7-2.7c2.9.6 5.2.3 6-2.3c.6-2.1-.1-3.3-1.7-4.1c1.2-.3 2-1.1 2.2-2.7zm-4 5.6c-.5 2.1-4.1.9-5.3.7l.9-3.6c1.2.3 4.9.9 4.4 2.9zm.5-5.6c-.4 1.9-3.5 1-4.4.7l.8-3.3c1 .3 4.1.7 3.6 2.6z"
        fill="#fff"
      />
    </svg>
  );
}

/** SAP — 项目代币，紫青渐变底 + ◈ 符号 */
function SapIcon({ size, glow }: { size: number; glow: string }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold select-none flex-shrink-0 ${styles.tokenIconBase}`}
      style={{
        ['--token-size' as string]: `${size}px`,
        ['--token-font-size' as string]: `${size * 0.38}px`,
        ['--token-from' as string]: '#7c4dff',
        ['--token-to' as string]: '#00e5ff',
        ['--token-glow' as string]: glow || 'rgba(124,77,255,0.6)',
        ['--token-glow-soft' as string]: (glow || 'rgba(124,77,255,0.6)').replace('0.6', '0.2'),
        ['--token-shadow-1' as string]: `${size * 0.4}px`,
        ['--token-shadow-2' as string]: `${size * 0.8}px`,
      }}
    >
      ◈
    </div>
  );
}

/* ========== 降级图标：未知代币用首字母圆形 ========== */

const FALLBACK_COLORS: Record<string, { from: string; to: string }> = {
  USDT: { from: '#26a17b', to: '#1a7a5e' },
  ETH: { from: '#627eea', to: '#3c4f9a' },
  MATIC: { from: '#8247e5', to: '#6b3bc4' },
  BUSD: { from: '#f0b90b', to: '#d4a208' },
  DAI: { from: '#f5ac37', to: '#d4922a' },
  BNB: { from: '#f3ba2f', to: '#c69315' },
  SOL: { from: '#14f195', to: '#9945ff' },
};

function FallbackIcon({ symbol, size }: { symbol: string; size: number }) {
  const colors = FALLBACK_COLORS[symbol] || { from: '#7c4dff', to: '#00e5ff' };
  const firstChar = symbol.charAt(0).toUpperCase();

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold select-none flex-shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.42}px`,
        color: '#fff',
        background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
      }}
    >
      {firstChar}
    </div>
  );
}

export default function TokenIcon({ symbol = 'SAP', size = 40, glowColor = '' }: TokenIconProps) {
  const upperSymbol = symbol.toUpperCase();

  // 已知币种使用真实 SVG 图标
  switch (upperSymbol) {
    case 'USDC':
      return <UsdcIcon size={size} />;
    case 'EURC':
      return <EurcIcon size={size} />;
    case 'CIRBTC':
      return <CirBtcIcon size={size} />;
    case 'SAP':
      return <SapIcon size={size} glow={glowColor} />;
    default:
      return <FallbackIcon symbol={upperSymbol} size={size} />;
  }
}
