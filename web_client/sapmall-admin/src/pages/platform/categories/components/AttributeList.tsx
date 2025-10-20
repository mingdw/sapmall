import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, InputNumber, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './AttributeList.module.scss';

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
  attributes?: Attribute[];
}

const AttributeList: React.FC<AttributeListProps> = ({ 
  attributeGroupId, 
  attributes = [] 
}) => {
  // 使用传入的属性数据，如果没有则显示空状态
  
  // 编辑状态管理
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Attribute>>({});

  const handleAddAttribute = () => {
    console.log('添加属性');
    // TODO: 打开添加属性弹窗
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingId(attribute.id);
    setEditingData({
      name: attribute.name,
      code: attribute.code,
      type: attribute.type,
      status: attribute.status,
      description: attribute.description,
      sort: attribute.sort,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleConfirmEdit = async (attribute: Attribute) => {
    try {
      console.log('保存编辑:', { ...attribute, ...editingData });
      // TODO: 调用API更新属性
      message.success('属性更新成功');
      setEditingId(null);
      setEditingData({});
    } catch (error) {
      message.error('属性更新失败');
      console.error(error);
    }
  };

  const handleDeleteAttribute = (attribute: Attribute) => {
    console.log('删除属性', attribute);
    // TODO: 确认删除
  };

  const isEditing = (attributeId: number) => editingId === attributeId;

  const columns: ColumnsType<Attribute> = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'left',
      render: (name, record) => {
        if (isEditing(record.id)) {
          return (
            <Input
              size="small"
              value={editingData.name}
              onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
              placeholder="请输入属性名称"
              className={styles.editInput}
            />
          );
        }
        return name;
      },
    },
    {
      title: '属性编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      align: 'left',
      render: (code, record) => {
        if (isEditing(record.id)) {
          return (
            <Input
              size="small"
              value={editingData.code}
              onChange={(e) => setEditingData({ ...editingData, code: e.target.value })}
              placeholder="请输入属性编码"
              className={styles.editInput}
            />
          );
        }
        return <code className={styles.code}>{code}</code>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      align: 'center',
      render: (type, record) => {
        if (isEditing(record.id)) {
          return (
            <InputNumber
              size="small"
              value={editingData.type}
              onChange={(value) => setEditingData({ ...editingData, type: value || 1 })}
              min={1}
              max={2}
              className={styles.editInput}
            />
          );
        }
        return (
          <Tag color={type === 1 ? 'blue' : 'green'}>
            {type === 1 ? '文本' : '数字'}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status, record) => {
        if (isEditing(record.id)) {
          return (
            <Switch
              size="small"
              checked={editingData.status === 1}
              onChange={(checked) => setEditingData({ ...editingData, status: checked ? 1 : 0 })}
            />
          );
        }
        return (
          <Switch
            size="small"
            checked={status === 1}
            disabled
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center',
      render: (sort, record) => {
        if (isEditing(record.id)) {
          return (
            <InputNumber
              size="small"
              value={editingData.sort}
              onChange={(value) => setEditingData({ ...editingData, sort: value || 0 })}
              min={0}
              className={styles.editInput}
            />
          );
        }
        return sort;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => {
        if (isEditing(record.id)) {
          return (
            <Space size="small">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                title="确认"
                onClick={() => handleConfirmEdit(record)}
                className={styles.confirmBtn}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                title="取消"
                onClick={handleCancelEdit}
                className={styles.cancelBtn}
              />
            </Space>
          );
        }
        return (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              title="编辑"
              onClick={() => handleEditAttribute(record)}
              className={styles.actionBtn}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              title="删除"
              onClick={() => handleDeleteAttribute(record)}
              className={styles.actionBtn}
            />
          </Space>
        );
      },
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
      <Table
        columns={columns}
        dataSource={attributes}
        rowKey="id"
        size="small"
        pagination={false}
        className={styles.table}
      />
    </div>
  );
};

export default AttributeList;

