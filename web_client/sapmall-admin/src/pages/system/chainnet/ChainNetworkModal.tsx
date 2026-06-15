import React from 'react';
import { Form, Input, InputNumber, Modal, Select, Space, Switch } from 'antd';
import AdminButton from '../../../components/common/AdminButton';
import type { ChainNetworkInfo, SaveChainNetworkReq } from '../../../services/api/chainApi';
import { CHAIN_NETWORK_STATUS_OPTIONS } from './constants';
import { CHAINNET_SELECT_POPUP_CLASS } from './chainnetTheme';
import styles from './ChainNetManager.module.scss';

type ChainNetworkFormValues = Omit<SaveChainNetworkReq, 'listenerEnabled'> & {
  listenerEnabled?: boolean;
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
      chainId: initial?.chainId,
      code: initial?.code || '',
      name: initial?.name || '',
      rpcUrl: initial?.rpcUrl || '',
      wsUrl: initial?.wsUrl || '',
      explorerUrl: initial?.explorerUrl || '',
      nativeSymbol: initial?.nativeSymbol || '',
      platformConfigAddress: initial?.platformConfigAddress || '',
      paymentRouterAddress: initial?.paymentRouterAddress || '',
      settlementVaultAddress: initial?.settlementVaultAddress || '',
      signerKeyRef: initial?.signerKeyRef || '',
      listenerEnabled: (initial?.listenerEnabled ?? 1) === 1,
      listenerStartBlock: initial?.listenerStartBlock ?? 0,
      listenerLastBlock: initial?.listenerLastBlock ?? 0,
      sort: initial?.sort ?? 0,
      status: initial?.status ?? 0,
      remark: initial?.remark || '',
    });
  }, [open, initial, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    await onSubmit({
      id: initial?.id,
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
          <Form.Item name="nativeSymbol" label="原生代币符号">
            <Input placeholder="如：ETH" size="small" />
          </Form.Item>
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
            <Form.Item name="signerKeyRef" label="Signer Key Ref">
              <Input placeholder="密钥引用标识" className={styles.monoInput} size="small" />
            </Form.Item>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>事件监听</h4>
          <Space wrap size={12} align="start" className={styles.listenerRow}>
            <Form.Item name="listenerEnabled" label="启用事件监听" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <Form.Item name="listenerStartBlock" label="起始区块">
              <InputNumber min={0} className={styles.tabularNums} style={{ width: 140 }} size="small" />
            </Form.Item>
            <Form.Item name="listenerLastBlock" label="最新同步区块">
              <InputNumber min={0} className={styles.tabularNums} style={{ width: 140 }} size="small" />
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
