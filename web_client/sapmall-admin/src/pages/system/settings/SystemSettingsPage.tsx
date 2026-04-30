import React, { useEffect, useMemo, useState } from 'react';
import { Empty, Form, Input, InputNumber, List, Popconfirm, Select, Spin, Switch, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AdminCard from '../../../components/common/AdminCard';
import AdminButton from '../../../components/common/AdminButton';
import AdminModal from '../../../components/common/AdminModal';
import MessageUtils from '../../../utils/messageUtils';
import systemConfigApi, {
  SYSTEM_CONFIG_TYPE_OPTIONS,
  type SaveSystemConfigReq,
  type SystemConfigInfo,
} from '../../../services/api/systemConfigApi';
import styles from './SystemSettingsPage.module.scss';

type SystemConfigListItem = SystemConfigInfo & {
  syncChainStatus?: number;
};

interface SystemConfigFormValues {
  configName: string;
  configKey: string;
  configValue: string;
  configType: string;
  status: boolean;
}

interface SystemConfigFilters {
  keyword: string;
  status?: number;
}

const mapToFormValues = (record?: SystemConfigListItem | null): SystemConfigFormValues => ({
  configName: record?.configName || '',
  configKey: record?.configKey || '',
  configValue: record?.configValue || '',
  configType: record?.configType || SYSTEM_CONFIG_TYPE_OPTIONS[0]?.value || 'string',
  status: record ? record.status === 0 : true,
});

const getTypeLabel = (value: string): string => {
  const found = SYSTEM_CONFIG_TYPE_OPTIONS.find((item) => item.value === value);
  return found?.label || value;
};

const parseBooleanValue = (value?: string): boolean => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

const SystemSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusTogglingId, setStatusTogglingId] = useState<number>();
  const [syncTogglingId, setSyncTogglingId] = useState<number>();
  const [deletingId, setDeletingId] = useState<number>();
  const [savingValueId, setSavingValueId] = useState<number>();
  const [draftValues, setDraftValues] = useState<Record<number, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SystemConfigListItem | null>(null);
  const [configList, setConfigList] = useState<SystemConfigListItem[]>([]);
  const [filters, setFilters] = useState<SystemConfigFilters>({
    keyword: '',
    status: undefined,
  });
  const [form] = Form.useForm<SystemConfigFormValues>();

  const loadConfigList = async () => {
    setLoading(true);
    try {
      const resp = await systemConfigApi.list({
        status: filters.status,
        page: 1,
        pageSize: 500,
      });
      setConfigList(Array.isArray(resp.data?.list) ? resp.data.list : []);
    } catch {
      MessageUtils.error('加载系统参数失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigList().catch(() => undefined);
  }, [filters]);

  const sortedConfigList = useMemo(
    () => {
      const keyword = filters.keyword.trim().toLowerCase();
      const filtered = keyword
        ? configList.filter((item) => {
            const key = (item.configKey || '').toLowerCase();
            const name = (item.configName || '').toLowerCase();
            return key.includes(keyword) || name.includes(keyword);
          })
        : configList;
      return [...filtered].sort((a, b) => (a.sort || 0) - (b.sort || 0) || a.id - b.id);
    },
    [configList, filters.keyword],
  );

  const getDraftValue = (record: SystemConfigInfo): string => {
    if (Object.prototype.hasOwnProperty.call(draftValues, record.id)) {
      return draftValues[record.id];
    }
    return record.configValue || '';
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    form.setFieldsValue(mapToFormValues(null));
    setModalOpen(true);
  };

  const handleFilterChange = (patch: Partial<SystemConfigFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      status: undefined,
    });
  };

  const handleQuery = () => {
    loadConfigList().catch(() => undefined);
  };

  const openEditModal = (record: SystemConfigListItem) => {
    setEditingRecord(record);
    form.setFieldsValue(mapToFormValues(record));
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: SaveSystemConfigReq = {
        id: editingRecord?.id,
        configName: values.configName.trim(),
        configKey: values.configKey.trim(),
        configValue: values.configValue,
        configType: values.configType,
        // 按业务约定固定值，不在前端开放选择
        isSystem: 0,
        isEncrypted: 0,
        isEditable: 0,
        status: values.status ? 0 : 1,
        syncChainStatus: editingRecord?.syncChainStatus ?? 0,
      };
      setSubmitting(true);
      await systemConfigApi.save(payload);
      MessageUtils.success(editingRecord ? '系统参数更新成功' : '系统参数新增成功');
      setModalOpen(false);
      await loadConfigList();
    } catch (error: any) {
      if (error?.errorFields) return;
      MessageUtils.error('保存系统参数失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: SystemConfigListItem, checked: boolean) => {
    setStatusTogglingId(record.id);
    try {
      await systemConfigApi.save({
        id: record.id,
        configName: record.configName,
        configKey: record.configKey,
        configValue: record.configValue,
        configType: record.configType,
        status: checked ? 0 : 1,
        syncChainStatus: record.syncChainStatus ?? 0,
      });
      MessageUtils.success(`已${checked ? '启用' : '禁用'}系统参数`);
      await loadConfigList();
    } catch {
      MessageUtils.error('更新参数状态失败，请稍后重试');
    } finally {
      setStatusTogglingId(undefined);
    }
  };

  const handleToggleSyncChain = async (record: SystemConfigListItem, checked: boolean) => {
    setSyncTogglingId(record.id);
    try {
      await systemConfigApi.save({
        id: record.id,
        configName: record.configName,
        configKey: record.configKey,
        configValue: record.configValue,
        configType: record.configType,
        status: record.status,
        syncChainStatus: checked ? 1 : 0,
      });
      MessageUtils.success(`已${checked ? '发起' : '取消'}链上同步`);
      await loadConfigList();
    } catch {
      MessageUtils.error('更新同步区块链开关失败，请稍后重试');
    } finally {
      setSyncTogglingId(undefined);
    }
  };

  const handleDelete = async (record: SystemConfigListItem) => {
    setDeletingId(record.id);
    try {
      await systemConfigApi.delete(record.id);
      MessageUtils.success('系统参数删除成功');
      await loadConfigList();
    } catch {
      MessageUtils.error('系统参数删除失败，请稍后重试');
    } finally {
      setDeletingId(undefined);
    }
  };

  const handleValueChange = (record: SystemConfigListItem, value: string) => {
    setDraftValues((prev) => ({
      ...prev,
      [record.id]: value,
    }));
  };

  const saveValue = async (record: SystemConfigListItem, nextValue: string) => {
    if ((record.configValue || '') === nextValue) return;
    setSavingValueId(record.id);
    try {
      await systemConfigApi.save({
        id: record.id,
        configName: record.configName,
        configKey: record.configKey,
        configValue: nextValue,
        configType: record.configType,
        status: record.status,
        syncChainStatus: record.syncChainStatus ?? 0,
      });
      MessageUtils.success('参数值已更新');
      await loadConfigList();
      setDraftValues((prev) => {
        const next = { ...prev };
        delete next[record.id];
        return next;
      });
    } catch {
      MessageUtils.error('更新参数值失败，请稍后重试');
    } finally {
      setSavingValueId(undefined);
    }
  };

  const renderValueControl = (record: SystemConfigListItem) => {
    const currentValue = getDraftValue(record);
    const isSaving = savingValueId === record.id;
    if (record.configType === 'number') {
      const numberValue = currentValue === '' ? undefined : Number(currentValue);
      return (
        <InputNumber
          className={styles.valueInputNumber}
          value={Number.isNaN(numberValue) ? undefined : numberValue}
          disabled={isSaving}
          placeholder="请输入数字"
          onChange={(value) => handleValueChange(record, value === null || value === undefined ? '' : String(value))}
          onBlur={() => saveValue(record, getDraftValue(record))}
          onClick={(event) => event.stopPropagation()}
        />
      );
    }
    if (record.configType === 'boolean') {
      const checked = parseBooleanValue(currentValue);
      return (
        <div onClick={(event) => event.stopPropagation()}>
          <Switch
            checked={checked}
            loading={isSaving}
            size="small"
            className={`${styles.booleanValueSwitch} ${
              checked ? styles.booleanValueSwitchOn : styles.booleanValueSwitchOff
            }`}
            onChange={(nextChecked) => {
              const nextValue = nextChecked ? 'true' : 'false';
              handleValueChange(record, nextValue);
              saveValue(record, nextValue).catch(() => undefined);
            }}
          />
        </div>
      );
    }
    if (record.configType === 'json') {
      return (
        <Input.TextArea
          className={styles.valueTextArea}
          value={currentValue}
          autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={isSaving}
          placeholder='请输入 JSON，如 {"a":1}'
          onChange={(event) => handleValueChange(record, event.target.value)}
          onBlur={() => saveValue(record, getDraftValue(record))}
          onClick={(event) => event.stopPropagation()}
        />
      );
    }
    return (
      <Input
        className={styles.valueInput}
        value={currentValue}
        disabled={isSaving}
        placeholder="请输入文本"
        onChange={(event) => handleValueChange(record, event.target.value)}
        onBlur={() => saveValue(record, getDraftValue(record))}
        onPressEnter={() => saveValue(record, getDraftValue(record))}
        onClick={(event) => event.stopPropagation()}
      />
    );
  };

  return (
    <div className={styles.settingsPage}>
      <AdminCard
        title="系统参数维护"
        icon="fas fa-sliders-h"
      >
        <div className={styles.filterToolbar}>
          <div className={styles.filterRow}>
            <Input
              allowClear
              size="small"
              className={styles.filterInput}
              prefix={<SearchOutlined className={styles.searchIcon} />}
              placeholder="输入 config_key 或 config_name 搜索"
              value={filters.keyword}
              onChange={(event) => handleFilterChange({ keyword: event.target.value })}
            />
            <Select
              allowClear
              size="small"
              className={styles.filterSelect}
              placeholder="状态"
              value={filters.status}
              options={[
                { label: '启用', value: 0 },
                { label: '禁用', value: 1 },
              ]}
              onChange={(value) => handleFilterChange({ status: value })}
            />
            <AdminButton
              variant="query"
              size="sm"
              icon="fas fa-search"
              className={styles.filterActionBtn}
              onClick={handleQuery}
            >
              搜索
            </AdminButton>
            <AdminButton
              variant="reset"
              size="sm"
              icon="fas fa-undo"
              className={styles.filterActionBtn}
              onClick={handleResetFilters}
            >
              重置
            </AdminButton>
            <AdminButton
              variant="add"
              size="sm"
              icon="fas fa-plus"
              className={styles.filterActionBtn}
              onClick={openCreateModal}
            >
              新增参数
            </AdminButton>
          </div>
        </div>

        <div className={styles.listContainer}>
          <Spin spinning={loading}>
            {sortedConfigList.length === 0 ? (
              <div className={styles.emptyWrap}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无系统参数，请点击右上角新增参数"
                />
              </div>
            ) : (
              <List
                className={styles.sectionList}
                dataSource={sortedConfigList}
                rowKey="id"
                renderItem={(item) => (
                  <List.Item className={styles.sectionItem}>
                    <div className={styles.itemMain}>
                      <div className={styles.singleLineRow}>
                      <span
                        className={styles.itemName}
                        onClick={() => openEditModal(item)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openEditModal(item);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {item.configName}
                      </span>
                      <span className={styles.itemCode}>{item.configKey}</span>
                      <div className={styles.itemValue}>{renderValueControl(item)}</div>
                      <span className={styles.itemType}>{getTypeLabel(item.configType)}</span>
                      <div className={styles.statusSwitchWrap} onClick={(event) => event.stopPropagation()}>
                        <Switch
                          size="small"
                          checked={item.status === 0}
                          className={`${styles.categoryStatusSwitch} ${
                            item.status === 0 ? styles.categoryStatusSwitchOn : styles.categoryStatusSwitchOff
                          }`}
                          loading={statusTogglingId === item.id}
                          onChange={(checked) => handleToggleStatus(item, checked)}
                        />
                        <span className={item.status === 0 ? styles.statusTextEnabled : styles.statusTextDisabled}>
                          {item.status === 0 ? '启用' : '禁用'}
                        </span>
                      </div>
                      <div className={styles.statusSwitchWrap} onClick={(event) => event.stopPropagation()}>
                        <Switch
                          size="small"
                          checked={[1, 2].includes(item.syncChainStatus ?? 0)}
                          className={`${styles.categoryStatusSwitch} ${
                            [1, 2].includes(item.syncChainStatus ?? 0) ? styles.categoryStatusSwitchOn : styles.categoryStatusSwitchOff
                          }`}
                          loading={syncTogglingId === item.id}
                          onChange={(checked) => handleToggleSyncChain(item, checked)}
                        />
                        <span
                          className={[1, 2].includes(item.syncChainStatus ?? 0) ? styles.statusTextEnabled : styles.statusTextDisabled}
                        >
                          是否同步区块链
                        </span>
                      </div>
                      <Tooltip title="删除">
                        <Popconfirm
                          title="确认删除该系统参数？"
                          okText="确认"
                          cancelText="取消"
                          onConfirm={() => handleDelete(item)}
                        >
                          <button
                            type="button"
                            className={styles.deleteIconButton}
                            disabled={deletingId === item.id}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <i className={deletingId === item.id ? 'fas fa-spinner fa-spin' : 'fas fa-trash'}></i>
                          </button>
                        </Popconfirm>
                      </Tooltip>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Spin>
        </div>
      </AdminCard>

      <AdminModal
        open={modalOpen}
        title={editingRecord ? '编辑系统参数' : '新增系统参数'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
        size="small"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={mapToFormValues(null)}
          className={styles.form}
        >
          <Form.Item
            label="名称"
            name="configName"
            rules={[
              { required: true, message: '请输入参数名称' },
              { max: 64, message: '名称长度不能超过 64 个字符' },
            ]}
          >
            <Input placeholder="请输入参数名称" />
          </Form.Item>
          <Form.Item
            label="Code"
            name="configKey"
            rules={[
              { required: true, message: '请输入参数 Code' },
              { max: 64, message: 'Code 长度不能超过 64 个字符' },
            ]}
          >
            <Input placeholder="例如：site_name" />
          </Form.Item>
          <Form.Item
            label="值"
            name="configValue"
            rules={[{ max: 500, message: '参数值长度不能超过 500 个字符' }]}
          >
            <Input placeholder="请输入参数值" />
          </Form.Item>
          <Form.Item label="类型" name="configType" rules={[{ required: true, message: '请选择参数类型' }]}>
            <Select options={SYSTEM_CONFIG_TYPE_OPTIONS} placeholder="请选择参数类型" />
          </Form.Item>
          <Form.Item
            label="是否启用"
            name="status"
            valuePropName="checked"
            className={styles.switchField}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </AdminModal>
    </div>
  );
};

export default SystemSettingsPage;
