import styles from '../ExchangePageDetail.module.scss';

export default function ParticleBackground() {
  const particles = [
    { w: 3, h: 3, top: '10%', left: '8%', delay: '0s', dur: '6s', color: 'rgba(124,77,255,0.7)' },
    { w: 2, h: 2, top: '20%', left: '92%', delay: '1s', dur: '8s', color: 'rgba(0,229,255,0.6)' },
    { w: 4, h: 4, top: '35%', left: '5%', delay: '2s', dur: '7s', color: 'rgba(124,77,255,0.5)' },
    { w: 2, h: 2, top: '60%', left: '95%', delay: '0.5s', dur: '9s', color: 'rgba(0,229,255,0.5)' },
    { w: 3, h: 3, top: '75%', left: '10%', delay: '3s', dur: '6.5s', color: 'rgba(105,240,174,0.5)' },
    { w: 2, h: 2, top: '85%', left: '88%', delay: '1.5s', dur: '7.5s', color: 'rgba(124,77,255,0.6)' },
  ];

  return (
    <div data-cmp="ParticleBackground" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 ${styles.particleGradientBg}`} />

      <div className={`absolute inset-0 opacity-[0.03] ${styles.particleGridBg}`} />

      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${p.w}px`,
            height: `${p.h}px`,
            top: p.top,
            left: p.left,
            background: p.color,
            boxShadow: `0 0 ${p.w * 3}px ${p.color}`,
            animation: `particleMove ${p.dur} ease-in-out infinite ${p.delay}`,
          }}
        />
      ))}
    </div>
  );
}
