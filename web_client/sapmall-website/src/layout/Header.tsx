import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from 'antd';
import { Menu as MenuIcon, Rocket, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoMarkSrc from '../assets/logo-mark.svg';
import { siteLinks } from '../config/siteLinks';
import i18n from '../i18n';

/** 备用布局 Header，与 HomePage 浅色风格一致 */
const Header: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language.startsWith('zh') ? 'zh' : 'en');

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#core-values', label: t('nav.coreValues') },
    { href: '#features', label: t('nav.features') },
    { href: '#about', label: t('nav.about') },
    { href: '#docs', label: t('nav.docs') },
  ];

  const launchDApp = () => {
    window.open(siteLinks.dappUrl, '_blank');
  };

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="site-nav">
      <div className="site-container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="logo-wrap">
              <img src={logoMarkSrc} alt="Sapphire Mall" />
            </div>
            <div>
              <Link to="/" className="brand-name">
                Sapphire Mall
              </Link>
              <div className="brand-tagline">{t('brand.tagline')}</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 lang-trigger">
              <button
                type="button"
                onClick={() => switchLanguage('zh')}
                className={`px-2 py-1 text-xs rounded ${currentLang === 'zh' ? 'text-brand-600 font-semibold' : 'text-[var(--color-text-muted)]'}`}
              >
                {t('language.zh')}
              </button>
              <span className="text-[var(--color-border)]">|</span>
              <button
                type="button"
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${currentLang === 'en' ? 'text-brand-600 font-semibold' : 'text-[var(--color-text-muted)]'}`}
              >
                {t('language.en')}
              </button>
            </div>

            <button type="button" onClick={launchDApp} className="launch-btn hidden sm:inline-flex">
              <span className="launch-btn__icon" aria-hidden>
                <Rocket size={15} strokeWidth={1.75} />
              </span>
              <span className="launch-btn__label">{t('nav.launchApp')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuVisible(true)}
              className="md:hidden p-2 text-[var(--color-text-secondary)]"
              aria-label={t('nav.menu')}
            >
              <MenuIcon size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <Drawer
        title={t('nav.menu')}
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        closeIcon={<X size={18} strokeWidth={1.75} />}
      >
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMobileMenuVisible(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={launchDApp} className="launch-btn action-btn--block w-full mt-6">
          <span className="launch-btn__icon" aria-hidden>
            <Rocket size={15} strokeWidth={1.75} />
          </span>
          <span className="launch-btn__label">{t('nav.launchApp')}</span>
        </button>
      </Drawer>
    </nav>
  );
};

export default Header;
