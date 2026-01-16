import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, Button, Space, Dropdown } from 'antd';
import { PlusOutlined, DeleteOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AdminButton from '../../../../components/common/AdminButton';
import { 
  DEFAULT_SPECIFICATION_TEMPLATES, 
  getSpecificationTemplatesByCategory,
  type SpecificationTemplate 
} from './SpecificationTemplates';
import styles from './SpecificationEditor.module.scss';

export interface SpecificationItem {
  name: string;
  values: string[];
}

interface SpecificationEditorProps {
  value?: Record<string, string[]>; // JSON对象格式，例如 {"分辨率":["4K","8K"]}
  onChange?: (value: Record<string, string[]>) => void;
  disabled?: boolean;
  categoryId?: number; // 商品分类ID，用于获取分类相关的规格模板（可选）
}

const SpecificationEditor: React.FC<SpecificationEditorProps> = ({
  value = {},
  onChange,
  disabled = false,
  categoryId,
}) => {
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [templates, setTemplates] = useState<SpecificationTemplate[]>([]);
  const isInternalUpdate = useRef(false); // 标记是否是内部更新

  // 加载规格模板
  useEffect(() => {
    const loadTemplates = async () => {
      const loadedTemplates = await getSpecificationTemplatesByCategory(categoryId);
      setTemplates(loadedTemplates);
    };
    loadTemplates();
  }, [categoryId]);

  // 初始化：将JSON对象转换为数组格式
  // 只在value从外部真正变化时更新（避免编辑时频繁更新）
  useEffect(() => {
    // 如果是内部更新触发的，不重新设置
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const items: SpecificationItem[] = Object.entries(value)
      .filter(([name, values]) => name.trim() && Array.isArray(values) && values.length > 0)
      .map(([name, values]) => ({
        name,
        values: values.filter(v => v.trim()),
      }));
    
    setSpecifications(items);
  }, [value]);

  // 更新规格名称（不立即通知父组件，避免重新渲染导致失去焦点）
  const updateSpecName = (index: number, newName: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      name: newName,
    };
    setSpecifications(newSpecs);
    // 不在输入时通知，只在失焦时通知
  };

  // 添加规格值
  const addSpecValue = (specIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values.push('');
    setSpecifications(newSpecs);
    setEditingIndex(specIndex);
  };

  // 更新规格值（不立即通知父组件，避免重新渲染导致失去焦点）
  const updateSpecValue = (specIndex: number, valueIndex: number, newValue: string) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values[valueIndex] = newValue;
    setSpecifications(newSpecs);
    // 不在输入时通知，只在失焦时通知
  };

  // 删除规格值
  const removeSpecValue = (specIndex: number, valueIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values = newSpecs[specIndex].values.filter((_, i) => i !== valueIndex);
    setSpecifications(newSpecs);
    notifyChange(newSpecs);
    // 如果删除后没有值了，取消编辑状态
    if (newSpecs[specIndex].values.length === 0) {
      setEditingIndex(null);
    }
  };

  // 添加新规格
  const addSpecification = () => {
    const newSpecs = [...specifications, { name: '', values: [] }];
    setSpecifications(newSpecs);
    setEditingIndex(newSpecs.length - 1);
  };

  // 从模板添加规格
  const addSpecificationFromTemplate = (template: SpecificationTemplate) => {
    // 检查是否已存在相同名称的规格
    const existingIndex = specifications.findIndex(
      spec => spec.name.trim() === template.label.trim()
    );

    if (existingIndex >= 0) {
      // 如果已存在，合并值（去重）
      const existingSpec = specifications[existingIndex];
      const mergedValues = [
        ...existingSpec.values,
        ...template.values.filter(v => !existingSpec.values.includes(v))
      ];
      const newSpecs = [...specifications];
      newSpecs[existingIndex] = {
        ...existingSpec,
        values: mergedValues,
      };
      setSpecifications(newSpecs);
      notifyChange(newSpecs);
    } else {
      // 如果不存在，添加新规格
      const newSpecs = [...specifications, {
        name: template.label,
        values: [...template.values],
      }];
      setSpecifications(newSpecs);
      notifyChange(newSpecs);
      setEditingIndex(newSpecs.length - 1);
    }
  };

  // 删除规格
  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    notifyChange(newSpecs);
    setEditingIndex(null);
  };

  // 处理失焦，清理空值
  const handleBlur = (specIndex: number) => {
    // 延迟执行，确保不会立即触发重新渲染
    setTimeout(() => {
      const spec = specifications[specIndex];
      // 清理空的规格值
      const cleanedValues = spec.values.filter(v => v.trim());
      
      if (cleanedValues.length === 0 && !spec.name.trim()) {
        // 如果规格名和值都为空，删除该规格
        const newSpecs = specifications.filter((_, i) => i !== specIndex);
        setSpecifications(newSpecs);
        notifyChange(newSpecs);
      } else if (cleanedValues.length !== spec.values.length) {
        // 如果有空值被清理，更新（不保留空值）
        const newSpecs = [...specifications];
        newSpecs[specIndex].values = cleanedValues;
        setSpecifications(newSpecs);
        notifyChange(newSpecs);
      } else {
        notifyChange(specifications);
      }
      setEditingIndex(null);
    }, 100);
  };

  // 通知父组件变化
  const notifyChange = (specs: SpecificationItem[]) => {
    if (!onChange) return;

    // 标记这是内部更新
    isInternalUpdate.current = true;

    // 转换为JSON对象格式
    const result: Record<string, string[]> = {};
    specs.forEach((spec) => {
      if (spec.name.trim()) {
        const values = spec.values.filter(v => v.trim());
        if (values.length > 0) {
          result[spec.name.trim()] = values;
        }
      }
    });

    onChange(result);
  };

  // 检查是否有有效规格
  const hasValidSpecs = specifications.some(
    spec => spec.name.trim() && spec.values.some(v => v.trim())
  );

  // 构建模板菜单项
  const templateMenuItems: MenuProps['items'] = useMemo(() => {
    return templates.map((template) => {
      // 检查该模板是否已被使用
      const isUsed = specifications.some(
        spec => spec.name.trim() === template.label.trim()
      );
      return {
        key: template.id,
        label: (
          <div className={styles.templateMenuItem}>
            <span className={styles.templateIcon}>{template.icon}</span>
            <span className={styles.templateLabel}>{template.label}</span>
            {isUsed && <span className={styles.templateUsed}>已使用</span>}
          </div>
        ),
        disabled: disabled || isUsed,
        onClick: () => addSpecificationFromTemplate(template),
      };
    });
  }, [templates, specifications, disabled]);

  return (
    <div className={styles.specificationEditor}>
      <div className={styles.header}>
        <h4 className={styles.title}>规格设置</h4>
        {!disabled && (
          <Space>
            {templates.length > 0 && (
              <Dropdown 
                menu={{ items: templateMenuItems }} 
                trigger={['click']} 
                placement="bottomRight"
                overlayClassName={styles.templateDropdown}
              >
                <AdminButton
                  variant="add"
                  size="sm"
                >
                  从模板添加 <DownOutlined />
                </AdminButton>
              </Dropdown>
            )}
            <AdminButton
              variant="add"
              size="sm"
              onClick={addSpecification}
            >
              添加规格
            </AdminButton>
          </Space>
        )}
      </div>

      {specifications.length === 0 && !hasValidSpecs ? (
        <div className={styles.emptyTip}>
          <div className={styles.emptyIcon}>📦</div>
          <p className={styles.emptyText}>暂无规格</p>
          <p className={styles.emptyHint}>点击"添加规格"按钮开始设置商品规格</p>
        </div>
      ) : (
        <div className={styles.specificationList}>
          {specifications.map((spec, specIndex) => (
            <div
              key={specIndex}
              className={`${styles.specificationItem} ${editingIndex === specIndex ? styles.editing : ''}`}
            >
              <div className={styles.specHeader}>
                <Input
                  placeholder="规格名称（如：分辨率、版本）"
                  value={spec.name}
                  onChange={(e) => updateSpecName(specIndex, e.target.value)}
                  onFocus={() => setEditingIndex(specIndex)}
                  onBlur={() => handleBlur(specIndex)}
                  disabled={disabled}
                  className={styles.specNameInput}
                  autoFocus={editingIndex === specIndex}
                />
                {!disabled && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeSpecification(specIndex)}
                    type="button"
                    title="删除规格"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>

              {spec.values.length > 0 ? (
                <div className={styles.specValues}>
                  <div className={styles.valuesLabel}>规格值：</div>
                  <div className={styles.valuesList}>
                    {spec.values.map((value, valueIndex) => (
                      <div key={valueIndex} className={styles.valueItem}>
                        <Input
                          placeholder="规格值"
                          value={value}
                          onChange={(e) => updateSpecValue(specIndex, valueIndex, e.target.value)}
                          onFocus={() => setEditingIndex(specIndex)}
                          onBlur={() => handleBlur(specIndex)}
                          disabled={disabled}
                          className={styles.valueInput}
                        />
                        {!disabled && spec.values.length > 1 && (
                          <button
                            className={styles.removeValueBtn}
                            onClick={() => removeSpecValue(specIndex, valueIndex)}
                            type="button"
                            title="删除"
                          >
                            <CloseOutlined />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {!disabled && (
                    <AdminButton
                      variant="add"
                      size="xs"
                      onClick={() => addSpecValue(specIndex)}
                    >
                      添加值
                    </AdminButton>
                  )}
                </div>
              ) : (
                !disabled && (
                  <div className={styles.emptyValuesTip}>
                    <AdminButton
                      variant="add"
                      size="xs"
                      onClick={() => addSpecValue(specIndex)}
                    >
                      添加规格值
                    </AdminButton>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecificationEditor;
