import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AttributeEditor from './AttributeEditor';
import styles from './AttributesEditor.module.scss';

interface AttributesEditorProps {
  basicAttributes?: Record<string, string>;
  saleAttributes?: Record<string, string>;
  onBasicAttributesChange?: (value: Record<string, string>) => void;
  onSaleAttributesChange?: (value: Record<string, string>) => void;
  disabled?: boolean;
  productId?: number;
  productCode?: string;
}

const AttributesEditor: React.FC<AttributesEditorProps> = ({
  basicAttributes = {},
  saleAttributes = {},
  onBasicAttributesChange,
  onSaleAttributesChange,
  disabled = false,
  productId,
  productCode,
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: (
        <div className={styles.tabLabel}>
          <span className={styles.tabTitle}>基础属性</span>
          <span className={styles.tabDescription}>商品的基本信息属性</span>
        </div>
      ),
      children: (
        <div className={styles.tabContent}>
          <AttributeEditor
            title=""
            value={basicAttributes}
            onChange={onBasicAttributesChange}
            mode="card"
            disabled={disabled}
            productId={productId}
            productCode={productCode}
            attrType={1}
          />
        </div>
      ),
    },
    {
      key: 'sale',
      label: (
        <div className={styles.tabLabel}>
          <span className={styles.tabTitle}>销售属性</span>
          <span className={styles.tabDescription}>商品的销售相关信息</span>
        </div>
      ),
      children: (
        <div className={styles.tabContent}>
          <AttributeEditor
            title=""
            value={saleAttributes}
            onChange={onSaleAttributesChange}
            mode="card"
            disabled={disabled}
            productId={productId}
            productCode={productCode}
            attrType={2}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.attributesEditor}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
};

export default AttributesEditor;
