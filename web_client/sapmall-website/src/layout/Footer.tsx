import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Send, MessageCircle, Code2 } from 'lucide-react';
import logoMarkSrc from '../assets/logo-mark.svg';

/** 备用布局 Footer，与 HomePage 浅色风格一致 */
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="site-container text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="logo-wrap w-8 h-8">
            <img src={logoMarkSrc} alt="Sapphire Mall" />
          </div>
          <span className="brand-name">Sapphire Mall</span>
        </div>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          {t('footer.tagline')}
        </p>
        <div className="flex justify-center gap-3 mb-6">
          {[ExternalLink, Send, MessageCircle, Code2].map((Icon, index) => (
            <button key={index} type="button" className="footer-social-btn" aria-label="social">
              <Icon size={18} strokeWidth={1.75} />
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
