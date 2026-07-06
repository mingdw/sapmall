import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

type LegalPageProps = {
  kind: 'privacy' | 'terms' | 'cookies';
};

const LEGAL_KEYS = {
  privacy: { title: 'legal.privacyTitle', body: 'legal.privacyBody' },
  terms: { title: 'legal.termsTitle', body: 'legal.termsBody' },
  cookies: { title: 'legal.cookieTitle', body: 'legal.cookieBody' },
} as const;

const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const { t } = useTranslation();
  const keys = LEGAL_KEYS[kind];
  const title = t(keys.title);
  const body = t(keys.body);

  return (
    <>
      <SEO title={title} />
      <div className="site-page legal-page">
        <div className="site-container py-16 max-w-2xl">
          <Link to="/" className="text-brand-600 text-sm font-medium mb-8 inline-block">← Sapphire Mall</Link>
          <h1 className="section-title mb-6">{title}</h1>
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{body}</p>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
