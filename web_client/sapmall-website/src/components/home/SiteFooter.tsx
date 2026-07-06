import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  CircleDot,
  Code2,
  Compass,
  Gem,
  Globe2,
  HelpCircle,
  Home,
  Layers,
  Mail,
  Map,
  MessageCircle,
  Network,
  Send,
  Target,
  Users,
  ExternalLink,
} from 'lucide-react';
import logoMarkSrc from '../../assets/logo-mark.svg';
import { siteLinks } from '../../config/siteLinks';

const ECO_NETWORK_ICONS: LucideIcon[] = [CircleDot, Network, Layers, Gem];

const SOCIAL = [
  { href: siteLinks.twitter, labelKey: 'footer.social.twitter', icon: ExternalLink, brand: 'twitter' },
  { href: siteLinks.github, labelKey: 'footer.social.github', icon: Code2, brand: 'github' },
  { href: siteLinks.telegram, labelKey: 'footer.social.telegram', icon: Send, brand: 'telegram' },
  { href: siteLinks.discord, labelKey: 'footer.social.discord', icon: MessageCircle, brand: 'discord' },
] as const;

const FOOTER_NAV: { href: string; labelKey: string; icon: LucideIcon }[] = [
  { href: '#home', labelKey: 'nav.home', icon: Home },
  { href: '#core-values', labelKey: 'nav.coreValues', icon: Target },
  { href: '#features', labelKey: 'nav.features', icon: Layers },
  { href: '#roadmap', labelKey: 'nav.roadmap', icon: Map },
  { href: '#about', labelKey: 'nav.about', icon: Users },
  { href: '#support', labelKey: 'nav.support', icon: HelpCircle },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 页脚：四列主区（品牌 / 快速导航 / 生态网络 / 订阅）+ 底栏法律信息 */
const SiteFooter: React.FC = () => {
  const { t } = useTranslation();
  const partnerItems = t('partners.items', { returnObjects: true }) as string[];
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('success');
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__glow" aria-hidden />
      <div className="site-container site-footer__inner">
        <div className="site-footer__main">
          {/* 第一列：品牌 + 社交 */}
          <section className="site-footer__col site-footer__col--brand" aria-labelledby="footer-brand-heading">
            <div className="site-footer__brand-head">
              <a href="#home" className="site-footer__brand-mark no-underline">
                <img src={logoMarkSrc} alt="" width={28} height={28} decoding="async" />
              </a>
              <div>
                <span id="footer-brand-heading" className="site-footer__brand-name">
                  Sapphire Mall
                </span>
                <span className="site-footer__brand-tagline">{t('brand.tagline')}</span>
              </div>
            </div>
            <p className="site-footer__brand-desc">{t('footer.tagline')}</p>
            <div className="site-footer__social-block">
              <span className="site-footer__social-label">{t('footer.followUs')}</span>
              <div className="site-footer__social-row" role="list" aria-label={t('footer.socialAria')}>
                {SOCIAL.map(({ href, labelKey, icon: Icon, brand }) => (
                  <a
                    key={labelKey}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer__social-link"
                    data-brand={brand}
                    aria-label={t(labelKey)}
                    role="listitem"
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* 第二列：快速导航（双列链接） */}
          <nav className="site-footer__col site-footer__col--nav" aria-label={t('footer.quickNav')}>
            <div className="site-footer__col-head">
              <span className="site-footer__col-icon site-footer__col-icon--nav" aria-hidden>
                <Compass size={14} strokeWidth={2} />
              </span>
              <h3 className="site-footer__col-title">{t('footer.quickNav')}</h3>
            </div>
            <ul className="site-footer__nav-grid">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="site-footer__nav-link">
                    <span className="site-footer__nav-icon" aria-hidden>
                      <item.icon size={14} strokeWidth={1.75} />
                    </span>
                    <span className="site-footer__nav-label">{t(item.labelKey)}</span>
                    <ChevronRight className="site-footer__nav-arrow" size={14} strokeWidth={2} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 第三列：生态网络 */}
          <div className="site-footer__col site-footer__col--eco">
            <div className="site-footer__col-head">
              <span className="site-footer__col-icon site-footer__col-icon--eco" aria-hidden>
                <Globe2 size={14} strokeWidth={2} />
              </span>
              <h3 className="site-footer__col-title">{t('partners.title')}</h3>
            </div>
            <p className="site-footer__col-desc">{t('partners.subtitle')}</p>
            <div className="site-footer__eco-list">
              {partnerItems.map((name, index) => {
                const EcoIcon = ECO_NETWORK_ICONS[index] ?? Globe2;
                return (
                  <span key={name} className="site-footer__eco-item">
                    <span className="site-footer__eco-icon" aria-hidden>
                      <EcoIcon size={12} strokeWidth={2} />
                    </span>
                    <span className="site-footer__eco-name">{name}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 第四列：订阅动态 */}
          <div className="site-footer__col site-footer__col--newsletter">
            <div className="site-footer__col-head">
              <span className="site-footer__col-icon site-footer__col-icon--mail" aria-hidden>
                <Mail size={14} strokeWidth={2} />
              </span>
              <h3 className="site-footer__col-title">{t('newsletter.title')}</h3>
            </div>
            <p className="site-footer__col-desc">{t('newsletter.subtitle')}</p>

            {newsletterStatus === 'success' ? (
              <p className="newsletter-success newsletter-success--footer" role="status">
                {t('newsletter.success')}
              </p>
            ) : (
              <form className="newsletter-form newsletter-form--footer-col" onSubmit={handleNewsletterSubmit}>
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  {t('newsletter.placeholder')}
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (newsletterStatus === 'error') setNewsletterStatus('idle');
                  }}
                  placeholder={t('newsletter.placeholder')}
                  className="newsletter-input newsletter-input--footer"
                  autoComplete="email"
                />
                <button type="submit" className="site-footer__subscribe-btn">
                  <Mail size={14} strokeWidth={1.75} aria-hidden />
                  <span>{t('newsletter.button')}</span>
                </button>
              </form>
            )}

            {newsletterStatus === 'error' ? (
              <p className="newsletter-error newsletter-error--footer" role="alert">
                {t('newsletter.invalidEmail')}
              </p>
            ) : null}
            <p className="site-footer__newsletter-note">{t('newsletter.privacyNote')}</p>
          </div>
        </div>

        {/* 底栏：版权 + 法律链接 */}
        <div className="site-footer__bar">
          <div className="site-footer__copyright">
            <span className="site-footer__status-dot" aria-hidden />
            <span>{t('footer.copyright')}</span>
          </div>
          <nav className="site-footer__legal" aria-label={t('footer.legalAria')}>
            <Link to="/privacy" className="site-footer__legal-link">
              {t('footer.privacy')}
            </Link>
            <span className="site-footer__legal-sep" aria-hidden>·</span>
            <Link to="/terms" className="site-footer__legal-link">
              {t('footer.terms')}
            </Link>
            <span className="site-footer__legal-sep" aria-hidden>·</span>
            <Link to="/cookies" className="site-footer__legal-link">
              {t('footer.cookie')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
