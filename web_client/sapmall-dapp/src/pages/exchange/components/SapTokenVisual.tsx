import { useTranslation } from 'react-i18next';
import styles from './SapTokenVisual.module.scss';

export default function SapTokenVisual() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <div className="relative flex flex-col items-center h-[320px] w-full rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  return (
    <div data-cmp="SapTokenVisual" className="relative flex flex-col items-center">
      <div className="relative h-[200px] w-[200px] flex items-center justify-center">
        <div className="absolute rounded-full h-[180px] w-[180px] border border-violet-400/30" />
        <div className="absolute rounded-full h-[140px] w-[140px] border border-cyan-300/30" />
        <div className="absolute rounded-full h-[100px] w-[100px] border border-dashed border-violet-400/20" />

        <div className={styles.orbitOuter}>
          <div className={styles.particlePurple} />
        </div>
        <div className={styles.orbitInner}>
          <div className={styles.particleCyan} />
        </div>

        <div className={`relative h-[72px] w-[72px] rounded-full flex items-center justify-center ${styles.tokenCore} ${styles.floatAnim}`}>
          <span className="text-2xl font-bold text-white">S</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className={`text-2xl font-bold ${styles.gradientText}`}>
          {t('exchange.sapVisual.name')}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{t('exchange.sapVisual.tagline')}</p>
      </div>

      <div className={`mt-4 px-6 py-3 rounded-2xl text-center border border-violet-400/30 bg-violet-500/10 ${styles.pricePanel}`}>
        <p className="text-xs text-muted-foreground mb-1">{t('exchange.sapVisual.currentPrice')}</p>
        <p className="text-xl font-bold text-foreground">$0.3510</p>
        <span className="text-xs text-emerald-300">{t('exchange.sapVisual.changeLabel')}</span>
      </div>
    </div>
  );
}
