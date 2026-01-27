import React, { useState, useEffect } from 'react';
import { message, Modal, Spin } from 'antd';
import AdminCard from '../../../components/common/AdminCard';
import CategoryTree from './components/CategoryTree';
import CategoryDetail from './components/CategoryDetail';
import {
  AttrGroupResp,
  AttrResp,
} from '../../../services/api/commonApiService';
import { categoryApi, SaveCategoryReq } from '../../../services/api/categoryApi';
import { useCategoryStore } from '../../../store/categoryStore';
import styles from './CategoryManagement.module.scss';
import type { Category, AttributeGroup, Attribute } from './types';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  // 使用 store 中的商品目录数据和刷新方法（menu_type=0）
  const { productCategories: categoryTree, refreshProductCategories, isProductCategoriesLoading: storeLoading } = useCategoryStore();

  // 加载商品目录数据（从 store 获取，如果缓存无效则从 API 获取）
  useEffect(() => {
    refreshProductCategories().catch(error => {
      console.error('加载目录失败:', error);
      message.error('加载目录失败: ' + (error as Error).message);
    });
  }, [refreshProductCategories]);

  // 当 store 中的分类数据变化时，更新本地状态
  useEffect(() => {
    if (categoryTree.length > 0) {
      const transformed = transformCategoryTree(categoryTree);
      setCategories(transformed);
    }
  }, [categoryTree]);

  // 合并 store 的加载状态
  useEffect(() => {
    setLoading(storeLoading);
  }, [storeLoading]);

  // 处理选择目录
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  // 处理属性组更新
  const handleAttrGroupsUpdate = (categoryId: number, attrGroups: AttributeGroup[] = []) => {
    const normalizedGroups = attrGroups ?? [];

    // 更新当前选中目录的属性组数据
    if (selectedCategory && selectedCategory.id === categoryId) {
      setSelectedCategory({
        ...selectedCategory,
        attrGroups: normalizedGroups,
      });
    }
    
    // 更新目录树中对应目录的属性组数据
    const updateCategoryInTree = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            attrGroups: normalizedGroups,
          };
        }
        if (cat.children && cat.children.length > 0) {
          return {
            ...cat,
            children: updateCategoryInTree(cat.children),
          };
        }
        return cat;
      });
    };
    
    setCategories((prev) => updateCategoryInTree(prev));
  };

  // 处理保存目录（新增/编辑）
  const handleSaveCategory = async (formData: SaveCategoryReq) => {
    try {
      setLoading(true);
      const response = await categoryApi.saveCategory(formData);
      
      if (response.code === 0) {
        message.success(formData.id ? '编辑成功' : '创建成功');
        // 刷新 store 中的商品目录缓存
        await refreshProductCategories();
        return true;
      } else {
        message.error(response.message || '操作失败');
        return false;
      }
    } catch (error) {
      console.error('保存目录失败:', error);
      message.error('保存失败: ' + (error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 处理添加目录
  const handleAddCategory = (parentCategory?: Category) => {
    // 此回调会被 CategoryTree 组件的模态框调用
    console.log('添加子目录，父目录:', parentCategory);
  };

  // 处理编辑目录
  const handleEditCategory = (category: Category) => {
    // 此回调会被 CategoryTree 组件的模态框调用
    console.log('编辑目录:', category);
    setSelectedCategory(category);
  };

  // 处理删除目录
  const handleDeleteCategory = async (category: Category) => {
    // 检查是否有子目录
    if (category.children && category.children.length > 0) {
      message.warning('该目录下存在子目录，请先删除子目录');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除目录"${category.name}"吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await categoryApi.deleteCategory(category.id);
          
          if (response.code === 0) {
            message.success('删除成功');
            // 刷新 store 中的商品目录缓存
            await refreshProductCategories();
            // 如果删除的是当前选中的目录，清空选中状态
            if (selectedCategory?.id === category.id) {
              setSelectedCategory(null);
            }
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除目录失败:', error);
          message.error('删除失败: ' + (error as Error).message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className={styles.categoryManagement}>
      <AdminCard icon="fas fa-sitemap" showHeader={false}>
        <Spin spinning={loading} tip="加载中...">
          <div className={styles.container}>
            {/* 左侧：目录树 */}
            <div className={styles.leftPanel}>
              <CategoryTree
                categories={categories}
                selectedCategoryId={selectedCategory?.id}
                onSelect={handleSelectCategory}
                onAdd={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onSave={handleSaveCategory}
              />
            </div>

            {/* 右侧：目录详情和属性管理 */}
            <div className={styles.rightPanel}>
              <CategoryDetail
                category={selectedCategory}
                onEditCategory={handleEditCategory}
                onRefresh={() => refreshProductCategories()}
                onAttrGroupsUpdate={handleAttrGroupsUpdate}
              />
            </div>
          </div>
        </Spin>
      </AdminCard>
    </div>
  );
};

export default CategoryManagement;

function transformCategoryTree(nodes: any[]): Category[] {
  return nodes.map((node) => {
    // 兼容两种类型定义：
    // 1. commonApiService 中的类型：有 code 和 parentId
    // 2. categoryTypes 中的类型：有 url 和 parent_id
    const code = node.code || node.url || '';
    const parentId = node.parentId || node.parent_id || 0;
    
    return {
      id: node.id,
      name: node.name,
      code: code,
      level: node.level,
      sort: node.sort,
      parentId: parentId,
      icon: node.icon || '',
      children:
        node.children && node.children.length > 0
          ? transformCategoryTree(node.children)
          : undefined,
      attrGroups: node.attrGroups ? transformAttributeGroups(node.attrGroups) : undefined,
    };
  });
}

function transformAttributeGroups(groups: AttrGroupResp[]): AttributeGroup[] {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    code: group.code,
    sort: group.sort,
    type: group.type,
    description: group.description ?? '',
    status: group.status,
    attrs: group.attrs ? transformAttributes(group.attrs, group.id) : undefined,
  }));
}

function transformAttributes(attrs: AttrResp[], groupId: number): Attribute[] {
  return attrs.map((attr) => ({
    id: attr.id,
    name: attr.name,
    code: attr.code,
    type: attr.type,
    status: attr.status,
    groupId: attr.groupId ?? groupId,
    description: attr.description ?? '',
    sort: attr.sort ?? 0,
  }));
}
