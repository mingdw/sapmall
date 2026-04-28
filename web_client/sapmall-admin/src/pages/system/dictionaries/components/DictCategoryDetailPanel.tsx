import React, { useEffect, useState } from 'react';
import { Descriptions, Empty, Form, Input, InputNumber, Select, Switch } from 'antd';
import AdminButton from '../../../../components/common/AdminButton';
import {
  DICT_CATEGORY_TYPE_OPTIONS,
  getDictCategoryTypeLabel,
  type DictCategoryInfo,
  type SaveDictCategoryReq,
} from '../../../../services/api/dictionaryApi';
import styles from '../DictionariesManager.module.scss';

interface DictCategoryDetailPanelProps {
  category: DictCategoryInfo | null;
  itemCount: number;
  enabledItemCount: number;
  saving: boolean;
  togglingCategoryId?: number;
  onSave: (payload: SaveDictCategoryReq) => Promise<void>;
  onToggleStatus: (category: DictCategoryInfo) => void;
}

const DictCategoryDetailPanel: React.FC<DictCategoryDetailPanelProps> = ({
  category,
  itemCount,
  enabledItemCount,
  saving,
  togglingCategoryId,
  onSave,
  onToggleStatus,
}) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm<SaveDictCategoryReq>();

  useEffect(() => {
    if (!category) return;
    form.setFieldsValue({
      dictType: category.dictType,
      code: category.code,
      dictName: category.dictName || '',
      desc: category.desc || '',
      level: category.level,
      sort: category.sort,
      status: category.status,
    });
    setEditing(false);
  }, [category?.id, form]);

  if (!category) {
    return (
      <div className={styles.emptyPanel}>
        <Empty description="请从左侧选择一个字典类目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.panelHead}>
        <h3 className={styles.panelTitle}>
          <i className="fas fa-circle-info"></i>
          类目信息
        </h3>
        <div className={styles.inlineActions}>
          {!editing ? (
            <AdminButton variant="outline" size="sm" icon="fas fa-pen" onClick={() => setEditing(true)}>
              编辑
            </AdminButton>
          ) : (
            <>
              <AdminButton
                variant="outline"
                size="sm"
                icon="fas fa-xmark"
                onClick={() => {
                  form.setFieldsValue({
                    dictType: category.dictType,
                    code: category.code,
                    dictName: category.dictName || '',
                    desc: category.desc || '',
                    level: category.level,
                    sort: category.sort,
                    status: category.status,
                  });
                  setEditing(false);
                }}
              >
                取消
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                icon="fas fa-check"
                loading={saving}
                onClick={async () => {
                  const values = await form.validateFields();
                  await onSave({
                    id: category.id,
                    dictType: values.dictType?.trim(),
                    code: values.code?.trim(),
                    dictName: values.dictName?.trim() || '',
                    desc: values.desc?.trim() || '',
                    level: values.level ?? 1,
                    sort: values.sort ?? 0,
                    status: category.status,
                  });
                  setEditing(false);
                }}
              >
                保存
              </AdminButton>
            </>
          )}
        </div>
      </div>
      {!editing ? (
        <Descriptions column={3} size="small" className={styles.descriptions}>
          <Descriptions.Item label="类目编码">{category.code}</Descriptions.Item>
          <Descriptions.Item label="字典类型">{getDictCategoryTypeLabel(category.dictType)}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <span className={styles.inlineActions}>
              <Switch
                size="small"
                checked={category.status === 0}
                loading={togglingCategoryId === category.id}
                className={`${styles.detailStatusSwitch} ${
                  category.status === 0 ? styles.categoryStatusSwitchOn : styles.categoryStatusSwitchOff
                }`}
                onChange={() => onToggleStatus(category)}
              />
              <span className={category.status === 0 ? styles.statusTextEnabled : styles.statusTextDisabled}>
                {category.status === 0 ? '启用' : '禁用'}
              </span>
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="名称">{category.dictName || '-'}</Descriptions.Item>
          <Descriptions.Item label="层级">第 {category.level} 级</Descriptions.Item>
          <Descriptions.Item label="排序">{category.sort}</Descriptions.Item>
          <Descriptions.Item label="字典项总数">{itemCount}</Descriptions.Item>
          <Descriptions.Item label="启用项">{enabledItemCount}</Descriptions.Item>
          <Descriptions.Item label="禁用项">{itemCount - enabledItemCount}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical" className={styles.inlineEditForm}>
          <div className={styles.editGrid}>
            <Form.Item name="code" label="类目编码" rules={[{ required: true, message: '请输入类目编码' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dictName" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="desc" label="备注描述">
              <Input />
            </Form.Item>
            <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '请选择字典类型' }]}>
              <Select options={DICT_CATEGORY_TYPE_OPTIONS} />
            </Form.Item>
            <Form.Item name="level" label="层级">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sort" label="排序">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      )}
    </div>
  );
};

export default DictCategoryDetailPanel;
