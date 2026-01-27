import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Space, Table, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import AdminButton from '../../../../components/common/AdminButton';
import styles from './AttributeEditor.module.scss';

export interface AttributeItem {
  key: string;
  value: string;
}

interface AttributeEditorProps {
  title: string;
  value?: Record<string, string>; // JSON对象格式
  onChange?: (value: Record<string, string>) => void;
  disabled?: boolean;
  mode?: 'table' | 'list'; // 新增：表格模式或列表模式
  productId?: number; // 商品ID（保留用于未来扩展，当前不用于实时保存）
  productCode?: string; // 商品编码（保留用于未来扩展，当前不用于实时保存）
  attrType?: number; // 属性类型：1-基本属性，2-销售属性，3-规格属性
  attrParamId?: number; // 属性参数ID（保留用于未来扩展）
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  title,
  value = {},
  onChange,
  disabled = false,
  mode = 'table', // 默认为表格模式
  productId,
  productCode,
  attrType,
  attrParamId,
}) => {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<AttributeItem | null>(null);
  const isInternalUpdate = useRef(false); // 标记是否是内部更新

  // 初始化：将JSON对象转换为数组格式（只显示有值的属性）
  // 只在value从外部真正变化时更新（避免编辑时频繁更新）
  useEffect(() => {
    // 如果是内部更新触发的，不重新设置
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const items: AttributeItem[] = Object.entries(value)
      .filter(([key, val]) => key.trim() && val.trim())
      .map(([key, val]) => ({
        key,
        value: val,
      }));
    
    setAttributes(items);
  }, [value]);

  // 开始编辑
  const startEdit = (index: number) => {
    setEditingKey(index);
    setEditingRow({ ...attributes[index] });
  };

  // 取消编辑
  const cancelEdit = (index: number) => {
    // 获取原始记录（在开始编辑时保存的）
    const originalRecord = attributes[index];
    
    // 如果是新添加的行（key和value都为空），则删除这一行（静默删除，不显示消息）
    if (!originalRecord.key.trim() && !originalRecord.value.trim()) {
      removeAttribute(index, true); // true 表示静默删除
    } else {
      // 如果是编辑已有行，则恢复原值并退出编辑模式
      setEditingKey(null);
      setEditingRow(null);
    }
  };

  // 保存编辑
  const saveEdit = async (index: number) => {
    if (!editingRow) return;
    
    const { key, value: val } = editingRow;
    
    // 验证：键和值都不能为空
    if (!key.trim()) {
      message.warning('属性名称不能为空');
      return;
    }
    
    if (!val.trim()) {
      message.warning('属性值不能为空');
      return;
    }

    // 检查键是否重复（排除当前编辑的行）
    const isDuplicate = attributes.some((attr, i) => 
      i !== index && attr.key.trim() === key.trim()
    );
    
    if (isDuplicate) {
      message.warning('属性名称已存在，请使用不同的名称');
      return;
    }

    const newAttributes = [...attributes];
    newAttributes[index] = { ...editingRow };
    setAttributes(newAttributes);
    setEditingKey(null);
    setEditingRow(null);
    
    // 只更新前端状态，不调用后端接口（暂存时会统一保存）
    notifyChange(newAttributes);
  };

  // 删除属性项
  // silent: 是否静默删除（不显示成功消息），用于取消操作
  const removeAttribute = (index: number, silent: boolean = false) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
    
    // 只更新前端状态，不调用后端接口（暂存时会统一保存）
    notifyChange(newAttributes);
    if (editingKey === index) {
      // 如果删除的是正在编辑的行，直接清除编辑状态
      setEditingKey(null);
      setEditingRow(null);
    } else if (editingKey !== null && editingKey > index) {
      // 如果删除的行在编辑行之前，需要调整编辑键
      setEditingKey(editingKey - 1);
    }
  };

  // 添加新属性项
  const addAttribute = () => {
    const newItem: AttributeItem = { key: '', value: '' };
    const newAttributes = [...attributes, newItem];
    const newIndex = newAttributes.length - 1;
    setAttributes(newAttributes);
    setEditingKey(newIndex);
    setEditingRow(newItem);
  };

  // 更新编辑中的行数据
  const updateEditingRow = (field: 'key' | 'value', newValue: string) => {
    if (!editingRow) return;
    setEditingRow({
      ...editingRow,
      [field]: newValue,
    });
  };

  // 通知父组件变化
  const notifyChange = (items: AttributeItem[]) => {
    if (!onChange) return;

    // 标记这是内部更新
    isInternalUpdate.current = true;

    // 过滤掉空的键值对，转换为JSON对象
    const result: Record<string, string> = {};
    items.forEach((item) => {
      if (item.key.trim() && item.value.trim()) {
        result[item.key.trim()] = item.value.trim();
      }
    });

    onChange(result);
  };

  // 表格列定义（表格模式）
  const columns = [
    {
      title: '属性名称',
      dataIndex: 'key',
      key: 'key',
      width: '35%',
      render: (_: any, record: AttributeItem, index: number) => {
        const isEditing = editingKey === index;
        if (isEditing && editingRow) {
          return (
            <Input
              value={editingRow.key}
              onChange={(e) => updateEditingRow('key', e.target.value)}
              placeholder="请输入属性名称"
              className={styles.tableInput}
              autoFocus
            />
          );
        }
        return <span className={styles.tableCell}>{record.key || '-'}</span>;
      },
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
      width: '45%',
      render: (_: any, record: AttributeItem, index: number) => {
        const isEditing = editingKey === index;
        if (isEditing && editingRow) {
          return (
            <Input
              value={editingRow.value}
              onChange={(e) => updateEditingRow('value', e.target.value)}
              placeholder="请输入属性值"
              className={styles.tableInput}
            />
          );
        }
        return <span className={styles.tableCell}>{record.value || '-'}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: AttributeItem, index: number) => {
        const isEditing = editingKey === index;
        
        if (isEditing) {
          return (
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => saveEdit(index)}
                className={styles.saveBtn}
                disabled={!editingRow?.key.trim() || !editingRow?.value.trim()}
              >
                保存
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => cancelEdit(index)}
                className={styles.cancelBtn}
              >
                取消
              </Button>
            </Space>
          );
        }
        
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => startEdit(index)}
              className={styles.editBtn}
              disabled={disabled}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeAttribute(index)}
              className={styles.deleteBtn}
              disabled={disabled}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  // 检查是否有有效属性
  const hasValidAttributes = attributes.some(attr => attr.key.trim() && attr.value.trim());

  // 表格模式
  if (mode === 'table') {
    return (
      <div className={styles.attributeEditor}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          {!disabled && (
            <AdminButton
              variant="add"
              size="sm"
              onClick={addAttribute}
            >
              添加属性
            </AdminButton>
          )}
        </div>

        {attributes.length === 0 && !hasValidAttributes ? (
          <div className={styles.emptyTip}>
            <div className={styles.emptyIcon}>📝</div>
            <p className={styles.emptyText}>暂无属性</p>
            <p className={styles.emptyHint}>点击"添加属性"按钮开始添加</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <Table
              columns={columns}
              dataSource={attributes.map((attr, index) => ({ ...attr, index }))}
              rowKey={(record, index) => `row-${index}`}
              pagination={false}
              size="small"
              className={styles.attributeTable}
              locale={{
                emptyText: '暂无数据',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // 列表模式（保留原有逻辑，用于销售属性等）
  return (
    <div className={styles.attributeEditor}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        {!disabled && (
          <AdminButton
            variant="add"
            size="sm"
            onClick={addAttribute}
          >
            添加属性
          </AdminButton>
        )}
      </div>

      {attributes.length === 0 && !hasValidAttributes ? (
        <div className={styles.emptyTip}>
          <div className={styles.emptyIcon}>📝</div>
          <p className={styles.emptyText}>暂无属性</p>
          <p className={styles.emptyHint}>点击"添加属性"按钮开始添加</p>
        </div>
      ) : (
        <div className={styles.attributeList}>
          {attributes.map((attr, index) => (
            <div 
              key={index} 
              className={styles.attributeItem}
            >
              <div className={styles.attributeInputs}>
                <Input
                  placeholder="属性名称"
                  value={attr.key}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index] = { ...newAttributes[index], key: e.target.value };
                    setAttributes(newAttributes);
                  }}
                  onBlur={() => notifyChange(attributes)}
                  disabled={disabled}
                  className={styles.keyInput}
                />
                <span className={styles.separator}>:</span>
                <Input
                  placeholder="属性值"
                  value={attr.value}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index] = { ...newAttributes[index], value: e.target.value };
                    setAttributes(newAttributes);
                  }}
                  onBlur={() => notifyChange(attributes)}
                  disabled={disabled}
                  className={styles.valueInput}
                />
              </div>
              {!disabled && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => removeAttribute(index)}
                  type="button"
                  title="删除"
                >
                  <DeleteOutlined />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributeEditor;
