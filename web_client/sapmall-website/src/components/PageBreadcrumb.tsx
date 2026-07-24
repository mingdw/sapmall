import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

type PageBreadcrumbProps = {
  /** 当前页名称（已翻译，不可点击） */
  current: string;
};

/**
 * 内容区面包屑：返回首页 → 当前页（当前页不可点）
 */
const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ current }) => {
  const { t } = useTranslation();

  return (
    <nav className="page-breadcrumb" aria-label={t('common.breadcrumb')}>
      <ol className="page-breadcrumb__list">
        <li className="page-breadcrumb__item">
          <Link to="/" className="page-breadcrumb__link">
            {t('common.backHome')}
          </Link>
        </li>
        <li className="page-breadcrumb__sep" aria-hidden>
          <ChevronRight size={14} strokeWidth={2} />
        </li>
        <li className="page-breadcrumb__item">
          <span className="page-breadcrumb__current" aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default PageBreadcrumb;
