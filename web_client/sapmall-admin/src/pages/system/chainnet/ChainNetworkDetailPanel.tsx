import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Space, Switch } from 'antd';
import AdminButton from '../../../components/common/AdminButton';
import type { ChainNetworkInfo, SaveChainNetworkReq } from '../../../services/api/chainApi';
import { CHAIN_NETWORK_STATUS_OPTIONS } from './constants';
import { CHAINNET_SELECT_POPUP_CLASS } from './chainnetTheme';
import styles from './ChainNetManager.module.scss';

type ChainNetworkFormValues = Omit<SaveChainNetworkReq, 'listenerEnabled'> & {
  listenerEnabled?: boolean;
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
      chainId: chain.chainId,
      code: chain.code || '',
      name: chain.name || '',
      rpcUrl: chain.rpcUrl || '',
      wsUrl: chain.wsUrl || '',
      explorerUrl: chain.explorerUrl || '',
      nativeSymbol: chain.nativeSymbol || '',
      platformConfigAddress: chain.platformConfigAddress || '',
      paymentRouterAddress: chain.paymentRouterAddress || '',
      settlementVaultAddress: chain.settlementVaultAddress || '',
      signerKeyRef: chain.signerKeyRef || '',
      listenerEnabled: chain.listenerEnabled === 1,
      listenerStartBlock: chain.listenerStartBlock ?? 0,
      listenerLastBlock: chain.listenerLastBlock ?? 0,
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
    await onSave({
      id: chain.id,
      chainId: values.chainId,
      code: values.code.trim(),
      name: values.name.trim(),
      rpcUrl: values.rpcUrl?.trim() || undefined,
      wsUrl: values.wsUrl?.trim() || undefined,
      explorerUrl: values.explorerUrl?.trim() || undefined,
      nativeSymbol: values.nativeSymbol?.trim() || undefined,
      platformConfigAddress: values.platformConfigAddress?.trim() || undefined,
      paymentRouterAddress: values.paymentRouterAddress?.trim() || undefined,
      settlementVaultAddress: values.settlementVaultAddress?.trim() || undefined,
      signerKeyRef: values.signerKeyRef?.trim() || undefined,
      listenerEnabled: values.listenerEnabled ? 1 : 0,
      listenerStartBlock: values.listenerStartBlock ?? 0,
      listenerLastBlock: values.listenerLastBlock ?? 0,
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
            {saving ? '保存中…' : '保存'}
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
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>基本信息</h4>
          <div className={styles.formGrid}>
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
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>网络配置</h4>
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
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>合约地址</h4>
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
            <Form.Item name="signerKeyRef" label="Signer Key Ref">
              <Input placeholder="密钥引用标识" className={styles.monoInput} size="small" />
            </Form.Item>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>事件监听</h4>
          <Space wrap size={12} align="start" className={styles.listenerRow}>
            <Form.Item name="listenerEnabled" label="启用监听" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item name="listenerStartBlock" label="起始区块">
              <InputNumber min={0} style={{ width: 140 }} size="small" />
            </Form.Item>
            <Form.Item name="listenerLastBlock" label="最新同步区块">
              <InputNumber min={0} style={{ width: 140 }} size="small" />
            </Form.Item>
          </Space>
        </div>
      </Form>
    </section>
  );
};

export default ChainNetworkDetailPanel;
