import React from 'react';
import MessageUtils from '../../../../utils/messageUtils';
import type { TodoItem } from '../types';
import styles from '../StoreOverview.module.scss';

interface TodoPanelProps {
  items: TodoItem[];
}

const TODO_STYLE: Record<
  TodoItem['key'],
  { color: string; bg: string }
> = {
  pending_ship: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  after_sale: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  review_reply: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

const TodoPanel: React.FC<TodoPanelProps> = ({ items }) => {
  const handleClick = (item: TodoItem) => {
    MessageUtils.info(`${item.label}功能即将开放`);
  };

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionLabel}>待办事项</h3>
      </div>

      <div className={styles.todoGrid}>
        {items.map((item) => {
          const tone = TODO_STYLE[item.key];
          return (
            <button
              key={item.key}
              type="button"
              className={`${styles.statsCard} ${styles.statsCardClickable}`}
              onClick={() => handleClick(item)}
            >
              <div className={styles.statsCardHead}>
                <div
                  className={styles.statsCardIcon}
                  style={{ background: tone.bg, color: tone.color }}
                >
                  <i className={item.icon} />
                </div>
                <span className={styles.statsCardLabel}>{item.label}</span>
              </div>
              <div className={styles.statsCardValueRow}>
                <span className={styles.statsCardValue}>{item.count}</span>
                <span className={styles.statsCardAction}>去处理</span>
              </div>
              <div className={styles.statsCardHint}>{item.description}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TodoPanel;
