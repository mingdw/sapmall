import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Space, Switch, Tabs } from 'antd';
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

interface ChainNetworkDetailPanelProps {
  chain: ChainNetworkInfo;
  saving: boolean;
  onSave: (payload: SaveChainNetworkReq) => Promise<void>;
  onDelete: (chain: ChainNetworkInfo) => void;
}

const ChainNetworkDetailPanel: React.FC<ChainNetworkDetailPanelProps> = ({
  chain,
  saving,
  onSave,
  onDelete,
}) => {
  const [form] = Form.useForm<ChainNetworkFormValues>();

  const applyChainToForm = () => {
    form.setFieldsValue({
      // 基础信息
      projectId: chain.projectId || '',
      chainId: chain.chainId,
      code: chain.code || '',
      name: chain.name || '',
      nativeSymbol: chain.nativeSymbol || '',
      // 链特性配置
      blockTime: chain.blockTime ?? 12,
      safeConfirmations: chain.safeConfirmations ?? 12,
      // 网络配置
      rpcUrl: chain.rpcUrl || '',
      wsUrl: chain.wsUrl || '',
      explorerUrl: chain.explorerUrl || '',
      // 合约地址
      platformConfigAddress: chain.platformConfigAddress || '',
      paymentRouterAddress: chain.paymentRouterAddress || '',
      settlementVaultAddress: chain.settlementVaultAddress || '',
      swapRouterAddress: chain.swapRouterAddress || '',
      signerKeyRef: chain.signerKeyRef || '',
      // Swap 监听器配置
      swapListenerEnabled: chain.swapListenerEnabled === 0,
      swapListenerPollInterval: chain.swapListenerPollInterval ?? 12,
      swapListenerStartBlock: chain.swapListenerStartBlock ?? 0,
      // Config 监听器配置
      configListenerEnabled: chain.configListenerEnabled === 0,
      configListenerPollInterval: chain.configListenerPollInterval ?? 12,
      configListenerStartBlock: chain.configListenerStartBlock ?? 0,
      // Payment 监听器配置
      paymentListenerEnabled: chain.paymentListenerEnabled === 0,
      paymentListenerPollInterval: chain.paymentListenerPollInterval ?? 12,
      paymentListenerStartBlock: chain.paymentListenerStartBlock ?? 0,
      // 其他
      sort: chain.sort ?? 0,
      status: chain.status ?? 0,
      remark: chain.remark || '',
    });
  };

  useEffect(() => {
    applyChainToForm();
  }, [chain, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    // 确保必填字段有值（经过 validateFields 后一定有值，这里是为了 TypeScript 类型检查）
    const chainId = values.chainId ?? 0;
    const code = values.code ?? '';
    const name = values.name ?? '';

    await onSave({
      id: chain.id,
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

  return (
    <section className={`${styles.section} ${styles.sectionPanel}`}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionHeading}>链配置</h3>
        <div className={styles.inlineActions}>
          <AdminButton variant="outline" size="sm" className={styles.chainBtnGhost} onClick={applyChainToForm}>
            重置
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            className={styles.chainBtnPrimary}
            onClick={() => handleSubmit().catch(() => undefined)}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </AdminButton>
          <Popconfirm
            title="确认删除该链配置？"
            description={`将软删除「${chain.name}」及其下属支付代币。`}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(chain)}
          >
            <AdminButton variant="outline" size="sm" className={styles.chainBtnDanger}>
              删除
            </AdminButton>
          </Popconfirm>
        </div>
      </div>

      <Form form={form} layout="vertical" className={styles.chainForm} requiredMark="optional">
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <div className={styles.formGrid}>
                  <Form.Item name="projectId" label="项目 ID (projectId)" tooltip="用于区分不同项目使用的链配置">
                    <Input placeholder="如：sapphire-mall" size="small" />
                  </Form.Item>
                  <Form.Item name="chainId" label="链 ID (chainId)" rules={[{ required: true, message: '请输入 chainId' }]}>
                    <InputNumber min={1} className={styles.tabularNums} style={{ width: '100%' }} disabled size="small" />
                  </Form.Item>
                  <Form.Item name="code" label="编码 (code)" rules={[{ required: true, message: '请输入 code' }]}>
                    <Input placeholder="如：sepolia" size="small" />
                  </Form.Item>
                  <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                    <Input placeholder="如：Sepolia Testnet" size="small" />
                  </Form.Item>
                  <Form.Item name="nativeSymbol" label="原生代币符号">
                    <Input placeholder="如：ETH" size="small" />
                  </Form.Item>
                  <Form.Item name="blockTime" label="出块时间(秒)" tooltip="平均出块时间，用于计算监听轮询间隔">
                    <InputNumber min={1} max={600} style={{ width: '100%' }} size="small" />
                  </Form.Item>
                  <Form.Item name="safeConfirmations" label="安全确认区块数" tooltip="支付场景需等待此数量区块确认">
                    <InputNumber min={1} max={1000} style={{ width: '100%' }} size="small" />
                  </Form.Item>
                  <Form.Item name="sort" label="排序">
                    <InputNumber min={0} style={{ width: '100%' }} size="small" />
                  </Form.Item>
                  <Form.Item name="status" label="状态">
                    <Select options={CHAIN_NETWORK_STATUS_OPTIONS} size="small" popupClassName={CHAINNET_SELECT_POPUP_CLASS} />
                  </Form.Item>
                  <Form.Item name="remark" label="备注" className={styles.formGridFull}>
                    <Input.TextArea rows={2} placeholder="可选备注" size="small" />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'network',
              label: '网络配置',
              children: (
                <div className={styles.formGrid}>
                  <Form.Item name="rpcUrl" label="RPC URL" className={styles.formGridFull}>
                    <Input placeholder="https://..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="wsUrl" label="WebSocket URL" className={styles.formGridFull}>
                    <Input placeholder="wss://..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="explorerUrl" label="区块浏览器" className={styles.formGridFull}>
                    <Input placeholder="https://..." className={styles.monoInput} size="small" />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'contract',
              label: '合约地址',
              children: (
                <div className={styles.formGrid}>
                  <Form.Item name="platformConfigAddress" label="PlatformConfig">
                    <Input placeholder="0x..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="paymentRouterAddress" label="PaymentRouter">
                    <Input placeholder="0x..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="settlementVaultAddress" label="SettlementVault">
                    <Input placeholder="0x..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="swapRouterAddress" label="SAPSwapRouter">
                    <Input placeholder="0x..." className={styles.monoInput} size="small" />
                  </Form.Item>
                  <Form.Item name="signerKeyRef" label="Signer Key Ref" className={styles.formGridFull}>
                    <Input placeholder="密钥引用标识" className={styles.monoInput} size="small" />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'listener',
              label: '事件监听',
              children: (
                <div className={styles.formSection}>
                  {/* Swap 监听器 */}
                  <h4 className={styles.sectionTitle}>Swap 监听器</h4>
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
                  <h4 className={styles.sectionTitle}>Config 监听器</h4>
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
                  <h4 className={styles.sectionTitle}>Payment 监听器</h4>
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
              ),
            },
          ]}
        />
      </Form>
    </section>
  );
};

export default ChainNetworkDetailPanel;
