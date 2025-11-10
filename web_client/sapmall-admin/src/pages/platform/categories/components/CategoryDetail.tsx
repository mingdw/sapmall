import React from 'react';
import { Descriptions, Empty, Divider } from 'antd';
import AttributeGroupList from './AttributeGroupList';
import styles from './CategoryDetail.module.scss';
import type { Category, AttributeGroup } from '../types';

interface CategoryDetailProps {
  category: Category | null;
  onEditCategory: (category: Category) => void;
  onRefresh?: () => void; // 刷新回调函数（兼容旧版本）
  onAttrGroupsUpdate?: (categoryId: number, attrGroups: AttributeGroup[]) => void; // 属性组更新回调函数
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  onEditCategory,
  onRefresh,
  onAttrGroupsUpdate,
}) => {
  if (!category) {
    return (
      <div className={styles.emptyState}>
        <Empty
          description="请从左侧选择一个商品目录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={styles.categoryDetail}>
      {/* 目录基本信息 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4>目录信息</h4>
        </div>
        <Descriptions column={2} size="small" className={styles.descriptions}>
          <Descriptions.Item label="目录名称">{category.name}</Descriptions.Item>
          <Descriptions.Item label="目录编码">{category.code}</Descriptions.Item>
          <Descriptions.Item label="目录层级">
            第 {category.level} 级
          </Descriptions.Item>
          <Descriptions.Item label="排序">
            {category.sort}
          </Descriptions.Item>
          <Descriptions.Item label="父级ID">
            {category.parentId || '无（根目录）'}
          </Descriptions.Item>
          <Descriptions.Item label="子目录数量">
            {category.children?.length || 0}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider className={styles.divider} />

      {/* 属性组管理 */}
      <div className={styles.section}>
        <AttributeGroupList 
          categoryId={category.id} 
          attrGroups={category.attrGroups || []}
          onRefresh={onRefresh}
          onAttrGroupsUpdate={(attrGroups) => {
            // 通知父组件更新属性组数据
            if (onAttrGroupsUpdate) {
              onAttrGroupsUpdate(category.id, attrGroups);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CategoryDetail;

