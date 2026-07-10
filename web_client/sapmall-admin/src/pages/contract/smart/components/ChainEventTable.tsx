import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Input, Select, Space, Table, Tag, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { Download, RotateCw, Search } from 'lucide-react';
import type { ChainNetworkInfo } from '../../../../services/api/chainApi';
import type { ChainEventInfo } from '../types';
import {
  BUSINESS_TYPE_OPTIONS,
  EVENT_PROCESS_STATUS_OPTIONS,
  generateMockChainEvents,
  getEventProcessStatusClass,
  getEventProcessStatusLabel,
} from '../constants';
import MessageUtils from '../../../../utils/messageUtils';
import styles from '../ContractManager.module.scss';

interface ChainEventTableProps {
  chainList: ChainNetworkInfo[];
}

const PAGE_SIZE = 15;

const ChainEventTable: React.FC<ChainEventTableProps> = ({ chainList }) => {
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState<ChainEventInfo[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 筛选
  const [filterChainId, setFilterChainId] = useState<number | undefined>();
  const [filterBusinessType, setFilterBusinessType] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<number | undefined>();
  const [filterEventName, setFilterEventName] = useState('');

  // 详情抽屉
  const [detailEvent, setDetailEvent] = useState<ChainEventInfo | null>(null);
  const [retryingId, setRetryingId] = useState<number | undefined>();

  const allMockEvents = useMemo(() => generateMockChainEvents(), []);

  const loadEvents = useCallback(() => {
    setLoading(true);
    // 模拟 API 请求延迟
    setTimeout(() => {
      let filtered = allMockEvents;

      if (filterChainId !== undefined) {
        filtered = filtered.filter((e) => e.chainId === filterChainId);
      }
      if (filterBusinessType) {
        filtered = filtered.filter((e) => e.businessType === filterBusinessType);
      }
      if (filterStatus !== undefined) {
        filtered = filtered.filter((e) => e.processStatus === filterStatus);
      }
      if (filterEventName.trim()) {
        const keyword = filterEventName.trim().toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.eventName.toLowerCase().includes(keyword) ||
            e.txHash?.toLowerCase().includes(keyword) ||
            e.contractAddress.toLowerCase().includes(keyword),
        );
      }

      setTotal(filtered.length);
      const start = (page - 1) * PAGE_SIZE;
      setEventList(filtered.slice(start, start + PAGE_SIZE));
      setLoading(false);
    }, 300);
  }, [allMockEvents, filterChainId, filterBusinessType, filterStatus, filterEventName, page]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSearch = () => {
    setPage(1);
    loadEvents();
  };

  const handleReset = () => {
    setFilterChainId(undefined);
    setFilterBusinessType(undefined);
    setFilterStatus(undefined);
    setFilterEventName('');
    setPage(1);
  };

  const handleRetry = (event: ChainEventInfo) => {
    setRetryingId(event.id);
    // 模拟重试
    setTimeout(() => {
      MessageUtils.success(`事件 #${event.id} 已加入重试队列`);
      setRetryingId(undefined);
      loadEvents();
    }, 800);
  };

  const handleExport = () => {
    MessageUtils.info('导出功能开发中');
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const columns: TableColumnsType<ChainEventInfo> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: number) => <span className={styles.monoText}>#{id}</span>,
    },
    {
      title: '链',
      dataIndex: 'chainName',
      key: 'chainName',
      width: 120,
      render: (name: string, record) => (
        <span className={styles.chainCell}>
          {name}
          <span className={styles.chainIdBadge}>{record.chainId}</span>
        </span>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: '事件名',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 160,
      render: (name: string) => <code className={styles.monoText}>{name}</code>,
    },
    {
      title: '合约',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 140,
      render: (name: string, record) => (
        <Tooltip title={record.contractAddress}>
          <span className={styles.monoText}>{name || formatAddress(record.contractAddress)}</span>
        </Tooltip>
      ),
    },
    {
      title: '区块号',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
      width: 110,
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      render: (n: number) => <span className={styles.monoText}>{n.toLocaleString()}</span>,
    },
    {
      title: '处理状态',
      dataIndex: 'processStatus',
      key: 'processStatus',
      width: 110,
      render: (status: number) => (
        <span className={`${styles.statusPill} ${styles[getEventProcessStatusClass(status)]}`}>
          {getEventProcessStatusLabel(status)}
        </span>
      ),
    },
    {
      title: '重试',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 60,
      render: (count: number) => (count > 0 ? <span className={styles.retryBadge}>{count}</span> : '—'),
    },
    {
      title: '时间',
      dataIndex: 'eventTime',
      key: 'eventTime',
      width: 160,
      sorter: (a, b) => new Date(a.eventTime || '').getTime() - new Date(b.eventTime || '').getTime(),
      render: (time: string) => (time ? new Date(time).toLocaleString('zh-CN') : '—'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: ChainEventInfo) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => setDetailEvent(record)}>
            详情
          </Button>
          {record.processStatus === 3 && (
            <Button
              type="link"
              size="small"
              loading={retryingId === record.id}
              onClick={() => handleRetry(record)}
            >
              重试
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.eventContainer}>
      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size={12}>
          <Select
            allowClear
            placeholder="选择链"
            style={{ width: 160 }}
            value={filterChainId}
            onChange={(v) => setFilterChainId(v)}
            options={chainList.map((c) => ({ label: c.name, value: c.chainId }))}
          />
          <Select
            allowClear
            placeholder="业务类型"
            style={{ width: 120 }}
            value={filterBusinessType}
            onChange={(v) => setFilterBusinessType(v)}
            options={BUSINESS_TYPE_OPTIONS}
          />
          <Select
            allowClear
            placeholder="处理状态"
            style={{ width: 120 }}
            value={filterStatus}
            onChange={(v) => setFilterStatus(v)}
            options={EVENT_PROCESS_STATUS_OPTIONS}
          />
          <Input
            allowClear
            placeholder="事件名 / TxHash / 合约地址"
            style={{ width: 260 }}
            value={filterEventName}
            onChange={(e) => setFilterEventName(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<Search size={14} />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<RotateCw size={14} />} onClick={handleReset}>
            重置
          </Button>
          <Button icon={<Download size={14} />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </div>

      {/* 事件表格 */}
      <Table<ChainEventInfo>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={eventList}
        size="small"
        scroll={{ x: 1100 }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p) => setPage(p),
        }}
        className={styles.eventTable}
      />

      {/* 详情抽屉 */}
      <Drawer
        title={`事件详情 #${detailEvent?.id ?? ''}`}
        open={!!detailEvent}
        onClose={() => setDetailEvent(null)}
        width={560}
        className={styles.eventDetailDrawer}
      >
        {detailEvent && (
          <div className={styles.eventDetail}>
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>基本信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>业务类型</span>
                  <span className={styles.detailValue}>{detailEvent.businessType}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>业务编码</span>
                  <span className={styles.detailValue}>{detailEvent.businessCode || '—'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>链</span>
                  <span className={styles.detailValue}>{detailEvent.chainName} ({detailEvent.chainId})</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>合约名称</span>
                  <span className={styles.detailValue}>{detailEvent.contractName || '—'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>事件名</span>
                  <span className={styles.detailValue}><code className={styles.monoText}>{detailEvent.eventName}</code></span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>处理状态</span>
                  <span className={`${styles.statusPill} ${styles[getEventProcessStatusClass(detailEvent.processStatus)]}`}>
                    {getEventProcessStatusLabel(detailEvent.processStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>链上信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>合约地址</span>
                  <div className={styles.detailMonoValue}>
                    <code className={styles.monoText}>{detailEvent.contractAddress}</code>
                  </div>
                </div>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>TxHash</span>
                  <div className={styles.detailMonoValue}>
                    {detailEvent.txHash ? (
                      <code className={styles.monoText}>{detailEvent.txHash}</code>
                    ) : (
                      <span className={styles.detailEmpty}>未上链</span>
                    )}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>区块号</span>
                  <span className={styles.detailValue}>{detailEvent.blockNumber.toLocaleString()}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>确认数</span>
                  <span className={styles.detailValue}>{detailEvent.confirmations}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tx Index</span>
                  <span className={styles.detailValue}>{detailEvent.txIndex}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Log Index</span>
                  <span className={styles.detailValue}>{detailEvent.logIndex}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>事件时间</span>
                  <span className={styles.detailValue}>
                    {detailEvent.eventTime ? new Date(detailEvent.eventTime).toLocaleString('zh-CN') : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>事件签名</h4>
              <pre className={styles.jsonBlock}>{detailEvent.eventSig}</pre>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>事件负载 (Payload)</h4>
              <pre className={styles.jsonBlock}>
                {JSON.stringify(detailEvent.eventPayload, null, 2)}
              </pre>
            </div>

            {detailEvent.rawLog && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSectionTitle}>原始日志</h4>
                <pre className={styles.jsonBlock}>
                  {JSON.stringify(detailEvent.rawLog, null, 2)}
                </pre>
              </div>
            )}

            {detailEvent.errorMsg && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSectionTitle}>错误信息</h4>
                <div className={styles.errorBlock}>{detailEvent.errorMsg}</div>
                <div className={styles.detailMeta}>
                  <span>重试次数: {detailEvent.retryCount}</span>
                </div>
              </div>
            )}

            {detailEvent.processStatus === 3 && (
              <div className={styles.detailActions}>
                <Button
                  type="primary"
                  loading={retryingId === detailEvent.id}
                  onClick={() => handleRetry(detailEvent)}
                >
                  手动重试
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ChainEventTable;
