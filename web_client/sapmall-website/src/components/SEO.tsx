import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url = 'https://sapphiremall.com',
  type = 'website'
}) => {
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language;
  const siteName = 'Sapphire Mall';
  const defaultTitle = currentLang === 'zh' 
    ? 'Sapphire Mall - Web3虚拟商品交易平台' 
    : 'Sapphire Mall - Web3 Virtual Goods Trading Platform';
  const defaultDescription = currentLang === 'zh'
    ? 'Sapphire Mall是全球领先的Web3虚拟商品交易平台，通过创新的流动性质押机制、DAO治理和多元化资产支持，为用户提供安全、高效、收益丰厚的交易体验。'
    : 'Sapphire Mall is the world\'s leading Web3 virtual goods trading platform, providing users with secure, efficient, and profitable trading experiences through innovative liquidity staking mechanisms, DAO governance, and diversified asset support.';
  const defaultKeywords = currentLang === 'zh'
    ? 'Web3,虚拟商品,交易平台,区块链,DeFi,DAO,流动性质押,数字资产,加密货币,去中心化'
    : 'Web3,virtual goods,trading platform,blockchain,DeFi,DAO,liquidity staking,digital assets,cryptocurrency,decentralized';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": url,
    "logo": `${url}/logo.png`,
    "description": seoDescription,
    "sameAs": [
      "https://twitter.com/sapphiremall",
      "https://t.me/sapphiremall",
      "https://discord.gg/sapphiremall",
      "https://github.com/sapphiremall"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "foundingDate": "2025",
    "founders": [
      {
        "@type": "Person",
        "name": "Sapphire Mall Team"
      }
    ]
  };

  return (
    <Helmet>
      {/* 基础meta标签 */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Sapphire Mall Team" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={currentLang} />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLang === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@sapphiremall" />
      <meta property="twitter:creator" content="@sapphiremall" />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* 多语言支持 */}
      <link rel="alternate" hrefLang="en" href={`${url}?lang=en`} />
      <link rel="alternate" hrefLang="zh" href={`${url}?lang=zh`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* 预连接优化 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      
      {/* 网站图标 */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEO;
