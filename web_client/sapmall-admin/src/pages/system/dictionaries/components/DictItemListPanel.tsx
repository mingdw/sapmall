import React from 'react';
import { Popconfirm, Spin, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminButton from '../../../../components/common/AdminButton';
import type { DictCategoryInfo, DictItemInfo } from '../../../../services/api/dictionaryApi';
import styles from '../DictionariesManager.module.scss';

interface DictItemListPanelProps {
  loading: boolean;
  selectedCategory: DictCategoryInfo | null;
  list: DictItemInfo[];
  onAdd: () => void;
  onEdit: (item: DictItemInfo) => void;
  onToggleStatus: (item: DictItemInfo) => void;
  onDelete: (item: DictItemInfo) => void;
  togglingItemId?: number;
  onRefresh: () => void;
}

const DictItemListPanel: React.FC<DictItemListPanelProps> = ({
  loading,
  selectedCategory,
  list,
  onAdd,
  onEdit,
  onToggleStatus,
  onDelete,
  togglingItemId,
  onRefresh,
}) => {
  const columns: ColumnsType<DictItemInfo> = [
    { title: '编码', dataIndex: 'code', key: 'code', width: 160 },
    { title: '值', dataIndex: 'value', key: 'value', width: 220 },
    { title: '描述', dataIndex: 'desc', key: 'desc' },
    { title: '层级', dataIndex: 'level', key: 'level', width: 80 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (value: number, record) => (
        <div className={styles.itemStatusCell}>
          <span className={value === 1 ? styles.statusTagEnabled : styles.statusTagDisabled}>
            {value === 1 ? '启用' : '禁用'}
          </span>
          <Switch
            size="small"
            checked={record.status === 1}
            loading={togglingItemId === record.id}
            onChange={() => onToggleStatus(record)}
          />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <div className={styles.inlineActions}>
          <AdminButton variant="outline" size="xs" icon="fas fa-pen" onClick={() => onEdit(record)}>
            编辑
          </AdminButton>
          <Popconfirm
            title="确认删除该字典项吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => onDelete(record)}
          >
            <AdminButton variant="outline" size="xs" icon="fas fa-trash">
              删除
            </AdminButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHead}>
        <h3 className={styles.panelTitle}>
          <i className="fas fa-list-check"></i>
          字典项管理
        </h3>
        <div className={styles.inlineActions}>
          <AdminButton variant="outline" size="sm" icon="fas fa-rotate" onClick={onRefresh}>
            刷新
          </AdminButton>
          <AdminButton
            variant="primary"
            size="xs"
            className={styles.addTinyButton}
            icon="fas fa-plus"
            onClick={onAdd}
            disabled={!selectedCategory}
          >
            新增字典项
          </AdminButton>
        </div>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          className={styles.itemTableDark}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default DictItemListPanel;
