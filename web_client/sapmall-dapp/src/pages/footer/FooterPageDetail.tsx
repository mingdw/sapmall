import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bug,
  ChevronRight,
  CircleDollarSign,
  Code2,
  FileText,
  GitBranch,
  Globe2,
  Landmark,
  Package,
  PieChart,
  ScrollText,
  ShieldCheck,
  Store,
  Ticket,
} from 'lucide-react';
import logoMarkSrc from '../../assets/logo-mark.svg';
import styles from './FooterPageDetail.module.scss';

type InternalLink = { kind: 'internal'; to: string; labelKey: string; icon: LucideIcon };
type ExternalLink = { kind: 'external'; href: string; labelKey: string; icon: LucideIcon };
type FooterLinkItem = InternalLink | ExternalLink;

const MALL_LINKS: InternalLink[] = [
  { kind: 'internal', to: '/marketplace', labelKey: 'footer.mall.digitalRights', icon: BadgeCheck },
  { kind: 'internal', to: '/marketplace', labelKey: 'footer.mall.nftRedeem', icon: Ticket },
  { kind: 'internal', to: '/marketplace', labelKey: 'footer.mall.virtualItems', icon: Package },
  { kind: 'internal', to: '/help', labelKey: 'footer.mall.recharge', icon: CircleDollarSign },
];

const ECOSYSTEM_LINKS: FooterLinkItem[] = [
  { kind: 'internal', to: '/dao', labelKey: 'footer.eco.dao', icon: Landmark },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.whitepaper', icon: ScrollText },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.tokenomics', icon: PieChart },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.audit', icon: ShieldCheck },
];

const DEV_LINKS: ExternalLink[] = [
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.dev.api', icon: FileText },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.dev.bounty', icon: Bug },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.dev.guide', icon: BookOpen },
  { kind: 'external', href: 'https://github.com', labelKey: 'footer.dev.opensource', icon: GitBranch },
];

const SOCIAL_LINKS = [
  { href: 'https://twitter.com', label: 'Twitter', iconClass: 'fab fa-twitter' },
  { href: 'https://github.com', label: 'GitHub', iconClass: 'fab fa-github' },
  { href: 'https://t.me', label: 'Telegram', iconClass: 'fab fa-telegram' },
  { href: 'https://youtube.com', label: 'YouTube', iconClass: 'fab fa-youtube' },
] as const;

type LinkColumnProps = {
  titleKey: string;
  columnIcon: LucideIcon;
  accent: 'mall' | 'eco' | 'dev';
  items: FooterLinkItem[];
  t: (key: string) => string;
};

const FooterLinkColumn: React.FC<LinkColumnProps> = ({
  titleKey,
  columnIcon: ColumnIcon,
  accent,
  items,
  t,
}) => (
  <div className={styles.linkColumn} data-accent={accent}>
    <div className={styles.columnHead}>
      <span className={styles.columnIcon} aria-hidden>
        <ColumnIcon strokeWidth={2} />
      </span>
      <h4 className={styles.footerColTitle}>{t(titleKey)}</h4>
    </div>
    <ul className={styles.linkList}>
      {items.map((item) => {
        const ItemIcon = item.icon;
        const label = t(item.labelKey);
        const content = (
          <>
            <span className={styles.linkIconWrap}>
              <ItemIcon strokeWidth={1.75} aria-hidden />
            </span>
            <span className={styles.linkLabel}>{label}</span>
            {item.kind === 'external' ? (
              <ArrowUpRight className={styles.linkArrow} strokeWidth={2} aria-hidden />
            ) : (
              <ChevronRight className={styles.linkArrow} strokeWidth={2} aria-hidden />
            )}
          </>
        );

        return (
          <li key={item.labelKey} className={styles.linkItem}>
            {item.kind === 'internal' ? (
              <Link to={item.to} className={styles.footerLink}>
                {content}
              </Link>
            ) : (
              <a
                href={item.href}
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

const FooterPageDetail: React.FC = () => {
  const { t, ready } = useTranslation();

  if (!ready) {
    return null;
  }

  return (
    <footer className={styles.footerRoot} role="contentinfo">
      <div className={styles.footerBackdrop} aria-hidden />
      <div className={styles.footerGridPattern} aria-hidden />
      <div className={styles.footerTopGlow} aria-hidden />

      <div className={styles.footerInner}>
        <div className={styles.footerMain}>
          <section className={styles.brandSection} aria-labelledby="footer-brand-heading">
            <div className={styles.brandHeader}>
              <div className={styles.brandMarkWrap}>
                <img src={logoMarkSrc} alt="" width={28} height={28} decoding="async" />
              </div>
              <div className={styles.brandTitleBlock}>
                <span id="footer-brand-heading" className={styles.brandName}>
                  {t('footer.brand')}
                </span>
                <span className={styles.brandTagline}>{t('footer.brandTagline')}</span>
              </div>
            </div>

            <p className={styles.brandDesc}>{t('footer.brandDesc')}</p>

            <div className={styles.socialBlock}>
              <span className={styles.socialLabel}>{t('footer.followUs')}</span>
              <div className={styles.socialRow} role="list" aria-label={t('footer.socialAria')}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    className={styles.socialLink}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    role="listitem"
                  >
                    <i className={social.iconClass} aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </section>

          <FooterLinkColumn
            titleKey="footer.colMall"
            columnIcon={Store}
            accent="mall"
            items={MALL_LINKS}
            t={t}
          />
          <FooterLinkColumn
            titleKey="footer.colEco"
            columnIcon={Globe2}
            accent="eco"
            items={ECOSYSTEM_LINKS}
            t={t}
          />
          <FooterLinkColumn
            titleKey="footer.colDev"
            columnIcon={Code2}
            accent="dev"
            items={DEV_LINKS}
            t={t}
          />
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyrightBlock}>
            <span className={styles.statusDot} aria-hidden />
            <span>{t('footer.copyright')}</span>
          </div>
          <nav className={styles.bottomBarLinks} aria-label={t('footer.legalAria')}>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.privacy')}
            </Link>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.terms')}
            </Link>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.cookie')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterPageDetail;
