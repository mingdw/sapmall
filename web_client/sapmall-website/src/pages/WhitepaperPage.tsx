import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import SEO from '../components/SEO';
import SubpageChrome from '../layout/SubpageChrome';
import {
  getWhitepaperSections,
  getWhitepaperTocLabel,
  type WhitepaperBlock,
} from '../content/whitepaper';

function BlockView({ block }: { block: WhitepaperBlock }) {
  if (block.type === 'paragraph') {
    return <p className="wp-prose__p">{block.text}</p>;
  }
  if (block.type === 'list') {
    return (
      <ul className="wp-prose__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'nestedList') {
    return (
      <div className="wp-nested">
        {block.items.map((item) => (
          <div key={item.title} className="wp-nested__group">
            <h3 className="wp-nested__title">{item.title}</h3>
            {item.children && item.children.length > 0 && (
              <ul className="wp-prose__list">
                {item.children.map((child) => (
                  <li key={child}>{child}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'kv') {
    return (
      <dl className="wp-kv">
        {block.items.map((row) => (
          <div key={row.label} className="wp-kv__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (block.type === 'architecture') {
    return (
      <div className="wp-arch" role="img" aria-label="architecture">
        {block.layers.map((layer, i) => (
          <React.Fragment key={layer.name}>
            <div className="wp-arch__layer">
              <div className="wp-arch__name">{layer.name}</div>
              <div className="wp-arch__items">
                {layer.items.map((item) => (
                  <span key={item} className="wp-arch__chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {i < block.layers.length - 1 && <div className="wp-arch__arrow" aria-hidden />}
          </React.Fragment>
        ))}
      </div>
    );
  }
  return <aside className="wp-prose__note">{block.text}</aside>;
}

const WhitepaperPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sections = useMemo(() => getWhitepaperSections(i18n.language), [i18n.language]);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? 'intro');
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setActiveId(sections[0]?.id ?? 'intro');
  }, [sections]);

  useEffect(() => {
    const nodes = sections.map((s) => document.getElementById(`wp-${s.id}`)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id.replace(/^wp-/, ''));
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    setMobileTreeOpen(false);
    const el = document.getElementById(`wp-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const tree = (
    <nav className="wp-tree" aria-label={t('whitepaper.toc')}>
      <button type="button" className="wp-tree__root" onClick={() => setExpanded((v) => !v)}>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>{t('whitepaper.docTitle')}</span>
      </button>
      {expanded && (
        <ul className="wp-tree__list">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={`wp-tree__item ${activeId === section.id ? 'wp-tree__item--active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {getWhitepaperTocLabel(section, i18n.language)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );

  return (
    <>
      <SEO title={t('whitepaper.seoTitle')} description={t('whitepaper.seoDesc')} />
      <SubpageChrome>
        <main className="wp-page" id="main-content">
          <div className="site-container wp-layout">
            <aside className="wp-sidebar">
              <p className="wp-sidebar__label">{t('whitepaper.toc')}</p>
              {tree}
            </aside>

            <div className="wp-main">
              <header className="wp-header">
                <div>
                  <p className="section-eyebrow">{t('whitepaper.eyebrow')}</p>
                  <h1 className="section-title">{t('whitepaper.docTitle')}</h1>
                  <p className="section-desc">{t('whitepaper.version')}</p>
                </div>
                <button
                  type="button"
                  className="wp-mobile-toc-btn lg:hidden"
                  onClick={() => setMobileTreeOpen(true)}
                >
                  <Menu size={16} />
                  {t('whitepaper.toc')}
                </button>
              </header>

              <div className="wp-content">
                {sections.map((section) => (
                  <section key={section.id} id={`wp-${section.id}`} className="wp-section">
                    <h2 className="wp-section__title">{section.title}</h2>
                    {section.blocks.map((block, i) => (
                      <BlockView key={`${section.id}-${i}`} block={block} />
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>

          {mobileTreeOpen && (
            <>
              <div className="wp-drawer-overlay" onClick={() => setMobileTreeOpen(false)} aria-hidden />
              <div className="wp-drawer" role="dialog" aria-modal="true" aria-label={t('whitepaper.toc')}>
                <div className="wp-drawer__head">
                  <span>{t('whitepaper.toc')}</span>
                  <button type="button" onClick={() => setMobileTreeOpen(false)} aria-label="close">
                    <X size={20} />
                  </button>
                </div>
                {tree}
              </div>
            </>
          )}
        </main>
      </SubpageChrome>
    </>
  );
};

export default WhitepaperPage;
