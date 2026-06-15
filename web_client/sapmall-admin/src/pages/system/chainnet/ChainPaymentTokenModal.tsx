import React from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import AdminButton from '../../../components/common/AdminButton';
import type { ChainPaymentTokenInfo, SaveChainPaymentTokenReq } from '../../../services/api/chainApi';
import { PAYMENT_TOKEN_STATUS_OPTIONS } from './constants';
import { CHAINNET_SELECT_POPUP_CLASS } from './chainnetTheme';
import styles from './ChainNetManager.module.scss';

interface ChainPaymentTokenModalProps {
  open: boolean;
  submitting: boolean;
  chainId?: number;
  initial: ChainPaymentTokenInfo | null;
  onCancel: () => void;
  onSubmit: (payload: SaveChainPaymentTokenReq) => Promise<void>;
}

const modalClassNames = {
  wrapper: styles.chainnetModalWrap,
  content: styles.chainnetModal,
  header: styles.chainnetModalHeader,
  body: styles.chainnetModalBody,
  footer: styles.chainnetModalFooter,
};

const ChainPaymentTokenModal: React.FC<ChainPaymentTokenModalProps> = ({
  open,
  submitting,
  chainId,
  initial,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<SaveChainPaymentTokenReq>();
  const isEdit = Boolean(initial);

  React.useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      chainId: initial?.chainId ?? chainId,
      symbol: initial?.symbol || '',
      displayName: initial?.displayName || '',
      contractAddress: initial?.contractAddress || '',
      decimals: initial?.decimals ?? 6,
      configKey: initial?.configKey || '',
      sort: initial?.sort ?? 0,
      status: initial?.status ?? 0,
      remark: initial?.remark || '',
    });
  }, [open, initial, chainId, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    await onSubmit({
      id: initial?.id,
      chainId: values.chainId,
      symbol: values.symbol.trim(),
      displayName: values.displayName?.trim() || undefined,
      contractAddress: values.contractAddress.trim(),
      decimals: values.decimals ?? 6,
      configKey: values.configKey?.trim() || undefined,
      sort: values.sort ?? 0,
      status: values.status ?? 0,
      remark: values.remark?.trim() || undefined,
    });
  };

  const modalTitle = (
    <div className={styles.modalTitleWrap}>
      <span className={styles.modalTitle}>{isEdit ? '编辑支付代币' : '新增支付代币'}</span>
      <span className={styles.modalSubtitle}>
        {isEdit ? '更新代币合约与展示配置' : '为当前链添加可用于支付的代币'}
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
      width={560}
      centered
      destroyOnClose
      onCancel={onCancel}
      footer={modalFooter}
      classNames={modalClassNames}
    >
      <Form form={form} layout="vertical" className={styles.chainForm} requiredMark="optional">
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>代币信息</h4>
          <Form.Item
            name="chainId"
            label="所属链 ID"
            rules={[{ required: true, message: '请选择所属链' }]}
          >
            <InputNumber min={1} className={styles.tabularNums} style={{ width: '100%' }} disabled={isEdit} size="small" />
          </Form.Item>
          <div className={styles.modalFormRow}>
            <Form.Item name="symbol" label="Symbol" rules={[{ required: true, message: '请输入 symbol' }]}>
              <Input placeholder="如：USDC" size="small" />
            </Form.Item>
            <Form.Item name="displayName" label="显示名">
              <Input placeholder="如：USD Coin" size="small" />
            </Form.Item>
          </div>
          <Form.Item
            name="contractAddress"
            label="合约地址"
            rules={[{ required: true, message: '请输入合约地址' }]}
          >
            <Input placeholder="0x..." className={styles.monoInput} size="small" />
          </Form.Item>
        </div>

        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>配置</h4>
          <div className={styles.modalFormRow3}>
            <Form.Item name="decimals" label="精度" rules={[{ required: true, message: '请输入精度' }]}>
              <InputNumber min={0} max={18} className={styles.tabularNums} style={{ width: '100%' }} size="small" />
            </Form.Item>
            <Form.Item name="sort" label="排序">
              <InputNumber min={0} className={styles.tabularNums} style={{ width: '100%' }} size="small" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select options={PAYMENT_TOKEN_STATUS_OPTIONS} size="small" popupClassName={CHAINNET_SELECT_POPUP_CLASS} />
            </Form.Item>
          </div>
          <Form.Item name="configKey" label="Config Key">
            <Input placeholder="如：payment.token.usdc" className={styles.monoInput} size="small" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="可选备注" size="small" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ChainPaymentTokenModal;
