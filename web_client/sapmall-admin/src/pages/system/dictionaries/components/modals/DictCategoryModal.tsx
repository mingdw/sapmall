import React from 'react';
import { Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import {
  DICT_CATEGORY_TYPE_OPTIONS,
  type DictCategoryInfo,
  type SaveDictCategoryReq,
} from '../../../../../services/api/dictionaryApi';

interface DictCategoryModalProps {
  open: boolean;
  loading: boolean;
  editingCategory: DictCategoryInfo | null;
  onCancel: () => void;
  onSubmit: (payload: SaveDictCategoryReq) => Promise<void>;
}

const DictCategoryModal: React.FC<DictCategoryModalProps> = ({
  open,
  loading,
  editingCategory,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<SaveDictCategoryReq>();

  React.useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      dictType: editingCategory?.dictType || '',
      code: editingCategory?.code || '',
      desc: editingCategory?.desc || '',
      level: editingCategory?.level ?? 1,
      sort: editingCategory?.sort ?? 0,
      status: editingCategory?.status ?? 0,
    });
  }, [open, editingCategory, form]);

  return (
    <Modal
      title={editingCategory ? '编辑字典类目' : '新增字典类目'}
      open={open}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        await onSubmit({
          id: editingCategory?.id,
          dictType: values.dictType.trim(),
          code: values.code.trim(),
          desc: values.desc?.trim() || '',
          level: values.level ?? 1,
          sort: values.sort ?? 0,
          status: values.status ?? 0,
        });
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '请选择字典类型' }]}>
          <Select placeholder="请选择字典类型" options={DICT_CATEGORY_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item name="code" label="类目编码" rules={[{ required: true, message: '请输入类目编码' }]}>
          <Input placeholder="如：order_status" />
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
                { label: '启用', value: 0 },
                { label: '禁用', value: 1 },
              ]}
            />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default DictCategoryModal;
