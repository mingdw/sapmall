import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Rocket,
  BookOpen,
  Play,
  Globe,
  CheckCircle,
  Heart,
  Eye,
  Percent,
  Shield,
  Users,
  Coins,
  Vote,
  Layers,
  TrendingUp,
  Lightbulb,
  Handshake,
  Mail,
  Headphones,
  Menu as MenuIcon,
  Target,
  ExternalLink,
  Send,
  MessageCircle,
  Code2,
  X,
  type LucideIcon,
} from 'lucide-react';
import SEO from '../components/SEO';
import RevealOnScroll from '../components/RevealOnScroll';
import logoMarkSrc from '../assets/logo-mark.svg';
import i18n from '../i18n';

type ActionButtonProps = {
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'primary' | 'outline-accent' | 'outline-muted';
  size?: 'md' | 'lg';
  onClick?: () => void;
  className?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
}) => {
  const iconSize = size === 'lg' ? 18 : 16;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`action-btn action-btn--${variant} action-btn--${size} ${className}`.trim()}
    >
      <span className="action-btn__icon" aria-hidden>
        <Icon size={iconSize} strokeWidth={1.75} />
      </span>
      <span className="action-btn__label">{children}</span>
    </button>
  );
};

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
  highlight: string;
  spanClass?: string;
  delay?: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  desc,
  highlight,
  spanClass = 'bento-span-6',
  delay = 0,
}) => (
  <RevealOnScroll delay={delay} className={spanClass}>
    <div className="surface-card feature-card h-full">
      <div className="icon-box icon-box--lg mb-5">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[var(--color-text)]">{title}</h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed grow">{desc}</p>
      <div className="feature-highlight">{highlight}</div>
    </div>
  </RevealOnScroll>
);

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState('zh');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [stats, setStats] = useState({
    tvl: 0,
    users: 0,
    transactions: 0,
    apy: 0,
  });

  useEffect(() => {
    const animateCounters = () => {
      const targetStats = {
        tvl: 124800,
        users: 8472,
        transactions: 44830,
        apy: 14,
      };

      const duration = 2000;
      const steps = 100;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setStats({
          tvl: Math.floor(targetStats.tvl * progress),
          users: Math.floor(targetStats.users * progress),
          transactions: Math.floor(targetStats.transactions * progress),
          apy: Math.floor(targetStats.apy * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  const launchDApp = () => {
    window.open('http://localhost:7102', '_blank');
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLanguageDropdownVisible(false);
  };

  const brandBlock = (
    <div className="flex items-center gap-3">
      <div className="logo-wrap">
        <img src={logoMarkSrc} alt="Sapphire Mall" />
      </div>
      <div>
        <div className="brand-name">Sapphire Mall</div>
        <div className="brand-tagline">{t('brand.tagline')}</div>
      </div>
    </div>
  );

  return (
    <>
      <SEO />
      <div className="site-page">
        {/* 导航 */}
        <nav className="site-nav">
          <div className="site-container py-4">
            <div className="flex items-center justify-between gap-4">
              {brandBlock}

              <div className="hidden md:flex items-center gap-8">
                <a href="#home" className="nav-link">{t('nav.home')}</a>
                <a href="#core-values" className="nav-link">{t('nav.coreValues')}</a>
                <a href="#features" className="nav-link">{t('nav.features')}</a>
                <a href="#about" className="nav-link">{t('nav.about')}</a>
                <a href="#docs" className="nav-link">{t('nav.docs')}</a>
              </div>

              <div className="flex items-center gap-3">
                <div className="language-dropdown">
                  <button type="button" onClick={toggleLanguageDropdown} className="lang-trigger">
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

                <button
                  type="button"
                  onClick={() => setMobileMenuVisible(true)}
                  className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-brand-500 transition-colors"
                  aria-label={t('nav.menu')}
                >
                  <MenuIcon size={22} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero：左文右数据，打破居中模板 */}
        <section id="home" className="hero-section">
          <div className="site-container relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <RevealOnScroll>
                <p className="hero-eyebrow">Sapphire Mall</p>
                <h1 className="hero-title">{t('hero.title')}</h1>
                <p className="hero-subtitle">{t('hero.subtitle')}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="chip">{t('hero.features.revenueSharing')}</span>
                  <span className="chip">{t('hero.features.daoGovernance')}</span>
                  <span className="chip">{t('hero.features.multiChain')}</span>
                  <span className="chip">{t('hero.features.globalService')}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <ActionButton icon={Rocket} variant="primary" size="lg" onClick={launchDApp}>
                    {t('hero.buttons.startTrading')}
                  </ActionButton>
                  <ActionButton icon={BookOpen} variant="outline-accent" size="lg">
                    {t('hero.buttons.readWhitepaper')}
                  </ActionButton>
                  <ActionButton icon={Play} variant="outline-muted" size="lg">
                    {t('hero.buttons.watchDemo')}
                  </ActionButton>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card">
                    <div className="text-2xl md:text-3xl stats-counter mb-1">
                      ${stats.tvl.toLocaleString()}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{t('stats.tvl')}</div>
                    <div className="text-xs text-brand-600 mt-1">{t('stats.tvlChange')}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl md:text-3xl stats-counter mb-1">
                      {stats.users.toLocaleString()}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{t('stats.activeUsers')}</div>
                    <div className="text-xs text-brand-600 mt-1">{t('stats.usersChange')}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl md:text-3xl stats-counter mb-1">
                      {stats.transactions.toLocaleString()}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{t('stats.transactions')}</div>
                    <div className="text-xs text-brand-600 mt-1">{t('stats.transactionsChange')}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl md:text-3xl stats-counter mb-1">{stats.apy}%</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{t('stats.apy')}</div>
                    <div className="text-xs text-brand-600 mt-1">{t('stats.contributorRewards')}</div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* 核心价值 */}
        <section id="core-values" className="section-muted section-padding">
          <div className="site-container">
            <RevealOnScroll className="mb-14 max-w-2xl">
              <p className="section-eyebrow">{t('nav.coreValues')}</p>
              <h2 className="section-title">{t('coreValues.title')}</h2>
              <p className="section-desc">{t('coreValues.subtitle')}</p>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <RevealOnScroll delay={0}>
                <div className="surface-card h-full">
                  <div className="icon-box icon-box--lg mb-5">
                    <Target size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{t('coreValues.mission.title')}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {t('coreValues.mission.content')}
                  </p>
                  <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                    <Heart size={16} strokeWidth={1.75} />
                    <span>{t('coreValues.mission.tagline')}</span>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={80}>
                <div className="surface-card h-full">
                  <div className="icon-box icon-box--lg mb-5">
                    <Eye size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{t('coreValues.vision.title')}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {t('coreValues.vision.content')}
                  </p>
                  <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                    <TrendingUp size={16} strokeWidth={1.75} />
                    <span>{t('coreValues.vision.tagline')}</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mb-10">
              <h3 className="text-2xl font-semibold">{t('coreValues.advantages.title')}</h3>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 gap-5 mb-12">
              {[
                { icon: Percent, title: t('coreValues.advantages.revenueSharing.title'), desc: t('coreValues.advantages.revenueSharing.desc') },
                { icon: Shield, title: t('coreValues.advantages.security.title'), desc: t('coreValues.advantages.security.desc') },
                { icon: Users, title: t('coreValues.advantages.governance.title'), desc: t('coreValues.advantages.governance.desc') },
                { icon: Globe, title: t('coreValues.advantages.ecosystem.title'), desc: t('coreValues.advantages.ecosystem.desc') },
              ].map((item, index) => (
                <RevealOnScroll key={item.title} delay={index * 60}>
                  <div className="surface-card flex gap-4 items-start">
                    <div className="icon-box">
                      <item.icon size={20} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll>
              <div className="surface-card">
                <h3 className="text-xl font-semibold mb-8">{t('coreValues.business.title')}</h3>
                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                  {[
                    { title: t('coreValues.business.opportunity.title'), items: t('coreValues.business.opportunity.items', { returnObjects: true }) as string[] },
                    { title: t('coreValues.business.advantages.title'), items: t('coreValues.business.advantages.items', { returnObjects: true }) as string[] },
                    { title: t('coreValues.business.roadmap.title'), items: t('coreValues.business.roadmap.items', { returnObjects: true }) as string[] },
                  ].map((block) => (
                    <div key={block.title}>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-600 mb-4">
                        {block.title}
                      </h4>
                      <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-brand-500 mt-1.5 shrink-0">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 平台功能：Bento 不对称网格 */}
        <section id="features" className="section-padding">
          <div className="site-container">
            <RevealOnScroll className="mb-14 max-w-2xl">
              <p className="section-eyebrow">{t('nav.features')}</p>
              <h2 className="section-title">{t('features.title')}</h2>
              <p className="section-desc">{t('features.subtitle')}</p>
            </RevealOnScroll>

            <div className="bento-grid">
              <FeatureCard
                spanClass="bento-span-7"
                icon={Coins}
                title={t('features.contributionRewards.title')}
                desc={t('features.contributionRewards.desc')}
                highlight={t('features.contributionRewards.highlight')}
                delay={0}
              />
              <FeatureCard
                spanClass="bento-span-5"
                icon={Vote}
                title={t('features.daoGovernance.title')}
                desc={t('features.daoGovernance.desc')}
                highlight={t('features.daoGovernance.highlight')}
                delay={60}
              />
              <FeatureCard
                spanClass="bento-span-6"
                icon={Globe}
                title={t('features.globalMarketplace.title')}
                desc={t('features.globalMarketplace.desc')}
                highlight={t('features.globalMarketplace.highlight')}
                delay={120}
              />
              <FeatureCard
                spanClass="bento-span-6"
                icon={Shield}
                title={t('features.secureTrading.title')}
                desc={t('features.secureTrading.desc')}
                highlight={t('features.secureTrading.highlight')}
                delay={180}
              />
              <FeatureCard
                spanClass="bento-span-6"
                icon={Layers}
                title={t('features.multiAsset.title')}
                desc={t('features.multiAsset.desc')}
                highlight={t('features.multiAsset.highlight')}
                delay={240}
              />
              <FeatureCard
                spanClass="bento-span-6"
                icon={TrendingUp}
                title={t('features.analytics.title')}
                desc={t('features.analytics.desc')}
                highlight={t('features.analytics.highlight')}
                delay={300}
              />
            </div>
          </div>
        </section>

        {/* 关于我们 */}
        <section id="about" className="section-muted section-padding">
          <div className="site-container">
            <RevealOnScroll className="mb-14 text-center mx-auto max-w-2xl">
              <p className="section-eyebrow">{t('nav.about')}</p>
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="section-desc mx-auto">{t('about.subtitle')}</p>
            </RevealOnScroll>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <RevealOnScroll>
                <h3 className="text-2xl font-semibold mb-5">{t('about.team.title')}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
                  {t('about.team.content')}
                </p>
                <div className="space-y-5">
                  {[
                    { title: t('about.team.expertise.title'), desc: t('about.team.expertise.desc') },
                    { title: t('about.team.experience.title'), desc: t('about.team.experience.desc') },
                    { title: t('about.team.vision.title'), desc: t('about.team.vision.desc') },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <CheckCircle size={18} className="text-brand-500 mt-0.5 shrink-0" strokeWidth={1.75} />
                      <div>
                        <h4 className="font-semibold mb-0.5">{item.title}</h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <div className="about-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&crop=center"
                    alt="Web3 Technology"
                  />
                  <div className="about-float-stat -top-3 -right-3 md:top-4 md:right-4">
                    <div className="text-xl font-bold stats-counter">100+</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{t('about.stats.projects')}</div>
                  </div>
                  <div className="about-float-stat -bottom-3 -left-3 md:bottom-4 md:left-4">
                    <div className="text-xl font-bold stats-counter">24/7</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{t('about.stats.support')}</div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Lightbulb, title: t('about.values.innovation.title'), desc: t('about.values.innovation.desc') },
                { icon: Handshake, title: t('about.values.userFirst.title'), desc: t('about.values.userFirst.desc') },
                { icon: Heart, title: t('about.values.community.title'), desc: t('about.values.community.desc') },
              ].map((item, index) => (
                <RevealOnScroll key={item.title} delay={index * 70}>
                  <div className="surface-card text-center h-full">
                    <div className="icon-box icon-box--lg mx-auto mb-4">
                      <item.icon size={20} strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll>
              <div className="surface-card">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-3">{t('about.contact.title')}</h3>
                  <p className="text-[var(--color-text-secondary)]">{t('about.contact.subtitle')}</p>
                </div>

                <div className="contact-grid mb-8">
                  {[
                    { icon: Mail, title: t('about.contact.business.title'), detail: t('about.contact.business.email') },
                    { icon: Headphones, title: t('about.contact.support.title'), detail: t('about.contact.support.email') },
                    { icon: Send, title: t('about.contact.telegram.title'), detail: t('about.contact.telegram.handle') },
                    { icon: MessageCircle, title: t('about.contact.discord.title'), detail: t('about.contact.discord.community') },
                  ].map((item) => (
                    <div key={item.title} className="contact-item text-center">
                      <div className="icon-box mx-auto mb-3">
                        <item.icon size={18} strokeWidth={1.75} />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-[var(--color-text-secondary)]">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <ActionButton icon={Rocket} variant="primary" onClick={launchDApp}>
                    {t('about.contact.buttons.startNow')}
                  </ActionButton>
                  <ActionButton icon={Send} variant="outline-muted">
                    {t('about.contact.buttons.joinCommunity')}
                  </ActionButton>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 文档与资源 */}
        <section id="docs" className="section-padding border-t border-[var(--color-border)]">
          <div className="site-container">
            <RevealOnScroll className="max-w-2xl mb-10">
              <p className="section-eyebrow">{t('nav.docs')}</p>
              <h2 className="section-title">{t('docsSection.title')}</h2>
              <p className="section-desc">{t('docsSection.subtitle')}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={80}>
              <div className="flex flex-col sm:flex-row gap-3">
                <ActionButton icon={BookOpen} variant="outline-accent" size="lg">
                  {t('docsSection.whitepaper')}
                </ActionButton>
                <ActionButton icon={Rocket} variant="primary" size="lg" onClick={launchDApp}>
                  {t('docsSection.launchDapp')}
                </ActionButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 页脚 */}
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
              {[ExternalLink, Send, MessageCircle, Code2].map((Icon, i) => (
                <button key={i} type="button" className="footer-social-btn" aria-label="social">
                  <Icon size={18} strokeWidth={1.75} />
                </button>
              ))}
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{t('footer.copyright')}</p>
          </div>
        </footer>

        {/* 移动端菜单 */}
        {mobileMenuVisible && (
          <>
            <div
              className="mobile-overlay md:hidden"
              onClick={() => setMobileMenuVisible(false)}
              aria-hidden
            />
            <div className="mobile-drawer md:hidden">
              <div className="flex justify-between items-center mb-8">
                <span className="font-semibold">{t('nav.menu')}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuVisible(false)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-brand-500"
                  aria-label="close menu"
                >
                  <X size={22} strokeWidth={1.75} />
                </button>
              </div>
              <nav>
                {[
                  { href: '#home', label: t('nav.home') },
                  { href: '#core-values', label: t('nav.coreValues') },
                  { href: '#features', label: t('nav.features') },
                  { href: '#about', label: t('nav.about') },
                  { href: '#docs', label: t('nav.docs') },
                ].map((link) => (
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
              <div className="mt-8">
                <button type="button" onClick={launchDApp} className="launch-btn action-btn--block w-full">
                  <span className="launch-btn__icon" aria-hidden>
                    <Rocket size={15} strokeWidth={1.75} />
                  </span>
                  <span className="launch-btn__label">{t('nav.launchApp')}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
