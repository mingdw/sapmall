import { Check } from 'lucide-react';
import styles from './SwapSuccessFlash.module.scss';

interface SwapSuccessFlashProps {
  /** 成功文案，如「兑换成功」 */
  label: string;
}

/**
 * 兑换成功转场：无外框底色，立体气泡场 + 轻量 icon/文案。
 * 动效参考连接钱包页 floatingOrb 的悬浮光球质感。
 * 由父组件约 3s 后切回「继续兑换」CTA。
 */
export default function SwapSuccessFlash({ label }: SwapSuccessFlashProps) {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      {/* 立体气泡场（装饰，不抢文案） */}
      <div className={styles.orbField} aria-hidden>
        <span className={`${styles.orb} ${styles.orbLg}`} />
        <span className={`${styles.orb} ${styles.orbMd}`} />
        <span className={`${styles.orb} ${styles.orbSm}`} />
        <span className={`${styles.orb} ${styles.orbTiny}`} />
      </div>

      <div className={styles.content}>
        <div className={styles.iconSphere} aria-hidden>
          <span className={styles.iconHighlight} />
          <span className={styles.iconRipple} />
          <span className={styles.iconRippleDelay} />
          <Check className={styles.iconCheck} size={16} strokeWidth={2.5} />
        </div>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
