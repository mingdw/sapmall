import React, { useState } from 'react';
import { Button, Space, Collapse, Empty, Switch, Tooltip, Descriptions, Input, InputNumber, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import AttributeList from './AttributeList';
import styles from './AttributeGroupList.module.scss';

const { Panel } = Collapse;

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

interface AttributeGroup {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs: Attribute[];
}

interface AttributeGroupListProps {
  categoryId: number;
  attrGroups?: AttributeGroup[];
}

const AttributeGroupList: React.FC<AttributeGroupListProps> = ({
  categoryId,
  attrGroups = [],
}) => {
  // 使用传入的属性组数据，如果没有则显示空状态
  const attributeGroups = attrGroups;
  
  // 编辑状态管理
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<AttributeGroup>>({});

  const handleAddGroup = () => {
    console.log('添加属性组');
    // TODO: 打开添加属性组弹窗
  };

  const handleEditGroup = (group: AttributeGroup) => {
    setEditingGroupId(group.id);
    setEditingData({
      name: group.name,
      code: group.code,
      sort: group.sort,
      status: group.status,
      description: group.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingData({});
  };

  const handleConfirmEdit = async (group: AttributeGroup) => {
    try {
      console.log('保存编辑:', { ...group, ...editingData });
      // TODO: 调用API更新属性组
      message.success('属性组更新成功');
      setEditingGroupId(null);
      setEditingData({});
    } catch (error) {
      message.error('属性组更新失败');
      console.error(error);
    }
  };

  const handleDeleteGroup = (group: AttributeGroup) => {
    console.log('删除属性组', group);
    // TODO: 确认删除
  };

  const handleStatusChange = (checked: boolean) => {
    setEditingData({
      ...editingData,
      status: checked ? 1 : 0,
    });
  };

  const isEditing = (groupId: number) => editingGroupId === groupId;

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
                        {isEditing(group.id) ? (
                          <>
                            <Button
                              type="text"
                              size="small"
                              icon={<CheckOutlined />}
                              title="确认"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmEdit(group);
                              }}
                              className={styles.confirmBtn}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<CloseOutlined />}
                              title="取消"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className={styles.cancelBtn}
                            />
                          </>
                        ) : (
                          <>
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
                              icon={<DeleteOutlined />}
                              title="删除"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(group);
                              }}
                            />
                          </>
                        )}
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
                    {isEditing(group.id) ? (
                      <Input
                        size="small"
                        value={editingData.name}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        placeholder="请输入属性组名称"
                        className={styles.editInput}
                      />
                    ) : (
                      group.name
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="属性组编码">
                    {isEditing(group.id) ? (
                      <Input
                        size="small"
                        value={editingData.code}
                        onChange={(e) => setEditingData({ ...editingData, code: e.target.value })}
                        placeholder="请输入属性组编码"
                        className={styles.editInput}
                      />
                    ) : (
                      <code className={styles.codeValue}>{group.code}</code>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="排序值">
                    {isEditing(group.id) ? (
                      <InputNumber
                        size="small"
                        value={editingData.sort}
                        onChange={(value) => setEditingData({ ...editingData, sort: value || 0 })}
                        placeholder="请输入排序值"
                        className={styles.editInput}
                        min={0}
                      />
                    ) : (
                      group.sort
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Switch
                      size="small"
                      checked={isEditing(group.id) ? editingData.status === 1 : group.status === 1}
                      disabled={!isEditing(group.id)}
                      onChange={handleStatusChange}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="描述" span={2}>
                    {isEditing(group.id) ? (
                      <Input.TextArea
                        size="small"
                        value={editingData.description}
                        onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                        placeholder="请输入描述"
                        className={styles.editTextarea}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                      />
                    ) : (
                      group.description ? (
                        <Tooltip title={group.description} placement="topLeft">
                          <span className={styles.descriptionFullText}>
                            {group.description}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className={styles.emptyText}>暂无描述</span>
                      )
                    )}
                  </Descriptions.Item>
                </Descriptions>
                <div className={styles.attributeSection}>
                  <AttributeList 
                    attributeGroupId={group.id} 
                    attributes={group.attrs}
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
    </div>
  );
};

export default AttributeGroupList;

