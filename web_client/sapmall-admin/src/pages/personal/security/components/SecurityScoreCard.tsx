import React, { useCallback, useState } from 'react';
import type { SecurityScore as SecurityScoreType } from '../types';
import { getScoreColor, calcDashArray } from '../utils/securityUtils';
import styles from '../SecurityManager.module.scss';

const CIRCUMFERENCE = 2 * Math.PI * 15.9155;

interface Props {
  score: SecurityScoreType;
  onReassess?: (newScore: number) => void;
}

const SecurityScoreCard: React.FC<Props> = ({ score, onReassess }) => {
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(score.score);
  const [animating, setAnimating] = useState(false);

  const color = getScoreColor(displayScore);
  const dashArray = calcDashArray(displayScore, CIRCUMFERENCE);

  const handleReassess = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setAnimating(true);

    // Simulate score evaluation with animation
    const targetScore = Math.floor(Math.random() * 40) + 60; // 60-99
    const startScore = displayScore;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(startScore + (targetScore - startScore) * eased);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        setLoading(false);
        onReassess?.(targetScore);
      }
    };

    requestAnimationFrame(animate);
  }, [loading, displayScore, onReassess]);

  return (
    <div className={styles.queryCard}>
      <div className={styles.scoreRow}>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 36 36">
            <path
              className="stroke-slate-700"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={dashArray}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ transition: animating ? 'none' : 'stroke-dasharray 0.8s ease, stroke 0.3s ease' }}
            />
          </svg>
          <span className={styles.scoreText}>{displayScore}%</span>
        </div>
        <div className={styles.scoreInfo}>
          <h3 className={styles.scoreTitle}>安全评分</h3>
          <p className={styles.scoreDesc}>{score.suggestion}</p>
          <button
            type="button"
            className={`${styles.btnReassess} ${loading ? styles.btnReassessLoading : ''}`}
            disabled={loading}
            onClick={handleReassess}
          >
            <i className={`fas ${loading ? 'fa-sync-alt' : 'fa-redo-alt'}`}></i>
            {loading ? '评估中...' : '重新评估'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreCard;
