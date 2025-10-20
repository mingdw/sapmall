import React from 'react';
import { Tree, Button, Space, Tooltip, ConfigProvider, Form, Input } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import AdminModal from '../../../../components/common/AdminModal';
import styles from './CategoryTree.module.scss';

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

interface CategoryTreeProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelect: (category: Category) => void;
  onAdd: (parentCategory?: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState<'view' | 'edit' | 'add'>('view');
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(null);
  const [form] = Form.useForm();

  // 默认展开第一个一级目录
  React.useEffect(() => {
    if (categories.length > 0 && expandedKeys.length === 0) {
      console.log('展开第一个目录:', categories[0]);
      setExpandedKeys([categories[0].id]);
    }
  }, [categories]);

  // 调试：打印目录数据
  React.useEffect(() => {
    console.log('CategoryTree接收到的目录数据:', categories);
  }, [categories]);

  // 打开模态框
  const openModal = (type: 'view' | 'edit' | 'add', category: Category | null = null) => {
    setModalType(type);
    setCurrentCategory(category);
    setModalVisible(true);
    
    if (category) {
      form.setFieldsValue({
        name: category.name,
        code: category.code,
        sort: category.sort,
      });
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setCurrentCategory(null);
    form.resetFields();
  };

  // 处理模态框确认
  const handleModalOk = () => {
    if (modalType === 'view') {
      closeModal();
      return;
    }

    form.validateFields().then(values => {
      console.log('表单数据:', values);
      
      if (modalType === 'edit' && currentCategory) {
        onEdit(currentCategory);
      } else if (modalType === 'add') {
        onAdd(currentCategory || undefined);
      }
      
      closeModal();
    });
  };

  // 获取模态框标题
  const getModalTitle = () => {
    switch (modalType) {
      case 'view':
        return '查看目录详情';
      case 'edit':
        return '编辑目录';
      case 'add':
        return currentCategory ? `添加子目录 - ${currentCategory.name}` : '添加根目录';
      default:
        return '';
    }
  };

  // 将目录数据转换为树形结构
  const convertToTreeData = (categories: Category[]): DataNode[] => {
    return categories.map((category) => ({
      title: (
        <div className={styles.treeNode}>
          <span className={styles.nodeName}>
            {category.name}
          </span>
          <Space className={styles.nodeActions} size={4}>
            <Tooltip title="查看详情">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('view', category);
                }}
              />
            </Tooltip>
            <Tooltip title="添加子目录">
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('add', category);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('edit', category);
                }}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category);
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
      key: category.id,
      children: category.children
        ? convertToTreeData(category.children)
        : undefined,
    }));
  };

  // 递归查找目录
  const findCategory = (
    categories: Category[],
    id: number
  ): Category | null => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategory(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const categoryId = selectedKeys[0] as number;
      const category = findCategory(categories, categoryId);
      if (category) {
        onSelect(category);
      }
    }
  };

  return (
    <div className={styles.categoryTreeContainer}>
      <div className={styles.treeHeader}>
        <h4>商品目录</h4>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => openModal('add', null)}
          className={styles.addButton}
        >
          添加根目录
        </Button>
      </div>
      <div className={styles.treeContent}>
        {categories.length > 0 ? (
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  // 节点标题高度
                  titleHeight: 32,
                  // 节点悬浮态背景色
                  nodeHoverBg: 'rgba(59, 130, 246, 0.15)',
                  // 节点悬浮态文字颜色
                  nodeHoverColor: '#e2e8f0',
                  // 节点选中态背景色
                  nodeSelectedBg: 'rgba(59, 130, 246, 0.25)',
                  // 节点选中态文字颜色
                  nodeSelectedColor: '#ffffff',
                  // 目录树节点选中背景色
                  directoryNodeSelectedBg: 'rgba(59, 130, 246, 0.3)',
                  // 目录树节点选中文字颜色
                  directoryNodeSelectedColor: '#ffffff',
                },
              },
              token: {
                // 全局颜色配置
                colorBgContainer: 'transparent',
                colorText: '#e2e8f0',
                colorTextSecondary: '#94a3b8',
                colorBorder: 'rgba(51, 65, 85, 0.3)',
              },
            }}
          >
            <Tree
              showLine
              selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
              onSelect={handleSelect}
              treeData={convertToTreeData(categories)}
              className={styles.tree}
            />
          </ConfigProvider>
        ) : (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#94a3b8',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '8px',
            border: '1px solid rgba(51, 65, 85, 0.3)'
          }}>
            <p>暂无目录数据</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>请检查数据加载状态</p>
          </div>
        )}
      </div>

      {/* 模态框 */}
      <AdminModal
        title={getModalTitle()}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={closeModal}
        width={520}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelButtonProps={{ style: { display: modalType === 'view' ? 'none' : 'inline-block' } }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
        >
           {currentCategory && (
            <Form.Item label="父目录">
              <Input
                value={currentCategory.name}
                disabled
              />
            </Form.Item>
          )}
          <Form.Item
            label="目录名称"
            name="name"
            rules={[{ required: modalType !== 'view', message: '请输入目录名称' }]}
          >
            <Input
              placeholder="请输入目录名称"
              disabled={modalType === 'view'}
            />
          </Form.Item>

          <Form.Item
            label="目录编码"
            name="code"
            rules={[{ required: modalType !== 'view', message: '请输入目录编码' }]}
          >
            <Input
              placeholder="请输入目录编码"
              disabled={modalType === 'view'}
            />
          </Form.Item>

          <Form.Item
            label="排序值"
            name="sort"
            rules={[{ required: modalType !== 'view', message: '请输入排序值' }]}
          >
            <Input
              type="number"
              placeholder="请输入排序值"
              disabled={modalType === 'view'}
            />
          </Form.Item>

         
        </Form>
      </AdminModal>
    </div>
  );
};

export default CategoryTree;

