import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { Plus } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { AdjustmentRecord, AdjustmentType, UserProfile } from '../types';
import {
  getAdjustmentTypeLabels,
  ADJUSTMENT_TYPE_ICONS,
  getAdjustmentStatusLabels,
} from '../constants';
import styles from '../BalanceManager.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const ADJUSTMENT_TYPE_KEYS: AdjustmentType[] = ['credit', 'debit', 'freeze', 'unfreeze'];

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
  const { t } = useTranslation();
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>(initialAdjustments);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const adjustmentTypeLabels = getAdjustmentTypeLabels(t);
  const adjustmentStatusLabels = getAdjustmentStatusLabels(t);

  const columns: ColumnsType<AdjustmentRecord> = [
    {
      title: t('assets.balance.operations.colType'),
      key: 'type',
      width: 100,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className={ADJUSTMENT_TYPE_ICONS[r.type]} style={{ fontSize: 13, color: r.type === 'credit' || r.type === 'unfreeze' ? '#6ee7b7' : r.type === 'debit' ? '#fca5a5' : '#fbbf24' }} />
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{adjustmentTypeLabels[r.type]}</span>
        </div>
      ),
    },
    {
      title: t('assets.balance.operations.colAmount'),
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
      title: t('assets.balance.operations.colChain'),
      key: 'chain',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.chainName}</span>,
    },
    {
      title: t('assets.balance.operations.colReason'),
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
      title: t('assets.balance.operations.colOperator'),
      key: 'operator',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 13, color: '#94a3b8' }}>{r.operator}</span>,
    },
    {
      title: t('assets.balance.operations.colStatus'),
      key: 'status',
      width: 90,
      render: (_, r) => (
        <span className={`${styles.statusPill} ${statusClassMap[r.status]}`}>
          {adjustmentStatusLabels[r.status]}
        </span>
      ),
    },
    {
      title: t('assets.balance.operations.colCreatedAt'),
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
      message.success(t('assets.balance.operations.msgAdjustmentCompleted'));
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
          {t('assets.balance.operations.addAdjustment')}
        </Button>
      </div>

      {/* 调账记录表格 */}
      <div className={styles.balanceTable}>
        <Table<AdjustmentRecord>
          dataSource={adjustments}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => t('assets.balance.operations.totalRecords', { count: total }) }}
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
            {t('assets.balance.operations.modalTitle')}
          </span>
        }
        okText={t('assets.balance.operations.confirmAdjustment')}
        cancelText={t('assets.balance.operations.cancelText')}
        className={styles.balanceModal}
        width={520}
      >
        <Form form={form} layout="vertical" className={styles.adjustForm}>
          <Form.Item name="type" label={t('assets.balance.operations.formType')} rules={[{ required: true, message: t('assets.balance.operations.validation.selectType') }]}>
            <Select placeholder={t('assets.balance.operations.placeholderType')}>
              {ADJUSTMENT_TYPE_KEYS.map((key) => (
                <Option key={key} value={key}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <i className={ADJUSTMENT_TYPE_ICONS[key]} />
                    {adjustmentTypeLabels[key]}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="chainId" label={t('assets.balance.operations.formTargetChain')} rules={[{ required: true, message: t('assets.balance.operations.validation.selectChain') }]}>
            <Select placeholder={t('assets.balance.operations.placeholderChain')}>
              {profile.chainBalances.map((c) => (
                <Option key={c.chainId} value={c.chainId}>
                  {c.chainName} (#{c.chainId})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item name="amount" label={t('assets.balance.operations.formAmount')} rules={[{ required: true, message: t('assets.balance.operations.validation.enterAmount') }]} style={{ flex: 1 }}>
              <InputNumber placeholder="0.00" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="tokenSymbol" label={t('assets.balance.operations.formToken')} rules={[{ required: true, message: t('assets.balance.operations.validation.selectToken') }]} style={{ width: 120 }}>
              <Select placeholder={t('assets.balance.operations.placeholderToken')}>
                <Option value="SAP">SAP</Option>
                <Option value="USDC">USDC</Option>
                <Option value="EURC">EURC</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="reason" label={t('assets.balance.operations.formReason')} rules={[{ required: true, message: t('assets.balance.operations.validation.enterReason') }]}>
            <Input placeholder={t('assets.balance.operations.placeholderReason')} />
          </Form.Item>
          <Form.Item name="memo" label={t('assets.balance.operations.formMemoOptional')}>
            <TextArea rows={2} placeholder={t('assets.balance.operations.placeholderMemo')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BalanceOperations;
