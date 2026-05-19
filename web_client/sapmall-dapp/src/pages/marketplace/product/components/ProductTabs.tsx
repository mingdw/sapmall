import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Pagination,
  Rate,
  Tabs,
} from 'antd';
import {
  CheckCircleOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  StarFilled,
  TableOutlined,
  ThunderboltOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProductDetailView } from '../types/productDetailTypes';
import { MOCK_REVIEWS } from '../mocks/reviews.mock';
import styles from '../ProductDetailPage.module.scss';

const REVIEWS_PER_PAGE = 3;

/** 与 Tab 标签重复的区块标题，内容区不再展示 */
const TAB_SECTION_HEADER_LABELS = new Set([
  '基本信息',
  '商品详情',
  '规格参数',
  '规格参数表',
  '售后保障',
  'overview',
  'specification table',
  'after-sales',
]);

function isTabSectionHeader(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return TAB_SECTION_HEADER_LABELS.has(label.trim())
    || TAB_SECTION_HEADER_LABELS.has(normalized);
}

function filterSpecRows(rows: Array<{ label: string; value: string }>) {
  return rows.filter((row) => !isTabSectionHeader(row.label));
}

function filterBasicAttrs(attrs: Record<string, string>) {
  return Object.entries(attrs).filter(([key]) => !isTabSectionHeader(key));
}

function splitBulletLines(text: string): string[] {
  return text
    .split(/[·•\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sanitizeDetailHtml(html: string): string {
  let result = html;
  TAB_SECTION_HEADER_LABELS.forEach((label) => {
    if (label.length < 2) return;
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`<h[1-6][^>]*>\\s*${escaped}\\s*</h[1-6]>`, 'gi'),
      ''
    );
  });
  return result;
}

function hasDetailContent(html: string | undefined | null): boolean {
  if (!html?.trim()) return false;
  const textOnly = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
  return textOnly.length > 0;
}

interface ProductTabsProps {
  product: ProductDetailView;
}

interface TabLabelProps {
  icon: React.ReactNode;
  text: string;
  badge?: number;
}

function TabLabel({ icon, text, badge }: TabLabelProps) {
  return (
    <span className={styles.tabLabel}>
      <span className={styles.tabLabelIcon}>{icon}</span>
      <span className={styles.tabLabelText}>{text}</span>
      {badge != null && badge > 0 && (
        <span className={styles.tabBadge}>{badge > 999 ? '999+' : badge}</span>
      )}
    </span>
  );
}

type ServiceIconTone = 'green' | 'blue' | 'purple' | 'orange';

interface ServiceCardItem {
  key: string;
  title: string;
  descLines: string[];
  iconHint?: string;
  tone: ServiceIconTone;
}

const DEFAULT_SERVICE_META: Array<{
  tone: ServiceIconTone;
  icon: React.ReactNode;
}> = [
  { tone: 'green', icon: <SafetyCertificateOutlined /> },
  { tone: 'blue', icon: <CheckCircleOutlined /> },
  { tone: 'purple', icon: <ThunderboltOutlined /> },
  { tone: 'orange', icon: <CustomerServiceOutlined /> },
];

function resolveServiceIcon(iconHint: string | undefined, index: number) {
  const hint = (iconHint || '').toLowerCase();
  if (hint.includes('shield') || hint.includes('safety') || hint.includes('正品')) {
    return { tone: 'green' as const, icon: <SafetyOutlined /> };
  }
  if (hint.includes('undo') || hint.includes('return') || hint.includes('退')) {
    return { tone: 'blue' as const, icon: <UndoOutlined /> };
  }
  if (hint.includes('truck') || hint.includes('delivery') || hint.includes('交付')) {
    return { tone: 'purple' as const, icon: <ThunderboltOutlined /> };
  }
  if (hint.includes('headset') || hint.includes('support') || hint.includes('客服')) {
    return { tone: 'orange' as const, icon: <CustomerServiceOutlined /> };
  }
  return DEFAULT_SERVICE_META[index % DEFAULT_SERVICE_META.length];
}

function ServiceIcon({
  tone,
  children,
}: {
  tone: ServiceIconTone;
  children: React.ReactNode;
}) {
  const toneClass = {
    green: styles.serviceIconGreen,
    blue: styles.serviceIconBlue,
    purple: styles.serviceIconPurple,
    orange: styles.serviceIconOrange,
  }[tone];

  return (
    <div className={`${styles.serviceIcon} ${toneClass}`} aria-hidden>
      {children}
    </div>
  );
}

function ServiceTabContent({ product }: { product: ProductDetailView }) {
  const { t } = useTranslation();
  const afterSale = product.details.afterSale;

  const items: ServiceCardItem[] = useMemo(() => {
    if (!afterSale) {
      return [
        {
          key: 'auth',
          title: t('productDetail.serviceAuth'),
          descLines: [t('productDetail.serviceAuthDesc')],
          tone: 'green',
        },
        {
          key: 'quality',
          title: t('productDetail.serviceQuality'),
          descLines: [t('productDetail.serviceQualityDesc')],
          tone: 'blue',
        },
        {
          key: 'support',
          title: t('productDetail.serviceSupport'),
          descLines: [t('productDetail.serviceSupportDesc')],
          tone: 'orange',
        },
      ];
    }

    const list: ServiceCardItem[] = [];
    let cardIndex = 0;

    afterSale.promises?.forEach((p) => {
      const descLines = splitBulletLines(p.desc);
      if (!p.title && !descLines.length) return;
      const { tone } = resolveServiceIcon(p.icon, cardIndex);
      list.push({
        key: p.title || `promise-${cardIndex}`,
        title: p.title,
        descLines: descLines.length ? descLines : [p.desc].filter(Boolean),
        iconHint: p.icon,
        tone,
      });
      cardIndex += 1;
    });

    afterSale.rights?.forEach((r, idx) => {
      if (isTabSectionHeader(r)) return;
      const lines = splitBulletLines(r);
      if (!lines.length) return;
      const title = lines[0];
      const descLines = lines.length > 1 ? lines.slice(1) : [];
      const { tone } = resolveServiceIcon(undefined, cardIndex);
      list.push({
        key: `right-${idx}`,
        title,
        descLines,
        tone,
      });
      cardIndex += 1;
    });

    afterSale.policies?.forEach((pol) => {
      if (isTabSectionHeader(pol.title)) return;
      const descLines = splitBulletLines(pol.content);
      if (!pol.title && !descLines.length) return;
      const { tone } = resolveServiceIcon(undefined, cardIndex);
      list.push({
        key: pol.title || `policy-${cardIndex}`,
        title: pol.title,
        descLines: descLines.length ? descLines : [pol.content].filter(Boolean),
        tone,
      });
      cardIndex += 1;
    });

    return list;
  }, [afterSale, t]);

  if (!items.length) {
    return <p className={styles.tabEmpty}>{t('productDetail.defaultService')}</p>;
  }

  return (
    <div className={styles.serviceGrid}>
      {items.map((item, index) => {
        const fallbackMeta = DEFAULT_SERVICE_META.find((m) => m.tone === item.tone)
          ?? DEFAULT_SERVICE_META[index % DEFAULT_SERVICE_META.length];
        const { icon } = item.iconHint
          ? resolveServiceIcon(item.iconHint, index)
          : fallbackMeta;

        return (
          <div key={item.key} className={styles.serviceItem}>
            <ServiceIcon tone={item.tone}>{icon}</ServiceIcon>
            <div className={styles.serviceContent}>
              <h4 className={styles.serviceTitle}>{item.title}</h4>
              {item.descLines.length === 1 ? (
                <p className={styles.serviceDesc}>{item.descLines[0]}</p>
              ) : item.descLines.length > 1 ? (
                <ul className={styles.serviceDescList}>
                  {item.descLines.map((line, lineIdx) => (
                    <li key={`${item.key}-${lineIdx}`}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const { t } = useTranslation();
  const [reviewPage, setReviewPage] = useState(1);

  const pagedReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return MOCK_REVIEWS.slice(start, start + REVIEWS_PER_PAGE);
  }, [reviewPage]);

  const reviewCount = product.reviewCount || MOCK_REVIEWS.length;
  const basicAttrEntries = useMemo(
    () => filterBasicAttrs(product.basicAttrs),
    [product.basicAttrs]
  );
  const specRows = useMemo(
    () => filterSpecRows(product.specTableRows),
    [product.specTableRows]
  );
  const hasDetailHtml = useMemo(
    () => hasDetailContent(product.details.detailHtml),
    [product.details.detailHtml]
  );

  const tabItems = [
    {
      key: 'detail',
      label: (
        <TabLabel
          icon={<FileTextOutlined />}
          text={t('productDetail.tabDetail')}
        />
      ),
      children: (
        <div className={styles.tabPaneBody}>
          {basicAttrEntries.length > 0 && (
            <section className={styles.basicAttrSection}>
              <div className={styles.basicAttrSectionHead}>
                <span className={styles.basicAttrSectionTitle}>
                  {t('productDetail.sectionBasicInfo')}
                </span>
              </div>
              <div className={styles.attrTableWrap}>
                <table className={styles.attrTable}>
                  <tbody>
                    {basicAttrEntries.map(([k, v], idx) => (
                      <tr
                        key={k}
                        className={
                          idx % 2 === 0 ? styles.attrRowEven : styles.attrRowOdd
                        }
                      >
                        <td className={styles.attrLabel}>{k}</td>
                        <td className={styles.attrValue}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {hasDetailHtml || basicAttrEntries.length > 0 ? (
            <section className={styles.detailContentSection}>
              <div className={styles.basicAttrSectionHead}>
                <span className={styles.basicAttrSectionTitle}>
                  {t('productDetail.sectionDetailContent')}
                </span>
              </div>
              {hasDetailHtml ? (
                <div
                  className={styles.detailHtml}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeDetailHtml(product.details.detailHtml),
                  }}
                />
              ) : (
                <div className={styles.detailEmpty}>
                  <FileTextOutlined className={styles.detailEmptyIcon} />
                  <p className={styles.detailEmptyText}>
                    {t('productDetail.detailContentEmpty')}
                  </p>
                </div>
              )}
            </section>
          ) : (
            <p className={styles.tabEmpty}>{t('productDetail.noDetail')}</p>
          )}
        </div>
      ),
    },
    {
      key: 'specs',
      label: (
        <TabLabel
          icon={<TableOutlined />}
          text={t('productDetail.tabSpecs')}
        />
      ),
      children: (
        <div className={styles.tabPaneBody}>
          {specRows.length > 0 ? (
            <section className={styles.basicAttrSection}>
              <div className={styles.basicAttrSectionHead}>
                <span className={styles.basicAttrSectionTitle}>
                  {t('productDetail.sectionSaleAttrs')}
                </span>
              </div>
              <div className={styles.specsTableWrap}>
                <table className={styles.specsTable}>
                  <tbody>
                    {specRows.map((row, idx) => (
                      <tr
                        key={row.label}
                        className={idx % 2 === 0 ? styles.specsRowEven : styles.specsRowOdd}
                      >
                        <td className={styles.specsLabel}>{row.label}</td>
                        <td className={styles.specsValue}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <p className={styles.tabEmpty}>{t('productDetail.noDetail')}</p>
          )}
        </div>
      ),
    },
    {
      key: 'reviews',
      label: (
        <TabLabel
          icon={<MessageOutlined />}
          text={t('productDetail.tabReviews')}
          badge={reviewCount}
        />
      ),
      children: (
        <div className={styles.tabPaneBody}>
          <div className={styles.reviewsSummary}>
            <div className={styles.reviewsSummaryScore}>
              <StarFilled className={styles.reviewsSummaryStar} />
              <span className={styles.reviewsSummaryValue}>
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className={styles.reviewsSummaryMeta}>
              {t('productDetail.reviewsSummary', { count: reviewCount })}
            </span>
          </div>
          <div className={styles.reviewsList}>
            {pagedReviews.map((r) => (
              <article key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <Avatar className={styles.reviewAvatar} size={40}>
                    {r.userName.slice(2, 4)}
                  </Avatar>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewUserName}>{r.userName}</div>
                    <Rate
                      disabled
                      value={r.rating}
                      className={styles.reviewRate}
                    />
                  </div>
                  <time className={styles.reviewDate}>{r.date}</time>
                </div>
                <p className={styles.reviewSpecs}>{r.specs}</p>
                <p className={styles.reviewContent}>{r.content}</p>
                {r.images && r.images.length > 0 && (
                  <div className={styles.reviewImages}>
                    {r.images.map((img) => (
                      <img key={img} src={img} alt="" />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          <Pagination
            className={styles.reviewsPagination}
            current={reviewPage}
            pageSize={REVIEWS_PER_PAGE}
            total={MOCK_REVIEWS.length}
            onChange={setReviewPage}
            showSizeChanger={false}
          />
        </div>
      ),
    },
    {
      key: 'service',
      label: (
        <TabLabel
          icon={<SafetyCertificateOutlined />}
          text={t('productDetail.tabService')}
        />
      ),
      children: (
        <div className={styles.tabPaneBody}>
          <ServiceTabContent product={product} />
        </div>
      ),
    },
  ];

  return (
    <section className={styles.tabSection}>
      <div className={styles.tabPanel}>
        <Tabs
          className={styles.tabNav}
          items={tabItems}
          defaultActiveKey="detail"
        />
      </div>
    </section>
  );
};

export default ProductTabs;
