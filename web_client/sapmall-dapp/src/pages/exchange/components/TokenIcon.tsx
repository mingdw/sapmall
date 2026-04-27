import styles from '../ExchangePageDetail.module.scss';

interface TokenIconProps {
  symbol?: string;
  size?: number;
  glowColor?: string;
}

const TOKEN_COLORS: Record<string, { from: string; to: string; glow: string; emoji: string }> = {
  SAP: { from: '#7c4dff', to: '#00e5ff', glow: 'rgba(124,77,255,0.6)', emoji: '◈' },
  USDT: { from: '#26a17b', to: '#1a7a5e', glow: 'rgba(38,161,123,0.6)', emoji: '₮' },
  USDC: { from: '#2775ca', to: '#1a5a9a', glow: 'rgba(39,117,202,0.6)', emoji: '◎' },
  BUSD: { from: '#f0b90b', to: '#d4a208', glow: 'rgba(240,185,11,0.6)', emoji: '◈' },
  DAI: { from: '#f5ac37', to: '#d4922a', glow: 'rgba(245,172,55,0.6)', emoji: '◇' },
};

export default function TokenIcon({ symbol = 'SAP', size = 40, glowColor = '' }: TokenIconProps) {
  const config = TOKEN_COLORS[symbol] || TOKEN_COLORS.SAP;
  const glow = glowColor || config.glow;

  return (
    <div
      data-cmp="TokenIcon"
      className={`rounded-full flex items-center justify-center font-bold select-none flex-shrink-0 ${styles.tokenIconBase}`}
      style={{
        ['--token-size' as string]: `${size}px`,
        ['--token-font-size' as string]: `${size * 0.38}px`,
        ['--token-from' as string]: config.from,
        ['--token-to' as string]: config.to,
        ['--token-glow' as string]: glow,
        ['--token-glow-soft' as string]: glow.replace('0.6', '0.2'),
        ['--token-shadow-1' as string]: `${size * 0.4}px`,
        ['--token-shadow-2' as string]: `${size * 0.8}px`,
      }}
    >
      {config.emoji}
    </div>
  );
}
