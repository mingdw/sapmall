import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Space, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  title,
  value = {},
  onChange,
  disabled = false,
}) => {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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

  // 更新属性项（不立即通知父组件，避免重新渲染导致失去焦点）
  const updateAttribute = (index: number, field: 'key' | 'value', newValue: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: newValue,
    };
    setAttributes(newAttributes);
    // 不在输入时通知，只在失焦时通知
  };

  // 添加新属性项（点击添加按钮时）
  const addAttribute = () => {
    const newAttributes = [...attributes, { key: '', value: '' }];
    setAttributes(newAttributes);
    setEditingIndex(newAttributes.length - 1); // 聚焦到新添加的项
    // 不立即通知变化，等用户输入后再通知
  };

  // 删除属性项
  const removeAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
    notifyChange(newAttributes);
    setEditingIndex(null);
  };

  // 处理输入框失焦，自动保存
  const handleBlur = (index: number) => {
    // 延迟执行，确保不会立即触发重新渲染
    setTimeout(() => {
      const attr = attributes[index];
      // 如果两个输入框都为空，移除该项
      if (!attr.key.trim() && !attr.value.trim()) {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
        notifyChange(newAttributes);
      } else {
        notifyChange(attributes);
      }
      setEditingIndex(null);
    }, 100);
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

  // 检查是否有有效属性
  const hasValidAttributes = attributes.some(attr => attr.key.trim() && attr.value.trim());

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
              className={`${styles.attributeItem} ${editingIndex === index ? styles.editing : ''}`}
            >
              <div className={styles.attributeInputs}>
                <Input
                  placeholder="属性名称"
                  value={attr.key}
                  onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                  onFocus={() => setEditingIndex(index)}
                  onBlur={() => handleBlur(index)}
                  disabled={disabled}
                  className={styles.keyInput}
                  autoFocus={editingIndex === index}
                />
                <span className={styles.separator}>:</span>
                <Input
                  placeholder="属性值"
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                  onFocus={() => setEditingIndex(index)}
                  onBlur={() => handleBlur(index)}
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
