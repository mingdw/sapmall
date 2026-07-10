import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputNumber, Modal, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { RotateCw } from 'lucide-react';
import type { ChainNetworkInfo, SaveChainNetworkReq } from '../../../../services/api/chainApi';
import chainApi from '../../../../services/api/chainApi';
import type { ListenerStatusInfo, ListenerType } from '../types';
import { LISTENER_TYPE_LABELS } from '../constants';
import MessageUtils from '../../../../utils/messageUtils';
import styles from '../ContractManager.module.scss';

interface ListenerStatusProps {
  chainList: ChainNetworkInfo[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

/** 从 chain_network 构建监听器状态列表 */
function buildListenerStatusList(chainList: ChainNetworkInfo[]): ListenerStatusInfo[] {
  const result: ListenerStatusInfo[] = [];

  for (const chain of chainList) {
    // 模拟当前区块高度
    const mockCurrentBlock = (chain.swapListenerLastBlock || chain.swapListenerStartBlock || 0) + 150;

    // Swap 监听器
    result.push({
      chainId: chain.chainId,
      chainName: chain.name,
      chainCode: chain.code,
      listenerType: 'swap',
      enabled: chain.swapListenerEnabled === 0,
      startBlock: chain.swapListenerStartBlock,
      lastBlock: chain.swapListenerLastBlock,
      currentBlock: mockCurrentBlock,
      pollInterval: chain.swapListenerPollInterval || chain.blockTime || 12,
      lag: Math.max(0, mockCurrentBlock - (chain.swapListenerLastBlock || chain.swapListenerStartBlock || 0)),
      status: chain.swapListenerEnabled === 0 ? 'running' : 'stopped',
      lastScanAt: new Date(Date.now() - 60_000).toISOString(),
    });

    // Config 监听器
    const configCurrent = (chain.configListenerLastBlock || chain.configListenerStartBlock || 0) + 85;
    result.push({
      chainId: chain.chainId,
      chainName: chain.name,
      chainCode: chain.code,
      listenerType: 'config',
      enabled: chain.configListenerEnabled === 0,
      startBlock: chain.configListenerStartBlock,
      lastBlock: chain.configListenerLastBlock,
      currentBlock: configCurrent,
      pollInterval: chain.configListenerPollInterval || chain.blockTime || 12,
      lag: Math.max(0, configCurrent - (chain.configListenerLastBlock || chain.configListenerStartBlock || 0)),
      status: chain.configListenerEnabled === 0 ? 'running' : 'stopped',
      lastScanAt: new Date(Date.now() - 120_000).toISOString(),
    });

    // Payment 监听器
    const paymentCurrent = (chain.paymentListenerLastBlock || chain.paymentListenerStartBlock || 0) + 200;
    result.push({
      chainId: chain.chainId,
      chainName: chain.name,
      chainCode: chain.code,
      listenerType: 'payment',
      enabled: chain.paymentListenerEnabled === 0,
      startBlock: chain.paymentListenerStartBlock,
      lastBlock: chain.paymentListenerLastBlock,
      currentBlock: paymentCurrent,
      pollInterval: chain.paymentListenerPollInterval || chain.blockTime || 12,
      lag: Math.max(0, paymentCurrent - (chain.paymentListenerLastBlock || chain.paymentListenerStartBlock || 0)),
      status: chain.paymentListenerEnabled === 0 ? 'running' : 'stopped',
      lastScanAt: new Date(Date.now() - 30_000).toISOString(),
    });
  }

  return result;
}

/** 构建 listener 字段前缀 */
function getListenerFieldPrefix(type: ListenerType): string {
  switch (type) {
    case 'swap':
      return 'swapListener';
    case 'config':
      return 'configListener';
    case 'payment':
      return 'paymentListener';
  }
}

const ListenerStatus: React.FC<ListenerStatusProps> = ({ chainList, loading, onRefresh }) => {
  const [togglingKey, setTogglingKey] = useState<string>('');
  const [resettingKey, setResettingKey] = useState<string>('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<ListenerStatusInfo | null>(null);
  const [resetBlockValue, setResetBlockValue] = useState<number | undefined>();

  const listenerList = useMemo(() => buildListenerStatusList(chainList), [chainList]);

  const findChain = useCallback(
    (chainId: number) => chainList.find((c) => c.chainId === chainId),
    [chainList],
  );

  const handleToggle = async (record: ListenerStatusInfo) => {
    const chain = findChain(record.chainId);
    if (!chain) return;

    const key = `${record.chainId}-${record.listenerType}`;
    setTogglingKey(key);

    try {
      const prefix = getListenerFieldPrefix(record.listenerType);
      const payload: SaveChainNetworkReq = {
        ...chain,
        [`${prefix}Enabled`]: record.enabled ? 1 : 0,
      };
      await chainApi.saveChainNetwork(payload);
      MessageUtils.success(record.enabled ? '监听器已禁用' : '监听器已启用');
      await onRefresh();
    } catch {
      MessageUtils.error('切换监听器状态失败');
    } finally {
      setTogglingKey('');
    }
  };

  const handleResetCursor = async (record: ListenerStatusInfo, newBlock: number) => {
    const chain = findChain(record.chainId);
    if (!chain) return;

    const key = `${record.chainId}-${record.listenerType}`;
    setResettingKey(key);

    try {
      const prefix = getListenerFieldPrefix(record.listenerType);
      const payload: SaveChainNetworkReq = {
        ...chain,
        [`${prefix}StartBlock`]: newBlock,
      };
      await chainApi.saveChainNetwork(payload);
      MessageUtils.success('游标已重置');
      setResetModalOpen(false);
      await onRefresh();
    } catch {
      MessageUtils.error('重置游标失败');
    } finally {
      setResettingKey('');
    }
  };

  const openResetModal = (record: ListenerStatusInfo) => {
    setResetTarget(record);
    setResetBlockValue(record.lastBlock);
    setResetModalOpen(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'running':
        return <Tag color="success">运行中</Tag>;
      case 'stopped':
        return <Tag color="default">已停止</Tag>;
      case 'error':
        return <Tag color="error">异常</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const getLagClass = (lag: number) => {
    if (lag === 0) return styles.lagOk;
    if (lag < 20) return styles.lagWarn;
    return styles.lagError;
  };

  const columns: TableColumnsType<ListenerStatusInfo> = [
    {
      title: '链',
      dataIndex: 'chainName',
      key: 'chainName',
      width: 140,
      render: (name: string, record) => (
        <span className={styles.chainCell}>
          {name}
          <span className={styles.chainIdBadge}>{record.chainId}</span>
        </span>
      ),
    },
    {
      title: '监听器',
      dataIndex: 'listenerType',
      key: 'listenerType',
      width: 140,
      render: (type: ListenerType) => LISTENER_TYPE_LABELS[type],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean, record: ListenerStatusInfo) => {
        const key = `${record.chainId}-${record.listenerType}`;
        return (
          <Switch
            size="small"
            checked={enabled}
            loading={togglingKey === key}
            onChange={() => handleToggle(record)}
          />
        );
      },
    },
    {
      title: '起始区块',
      dataIndex: 'startBlock',
      key: 'startBlock',
      width: 130,
      render: (n: number) => <span className={styles.monoText}>{n.toLocaleString()}</span>,
    },
    {
      title: '已处理区块',
      dataIndex: 'lastBlock',
      key: 'lastBlock',
      width: 130,
      render: (n: number) => <span className={styles.monoText}>{n.toLocaleString()}</span>,
    },
    {
      title: '当前区块',
      dataIndex: 'currentBlock',
      key: 'currentBlock',
      width: 130,
      render: (n: number) => <span className={styles.monoText}>{n.toLocaleString()}</span>,
    },
    {
      title: '延迟',
      dataIndex: 'lag',
      key: 'lag',
      width: 100,
      sorter: (a, b) => a.lag - b.lag,
      render: (lag: number) => (
        <span className={`${styles.lagValue} ${getLagClass(lag)}`}>{lag}</span>
      ),
    },
    {
      title: '轮询(秒)',
      dataIndex: 'pollInterval',
      key: 'pollInterval',
      width: 90,
      render: (n: number) => <span className={styles.monoText}>{n}s</span>,
    },
    {
      title: '最近扫描',
      dataIndex: 'lastScanAt',
      key: 'lastScanAt',
      width: 150,
      render: (time: string) => (time ? new Date(time).toLocaleString('zh-CN') : '—'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: ListenerStatusInfo) => {
        const key = `${record.chainId}-${record.listenerType}`;
        return (
          <Popconfirm
            title="重置监听器游标"
            description="将重置 lastBlock 到指定区块，下次扫描将从该区块开始。"
            onConfirm={() => openResetModal(record)}
            okText="重置"
            cancelText="取消"
          >
            <Tooltip title="重置游标">
              <button className={styles.iconActionBtn} disabled={resettingKey === key}>
                <RotateCw size={13} />
              </button>
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  // 统计概览
  const stats = useMemo(() => {
    const total = listenerList.length;
    const running = listenerList.filter((l) => l.status === 'running').length;
    const stopped = listenerList.filter((l) => l.status === 'stopped').length;
    const error = listenerList.filter((l) => l.status === 'error').length;
    return { total, running, stopped, error };
  }, [listenerList]);

  if (!loading && chainList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>暂无链配置</p>
        <p className={styles.emptyHint}>请先在「链网络管理」中添加区块链网络配置。</p>
      </div>
    );
  }

  return (
    <div className={styles.listenerContainer}>
      {/* 统计概览 */}
      <div className={styles.statsBar}>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>监听器总数</span>
          <span className={styles.statsValue}>{stats.total}</span>
        </div>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>运行中</span>
          <span className={`${styles.statsValue} ${styles.statsValueOk}`}>{stats.running}</span>
        </div>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>已停止</span>
          <span className={`${styles.statsValue} ${styles.statsValueMuted}`}>{stats.stopped}</span>
        </div>
        {stats.error > 0 && (
          <div className={styles.statsItem}>
            <span className={styles.statsLabel}>异常</span>
            <span className={`${styles.statsValue} ${styles.statsValueError}`}>{stats.error}</span>
          </div>
        )}
      </div>

      <Table<ListenerStatusInfo>
        rowKey={(record) => `${record.chainId}-${record.listenerType}`}
        loading={loading}
        columns={columns}
        dataSource={listenerList}
        size="small"
        scroll={{ x: 1200 }}
        pagination={false}
        className={styles.listenerTable}
      />

      {/* 重置游标弹窗 */}
      <Modal
        title="重置监听器游标"
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onOk={() => {
          if (resetTarget && resetBlockValue !== undefined) {
            handleResetCursor(resetTarget, resetBlockValue);
          }
        }}
        confirmLoading={!!resettingKey}
        okText="确认重置"
        cancelText="取消"
      >
        {resetTarget && (
          <div className={styles.resetModalContent}>
            <p className={styles.resetModalHint}>
              将重置 <strong>{resetTarget.chainName}</strong> 的{' '}
              <strong>{LISTENER_TYPE_LABELS[resetTarget.listenerType]}</strong> 游标。
            </p>
            <p className={styles.resetModalWarning}>
              下次扫描将从设置的区块号开始。请谨慎操作，过低可能导致重复处理事件。
            </p>
            <div className={styles.resetModalField}>
              <label className={styles.resetModalLabel}>当前游标</label>
              <span className={styles.monoText}>{resetTarget.lastBlock.toLocaleString()}</span>
            </div>
            <div className={styles.resetModalField}>
              <label className={styles.resetModalLabel}>新游标值</label>
              <InputNumber
                min={0}
                value={resetBlockValue}
                onChange={(v) => setResetBlockValue(v ?? 0)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListenerStatus;
