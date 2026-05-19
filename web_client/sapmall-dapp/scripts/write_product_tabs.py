# -*- coding: utf-8 -*-
from pathlib import Path

content = r'''import React, { useMemo, useState } from 'react';
import { Avatar, Pagination, Rate, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProductDetailView } from '../types/productDetailTypes';
import { MOCK_REVIEWS } from '../mocks/reviews.mock';
import styles from '../ProductDetailPage.module.scss';

const REVIEWS_PER_PAGE = 3;

interface ProductTabsProps {
  product: ProductDetailView;
}

function ServiceTabContent({ product }: { product: ProductDetailView }) {
  const { t } = useTranslation();
  const afterSale = product.details.afterSale;

  if (!afterSale) {
    return <p className="text-slate-400">{t('productDetail.defaultService')}</p>;
  }

  return (
    <>
      {afterSale.promises && afterSale.promises.length > 0 && (
        <motionless />
      )}
    </>
  );
}
'''

# Fix: build file in parts with real div tags
d = "div"
content = f'''import React, {{ useMemo, useState }} from 'react';
import {{ Avatar, Pagination, Rate, Tabs }} from 'antd';
import {{ useTranslation }} from 'react-i18next';
import {{ ProductDetailView }} from '../types/productDetailTypes';
import {{ MOCK_REVIEWS }} from '../mocks/reviews.mock';
import styles from '../ProductDetailPage.module.scss';

const REVIEWS_PER_PAGE = 3;

interface ProductTabsProps {{
  product: ProductDetailView;
}}

function ServiceTabContent({{ product }}: {{ product: ProductDetailView }}) {{
  const {{ t }} = useTranslation();
  const afterSale = product.details.afterSale;

  if (!afterSale) {{
    return <p className="text-slate-400">{{t('productDetail.defaultService')}}</p>;
  }}

  return (
    <>
      {{afterSale.promises && afterSale.promises.length > 0 && (
        <{d} className={{styles.serviceGrid}}>
          {{afterSale.promises.map((p) => (
            <{d} key={{p.title}} className={{styles.serviceItem}}>
              <{d}>
                <{d} className="text-slate-200 font-medium">{{p.title}}</{d}>
                <{d} className="text-slate-400 text-sm">{{p.desc}}</{d}>
              </{d}>
            </{d}>
          ))}}
        </{d}>
      )}}
      {{afterSale.rights && afterSale.rights.length > 0 && (
        <ul className="list-disc pl-5 text-slate-300 text-sm mt-4 space-y-1">
          {{afterSale.rights.map((r) => (
            <li key={{r}}>{{r}}</li>
          ))}}
        </ul>
      )}}
      {{afterSale.policies?.map((pol) => (
        <{d} key={{pol.title}} className="mt-4">
          <h4 className="text-slate-200 font-medium mb-1">{{pol.title}}</h4>
          <p className="text-slate-400 text-sm">{{pol.content}}</p>
        </{d}>
      ))}}
    </>
  );
}}

const ProductTabs: React.FC<ProductTabsProps> = ({{ product }}) => {{
  const {{ t }} = useTranslation();
  const [reviewPage, setReviewPage] = useState(1);

  const pagedReviews = useMemo(() => {{
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return MOCK_REVIEWS.slice(start, start + REVIEWS_PER_PAGE);
  }}, [reviewPage]);

  const tabItems = [
    {{
      key: 'detail',
      label: t('productDetail.tabDetail'),
      children: (
        <>
          <{d} className={{styles.attrGrid}}>
            {{Object.entries(product.basicAttrs).map(([k, v]) => (
              <{d} key={{k}} className={{styles.attrItem}}>
                <span className={{styles.attrLabel}}>{{k}}:</span>
                <span className={{styles.attrValue}}>{{v}}</span>
              </{d}>
            ))}}
          </{d}>
          {{product.details.detailHtml ? (
            <{d}
              className={{`${{styles.detailHtml}} mt-6`}}
              dangerouslySetInnerHTML={{{{ __html: product.details.detailHtml }}}}
            />
          ) : (
            <p className="text-slate-400 mt-4">{{t('productDetail.noDetail')}}</p>
          )}}
        </>
      ),
    }},
    {{
      key: 'specs',
      label: t('productDetail.tabSpecs'),
      children: (
        <table className={{styles.specsTable}}>
          <tbody>
            {{product.specTableRows.map((row) => (
              <tr key={{row.label}}>
                <td className={{styles.specsLabel}}>{{row.label}}</td>
                <td className={{styles.specsValue}}>{{row.value}}</td>
              </tr>
            ))}}
          </tbody>
        </table>
      ),
    }},
    {{
      key: 'reviews',
      label: t('productDetail.tabReviews'),
      children: (
        <>
          {{pagedReviews.map((r) => (
            <{d} key={{r.id}} className={{styles.reviewItem}}>
              <{d} className="flex items-center gap-3 mb-2">
                <Avatar>{{r.userName.slice(2, 4)}}</Avatar>
                <{d}>
                  <{d} className="text-slate-200">{{r.userName}}</{d}>
                  <Rate disabled value={{r.rating}} className="text-xs" />
                </{d}>
              </{d}>
              <p className="text-slate-400 text-xs mb-1">{{r.date}} · {{r.specs}}</p>
              <p className="text-slate-300 text-sm">{{r.content}}</p>
            </{d}>
          ))}}
          <Pagination
            current={{reviewPage}}
            pageSize={{REVIEWS_PER_PAGE}}
            total={{MOCK_REVIEWS.length}}
            onChange={{setReviewPage}}
            className="mt-4"
          />
        </>
      ),
    }},
    {{
      key: 'service',
      label: t('productDetail.tabService'),
      children: <ServiceTabContent product={{product}} />,
    }},
  ];

  return (
    <{d} className={{`${{styles.tabSection}} ${{styles.tabNav}}`}}>
      <Tabs items={{tabItems}} defaultActiveKey="detail" />
    </{d}>
  );
}};

export default ProductTabs;
'''

out = Path(__file__).resolve().parent.parent / 'src/pages/product/components/ProductTabs.tsx'
out.write_text(content, encoding='utf-8')
print('written', out)
