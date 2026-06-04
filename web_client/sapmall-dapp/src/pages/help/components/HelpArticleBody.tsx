import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { HELP_DISCORD_URL } from '../constants';
import HelpArticleFigure from './HelpArticleFigure';
import type { HelpArticleBlock } from '../types';
import { getArticleLayoutVariant } from '../utils/buildHelpArticleBlocks';
import { parseTopicQaArticleIndex } from '../utils/helpTopicSlug';

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

  const rootClass = [
    'flex flex-col gap-0.5',
    layoutVariant === 2 ? '[&_.body-callout]:mb-[1.1rem]' : '',
    layoutVariant === 3 ? '[&_.body-steps]:mt-[0.35rem]' : '',
    layoutVariant === 5 ? '[&_.body-heading:first-of-type]:mt-3' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} data-layout={layoutVariant}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 text-[0.9375rem] leading-relaxed text-[var(--help-panel-text)]">
              {t(block.key)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const Tag = block.level === 3 ? 'h4' : 'h3';
          return (
            <Tag
              key={index}
              className="body-heading mb-[0.55rem] mt-[1.15rem] text-[0.9375rem] font-semibold tracking-tight text-[var(--help-panel-text)]"
            >
              {t(block.key)}
            </Tag>
          );
        }

        if (block.type === 'steps') {
          const steps = t(block.key, { returnObjects: true });
          const list = Array.isArray(steps) ? steps : [];
          const stepLiExtra =
            layoutVariant === 1
              ? 'border-l-[3px] border-[var(--help-primary)] rounded-l-lg rounded-r-[0.65rem]'
              : '';
          return (
            <ol key={index} className="body-steps m-0 mb-5 flex list-none flex-col gap-[0.55rem] p-0">
              {list.map((step, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-[0.65rem] rounded-[0.65rem] border border-slate-900/[0.06] bg-slate-50 px-[0.85rem] py-3 text-[0.9rem] leading-relaxed text-[var(--help-panel-text)] ${stepLiExtra}`}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--help-primary)] to-violet-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">{step}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'callout') {
          const variantClass =
            block.variant === 'warning'
              ? 'border-amber-500 bg-amber-500/15 text-amber-900'
              : 'border-[var(--help-amber)] bg-amber-500/10 text-amber-900';
          return (
            <div
              key={index}
              className={`body-callout mb-4 border-l-[3px] px-4 py-[0.85rem] text-sm leading-relaxed ${variantClass}`}
            >
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
            <figure key={index} className="mb-5">
              <img
                src={block.src}
                alt={t(block.altKey)}
                className="block w-full rounded-xl border border-slate-900/10"
                loading="lazy"
              />
              {block.captionKey ? (
                <figcaption className="mt-[0.45rem] text-center text-xs text-[var(--help-panel-muted)]">
                  {t(block.captionKey)}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === 'link') {
          const resolved = resolveHref(block.href);
          const label = t(block.key);
          const linkClass =
            'mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--help-primary)] no-underline hover:underline';
          if (resolved.external) {
            return (
              <a
                key={index}
                href={resolved.external}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
                <ExternalLink size={14} aria-hidden />
              </a>
            );
          }
          return (
            <Link key={index} to={resolved.to ?? '/'} className={linkClass}>
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
