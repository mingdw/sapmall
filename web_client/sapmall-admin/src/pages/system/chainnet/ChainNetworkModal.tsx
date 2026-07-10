import React from 'react';
import { Form, Input, InputNumber, Modal, Select, Space, Switch } from 'antd';
import AdminButton from '../../../components/common/AdminButton';
import type { ChainNetworkInfo, SaveChainNetworkReq } from '../../../services/api/chainApi';
import { CHAIN_NETWORK_STATUS_OPTIONS } from './constants';
import { CHAINNET_SELECT_POPUP_CLASS } from './chainnetTheme';
import styles from './ChainNetManager.module.scss';

// 表单值类型，覆盖接口的 number 类型为 boolean（用于 Switch 组件）
type ChainNetworkFormValues = {
  // 基础信息
  projectId?: string;
  chainId?: number;
  code?: string;
  name?: string;
  nativeSymbol?: string;
  blockTime?: number;
  safeConfirmations?: number;
  // 网络配置
  rpcUrl?: string;
  wsUrl?: string;
  explorerUrl?: string;
  // 合约地址
  platformConfigAddress?: string;
  paymentRouterAddress?: string;
  settlementVaultAddress?: string;
  swapRouterAddress?: string;
  signerKeyRef?: string;
  // 监听器配置（使用 boolean 类型）
  swapListenerEnabled?: boolean;
  swapListenerPollInterval?: number;
  swapListenerStartBlock?: number;
  configListenerEnabled?: boolean;
  configListenerPollInterval?: number;
  configListenerStartBlock?: number;
  paymentListenerEnabled?: boolean;
  paymentListenerPollInterval?: number;
  paymentListenerStartBlock?: number;
  // 其他
  sort?: number;
  status?: number;
  remark?: string;
};

interface ChainNetworkModalProps {
  open: boolean;
  submitting: boolean;
  initial: ChainNetworkInfo | null;
  onCancel: () => void;
  onSubmit: (payload: SaveChainNetworkReq) => Promise<void>;
}

const modalClassNames = {
  wrapper: styles.chainnetModalWrap,
  content: styles.chainnetModal,
  header: styles.chainnetModalHeader,
  body: styles.chainnetModalBody,
  footer: styles.chainnetModalFooter,
};

const ChainNetworkModal: React.FC<ChainNetworkModalProps> = ({
  open,
  submitting,
  initial,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<ChainNetworkFormValues>();
  const isEdit = Boolean(initial);

  React.useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      // 基础信息
      projectId: initial?.projectId || '',
      chainId: initial?.chainId,
      code: initial?.code || '',
      name: initial?.name || '',
      nativeSymbol: initial?.nativeSymbol || '',
      // 链特性配置
      blockTime: initial?.blockTime ?? 12,
      safeConfirmations: initial?.safeConfirmations ?? 12,
      // 网络配置
      rpcUrl: initial?.rpcUrl || '',
      wsUrl: initial?.wsUrl || '',
      explorerUrl: initial?.explorerUrl || '',
      // 合约地址
      platformConfigAddress: initial?.platformConfigAddress || '',
      paymentRouterAddress: initial?.paymentRouterAddress || '',
      settlementVaultAddress: initial?.settlementVaultAddress || '',
      swapRouterAddress: initial?.swapRouterAddress || '',
      signerKeyRef: initial?.signerKeyRef || '',
      // Swap 监听器配置
      swapListenerEnabled: (initial?.swapListenerEnabled ?? 1) === 0,
      swapListenerPollInterval: initial?.swapListenerPollInterval ?? 12,
      swapListenerStartBlock: initial?.swapListenerStartBlock ?? 0,
      // Config 监听器配置
      configListenerEnabled: (initial?.configListenerEnabled ?? 1) === 0,
      configListenerPollInterval: initial?.configListenerPollInterval ?? 12,
      configListenerStartBlock: initial?.configListenerStartBlock ?? 0,
      // Payment 监听器配置
      paymentListenerEnabled: (initial?.paymentListenerEnabled ?? 1) === 0,
      paymentListenerPollInterval: initial?.paymentListenerPollInterval ?? 12,
      paymentListenerStartBlock: initial?.paymentListenerStartBlock ?? 0,
      // 其他
      sort: initial?.sort ?? 0,
      status: initial?.status ?? 0,
      remark: initial?.remark || '',
    });
  }, [open, initial, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    // 确保必填字段有值（经过 validateFields 后一定有值，这里是为了 TypeScript 类型检查）
    const chainId = values.chainId ?? 0;
    const code = values.code ?? '';
    const name = values.name ?? '';

    await onSubmit({
      id: initial?.id,
      // 基础信息
      projectId: values.projectId?.trim() || undefined,
      chainId,
      code: code.trim(),
      name: name.trim(),
      nativeSymbol: values.nativeSymbol?.trim() || undefined,
      // 链特性配置
      blockTime: values.blockTime ?? 12,
      safeConfirmations: values.safeConfirmations ?? 12,
      // 网络配置
      rpcUrl: values.rpcUrl?.trim() || undefined,
      wsUrl: values.wsUrl?.trim() || undefined,
      explorerUrl: values.explorerUrl?.trim() || undefined,
      // 合约地址
      platformConfigAddress: values.platformConfigAddress?.trim() || undefined,
      paymentRouterAddress: values.paymentRouterAddress?.trim() || undefined,
      settlementVaultAddress: values.settlementVaultAddress?.trim() || undefined,
      swapRouterAddress: values.swapRouterAddress?.trim() || undefined,
      signerKeyRef: values.signerKeyRef?.trim() || undefined,
      // Swap 监听器配置
      swapListenerEnabled: values.swapListenerEnabled ? 0 : 1,
      swapListenerPollInterval: values.swapListenerPollInterval ?? 12,
      swapListenerStartBlock: values.swapListenerStartBlock ?? 0,
      // Config 监听器配置
      configListenerEnabled: values.configListenerEnabled ? 0 : 1,
      configListenerPollInterval: values.configListenerPollInterval ?? 12,
      configListenerStartBlock: values.configListenerStartBlock ?? 0,
      // Payment 监听器配置
      paymentListenerEnabled: values.paymentListenerEnabled ? 0 : 1,
      paymentListenerPollInterval: values.paymentListenerPollInterval ?? 12,
      paymentListenerStartBlock: values.paymentListenerStartBlock ?? 0,
      // 其他
      sort: values.sort ?? 0,
      status: values.status ?? 0,
      remark: values.remark?.trim() || undefined,
    });
  };

  const modalTitle = (
    <div className={styles.modalTitleWrap}>
      <span className={styles.modalTitle}>{isEdit ? '编辑链配置' : '新增链配置'}</span>
      <span className={styles.modalSubtitle}>
        {isEdit ? '修改 RPC、合约地址与事件监听等配置' : '登记新链网络，供前台切换与支付使用'}
      </span>
    </div>
  );

  const modalFooter = (
    <div className={styles.modalFooter}>
      <AdminButton variant="outline" size="sm" className={styles.chainBtnGhost} onClick={onCancel} disabled={submitting}>
        取消
      </AdminButton>
      <AdminButton
        variant="primary"
        size="sm"
        className={styles.chainBtnPrimary}
        onClick={() => handleSave().catch(() => undefined)}
        loading={submitting}
        disabled={submitting}
      >
        {isEdit ? '保存' : '创建'}
      </AdminButton>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      width={720}
      centered
      destroyOnClose
      onCancel={onCancel}
      footer={modalFooter}
      classNames={modalClassNames}
    >
      <Form form={form} layout="vertical" className={styles.chainForm} requiredMark="optional">
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>基本信息</h4>
          <Form.Item name="projectId" label="项目 ID (projectId)" tooltip="用于区分不同项目使用的链配置">
            <Input placeholder="如：sapphire-mall" size="small" />
          </Form.Item>
          <div className={styles.modalFormRow3}>
            <Form.Item
              name="chainId"
              label="链 ID (chainId)"
              rules={[{ required: true, message: '请输入 chainId' }]}
            >
              <InputNumber min={1} className={styles.tabularNums} style={{ width: '100%' }} disabled={isEdit} size="small" />
            </Form.Item>
            <Form.Item name="code" label="编码 (code)" rules={[{ required: true, message: '请输入 code' }]}>
              <Input placeholder="如：sepolia" size="small" />
            </Form.Item>
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder="如：Sepolia Testnet" size="small" />
            </Form.Item>
          </div>
          <div className={styles.modalFormRow3}>
            <Form.Item name="nativeSymbol" label="原生代币符号">
              <Input placeholder="如：ETH" size="small" />
            </Form.Item>
            <Form.Item name="blockTime" label="出块时间(秒)" tooltip="平均出块时间，用于计算监听轮询间隔">
              <InputNumber min={1} max={600} style={{ width: '100%' }} size="small" />
            </Form.Item>
            <Form.Item name="safeConfirmations" label="安全确认区块数" tooltip="支付场景需等待此数量区块确认">
              <InputNumber min={1} max={1000} style={{ width: '100%' }} size="small" />
            </Form.Item>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>网络配置</h4>
          <Form.Item name="rpcUrl" label="RPC URL">
            <Input placeholder="https://..." className={styles.monoInput} size="small" />
          </Form.Item>
          <Form.Item name="wsUrl" label="WebSocket URL">
            <Input placeholder="wss://..." className={styles.monoInput} size="small" />
          </Form.Item>
          <Form.Item name="explorerUrl" label="区块浏览器 URL">
            <Input placeholder="https://..." className={styles.monoInput} size="small" />
          </Form.Item>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>合约地址</h4>
          <div className={styles.modalFormRow}>
            <Form.Item name="platformConfigAddress" label="PlatformConfig 合约">
              <Input placeholder="0x..." className={styles.monoInput} size="small" />
            </Form.Item>
            <Form.Item name="paymentRouterAddress" label="PaymentRouter 合约">
              <Input placeholder="0x..." className={styles.monoInput} size="small" />
            </Form.Item>
            <Form.Item name="settlementVaultAddress" label="SettlementVault 合约">
              <Input placeholder="0x..." className={styles.monoInput} size="small" />
            </Form.Item>
            <Form.Item name="swapRouterAddress" label="SAPSwapRouter 合约">
              <Input placeholder="0x..." className={styles.monoInput} size="small" />
            </Form.Item>
            <Form.Item name="signerKeyRef" label="Signer Key Ref">
              <Input placeholder="密钥引用标识" className={styles.monoInput} size="small" />
            </Form.Item>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>事件监听</h4>
          
          {/* Swap 监听器 */}
          <h5 className={styles.sectionTitle} style={{ fontSize: 13, marginTop: 8 }}>Swap 监听器</h5>
          <Space wrap size={12} align="start" className={styles.listenerRow}>
            <Form.Item name="swapListenerEnabled" label="启用" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item name="swapListenerPollInterval" label="轮询间隔(秒)">
              <InputNumber min={1} max={300} style={{ width: 120 }} size="small" />
            </Form.Item>
            <Form.Item name="swapListenerStartBlock" label="起始区块">
              <InputNumber min={0} style={{ width: 140 }} size="small" />
            </Form.Item>
          </Space>

          {/* Config 监听器 */}
          <h5 className={styles.sectionTitle} style={{ fontSize: 13, marginTop: 8 }}>Config 监听器</h5>
          <Space wrap size={12} align="start" className={styles.listenerRow}>
            <Form.Item name="configListenerEnabled" label="启用" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item name="configListenerPollInterval" label="轮询间隔(秒)">
              <InputNumber min={1} max={300} style={{ width: 120 }} size="small" />
            </Form.Item>
            <Form.Item name="configListenerStartBlock" label="起始区块">
              <InputNumber min={0} style={{ width: 140 }} size="small" />
            </Form.Item>
          </Space>

          {/* Payment 监听器 */}
          <h5 className={styles.sectionTitle} style={{ fontSize: 13, marginTop: 8 }}>Payment 监听器</h5>
          <Space wrap size={12} align="start" className={styles.listenerRow}>
            <Form.Item name="paymentListenerEnabled" label="启用" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item name="paymentListenerPollInterval" label="轮询间隔(秒)">
              <InputNumber min={1} max={300} style={{ width: 120 }} size="small" />
            </Form.Item>
            <Form.Item name="paymentListenerStartBlock" label="起始区块">
              <InputNumber min={0} style={{ width: 140 }} size="small" />
            </Form.Item>
          </Space>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>其他</h4>
          <div className={styles.modalFormRow3}>
            <Form.Item name="sort" label="排序">
              <InputNumber min={0} className={styles.tabularNums} style={{ width: '100%' }} size="small" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select options={CHAIN_NETWORK_STATUS_OPTIONS} size="small" popupClassName={CHAINNET_SELECT_POPUP_CLASS} />
            </Form.Item>
          </div>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="可选备注" size="small" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ChainNetworkModal;
