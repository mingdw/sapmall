import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Globe, Rocket } from 'lucide-react';
import logoMarkSrc from '../assets/logo-mark.svg';
import i18n from '../i18n';
import { siteLinks } from '../config/siteLinks';
import { useClickOutside } from '../hooks/useClickOutside';

type SubpageChromeProps = {
  children: React.ReactNode;
  /** 沉浸式：隐藏页脚区，用于幻灯片 */
  immersive?: boolean;
  className?: string;
};

/** 子页顶栏：返回首页 + 语言 + 启动应用 */
const SubpageChrome: React.FC<SubpageChromeProps> = ({ children, immersive = false, className = '' }) => {
  const { t } = useTranslation();
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => (i18n.language.startsWith('zh') ? 'zh' : 'en'));
  const langRef = useRef<HTMLDivElement>(null);

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

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLanguageDropdownVisible(false);
  };

  const launchDApp = () => {
    window.open(siteLinks.dappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`site-page subpage ${immersive ? 'subpage--immersive' : ''} ${className}`.trim()}>
      <header className={`subpage-bar ${immersive ? 'subpage-bar--overlay' : ''}`}>
        <div className="site-container subpage-bar__inner">
          <div className="subpage-bar__left">
            <Link to="/" className="subpage-back">
              <ArrowLeft size={16} strokeWidth={1.75} />
              <span>{t('common.backHome')}</span>
            </Link>
            <Link to="/" className="subpage-brand">
              <img src={logoMarkSrc} alt="" className="subpage-brand__mark" />
              <span className="subpage-brand__name">Sapphire Mall</span>
            </Link>
          </div>

          <div className="subpage-bar__right">
            <div className="language-dropdown" ref={langRef}>
              <button
                type="button"
                onClick={() => setLanguageDropdownVisible((v) => !v)}
                className="lang-trigger"
              >
                <Globe size={15} strokeWidth={1.75} />
                <span>{currentLang === 'zh' ? t('language.zh') : t('language.en')}</span>
              </button>
              <div className={`dropdown-menu ${languageDropdownVisible ? 'show' : ''}`}>
                <button type="button" onClick={() => switchLanguage('zh')} className="dropdown-item">
                  <CheckCircle
                    size={14}
                    className="mr-2 text-brand-500"
                    style={{ opacity: currentLang === 'zh' ? 1 : 0 }}
                  />
                  {t('language.zh')}
                </button>
                <button type="button" onClick={() => switchLanguage('en')} className="dropdown-item">
                  <CheckCircle
                    size={14}
                    className="mr-2 text-brand-500"
                    style={{ opacity: currentLang === 'en' ? 1 : 0 }}
                  />
                  {t('language.en')}
                </button>
              </div>
            </div>

            <button type="button" onClick={launchDApp} className="launch-btn hidden sm:inline-flex">
              <span className="launch-btn__icon" aria-hidden>
                <Rocket size={15} strokeWidth={1.75} />
              </span>
              <span className="launch-btn__label">{t('nav.launchApp')}</span>
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
};

export default SubpageChrome;
