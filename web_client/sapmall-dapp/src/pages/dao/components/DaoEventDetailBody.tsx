import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DaoEventDetail, DaoEventDetailBlock } from '../types';
import detailStyles from '../styles/dao.detailCommon.module.scss';

type Props = {
  event: DaoEventDetail;
  blocks: DaoEventDetailBlock[];
};

const resolveImageSrc = (event: DaoEventDetail, block: Extract<DaoEventDetailBlock, { type: 'image' }>): string => {
  if (block.src) return block.src;
  if (block.srcKey === 'cover') return event.imageUrl;
  return event.imageUrl;
};

const DaoEventDetailBody: React.FC<Props> = ({ event, blocks }) => {
  const { t } = useTranslation();

  return (
    <div className={detailStyles.eventBodyContent}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          const content = block.text ?? (block.key ? t(block.key) : '');
          return (
            <p key={index} className={detailStyles.eventBodyParagraph}>
              {content}
            </p>
          );
        }

        if (block.type === 'heading') {
          const Tag = block.level === 3 ? 'h4' : 'h3';
          const content = block.text ?? (block.key ? t(block.key) : '');
          return (
            <Tag key={index} className={detailStyles.eventBodyHeading}>
              {content}
            </Tag>
          );
        }

        if (block.type === 'bulletList') {
          const items = t(block.key, { returnObjects: true });
          const list = Array.isArray(items) ? items : [];
          return (
            <ul key={index} className={detailStyles.eventBodyList}>
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === 'callout') {
          const content = block.text ?? (block.key ? t(block.key) : '');
          return (
            <aside key={index} className={detailStyles.eventBodyCallout} data-variant={block.variant}>
              {content}
            </aside>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={index} className={detailStyles.eventBodyFigure}>
              <img
                src={resolveImageSrc(event, block)}
                alt={t(block.altKey)}
                className={detailStyles.eventBodyImage}
                loading="lazy"
              />
              {block.captionKey ? (
                <figcaption className={detailStyles.eventBodyCaption}>{t(block.captionKey)}</figcaption>
              ) : null}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
};

export default DaoEventDetailBody;

