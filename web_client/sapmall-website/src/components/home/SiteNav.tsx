import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, Globe, CheckCircle, Menu as MenuIcon, X } from 'lucide-react';
import logoMarkSrc from '../../assets/logo-mark.svg';
import i18n from '../../i18n';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useNavElevated } from '../../hooks/useNavElevated';
import type { SectionId } from '../../hooks/useActiveSection';

type NavItem = { hash: string; id: SectionId; label: string };

type SiteNavProps = {
  /** 首页滚动高亮；子页传 null 不高亮任何项 */
  activeSection: SectionId | null;
  onLaunchDApp: () => void;
};

const SiteNav: React.FC<SiteNavProps> = ({ activeSection, onLaunchDApp }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(() =>
    i18n.language.startsWith('zh') ? 'zh' : 'en'
  );
  const langRef = useRef<HTMLDivElement>(null);
  const navElevated = useNavElevated();

  useEffect(() => {
    const sync = (lng: string) => setCurrentLang(lng.startsWith('zh') ? 'zh' : 'en');
    sync(i18n.language);
    i18n.on('languageChanged', sync);
    return () => {
      i18n.off('languageChanged', sync);
    };
  }, []);

  const closeLang = useCallback(() => setLanguageDropdownVisible(false), []);
  useClickOutside(langRef, closeLang, languageDropdownVisible);

  const navItems: NavItem[] = [
    { hash: '#home', id: 'home', label: t('nav.home') },
    { hash: '#core-values', id: 'core-values', label: t('nav.coreValues') },
    { hash: '#features', id: 'features', label: t('nav.features') },
    { hash: '#roadmap', id: 'roadmap', label: t('nav.roadmap') },
    { hash: '#about', id: 'about', label: t('nav.about') },
    { hash: '#support', id: 'support', label: t('nav.support') },
  ];

  /** 首页用锚点；子页回到首页对应区块 */
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLanguageDropdownVisible(false);
  };

  const brandBlock = isHome ? (
    <a href="#home" className="flex items-center gap-3 no-underline">
      <div className="logo-wrap">
        <img src={logoMarkSrc} alt="Sapphire Mall" />
      </div>
      <div>
        <div className="brand-name">Sapphire Mall</div>
        <div className="brand-tagline">{t('brand.tagline')}</div>
      </div>
    </a>
  ) : (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <div className="logo-wrap">
        <img src={logoMarkSrc} alt="Sapphire Mall" />
      </div>
      <div>
        <div className="brand-name">Sapphire Mall</div>
        <div className="brand-tagline">{t('brand.tagline')}</div>
      </div>
    </Link>
  );

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <nav className={`site-nav ${navElevated ? 'site-nav--elevated' : ''}`} aria-label="Primary">
        <div className="site-container py-4">
          <div className="flex items-center justify-between gap-4">
            {brandBlock}

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={sectionHref(item.hash)}
                  className={`nav-link ${activeSection === item.id ? 'nav-link--active' : ''}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="language-dropdown" ref={langRef}>
                <button type="button" onClick={() => setLanguageDropdownVisible((v) => !v)} className="lang-trigger">
                  <Globe size={15} strokeWidth={1.75} />
                  <span>{currentLang === 'zh' ? t('language.zh') : t('language.en')}</span>
                </button>
                <div className={`dropdown-menu ${languageDropdownVisible ? 'show' : ''}`}>
                  <button type="button" onClick={() => switchLanguage('zh')} className="dropdown-item">
                    <CheckCircle size={14} className="mr-2 text-brand-500" style={{ opacity: currentLang === 'zh' ? 1 : 0 }} />
                    {t('language.zh')}
                  </button>
                  <button type="button" onClick={() => switchLanguage('en')} className="dropdown-item">
                    <CheckCircle size={14} className="mr-2 text-brand-500" style={{ opacity: currentLang === 'en' ? 1 : 0 }} />
                    {t('language.en')}
                  </button>
                </div>
              </div>

              <button type="button" onClick={onLaunchDApp} className="launch-btn hidden sm:inline-flex">
                <span className="launch-btn__icon" aria-hidden>
                  <Rocket size={15} strokeWidth={1.75} />
                </span>
                <span className="launch-btn__label">{t('nav.launchApp')}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuVisible(true)}
                className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-brand-500 transition-colors"
                aria-label={t('nav.menu')}
              >
                <MenuIcon size={22} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuVisible && (
        <>
          <div className="mobile-overlay lg:hidden" onClick={() => setMobileMenuVisible(false)} aria-hidden />
          <div className="mobile-drawer lg:hidden" role="dialog" aria-modal="true">
            <div className="flex justify-between items-center mb-8">
              <span className="font-semibold">{t('nav.menu')}</span>
              <button type="button" onClick={() => setMobileMenuVisible(false)} className="p-1 text-[var(--color-text-secondary)]" aria-label="close">
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
            <nav>
              {navItems.map((link) => (
                <a
                  key={link.id}
                  href={sectionHref(link.hash)}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-8">
              <button type="button" onClick={onLaunchDApp} className="launch-btn action-btn--block w-full">
                <span className="launch-btn__icon" aria-hidden>
                  <Rocket size={15} strokeWidth={1.75} />
                </span>
                <span className="launch-btn__label">{t('nav.launchApp')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SiteNav;
