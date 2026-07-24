import React from 'react';
import { siteLinks } from '../config/siteLinks';
import SiteNav from '../components/home/SiteNav';
import SiteFooter from '../components/home/SiteFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';

type ContentShellProps = {
  children: React.ReactNode;
  /** 面包屑当前页文案（已翻译） */
  breadcrumbCurrent: string;
  /** 全屏等场景隐藏顶栏/页脚/面包屑 */
  chromeHidden?: boolean;
  className?: string;
  /** 是否展示页脚，默认 true */
  showFooter?: boolean;
};

/**
 * 内容子页外壳：与首页相同的顶栏导航 + 内容区面包屑 + 页脚
 */
const ContentShell: React.FC<ContentShellProps> = ({
  children,
  breadcrumbCurrent,
  chromeHidden = false,
  className = '',
  showFooter = true,
}) => {
  const launchDApp = () => {
    window.open(siteLinks.dappUrl, '_blank', 'noopener,noreferrer');
  };

  if (chromeHidden) {
    return <div className={`site-page ${className}`.trim()}>{children}</div>;
  }

  return (
    <div className={`site-page content-shell ${className}`.trim()}>
      <SiteNav activeSection={null} onLaunchDApp={launchDApp} />
      <div className="content-shell__body">
        <div className="site-container">
          <PageBreadcrumb current={breadcrumbCurrent} />
        </div>
        {children}
      </div>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
};

export default ContentShell;
