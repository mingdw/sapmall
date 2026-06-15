import React from 'react';
import { Popconfirm, Spin, Switch, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminButton from '../../../components/common/AdminButton';
import type { ChainPaymentTokenInfo } from '../../../services/api/chainApi';
import {
  PAYMENT_TOKEN_STATUS,
  SYNC_STATUS,
  getSyncStatusLabel,
} from './constants';
import styles from './ChainNetManager.module.scss';

interface ChainPaymentTokenPanelProps {
  loading: boolean;
  list: ChainPaymentTokenInfo[];
  enabledCount: number;
  togglingTokenId?: number;
  onRefresh: () => void;
  onAdd: () => void;
  onEdit: (token: ChainPaymentTokenInfo) => void;
  onToggleStatus: (token: ChainPaymentTokenInfo) => void;
  onDelete: (token: ChainPaymentTokenInfo) => void;
}

const getSyncTagClass = (status: number) => {
  if (status === SYNC_STATUS.SYNCED) return styles.syncTagOk;
  if (status === SYNC_STATUS.FAILED) return styles.syncTagFail;
  if (status === SYNC_STATUS.SYNCING) return styles.syncTagSyncing;
  return styles.syncTagPending;
};

const ChainPaymentTokenPanel: React.FC<ChainPaymentTokenPanelProps> = ({
  loading,
  list,
  enabledCount,
  togglingTokenId,
  onRefresh,
  onAdd,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const columns: ColumnsType<ChainPaymentTokenInfo> = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol', width: 90 },
    { title: '显示名', dataIndex: 'displayName', key: 'displayName', width: 120, render: (v) => v || '-' },
    {
      title: '合约地址',
      dataIndex: 'contractAddress',
      key: 'contractAddress',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <span className={styles.contractCell}>{v}</span>
        </Tooltip>
      ),
    },
    { title: '精度', dataIndex: 'decimals', key: 'decimals', width: 70, className: styles.tabularNums },
    { title: 'Config Key', dataIndex: 'configKey', key: 'configKey', width: 160, ellipsis: true },
    {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      width: 100,
      render: (value: number, record) => (
        <Tooltip title={record.syncError || record.lastSyncTxHash || undefined}>
          <span className={getSyncTagClass(value)}>{getSyncStatusLabel(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (value: number, record) => (
        <Switch
          size="small"
          checked={record.status === PAYMENT_TOKEN_STATUS.ENABLED}
          loading={togglingTokenId === record.id}
          onChange={() => onToggleStatus(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <div className={styles.inlineActions}>
          <button type="button" className={styles.textAction} onClick={() => onEdit(record)}>
            编辑
          </button>
          <Popconfirm
            title="确认删除该支付代币？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => onDelete(record)}
          >
            <button type="button" className={styles.textActionDanger}>
              删除
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <section className={`${styles.section} ${styles.sectionPanel}`}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionHeading}>
          支付代币
          <span className={styles.statusPill}>启用 {enabledCount}/{list.length}</span>
        </h3>
        <div className={styles.inlineActions}>
          <button type="button" className={styles.textAction} onClick={onRefresh}>
            刷新
          </button>
          <AdminButton variant="primary" size="sm" className={styles.chainBtnPrimary} onClick={onAdd}>
            新增
          </AdminButton>
        </div>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="middle"
          className={styles.tokenTable}
          columns={columns}
          dataSource={list}
          pagination={false}
          locale={{
            emptyText: <span className={styles.tableEmptyHint}>暂无支付代币，点击「新增」添加</span>,
          }}
        />
      </Spin>
    </section>
  );
};

export default ChainPaymentTokenPanel;
