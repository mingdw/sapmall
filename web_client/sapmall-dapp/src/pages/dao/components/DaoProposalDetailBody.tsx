import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DaoProposalDetailBlock } from '../types';
import styles from '../DaoPage.module.scss';

type Props = {
  blocks: DaoProposalDetailBlock[];
};

const DaoProposalDetailBody: React.FC<Props> = ({ blocks }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.eventBodyContent}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className={styles.eventBodyParagraph}>
              {t(block.key)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const Tag = block.level === 3 ? 'h4' : 'h3';
          return (
            <Tag key={index} className={styles.eventBodyHeading}>
              {t(block.key)}
            </Tag>
          );
        }

        if (block.type === 'bulletList') {
          const items = t(block.key, { returnObjects: true });
          const list = Array.isArray(items) ? items : [];
          return (
            <ul key={index} className={styles.eventBodyList}>
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === 'callout') {
          return (
            <aside key={index} className={styles.eventBodyCallout} data-variant={block.variant}>
              {t(block.key)}
            </aside>
          );
        }

        return null;
      })}
    </div>
  );
};

export default DaoProposalDetailBody;
