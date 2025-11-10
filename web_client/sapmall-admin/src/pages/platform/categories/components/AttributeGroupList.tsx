import React, { useState } from 'react';
import { Button, Space, Collapse, Empty, Switch, Tooltip, Descriptions, Input, InputNumber, message, Modal, Form } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import AttributeList from './AttributeList';
import AdminModal from '../../../../components/common/AdminModal';
import { attributeGroupApi, SaveAttributeGroupReq } from '../../../../services/api/attributeGroupApi';
import styles from './AttributeGroupList.module.scss';
import type { AttributeGroup } from '../types';

const { Panel } = Collapse;

interface AttributeGroupListProps {
  categoryId: number;
  attrGroups?: AttributeGroup[];
  onRefresh?: () => void; // 刷新回调函数（兼容旧版本）
  onAttrGroupsUpdate?: (attrGroups: AttributeGroup[]) => void; // 属性组更新回调函数
}

const AttributeGroupList: React.FC<AttributeGroupListProps> = ({
  categoryId,
  attrGroups = [],
  onRefresh,
  onAttrGroupsUpdate,
}) => {
  // 使用传入的属性组数据，如果没有则显示空状态
  // 确保每个属性组的 attrs 都是数组（处理 null 或 undefined 的情况）
  const normalizeAttrGroups = (groups: AttributeGroup[] = []): AttributeGroup[] => {
    return groups.map(group => ({
      ...group,
      attrs: group.attrs || [],
    }));
  };

  const [attributeGroups, setAttributeGroups] = React.useState<AttributeGroup[]>(
    normalizeAttrGroups(attrGroups)
  );

  // 当传入的 attrGroups 变化时，更新本地状态
  React.useEffect(() => {
    setAttributeGroups(normalizeAttrGroups(attrGroups));
  }, [attrGroups]);

  // 从后端获取最新的属性组数据
  const fetchLatestAttrGroups = async () => {
    try {
      const latestGroups = await attributeGroupApi.getAttributeGroupsByCategoryId(categoryId);
      // 转换数据格式以匹配组件内部使用的格式
      const convertedGroups: AttributeGroup[] = latestGroups.map(ag => ({
        id: ag.id,
        name: ag.name,
        code: ag.code,
        sort: ag.sort,
        type: ag.type,
        description: ag.description,
        status: ag.status,
        attrs: (ag.attrs || []).map(attr => ({
          id: attr.id,
          name: attr.name,
          code: attr.code,
          type: attr.type,
          status: attr.status,
          groupId: attr.groupId,
          description: attr.description,
          sort: attr.sort,
        })),
      }));
      setAttributeGroups(convertedGroups);
      // 通知父组件更新
      if (onAttrGroupsUpdate) {
        onAttrGroupsUpdate(convertedGroups);
      }
      return convertedGroups;
    } catch (error) {
      console.error('获取最新属性组数据失败:', error);
      message.error('获取最新数据失败: ' + (error as Error).message);
      throw error;
    }
  };
  
  // 模态框状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'add'>('view');
  const [currentGroup, setCurrentGroup] = useState<AttributeGroup | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // 打开模态框
  const openModal = (type: 'view' | 'edit' | 'add', group: AttributeGroup | null = null) => {
    setModalType(type);
    setCurrentGroup(group);
    setModalVisible(true);
    
    if (type === 'edit' && group) {
      // 编辑模式：填充现有数据
      // 注意：0=启用，1=禁用，所以 status=0 时表单显示为 true（启用）
      form.setFieldsValue({
        name: group.name,
        code: group.code,
        sort: group.sort,
        status: group.status === 0, // 0=启用，所以 status === 0 时显示为 true
        description: group.description || '',
      });
    } else if (type === 'add') {
      // 新增模式：重置表单，设置默认值
      form.resetFields();
      form.setFieldsValue({
        sort: 0, // 默认排序值
        status: true, // 默认启用（对应 status=0）
        description: '',
      });
    } else {
      // 查看模式
      if (group) {
        form.setFieldsValue({
          name: group.name,
          code: group.code,
          sort: group.sort,
          status: group.status === 0, // 0=启用，所以 status === 0 时显示为 true
          description: group.description || '',
        });
      }
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setCurrentGroup(null);
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
      const saveData: SaveAttributeGroupReq = {
        name: values.name,
        code: values.code,
        sort: values.sort || 0,
        status: statusValue, // true -> 0(启用), false -> 1(禁用)
        description: values.description || '',
        categoryId: categoryId,
        type: 1, // 1=目录专用
      };

      if (modalType === 'edit' && currentGroup) {
        // 编辑模式：设置ID
        saveData.id = currentGroup.id;
        console.log('编辑属性组 - 原始状态:', currentGroup.status, '新状态:', statusValue);
      }

      console.log('保存数据:', saveData);
      console.log('表单 values.status:', values.status, '转换后的 status:', statusValue);
      
      // 调用保存接口
      const response = await attributeGroupApi.saveAttributeGroup(saveData);
      
      if (response.code === 0) {
        message.success(modalType === 'edit' ? '属性组更新成功' : '属性组创建成功');
        closeModal();
        
        // 从后端获取最新的属性组数据
        try {
          await fetchLatestAttrGroups();
        } catch (error) {
          // 如果获取最新数据失败，仍然调用旧的刷新回调
          if (onRefresh) {
            onRefresh();
          }
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
        return '查看属性组详情';
      case 'edit':
        return '编辑属性组';
      case 'add':
        return '添加属性组';
      default:
        return '';
    }
  };

  // 处理添加属性组
  const handleAddGroup = () => {
    openModal('add', null);
  };

  // 处理编辑属性组
  const handleEditGroup = (group: AttributeGroup) => {
    openModal('edit', group);
  };

  // 处理删除属性组
  const handleDeleteGroup = (group: AttributeGroup) => {
    const attributeCount = group.attrs?.length ?? 0;
    const hasAttributes = attributeCount > 0;
    
    // 构建警告内容
    const warningContent = (
      <div>
        <div style={{ marginBottom: hasAttributes ? 12 : 0 }}>
          确定要删除属性组 <strong>"{group.name}"</strong> 吗？
        </div>
        {hasAttributes && (
          <div style={{ 
            color: '#ff4d4f', 
            marginTop: 12, 
            padding: '8px 12px', 
            backgroundColor: '#fff2f0', 
            borderRadius: 4,
            border: '1px solid #ffccc7'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>⚠️ 警告</div>
            <div>
              删除该属性组将同时删除该属性组下的 <strong>{attributeCount} 个属性</strong>，此操作不可恢复！
            </div>
          </div>
        )}
      </div>
    );

    Modal.confirm({
      title: '确认删除',
      content: warningContent,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      width: 480,
      onOk: async () => {
        try {
          const response = await attributeGroupApi.deleteAttributeGroup(group.id);
          
          if (response.code === 0) {
            message.success(hasAttributes 
              ? `删除成功，已同时删除 ${attributeCount} 个属性` 
              : '删除成功');
            
            // 从后端获取最新的属性组数据
            try {
              await fetchLatestAttrGroups();
            } catch (error) {
              // 如果获取最新数据失败，仍然调用旧的刷新回调
              if (onRefresh) {
                onRefresh();
              }
            }
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除属性组失败:', error);
          message.error('删除失败: ' + (error as Error).message);
        }
      },
    });
  };

  return (
    <div className={styles.attributeGroupList}>
      <div className={styles.header}>
        <h4>属性组管理</h4>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddGroup}
        >
          添加属性组
        </Button>
      </div>

      {attributeGroups.length > 0 ? (
        <Collapse
          className={styles.collapse}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          ghost
        >
          {attributeGroups.map((group) => (
            <Panel
              header={
                <div className={styles.panelHeader}>
                  <div className={styles.groupInfo}>
                    <div className={styles.groupHeader}>
                      <div className={styles.groupLeft}>
                        <span className={styles.groupName}>{group.name}</span>
                        {group.description && (
                          <Tooltip title={group.description} placement="topLeft">
                            <span className={styles.descriptionText}>
                              {group.description}
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <Space size="small" className={styles.statusActions}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          title="查看详情"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('view', group);
                          }}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          title="编辑"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          title="删除"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                        />
                      </Space>
                    </div>
                  </div>
                </div>
              }
              key={group.id}
            >
              <div className={styles.panelContent}>
                <Descriptions
                  size="small"
                  column={2}
                  className={styles.descriptions}
                >
                  <Descriptions.Item label="属性组名称">
                    {group.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="属性组编码">
                    <code className={styles.codeValue}>{group.code}</code>
                  </Descriptions.Item>
                  <Descriptions.Item label="排序值">
                    {group.sort}
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Switch
                      size="small"
                      checked={group.status === 0}
                      disabled
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="描述" span={2}>
                    {group.description ? (
                      <Tooltip title={group.description} placement="topLeft">
                        <span className={styles.descriptionFullText}>
                          {group.description}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className={styles.emptyText}>暂无描述</span>
                    )}
                  </Descriptions.Item>
                </Descriptions>
                <div className={styles.attributeSection}>
                  <AttributeList 
                    attributeGroupId={group.id}
                    attributeGroupCode={group.code}
                    attributes={group.attrs || []}
                    onRefresh={async () => {
                      // 刷新属性组数据
                      try {
                        await fetchLatestAttrGroups();
                      } catch (error) {
                        // 如果获取最新数据失败，仍然调用旧的刷新回调
                        if (onRefresh) {
                          onRefresh();
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Empty
          description="暂无属性组"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.empty}
        >
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleAddGroup}
          >
            添加第一个属性组
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
            label="属性组名称"
            name="name"
            rules={[
              { required: modalType !== 'view', message: '请输入属性组名称' },
              { max: 50, message: '属性组名称不能超过50个字符' }
            ]}
          >
            <Input
              placeholder="请输入属性组名称"
              disabled={modalType === 'view'}
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label="属性组编码"
            name="code"
            rules={[
              { required: modalType !== 'view', message: '请输入属性组编码' },
              { pattern: /^[A-Z0-9_]+$/, message: '编码只能包含大写字母、数字和下划线' },
              { max: 30, message: '编码不能超过30个字符' }
            ]}
          >
            <Input
              placeholder="请输入属性组编码（大写字母、数字、下划线）"
              disabled={modalType === 'view' || modalType === 'edit'}
              maxLength={30}
            />
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

export default AttributeGroupList;

