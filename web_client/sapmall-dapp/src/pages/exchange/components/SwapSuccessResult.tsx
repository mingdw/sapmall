import { ExternalLink } from 'lucide-react';
import SwapSuccessFlash from './SwapSuccessFlash';
import styles from '../ExchangePageDetail.module.scss';

export type SwapSuccessRow = {
  label: string;
  value: string;
  /** 有链接时视为交易哈希等可跳转项 */
  href?: string;
};

interface SwapSuccessResultProps {
  /** 成功标题，如「兑换成功」 */
  title: string;
  /** 订单完成明细 */
  rows: SwapSuccessRow[];
  onSwapAgain: () => void;
  swapAgainLabel: string;
}

/**
 * 兑换成功结果：成功动效 + 订单式明细 +「再兑换一笔」
 * 停留在成功态，由用户主动再兑，避免自动清空后无法继续操作。
 */
export default function SwapSuccessResult({
  title,
  rows,
  onSwapAgain,
  swapAgainLabel,
}: SwapSuccessResultProps) {
  return (
    <div className={styles.swapSuccessResult} role="status" aria-live="polite">
      <SwapSuccessFlash label={title} />

      {rows.length > 0 ? (
        <div className={`${styles.cctpInfoPanel} ${styles.swapSuccessOrder}`}>
          <div className={styles.cctpInfoRows}>
            {rows.map((row) => (
              <div className={styles.cctpInfoRow} key={row.label}>
                <span className={styles.cctpInfoLabel}>{row.label}</span>
                {row.href ? (
                  <a
                    className={styles.cctpInfoLink}
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.cctpInfoMono}>{row.value}</span>
                    <ExternalLink size={12} aria-hidden />
                  </a>
                ) : (
                  <span className={styles.cctpInfoValue}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button type="button" className={styles.swapAgainBtn} onClick={onSwapAgain}>
        {swapAgainLabel}
      </button>
    </div>
  );
}
