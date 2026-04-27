import React from 'react';
import { Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import type { DictCategoryInfo, DictItemInfo, SaveDictItemReq } from '../../../../../services/api/dictionaryApi';

interface DictItemModalProps {
  open: boolean;
  loading: boolean;
  category: DictCategoryInfo | null;
  editingItem: DictItemInfo | null;
  onCancel: () => void;
  onSubmit: (payload: SaveDictItemReq) => Promise<void>;
}

const DictItemModal: React.FC<DictItemModalProps> = ({
  open,
  loading,
  category,
  editingItem,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<SaveDictItemReq>();

  React.useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      dictCategoryCode: editingItem?.dictCategoryCode || category?.code || '',
      code: editingItem?.code || '',
      value: editingItem?.value || '',
      desc: editingItem?.desc || '',
      level: editingItem?.level ?? 1,
      sort: editingItem?.sort ?? 0,
      status: editingItem?.status ?? 1,
    });
  }, [open, category, editingItem, form]);

  return (
    <Modal
      title={editingItem ? '编辑字典项' : '新增字典项'}
      open={open}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        await onSubmit({
          id: editingItem?.id,
          dictCategoryCode: values.dictCategoryCode.trim(),
          code: values.code.trim(),
          value: values.value.trim(),
          desc: values.desc?.trim() || '',
          level: values.level ?? 1,
          sort: values.sort ?? 0,
          status: values.status ?? 1,
        });
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="dictCategoryCode"
          label="所属字典类目编码"
          rules={[{ required: true, message: '请输入所属字典类目编码' }]}
        >
          <Input disabled={Boolean(category)} />
        </Form.Item>
        <Form.Item name="code" label="字典项编码" rules={[{ required: true, message: '请输入字典项编码' }]}>
          <Input placeholder="如：paid" />
        </Form.Item>
        <Form.Item name="value" label="字典值" rules={[{ required: true, message: '请输入字典值' }]}>
          <Input placeholder="如：2" />
        </Form.Item>
        <Form.Item name="desc" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
        <Space style={{ display: 'flex' }} size={12}>
          <Form.Item name="level" label="层级">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              style={{ width: 120 }}
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default DictItemModal;
