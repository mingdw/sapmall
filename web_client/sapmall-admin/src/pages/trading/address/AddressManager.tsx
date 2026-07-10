import React, { useState, useMemo, useCallback } from 'react';
import { ConfigProvider, Button, Input, Modal, Form, Select, Checkbox, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { addressTheme } from './addressTheme';
import { REGION_DATA, LABEL_META, LABEL_OPTIONS, MOCK_ADDRESSES, PHONE_REGEX } from './constants';
import type { AddressRecord, AddressFormValues } from './types';
import styles from './AddressManager.module.scss';

const EMPTY_FORM: AddressFormValues = {
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  postalCode: '',
  addressLabel: 'home',
  isDefault: false,
};

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressRecord[]>(MOCK_ADDRESSES);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm<AddressFormValues>();

  /* ---- filtering ---- */
  const filteredAddresses = useMemo(() => {
    if (!keyword.trim()) return addresses;
    const kw = keyword.trim().toLowerCase();
    return addresses.filter((a) => {
      const full = `${a.receiverName} ${a.receiverPhone} ${a.province}${a.city}${a.district} ${a.detailAddress}`.toLowerCase();
      return full.includes(kw);
    });
  }, [addresses, keyword]);

  /* ---- province / city / district cascading ---- */
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const handleProvinceChange = useCallback((val: string) => {
    form.setFieldValue('city', '');
    form.setFieldValue('district', '');
    setCities(val && REGION_DATA[val] ? Object.keys(REGION_DATA[val]) : []);
    setDistricts([]);
  }, [form]);

  const handleCityChange = useCallback((val: string) => {
    form.setFieldValue('district', '');
    const prov = form.getFieldValue('province');
    setDistricts(val && prov && REGION_DATA[prov]?.[val] ? REGION_DATA[prov][val] : []);
  }, [form]);

  /* ---- open add modal ---- */
  const handleAdd = useCallback(() => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(EMPTY_FORM);
    setCities([]);
    setDistricts([]);
    setModalOpen(true);
  }, [form]);

  /* ---- open edit modal ---- */
  const handleEdit = useCallback((record: AddressRecord) => {
    setEditingId(record.id);
    form.setFieldsValue({
      receiverName: record.receiverName,
      receiverPhone: record.receiverPhone,
      province: record.province,
      city: record.city,
      district: record.district,
      detailAddress: record.detailAddress,
      postalCode: record.postalCode,
      addressLabel: record.addressLabel,
      isDefault: record.isDefault,
    });
    setCities(REGION_DATA[record.province] ? Object.keys(REGION_DATA[record.province]) : []);
    setDistricts(REGION_DATA[record.province]?.[record.city] ?? []);
    setModalOpen(true);
  }, [form]);

  /* ---- save (add or edit) ---- */
  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const today = new Date().toISOString().split('T')[0];

      if (editingId) {
        setAddresses((prev) => {
          return prev.map((a) => {
            if (a.id === editingId) {
              return { ...a, ...values, lastUsed: today };
            }
            return values.isDefault ? { ...a, isDefault: false } : a;
          });
        });
        message.success('地址更新成功');
      } else {
        const newAddr: AddressRecord = {
          id: `addr_${Date.now()}`,
          ...values,
          createTime: today,
          lastUsed: today,
        };
        setAddresses((prev) => {
          if (values.isDefault) {
            return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
          }
          return [...prev, newAddr];
        });
        message.success('地址添加成功');
      }
      setModalOpen(false);
    } catch {
      // validation errors are shown by Form
    }
  }, [editingId, form]);

  /* ---- set default ---- */
  const handleSetDefault = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    message.success('默认地址设置成功');
  }, []);

  /* ---- delete ---- */
  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return;
    setAddresses((prev) => prev.filter((a) => a.id !== deleteId));
    message.success('地址删除成功');
    setDeleteId(null);
  }, [deleteId]);

  /* ---- render single address card ---- */
  const renderAddressCard = (record: AddressRecord) => {
    const labelMeta = LABEL_META[record.addressLabel];
    return (
      <div
        key={record.id}
        className={`${styles.addrCard} ${record.isDefault ? styles.addrCardDefault : ''}`}
      >
        {/* Header: name + phone + tags */}
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <span className={styles.receiverName}>{record.receiverName}</span>
            <span className={styles.receiverPhone}>{record.receiverPhone}</span>
          </div>
          <div className={styles.tagRow}>
            {record.isDefault && (
              <span className={styles.defaultTag}>默认</span>
            )}
            <span
              className={styles.labelTag}
              style={{ color: labelMeta.color, background: labelMeta.bg }}
            >
              {labelMeta.text}
            </span>
          </div>
        </div>

        {/* Body: address + meta */}
        <div className={styles.cardBody}>
          <div className={styles.addressLine}>
            {record.province} {record.city} {record.district} {record.detailAddress}
          </div>
          <div className={styles.addressMeta}>
            {record.postalCode && <span>邮编 {record.postalCode}</span>}
            {record.postalCode && <span className={styles.metaDot}>·</span>}
            <span>创建 {record.createTime}</span>
            <span className={styles.metaDot}>·</span>
            <span>最近使用 {record.lastUsed}</span>
          </div>
        </div>

        {/* Footer: actions */}
        <div className={styles.cardFooter}>
          {!record.isDefault && (
            <button
              className={`${styles.actionLink} ${styles.actionDefault}`}
              onClick={() => handleSetDefault(record.id)}
            >
              <StarOutlined style={{ fontSize: 12 }} />
              设为默认
            </button>
          )}
          {record.isDefault && (
            <span className={`${styles.actionLink}`} style={{ color: '#34d399', cursor: 'default' }}>
              <StarFilled style={{ fontSize: 12 }} />
              默认地址
            </span>
          )}
          <button
            className={`${styles.actionLink} ${styles.actionEdit}`}
            onClick={() => handleEdit(record)}
          >
            <EditOutlined style={{ fontSize: 12 }} />
            编辑
          </button>
          <button
            className={`${styles.actionLink} ${styles.actionDelete}`}
            onClick={() => setDeleteId(record.id)}
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
            删除
          </button>
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider theme={addressTheme}>
      <div className={styles.addrPage}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <Input
              className={styles.searchBox}
              prefix={<SearchOutlined style={{ color: '#64748b' }} />}
              placeholder="搜索收货人、电话或地址"
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className={styles.toolbarRight}>
            <span className={styles.addrCount}>共 {filteredAddresses.length} 个地址</span>
            <Button
              className={styles.addBtn}
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加地址
            </Button>
          </div>
        </div>

        {/* Address Card Grid or Empty State */}
        {filteredAddresses.length === 0 && !keyword ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <EnvironmentOutlined style={{ fontSize: 48 }} />
            </div>
            <h3>还没有收货地址</h3>
            <p>添加收货地址，让购物更便捷</p>
            <Button
              className={styles.addBtn}
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加第一个地址
            </Button>
          </div>
        ) : (
          <div className={styles.addrGrid}>
            {filteredAddresses.map(renderAddressCard)}
          </div>
        )}

        {/* Add / Edit Modal */}
        <Modal
          open={modalOpen}
          title={
            <span className={styles.modalTitle}>
              {editingId ? '编辑收货地址' : '添加收货地址'}
            </span>
          }
          onCancel={() => setModalOpen(false)}
          onOk={handleSave}
          okText="保存"
          cancelText="取消"
          width={560}
          destroyOnHidden
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={EMPTY_FORM}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="receiverName"
              label="收货人姓名"
              rules={[{ required: true, message: '请输入收货人姓名' }]}
            >
              <Input placeholder="请输入收货人姓名" />
            </Form.Item>

            <Form.Item
              name="receiverPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const digits = value.replace(/\D/g, '');
                    if (!PHONE_REGEX.test(digits)) {
                      return Promise.reject(new Error('请输入正确的手机号码'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="请输入手机号码" maxLength={11} />
            </Form.Item>

            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item
                name="province"
                label="省/直辖市"
                rules={[{ required: true, message: '请选择省份' }]}
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="请选择省份"
                  onChange={handleProvinceChange}
                  options={Object.keys(REGION_DATA).map((p) => ({ value: p, label: p }))}
                />
              </Form.Item>

              <Form.Item
                name="city"
                label="市/区"
                rules={[{ required: true, message: '请选择城市' }]}
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="请选择城市"
                  onChange={handleCityChange}
                  options={cities.map((c) => ({ value: c, label: c }))}
                  disabled={cities.length === 0}
                />
              </Form.Item>

              <Form.Item
                name="district"
                label="区/县"
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="请选择区县"
                  allowClear
                  options={districts.map((d) => ({ value: d, label: d }))}
                  disabled={districts.length === 0}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="detailAddress"
              label="详细地址"
              rules={[{ required: true, message: '请输入详细地址' }]}
            >
              <Input.TextArea
                placeholder="请填写详细地址，如道路、门牌号、小区、楼栋号、房间号等"
                rows={3}
              />
            </Form.Item>

            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item name="postalCode" label="邮政编码" style={{ flex: 1 }}>
                <Input placeholder="请输入邮政编码" maxLength={6} />
              </Form.Item>

              <Form.Item name="addressLabel" label="地址标签" style={{ flex: 1 }}>
                <Select options={LABEL_OPTIONS} />
              </Form.Item>
            </div>

            <Form.Item name="isDefault" valuePropName="checked">
              <Checkbox>设为默认地址</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal
          open={!!deleteId}
          title="删除地址"
          onCancel={() => setDeleteId(null)}
          onOk={handleConfirmDelete}
          okText="确定删除"
          okButtonProps={{ danger: true }}
          cancelText="取消"
          width={400}
          centered
        >
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#e2e8f0' }}>
            <DeleteOutlined style={{ fontSize: 36, color: '#f59e0b', marginBottom: 12 }} />
            <h4 style={{ fontSize: 15, color: '#e2e8f0', margin: '0 0 8px' }}>确定要删除这个地址吗？</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>删除后无法恢复，请确认操作。</p>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default AddressManager;
