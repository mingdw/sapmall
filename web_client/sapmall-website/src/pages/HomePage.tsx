import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SEO from '../components/SEO';
import { 
  faRocket, 
  faBook, 
  faPlay, 
  faGlobe, 
  faCheckCircle, 
  faHeart, 
  faEye, 
  faPercentage, 
  faShieldAlt, 
  faUsers, 
  faCoins, 
  faVoteYea, 
  faLayerGroup, 
  faChartLine, 
  faLightbulb, 
  faHandshake, 
  faEnvelope, 
  faHeadset,
  faBars,
  faGem,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faDiscord, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import i18n from '../i18n';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState('zh');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [stats, setStats] = useState({
    tvl: 0,
    users: 0,
    transactions: 0,
    apy: 0
  });

  // 统计数据动画
  useEffect(() => {
    const animateCounters = () => {
      const targetStats = {
        tvl: 125000,
        users: 8500,
        transactions: 45000,
        apy: 15
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
          apy: Math.floor(targetStats.apy * progress)
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
    console.log('Launching DApp...');
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLanguageDropdownVisible(false);
  };

  return (
    <>
      <SEO />
      <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="mx-auto px-6 py-4" style={{ width: '90%' }}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faGem} className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-sapphire-400 to-purple-400 bg-clip-text text-transparent">Sapphire Mall</h1>
                <p className="text-xs text-gray-400">Web3虚拟商品交易平台</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link text-gray-300 hover:text-sapphire-400">{t('nav.home')}</a>
              <a href="#core-values" className="nav-link text-gray-300 hover:text-sapphire-400">{t('nav.coreValues')}</a>
              <a href="#features" className="nav-link text-gray-300 hover:text-sapphire-400">{t('nav.features')}</a>
              <a href="#about" className="nav-link text-gray-300 hover:text-sapphire-400">{t('nav.about')}</a>
              <a href="#docs" className="nav-link text-gray-300 hover:text-sapphire-400">{t('nav.docs')}</a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Language Switch */}
              <div className="language-dropdown">
                <button 
                  onClick={toggleLanguageDropdown} 
                  className="flex items-center space-x-2 text-gray-300 hover:text-sapphire-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>{currentLang === 'zh' ? t('language.zh') : t('language.en')}</span>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                </button>
                <div className={`dropdown-menu ${languageDropdownVisible ? 'show' : ''}`}>
                  <button 
                    onClick={() => switchLanguage('zh')} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sapphire-400 mr-2" style={{ opacity: currentLang === 'zh' ? 1 : 0 }} />
                    {t('language.zh')}
                  </button>
                  <button 
                    onClick={() => switchLanguage('en')} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sapphire-400 mr-2" style={{ opacity: currentLang === 'en' ? 1 : 0 }} />
                    {t('language.en')}
                  </button>
                </div>
              </div>

              {/* Launch App Button */}
              <button 
                onClick={launchDApp} 
                className="launch-btn"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                {t('nav.launchApp')}
              </button>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  onClick={() => setMobileMenuVisible(true)}
                  className="text-gray-300 hover:text-sapphire-400"
                >
                  <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 hero-gradient">
        <div className="mx-auto px-6" style={{ width: '90%' }}>
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {t('hero.subtitle')}
              </p>
              
              {/* Platform Positioning */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <span className="bg-sapphire-500/20 text-sapphire-300 px-4 py-2 rounded-full text-sm font-medium">{t('hero.features.revenueSharing')}</span>
                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">{t('hero.features.daoGovernance')}</span>
                <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium">{t('hero.features.multiChain')}</span>
                <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium">{t('hero.features.globalService')}</span>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button 
                  onClick={launchDApp}
                  className="bg-gradient-to-r from-sapphire-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-sapphire-600 hover:to-purple-700 transition-all duration-300 transform hover:translateY(-2px) hover:shadow-lg"
                >
                  <FontAwesomeIcon icon={faRocket} className="mr-2" />
                  {t('hero.buttons.startTrading')}
                </button>
                <button className="border border-sapphire-500 text-sapphire-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-sapphire-500 hover:text-white transition-all duration-300">
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  {t('hero.buttons.readWhitepaper')}
                </button>
                <button className="border border-gray-500 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-500 hover:text-white transition-all duration-300">
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  {t('hero.buttons.watchDemo')}
                </button>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-sapphire-400 stats-counter mb-2">${stats.tvl.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{t('stats.tvl')}</div>
                <div className="text-xs text-green-400 mt-1">{t('stats.tvlChange')}</div>
              </div>
              <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 stats-counter mb-2">{stats.users.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{t('stats.activeUsers')}</div>
                <div className="text-xs text-green-400 mt-1">{t('stats.usersChange')}</div>
              </div>
              <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 stats-counter mb-2">{stats.transactions.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{t('stats.transactions')}</div>
                <div className="text-xs text-green-400 mt-1">{t('stats.transactionsChange')}</div>
              </div>
              <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400 stats-counter mb-2">{stats.apy}%</div>
                <div className="text-sm text-gray-400">{t('stats.apy')}</div>
                <div className="text-xs text-sapphire-400 mt-1">{t('stats.stakingRewards')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="core-values" className="py-20 bg-gray-900/50">
        <div className="mx-auto px-6" style={{ width: '90%' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('coreValues.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('coreValues.subtitle')}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="core-mission-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="core-mission-icon w-16 h-16 bg-gradient-to-br from-sapphire-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faBullseye} className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('coreValues.mission.title')}</h3>
              <p className="text-gray-300 mb-6">
                {t('coreValues.mission.content')}
              </p>
              <div className="flex items-center space-x-2 text-sapphire-400">
                <FontAwesomeIcon icon={faHeart} />
                <span className="font-semibold">{t('coreValues.mission.tagline')}</span>
              </div>
            </div>

            <div className="core-mission-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="core-mission-icon w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faEye} className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('coreValues.vision.title')}</h3>
              <p className="text-gray-300 mb-6">
                {t('coreValues.vision.content')}
              </p>
              <div className="flex items-center space-x-2 text-purple-400">
                <FontAwesomeIcon icon={faRocket} />
                <span className="font-semibold">{t('coreValues.vision.tagline')}</span>
              </div>
            </div>
          </div>

          {/* Core Advantages */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">{t('coreValues.advantages.title')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="core-advantage-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                <div className="core-advantage-icon w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPercentage} className="text-white text-xl" />
                </div>
                <h4 className="font-bold mb-2">{t('coreValues.advantages.revenueSharing.title')}</h4>
                <p className="text-gray-400 text-sm">{t('coreValues.advantages.revenueSharing.desc')}</p>
              </div>
              <div className="core-advantage-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                <div className="core-advantage-icon w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-white text-xl" />
                </div>
                <h4 className="font-bold mb-2">{t('coreValues.advantages.security.title')}</h4>
                <p className="text-gray-400 text-sm">{t('coreValues.advantages.security.desc')}</p>
              </div>
              <div className="core-advantage-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                <div className="core-advantage-icon w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
                </div>
                <h4 className="font-bold mb-2">{t('coreValues.advantages.governance.title')}</h4>
                <p className="text-gray-400 text-sm">{t('coreValues.advantages.governance.desc')}</p>
              </div>
              <div className="core-advantage-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                <div className="core-advantage-icon w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faGlobe} className="text-white text-xl" />
                </div>
                <h4 className="font-bold mb-2">{t('coreValues.advantages.ecosystem.title')}</h4>
                <p className="text-gray-400 text-sm">{t('coreValues.advantages.ecosystem.desc')}</p>
              </div>
            </div>
          </div>

          {/* Business Background */}
          <div className="core-business-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">{t('coreValues.business.title')}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="core-business-section">
                <h4 className="text-lg font-semibold text-sapphire-400 mb-3">{t('coreValues.business.opportunity.title')}</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  {(t('coreValues.business.opportunity.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="core-business-section">
                <h4 className="text-lg font-semibold text-sapphire-400 mb-3">{t('coreValues.business.advantages.title')}</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  {(t('coreValues.business.advantages.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="core-business-section">
                <h4 className="text-lg font-semibold text-sapphire-400 mb-3">{t('coreValues.business.roadmap.title')}</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  {(t('coreValues.business.roadmap.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto px-6" style={{ width: '90%' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Liquidity Staking */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-sapphire-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faCoins} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.liquidityStaking.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.liquidityStaking.desc')}
                </p>
                <div className="text-sapphire-400 font-semibold">{t('features.liquidityStaking.highlight')}</div>
              </div>
            </div>

            {/* Feature 2: DAO Governance */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faVoteYea} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.daoGovernance.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.daoGovernance.desc')}
                </p>
                <div className="text-purple-400 font-semibold">{t('features.daoGovernance.highlight')}</div>
              </div>
            </div>

            {/* Feature 3: Global Marketplace */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faGlobe} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.globalMarketplace.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.globalMarketplace.desc')}
                </p>
                <div className="text-green-400 font-semibold">{t('features.globalMarketplace.highlight')}</div>
              </div>
            </div>

            {/* Feature 4: Secure Trading */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.secureTrading.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.secureTrading.desc')}
                </p>
                <div className="text-yellow-400 font-semibold">{t('features.secureTrading.highlight')}</div>
              </div>
            </div>

            {/* Feature 5: Multi-Asset Support */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.multiAsset.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.multiAsset.desc')}
                </p>
                <div className="text-red-400 font-semibold">{t('features.multiAsset.highlight')}</div>
              </div>
            </div>

            {/* Feature 6: Advanced Analytics */}
            <div className="feature-card gradient-border">
              <div className="gradient-border-content">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faChartLine} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t('features.analytics.title')}</h3>
                <p className="text-gray-400 mb-4">
                  {t('features.analytics.desc')}
                </p>
                <div className="text-indigo-400 font-semibold">{t('features.analytics.highlight')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900/50">
        <div className="mx-auto px-6" style={{ width: '90%' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t('about.title')}</h2>
              <p className="text-xl text-gray-400">
                {t('about.subtitle')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold mb-6">{t('about.team.title')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('about.team.content')}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sapphire-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">{t('about.team.expertise.title')}</h4>
                      <p className="text-sm text-gray-400">{t('about.team.expertise.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sapphire-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">{t('about.team.experience.title')}</h4>
                      <p className="text-sm text-gray-400">{t('about.team.experience.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sapphire-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">{t('about.team.vision.title')}</h4>
                      <p className="text-sm text-gray-400">{t('about.team.vision.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&crop=center" 
                  alt="Web3 Technology" 
                  className="rounded-xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-sapphire-500/20 to-purple-500/20 rounded-xl"></div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sapphire-400">100+</div>
                    <div className="text-xs text-gray-400">{t('about.stats.projects')}</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">24/7</div>
                    <div className="text-xs text-gray-400">{t('about.stats.support')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Values */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="about-value-card text-center">
                <div className="about-value-icon w-16 h-16 bg-gradient-to-br from-sapphire-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faLightbulb} className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('about.values.innovation.title')}</h3>
                <p className="text-gray-400">{t('about.values.innovation.desc')}</p>
              </div>
              <div className="about-value-card text-center">
                <div className="about-value-icon w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHandshake} className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('about.values.userFirst.title')}</h3>
                <p className="text-gray-400">{t('about.values.userFirst.desc')}</p>
              </div>
              <div className="about-value-card text-center">
                <div className="about-value-icon w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeart} className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('about.values.community.title')}</h3>
                <p className="text-gray-400">{t('about.values.community.desc')}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="about-main-card bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{t('about.contact.title')}</h3>
                <p className="text-gray-400">
                  {t('about.contact.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="about-contact-item text-center p-4">
                  <div className="about-contact-icon w-12 h-12 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('about.contact.business.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('about.contact.business.email')}</p>
                </div>
                <div className="about-contact-item text-center p-4">
                  <div className="about-contact-icon w-12 h-12 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FontAwesomeIcon icon={faHeadset} className="text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('about.contact.support.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('about.contact.support.email')}</p>
                </div>
                <div className="about-contact-item text-center p-4">
                  <div className="about-contact-icon w-12 h-12 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTelegram} className="text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('about.contact.telegram.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('about.contact.telegram.handle')}</p>
                </div>
                <div className="about-contact-item text-center p-4">
                  <div className="about-contact-icon w-12 h-12 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FontAwesomeIcon icon={faDiscord} className="text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('about.contact.discord.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('about.contact.discord.community')}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={launchDApp}
                  className="bg-gradient-to-r from-sapphire-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-sapphire-600 hover:to-purple-700 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faRocket} className="mr-2" />
                  {t('about.contact.buttons.startNow')}
                </button>
                <button className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 hover:text-white transition-all duration-300">
                  <FontAwesomeIcon icon={faTelegram} className="mr-2" />
                  {t('about.contact.buttons.joinCommunity')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="mx-auto px-6" style={{ width: '90%' }}>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faGem} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sapphire-400 to-purple-400 bg-clip-text text-transparent">Sapphire Mall</span>
            </div>
            <p className="text-gray-400 mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-sapphire-400 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sapphire-400 transition-colors">
                <FontAwesomeIcon icon={faTelegram} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sapphire-400 transition-colors">
                <FontAwesomeIcon icon={faDiscord} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sapphire-400 transition-colors">
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">{t('nav.menu')}</h2>
              <button 
                onClick={() => setMobileMenuVisible(false)}
                className="text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
              </button>
            </div>
            <nav className="space-y-4">
              <a href="#home" className="block text-gray-300 hover:text-sapphire-400 py-2">{t('nav.home')}</a>
              <a href="#core-values" className="block text-gray-300 hover:text-sapphire-400 py-2">{t('nav.coreValues')}</a>
              <a href="#features" className="block text-gray-300 hover:text-sapphire-400 py-2">{t('nav.features')}</a>
              <a href="#about" className="block text-gray-300 hover:text-sapphire-400 py-2">{t('nav.about')}</a>
              <a href="#docs" className="block text-gray-300 hover:text-sapphire-400 py-2">{t('nav.docs')}</a>
            </nav>
            <div className="mt-8">
              <button 
                onClick={launchDApp}
                className="w-full bg-gradient-to-r from-sapphire-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                {t('nav.launchApp')}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default HomePage;