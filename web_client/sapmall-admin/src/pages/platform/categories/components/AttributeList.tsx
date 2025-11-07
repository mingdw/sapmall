import React, { useState } from 'react';
import { Table, Button, Space, Tag, Switch, message, Modal, Form, Input, InputNumber, Select, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminModal from '../../../../components/common/AdminModal';
import { attributeApi, SaveAttributeReq } from '../../../../services/api/attributeApi';
import styles from './AttributeList.module.scss';

const { Option } = Select;

interface Attribute {
  id: number;
  name: string;
  code: string;
  type: number;
  status: number;
  groupId: number;
  description: string;
  sort: number;
}

interface AttributeListProps {
  attributeGroupId: number;
  attributeGroupCode: string;
  attributes?: Attribute[];
  onRefresh?: () => void; // 刷新回调函数
}

const AttributeList: React.FC<AttributeListProps> = ({ 
  attributeGroupId,
  attributeGroupCode,
  attributes = [],
  onRefresh,
}) => {
  // 使用传入的属性数据，确保始终是数组（处理 null 或 undefined 的情况）
  const [attributeList, setAttributeList] = React.useState<Attribute[]>(attributes || []);

  // 当传入的 attributes 变化时，更新本地状态
  React.useEffect(() => {
    setAttributeList(attributes || []);
  }, [attributes]);

  // 模态框状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'add'>('view');
  const [currentAttribute, setCurrentAttribute] = useState<Attribute | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // 打开模态框
  const openModal = (type: 'view' | 'edit' | 'add', attribute: Attribute | null = null) => {
    setModalType(type);
    setCurrentAttribute(attribute);
    setModalVisible(true);
    
    if (type === 'edit' && attribute) {
      // 编辑模式：填充现有数据
      // 注意：0=启用，1=禁用，所以 status=0 时表单显示为 true（启用）
      form.setFieldsValue({
        name: attribute.name,
        code: attribute.code,
        type: attribute.type,
        sort: attribute.sort,
        status: attribute.status === 0, // 0=启用，所以 status === 0 时显示为 true
        description: attribute.description || '',
      });
    } else if (type === 'add') {
      // 新增模式：重置表单，设置默认值
      form.resetFields();
      form.setFieldsValue({
        type: 1, // 默认文本类型
        sort: 0, // 默认排序值
        status: true, // 默认启用（对应 status=0）
        description: '',
      });
    } else {
      // 查看模式
      if (attribute) {
        form.setFieldsValue({
          name: attribute.name,
          code: attribute.code,
          type: attribute.type,
          sort: attribute.sort,
          status: attribute.status === 0, // 0=启用，所以 status === 0 时显示为 true
          description: attribute.description || '',
        });
      }
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setCurrentAttribute(null);
    form.resetFields();
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    if (modalType === 'view') {
      closeModal();
      return;
    }

    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
      
      setSubmitting(true);
      
      // 构建保存请求数据
      // 注意：0=启用，1=禁用
      // 表单中 true（启用）对应 status=0，false（禁用）对应 status=1
      const statusValue = values.status === true ? 0 : 1;
      const saveData: SaveAttributeReq = {
        name: values.name,
        code: values.code,
        groupId: attributeGroupId,
        groupCode: attributeGroupCode,
        type: values.type || 1,
        sort: values.sort || 0,
        status: statusValue, // true -> 0(启用), false -> 1(禁用)
        description: values.description || '',
      };

      if (modalType === 'edit' && currentAttribute) {
        // 编辑模式：设置ID
        saveData.id = currentAttribute.id;
        console.log('编辑属性 - 原始状态:', currentAttribute.status, '新状态:', statusValue);
      }

      console.log('保存数据:', saveData);
      console.log('表单 values.status:', values.status, '转换后的 status:', statusValue);
      
      // 调用保存接口
      const response = await attributeApi.saveAttribute(saveData);
      
      if (response.code === 0) {
        message.success(modalType === 'edit' ? '属性更新成功' : '属性创建成功');
        closeModal();
        
        // 刷新数据
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 获取模态框标题
  const getModalTitle = () => {
    switch (modalType) {
      case 'view':
        return '查看属性详情';
      case 'edit':
        return '编辑属性';
      case 'add':
        return '添加属性';
      default:
        return '';
    }
  };

  // 处理添加属性
  const handleAddAttribute = () => {
    openModal('add', null);
  };

  // 处理编辑属性
  const handleEditAttribute = (attribute: Attribute) => {
    openModal('edit', attribute);
  };

  // 处理查看属性
  const handleViewAttribute = (attribute: Attribute) => {
    openModal('view', attribute);
  };

  // 处理删除属性
  const handleDeleteAttribute = (attribute: Attribute) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除属性"${attribute.name}"吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await attributeApi.deleteAttribute(attribute.id);
          
          if (response.code === 0) {
            message.success('删除成功');
            
            // 刷新数据
            if (onRefresh) {
              onRefresh();
            }
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除属性失败:', error);
          message.error('删除失败: ' + (error as Error).message);
        }
      },
    });
  };

  const columns: ColumnsType<Attribute> = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'left',
    },
    {
      title: '属性编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      align: 'left',
      render: (code) => <code className={styles.code}>{code}</code>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      align: 'center',
      render: (type) => (
        <Tag color={type === 1 ? 'blue' : 'green'}>
          {type === 1 ? '文本' : '数字'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status) => (
        <Switch
          size="small"
          checked={status === 0}
          disabled
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            title="查看详情"
            onClick={() => handleViewAttribute(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            title="编辑"
            onClick={() => handleEditAttribute(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            title="删除"
            onClick={() => handleDeleteAttribute(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.attributeList}>
      <div className={styles.header}>
        <span className={styles.title}>属性列表</span>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddAttribute}
        >
          添加属性
        </Button>
      </div>
      
      {attributeList.length > 0 ? (
        <Table
          columns={columns}
          dataSource={attributeList}
          rowKey="id"
          size="small"
          pagination={false}
          className={styles.table}
        />
      ) : (
        <Empty
          description="暂无属性"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.empty}
        >
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleAddAttribute}
          >
            添加第一个属性
          </Button>
        </Empty>
      )}

      {/* 模态框 */}
      <AdminModal
        title={getModalTitle()}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={closeModal}
        width={520}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelButtonProps={{ style: { display: modalType === 'view' ? 'none' : 'inline-block' } }}
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
        >
          <Form.Item
            label="属性名称"
            name="name"
            rules={[
              { required: modalType !== 'view', message: '请输入属性名称' },
              { max: 50, message: '属性名称不能超过50个字符' }
            ]}
          >
            <Input
              placeholder="请输入属性名称"
              disabled={modalType === 'view'}
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label="属性编码"
            name="code"
            rules={[
              { required: modalType !== 'view', message: '请输入属性编码' },
              { pattern: /^[A-Z0-9_]+$/, message: '编码只能包含大写字母、数字和下划线' },
              { max: 30, message: '编码不能超过30个字符' }
            ]}
          >
            <Input
              placeholder="请输入属性编码（大写字母、数字、下划线）"
              disabled={modalType === 'view' || modalType === 'edit'}
              maxLength={30}
            />
          </Form.Item>

          <Form.Item
            label="属性类型"
            name="type"
            rules={[{ required: modalType !== 'view', message: '请选择属性类型' }]}
          >
            <Select
              placeholder="请选择属性类型"
              disabled={modalType === 'view'}
            >
              <Option value={1}>文本</Option>
              <Option value={2}>数字</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="排序值"
            name="sort"
            rules={[{ required: modalType !== 'view', message: '请输入排序值' }]}
          >
            <InputNumber
              placeholder="请输入排序值"
              disabled={modalType === 'view'}
              min={0}
              max={9999}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch
              disabled={modalType === 'view'}
            />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea
              placeholder="请输入描述（可选）"
              disabled={modalType === 'view'}
              maxLength={200}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </AdminModal>
    </div>
  );
};

export default AttributeList;
