import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { Plus } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { AdjustmentRecord, AdjustmentType, UserProfile } from '../types';
import {
  ADJUSTMENT_TYPE_LABELS,
  ADJUSTMENT_TYPE_ICONS,
  ADJUSTMENT_STATUS_LABELS,
} from '../constants';
import styles from '../BalanceManager.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const statusClassMap: Record<string, string> = {
  completed: styles.statusConfirmed,
  pending: styles.statusPending,
  rejected: styles.statusFailed,
};

interface BalanceOperationsProps {
  profile: UserProfile;
  adjustments: AdjustmentRecord[];
}

const BalanceOperations: React.FC<BalanceOperationsProps> = ({ profile, adjustments: initialAdjustments }) => {
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>(initialAdjustments);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<AdjustmentRecord> = [
    {
      title: '操作类型',
      key: 'type',
      width: 100,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className={ADJUSTMENT_TYPE_ICONS[r.type]} style={{ fontSize: 13, color: r.type === 'credit' || r.type === 'unfreeze' ? '#6ee7b7' : r.type === 'debit' ? '#fca5a5' : '#fbbf24' }} />
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{ADJUSTMENT_TYPE_LABELS[r.type]}</span>
        </div>
      ),
    },
    {
      title: '金额',
      key: 'amount',
      width: 140,
      sorter: (a, b) => a.amount - b.amount,
      render: (_, r) => (
        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: r.type === 'credit' ? '#6ee7b7' : r.type === 'debit' ? '#fca5a5' : '#e2e8f0' }}>
          {r.type === 'credit' ? '+' : r.type === 'debit' ? '-' : ''}{r.amount.toLocaleString()} {r.tokenSymbol}
        </span>
      ),
    },
    {
      title: '链',
      key: 'chain',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.chainName}</span>,
    },
    {
      title: '原因',
      key: 'reason',
      width: 220,
      render: (_, r) => (
        <div>
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{r.reason}</span>
          {r.memo && <div style={{ fontSize: 12, color: '#64748b' }}>{r.memo}</div>}
        </div>
      ),
    },
    {
      title: '操作人',
      key: 'operator',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 13, color: '#94a3b8' }}>{r.operator}</span>,
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: (_, r) => (
        <span className={`${styles.statusPill} ${statusClassMap[r.status]}`}>
          {ADJUSTMENT_STATUS_LABELS[r.status]}
        </span>
      ),
    },
    {
      title: '创建时间',
      key: 'createdAt',
      width: 170,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (_, r) => <span style={{ fontSize: 12, color: '#64748b' }}>{r.createdAt}</span>,
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const chainInfo = profile.chainBalances.find((c) => c.chainId === values.chainId);
      const newRecord: AdjustmentRecord = {
        id: adjustments.length + 1,
        operator: 'admin',
        type: values.type as AdjustmentType,
        amount: values.amount,
        tokenSymbol: values.tokenSymbol,
        chainName: chainInfo?.chainName ?? '—',
        status: 'completed',
        reason: values.reason,
        memo: values.memo,
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        reviewedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        reviewer: 'admin',
      };
      setAdjustments((prev) => [newRecord, ...prev]);
      message.success('调账操作已完成');
      setModalOpen(false);
      form.resetFields();
    } catch {
      // 校验失败
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* 操作栏 */}
      <div className={styles.filterBar}>
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={() => setModalOpen(true)}
          style={{ background: 'rgba(251,191,36,0.9)', borderColor: 'rgba(251,191,36,0.4)' }}
        >
          新增调账
        </Button>
      </div>

      {/* 调账记录表格 */}
      <div className={styles.balanceTable}>
        <Table<AdjustmentRecord>
          dataSource={adjustments}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条记录` }}
        />
      </div>

      {/* 新增调账 Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        confirmLoading={submitting}
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-balance-scale" style={{ color: '#fbbf24' }} />
            新增余额调整
          </span>
        }
        okText="确认调账"
        cancelText="取消"
        className={styles.balanceModal}
        width={520}
      >
        <Form form={form} layout="vertical" className={styles.adjustForm}>
          <Form.Item name="type" label="操作类型" rules={[{ required: true, message: '请选择操作类型' }]}>
            <Select placeholder="选择操作类型">
              {(Object.keys(ADJUSTMENT_TYPE_LABELS) as AdjustmentType[]).map((t) => (
                <Option key={t} value={t}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <i className={ADJUSTMENT_TYPE_ICONS[t]} />
                    {ADJUSTMENT_TYPE_LABELS[t]}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="chainId" label="目标链" rules={[{ required: true, message: '请选择链' }]}>
            <Select placeholder="选择链网络">
              {profile.chainBalances.map((c) => (
                <Option key={c.chainId} value={c.chainId}>
                  {c.chainName} (#{c.chainId})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item name="amount" label="金额" rules={[{ required: true, message: '请输入金额' }]} style={{ flex: 1 }}>
              <InputNumber placeholder="0.00" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="tokenSymbol" label="代币" rules={[{ required: true, message: '请选择代币' }]} style={{ width: 120 }}>
              <Select placeholder="选择">
                <Option value="SAP">SAP</Option>
                <Option value="USDC">USDC</Option>
                <Option value="EURC">EURC</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="reason" label="调账原因" rules={[{ required: true, message: '请输入调账原因' }]}>
            <Input placeholder="如：活动奖励补发、异常交易冻结等" />
          </Form.Item>
          <Form.Item name="memo" label="备注（选填）">
            <TextArea rows={2} placeholder="补充说明..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BalanceOperations;
