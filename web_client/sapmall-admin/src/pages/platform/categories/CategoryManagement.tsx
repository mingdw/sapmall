import React, { useState, useEffect } from 'react';
import { message, Modal, Spin } from 'antd';
import AdminCard from '../../../components/common/AdminCard';
import CategoryTree from './components/CategoryTree';
import CategoryDetail from './components/CategoryDetail';
import { commonApiService } from '../../../services/api/commonApiService';
import styles from './CategoryManagement.module.scss';

// 目录数据类型
interface Category {
  id: number;
  name: string;
  code: string;
  level: number;
  sort: number;
  parentId: number;
  icon?: string;
  children?: Category[];
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // 加载商品目录数据
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // 使用 categoryType=0 获取商品目录（menu_type=0）
      const data = await commonApiService.getCategoryTree(0);
      console.log('获取到的商品目录数据:', data);
      setCategories(Array.isArray(data) ? data : []);
      // 移除成功提示，避免频繁提示
    } catch (error) {
      console.error('加载目录失败:', error);
      message.error('加载目录失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理选择目录
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  // 处理添加目录
  const handleAddCategory = (parentCategory?: Category) => {
    message.info(`添加子目录功能开发中... 父目录: ${parentCategory?.name || '根目录'}`);
    // TODO: 打开添加目录的表单弹窗
  };

  // 处理编辑目录
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    message.info(`编辑目录功能开发中... 目录: ${category.name}`);
    // TODO: 打开编辑目录的表单弹窗
  };

  // 处理删除目录
  const handleDeleteCategory = (category: Category) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除目录"${category.name}"吗？${
        category.children?.length
          ? '\n注意：删除后，该目录下的所有子目录也将被删除！'
          : ''
      }`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          message.info(`删除功能开发中... 目录ID: ${category.id}`);
          // TODO: 调用删除接口
          // await categoryApi.deleteCategory(category.id);
          // await loadCategories();
          // message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
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
              />
            </div>

            {/* 右侧：目录详情和属性管理 */}
            <div className={styles.rightPanel}>
              <CategoryDetail
                category={selectedCategory}
                onEditCategory={handleEditCategory}
              />
            </div>
          </div>
        </Spin>
      </AdminCard>
    </div>
  );
};

export default CategoryManagement;
