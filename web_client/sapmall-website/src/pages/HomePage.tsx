import React from 'react';
import SEO from '../components/SEO';
import { siteLinks } from '../config/siteLinks';
import { useActiveSection } from '../hooks/useActiveSection';
import SiteNav from '../components/home/SiteNav';
import HeroSection from '../components/home/HeroSection';
import CoreValuesSection from '../components/home/CoreValuesSection';
import PlatformFeaturesSection from '../components/home/PlatformFeaturesSection';
import RoadmapSection from '../components/home/RoadmapSection';
import AboutSection from '../components/home/AboutSection';
import SupportSection from '../components/home/SupportSection';
import SiteFooter from '../components/home/SiteFooter';

const HomePage: React.FC = () => {
  const activeSection = useActiveSection();

  const launchDApp = () => {
    window.open(siteLinks.dappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO />
      <div className="site-page">
        <SiteNav activeSection={activeSection} onLaunchDApp={launchDApp} />

        <main id="main-content">
          <HeroSection onLaunchDApp={launchDApp} />
          <CoreValuesSection />
          <PlatformFeaturesSection />
          <RoadmapSection />
          <AboutSection />
          <SupportSection onLaunchDApp={launchDApp} />
        </main>

        <SiteFooter />
      </div>
    </>
  );
};

export default HomePage;
