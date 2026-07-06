import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { siteLinks } from '../../config/siteLinks';
import { getDappPreviewImage } from '../../config/dappPreviewImages';

type DappPreviewFrameProps = {
  /** 当前步骤索引，与左侧「如何使用」步骤联动 */
  activeStep?: number;
  caption?: string;
};

/** DApp 界面预览 — 步骤切换 cross-fade */
const DappPreviewFrame: React.FC<DappPreviewFrameProps> = ({ activeStep = 0, caption }) => {
  const { t, i18n } = useTranslation();
  const [displayStep, setDisplayStep] = useState(activeStep);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (activeStep === displayStep) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setDisplayStep(activeStep);
      return;
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayStep(activeStep);
      setVisible(true);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [activeStep, displayStep]);

  const preview = getDappPreviewImage(i18n.language, displayStep);

  return (
    <div className="dapp-preview">
      <div className="dapp-preview__chrome">
        <span className="dapp-preview__dot" />
        <span className="dapp-preview__dot" />
        <span className="dapp-preview__dot" />
        <span className="dapp-preview__url">{siteLinks.dappMarketplace.replace(/^https?:\/\//, '')}</span>
      </div>
      <div className="dapp-preview__screen">
        <img
          src={preview.src}
          alt={t(preview.altKey)}
          className={`dapp-preview__image ${visible ? 'dapp-preview__image--visible' : ''}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption ? <p className="dapp-preview__caption">{caption}</p> : null}
    </div>
  );
};

export default DappPreviewFrame;
