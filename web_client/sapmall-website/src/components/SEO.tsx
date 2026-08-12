import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE_URL, absoluteUrl } from '../config/site';
import { siteLinks } from '../config/siteLinks';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  /** 相对路径（如 /whitepaper）或绝对 URL；用于 canonical / og:url */
  path?: string;
  /** @deprecated 请改用 path；若传入绝对 URL 仍可用 */
  url?: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  path = '/',
  url,
  image,
  type = 'website',
}) => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith('zh') ? 'zh' : 'en';
  const siteName = 'Sapphire Mall';
  const defaultTitle =
    currentLang === 'zh'
      ? 'Sapphire Mall - Web3虚拟商品交易平台'
      : 'Sapphire Mall - Web3 Virtual Goods Trading Platform';
  const defaultDescription =
    currentLang === 'zh'
      ? 'Sapphire Mall是全球领先的Web3虚拟商品交易平台，通过贡献激励、DAO治理和多元化资产支持，为用户提供安全、高效、收益丰厚的交易体验。'
      : "Sapphire Mall is the world's leading Web3 virtual goods trading platform, providing users with secure, efficient, and rewarding experiences through contribution incentives, DAO governance, and diversified asset support.";
  const defaultKeywords =
    currentLang === 'zh'
      ? 'Web3,虚拟商品,交易平台,区块链,DAO,贡献激励,数字资产,加密货币,去中心化'
      : 'Web3,virtual goods,trading platform,blockchain,DAO,contribution incentives,digital assets,cryptocurrency,decentralized';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;

  const canonicalUrl = url && /^https?:\/\//i.test(url) ? url : absoluteUrl(path);
  const pagePath = (() => {
    try {
      return new URL(canonicalUrl).pathname || '/';
    } catch {
      return path.startsWith('/') ? path : `/${path}`;
    }
  })();
  const pathForLang = pagePath === '/' ? '/' : pagePath;
  const enHref = `${SITE_URL}${pathForLang === '/' ? '/' : pathForLang}?lang=en`;
  const zhHref = `${SITE_URL}${pathForLang === '/' ? '/' : pathForLang}?lang=zh`;
  const defaultHref = absoluteUrl(pathForLang);

  const ogImage = image
    ? absoluteUrl(image)
    : absoluteUrl('/og-image.jpg');
  const logoUrl = absoluteUrl('/logo.svg');

  const sameAs = [siteLinks.twitter, siteLinks.telegram, siteLinks.discord, siteLinks.github].filter(
    (href) => href && !href.includes('localhost') && href !== 'https://twitter.com' && href !== 'https://t.me' && href !== 'https://discord.com' && href !== 'https://github.com',
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE_URL,
    logo: logoUrl,
    description: seoDescription,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@sapphiremall.com',
      availableLanguage: ['English', 'Chinese'],
    },
    foundingDate: '2025',
  };

  return (
    <Helmet>
      <html lang={currentLang === 'zh' ? 'zh-CN' : 'en'} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Sapphire Mall Team" />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLang === 'zh' ? 'zh_CN' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@sapphiremall" />
      <meta name="twitter:creator" content="@sapphiremall" />

      <meta name="theme-color" content="#f7f6f3" />
      <meta name="msapplication-TileColor" content="#149eca" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      <link rel="alternate" hrefLang="en" href={enHref} />
      <link rel="alternate" hrefLang="zh" href={zhHref} />
      <link rel="alternate" hrefLang="x-default" href={defaultHref} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEO;
