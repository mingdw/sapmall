import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { HELP_DISCORD_URL } from '../constants';
import HelpArticleFigure from './HelpArticleFigure';
import type { HelpArticleBlock } from '../types';
import { getArticleLayoutVariant } from '../utils/buildHelpArticleBlocks';
import { parseTopicQaArticleIndex } from '../utils/helpTopicSlug';
import styles from '../HelpPage.module.scss';

type Props = {
  blocks: HelpArticleBlock[];
  slug?: string;
};

const resolveHref = (href: string): { to?: string; external?: string } => {
  if (href === 'discord') return { external: HELP_DISCORD_URL };
  if (href.startsWith('http')) return { external: href };
  return { to: href };
};

const HelpArticleBody: React.FC<Props> = ({ blocks, slug }) => {
  const { t } = useTranslation();
  const layoutVariant =
    slug !== undefined ? getArticleLayoutVariant(parseTopicQaArticleIndex(slug)) : 0;

  return (
    <div
      className={styles.articleBodyContent}
      data-layout={layoutVariant}
    >
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className={styles.bodyParagraph}>
              {t(block.key)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const Tag = block.level === 3 ? 'h4' : 'h3';
          return (
            <Tag key={index} className={styles.bodyHeading}>
              {t(block.key)}
            </Tag>
          );
        }

        if (block.type === 'steps') {
          const steps = t(block.key, { returnObjects: true });
          const list = Array.isArray(steps) ? steps : [];
          return (
            <ol key={index} className={styles.bodySteps}>
              {list.map((step, i) => (
                <li key={i}>
                  <span className={styles.bodyStepIndex}>{i + 1}</span>
                  <span className={styles.bodyStepText}>{step}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'callout') {
          return (
            <div key={index} className={styles.bodyCallout} data-variant={block.variant}>
              {t(block.key)}
            </div>
          );
        }

        if (block.type === 'figure') {
          return (
            <HelpArticleFigure
              key={index}
              category={block.category}
              captionKey={block.captionKey}
            />
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={index} className={styles.bodyImageFigure}>
              <img src={block.src} alt={t(block.altKey)} className={styles.bodyImage} loading="lazy" />
              {block.captionKey ? (
                <figcaption className={styles.bodyFigureCaption}>{t(block.captionKey)}</figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === 'link') {
          const resolved = resolveHref(block.href);
          const label = t(block.key);
          if (resolved.external) {
            return (
              <a
                key={index}
                href={resolved.external}
                className={styles.bodyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
                <ExternalLink size={14} aria-hidden />
              </a>
            );
          }
          return (
            <Link key={index} to={resolved.to ?? '/'} className={styles.bodyLink}>
              {label}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
};

export default HelpArticleBody;
