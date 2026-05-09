import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoMarkSrc from '../../assets/logo-mark.svg';
import styles from './FooterPageDetail.module.scss';

const FooterPageDetail: React.FC = () => {
  const { t, ready } = useTranslation();

  if (!ready) {
    return null;
  }

  const mallLinks: { to: string; labelKey: string }[] = [
    { to: '/marketplace', labelKey: 'footer.mall.digitalRights' },
    { to: '/marketplace', labelKey: 'footer.mall.nftRedeem' },
    { to: '/marketplace', labelKey: 'footer.mall.virtualItems' },
    { to: '/help', labelKey: 'footer.mall.recharge' },
  ];

  type EcoLink =
    | { kind: 'internal'; to: string; labelKey: string }
    | { kind: 'external'; href: string; labelKey: string };

  const ecosystemLinks: EcoLink[] = [
    { kind: 'internal', to: '/dao', labelKey: 'footer.eco.dao' },
    { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.whitepaper' },
    { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.tokenomics' },
    { kind: 'external', href: 'https://github.com', labelKey: 'footer.eco.audit' },
  ];

  const devLinks: { href: string; labelKey: string }[] = [
    { href: 'https://github.com', labelKey: 'footer.dev.api' },
    { href: 'https://github.com', labelKey: 'footer.dev.bounty' },
    { href: 'https://github.com', labelKey: 'footer.dev.guide' },
    { href: 'https://github.com', labelKey: 'footer.dev.opensource' },
  ];

  return (
    <footer className={styles.footerRoot} role="contentinfo">
      <div className={styles.footerInner}>
        <div className="mb-0 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-10">
          {/* 品牌 + 简介 + 社交（占 2 列，与原型 lg:col-span-2 一致） */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className={styles.brandMarkWrap}>
                <img src={logoMarkSrc} alt="" className="h-7 w-7 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{t('footer.brand')}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">{t('footer.brandDesc')}</p>
            <div className="mt-6 flex gap-4">
              <a
                className={styles.socialLink}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl" aria-hidden />
              </a>
              <a
                className={styles.socialLink}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github text-xl" aria-hidden />
              </a>
              <a
                className={styles.socialLink}
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <i className="fab fa-telegram text-xl" aria-hidden />
              </a>
              <a
                className={styles.socialLink}
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-xl" aria-hidden />
              </a>
            </div>
          </div>

          {/* 商城服务 */}
          <div>
            <h4 className={styles.footerColTitle}>{t('footer.colMall')}</h4>
            <ul className="flex flex-col gap-3">
              {mallLinks.map((item) => (
                <li key={item.labelKey}>
                  <Link to={item.to} className={styles.footerLink}>
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 关于生态 */}
          <div>
            <h4 className={styles.footerColTitle}>{t('footer.colEco')}</h4>
            <ul className="flex flex-col gap-3">
              {ecosystemLinks.map((item) => (
                <li key={item.labelKey}>
                  {item.kind === 'internal' ? (
                    <Link to={item.to} className={styles.footerLink}>
                      {t(item.labelKey)}
                    </Link>
                  ) : (
                    <a href={item.href} className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                      {t(item.labelKey)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 开发者 */}
          <div>
            <h4 className={styles.footerColTitle}>{t('footer.colDev')}</h4>
            <ul className="flex flex-col gap-3">
              {devLinks.map((item) => (
                <li key={item.labelKey}>
                  <a href={item.href} className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className="m-0 text-center md:text-left">{t('footer.copyright')}</p>
          <div className={styles.bottomBarLinks}>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.privacy')}
            </Link>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.terms')}
            </Link>
            <Link to="/help" className={styles.bottomBarLink}>
              {t('footer.cookie')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPageDetail;
