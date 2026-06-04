import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  CheckCircle2,
  Coins,
  FileText,
  Flag,
  MessageCircle,
  Radio,
  Sparkles,
  Store,
  Users,
  Vote,
} from 'lucide-react';
import { DAO_DISCORD_URL } from '../constants';
import type { DaoHeroAsideIcon, DaoHeroAsideItem, DaoHeroDimension, DaoHeroSlide } from '../types';
import HeroCountUp from './HeroCountUp';
const dimensionTabIconMap: Record<DaoHeroDimension, LucideIcon> = {
  discussions: MessageCircle,
  proposals: FileText,
  events: Sparkles,
};

const getAsideIcon = (icon: DaoHeroAsideIcon): LucideIcon => {
  switch (icon) {
    case 'message':
      return MessageCircle;
    case 'store':
      return Store;
    case 'users':
      return Users;
    case 'vote':
      return Vote;
    case 'check':
      return CheckCircle2;
    case 'clock':
    case 'calendar':
      return CalendarClock;
    case 'radio':
      return Radio;
    case 'coins':
      return Coins;
    case 'flag':
      return Flag;
    default: {
      const _exhaustive: never = icon;
      return _exhaustive;
    }
  }
};

type Props = {
  slides: DaoHeroSlide[];
  slideIndex: number;
  onSlideIndexChange: (index: number) => void;
};

const DaoHeroCarousel: React.FC<Props> = ({ slides, slideIndex, onSlideIndexChange }) => {
  const { t } = useTranslation();

  return (
    <div className="heroCarouselViewport" aria-live="polite">
      <div
        className="heroDimensionNav"
        role="tablist"
        aria-label={t('dao.hero.dimensionNavAria')}
      >
        {slides.map((slide, i) => {
          const TabIcon = dimensionTabIconMap[slide.id];
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === slideIndex}
              className="heroDimensionTab"
              data-active={i === slideIndex}
              data-dimension={slide.id}
              onClick={() => onSlideIndexChange(i)}
            >
              <TabIcon className="heroDimensionTabIcon" strokeWidth={2.25} aria-hidden />
              <span>{t(`dao.hero.dimensions.${slide.id}`)}</span>
            </button>
          );
        })}
      </div>

      <div className="heroSlidesTrack">
        {slides.map((slide, i) => {
          const isActive = i === slideIndex;

          return (
            <div
              key={slide.id}
              className="heroCarouselSlide"
              data-active={isActive}
              data-dimension={slide.id}
              aria-hidden={!isActive}
            >
              <div className="heroSlideStack">
                <div
                  className="heroSlideIntro"
                  data-dimension={slide.id}
                  data-copy-active={isActive ? 'true' : 'false'}
                >
                  <div className="heroTitleRow">
                    <h2
                      className="heroSlideTitle heroCopyStaggerItem heroCopyStagger1"
                      data-dimension={slide.id}
                    >
                      {t(slide.titleKey)}
                    </h2>
                    <span
                      className="heroSlideTag heroCopyStaggerItem heroCopyStagger2"
                      data-dimension={slide.id}
                    >
                      {t(`dao.hero.dimensions.${slide.id}`)}
                    </span>
                  </div>
                  <p
                    className="heroSlideDesc heroCopyStaggerItem heroCopyStagger3"
                    data-dimension={slide.id}
                  >
                    {t(slide.descriptionKey)}
                  </p>
                </div>

                <HeroAside slide={slide} isActive={isActive} t={t} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type AsideProps = {
  slide: DaoHeroSlide;
  isActive: boolean;
  t: (key: string) => string;
};

const HeroAside: React.FC<AsideProps> = ({ slide, isActive, t }) => {
  if (slide.asideKind === 'spotlight' && slide.spotlight) {
    return (
      <aside className="heroSlideAside" data-kind="spotlight">
        <div className="heroSpotlight">
          <Radio className="heroSpotlightIcon" strokeWidth={2.5} aria-hidden />
          <div className="heroSpotlightCopy">
            <p className="heroSpotlightHeadline">{t(slide.spotlight.headlineKey)}</p>
            {slide.spotlight.footnoteKey ? (
              <p className="heroSpotlightFoot">{t(slide.spotlight.footnoteKey)}</p>
            ) : null}
          </div>
        </div>
        {slide.asideItems?.length ? (
          <div className="heroAsideMiniRow">
            {slide.asideItems.map((item) => (
              <AsideInlineItem key={item.id} item={item} isActive={isActive} t={t} />
            ))}
          </div>
        ) : null}
      </aside>
    );
  }

  if (slide.asideKind === 'governance' && slide.asideItems?.length) {
    return (
      <aside className="heroSlideAside" data-kind="governance">
        <div className="heroGovRow" role="list">
          {slide.asideItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 ? <span className="heroStatSep" aria-hidden /> : null}
              <span className="heroGovMetric" role="listitem" data-item-id={item.id}>
                <AsideIcon icon={item.icon} />
                <span className="heroGovText">
                  <span className="heroGovLabel">{t(item.labelKey)}</span>
                  {item.value ? (
                    <HeroCountUp
                      value={item.value}
                      active={isActive}
                      className="heroGovValue"
                    />
                  ) : null}
                </span>
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="heroAsideHint">{t('dao.hero.aside.proposals.hint')}</p>
      </aside>
    );
  }

  if (slide.asideItems?.length) {
    return (
      <aside className="heroSlideAside" data-kind="inlineStats">
        <div className="heroStatRow">
          {slide.asideItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 ? <span className="heroStatSep" aria-hidden /> : null}
              <AsideInlineItem item={item} isActive={isActive} t={t} />
            </React.Fragment>
          ))}
        </div>
      </aside>
    );
  }

  return null;
};

type InlineProps = {
  item: DaoHeroAsideItem;
  isActive: boolean;
  t: (key: string) => string;
};

const AsideIcon: React.FC<{ icon: DaoHeroAsideIcon }> = ({ icon }) => {
  const Icon = getAsideIcon(icon);
  return (
    <Icon
      className="heroAsideIcon"
      data-icon={icon}
      strokeWidth={2.5}
      aria-hidden
    />
  );
};

const AsideInlineItem: React.FC<InlineProps> = ({ item, isActive, t }) => {
  const content = (
    <>
      <AsideIcon icon={item.icon} />
      <span className="heroStatLabel">{t(item.labelKey)}</span>
      {item.value ? (
        <HeroCountUp value={item.value} active={isActive} className="heroStatValue" />
      ) : null}
    </>
  );

  if (item.externalLink === 'discord') {
    return (
      <button
        type="button"
        className="heroStatItem"
        data-item-id={item.id}
        data-link="discord"
        onClick={() => window.open(DAO_DISCORD_URL, '_blank', 'noopener,noreferrer')}
      >
        {content}
      </button>
    );
  }

  return (
    <span className="heroStatItem" data-item-id={item.id}>
      {content}
    </span>
  );
};

export default DaoHeroCarousel;



