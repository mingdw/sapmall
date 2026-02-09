import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, Button, Space, Dropdown, Tag, InputRef, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, CloseOutlined, DownOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
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
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null); // 正在编辑名称的规格索引
  const [editingNameValue, setEditingNameValue] = useState<string>(''); // 编辑中的名称值
  const [hoveredNameIndex, setHoveredNameIndex] = useState<number | null>(null); // 鼠标悬停的规格名称索引
  const [templates, setTemplates] = useState<SpecificationTemplate[]>([]);
  const isInternalUpdate = useRef(false); // 标记是否是内部更新
  const [addingValueIndex, setAddingValueIndex] = useState<number | null>(null); // 正在添加值的规格索引
  const [newValueInput, setNewValueInput] = useState<string>(''); // 新值的输入
  const inputRefs = useRef<{ [key: number]: InputRef | null }>({}); // 存储输入框引用
  const nameInputRefs = useRef<{ [key: number]: InputRef | null }>({}); // 存储名称输入框引用

  // 加载规格模板
  useEffect(() => {
    const loadTemplates = async () => {
      const loadedTemplates = await getSpecificationTemplatesByCategory(categoryId);
      setTemplates(loadedTemplates);
    };
    loadTemplates();
  }, [categoryId]);

  // 使用 ref 存储最新的规格数据，确保 notifyChange 总是使用最新值
  const specsRef = useRef<SpecificationItem[]>([]);
  
  // 初始化：将JSON对象转换为数组格式
  // 只在value从外部真正变化时更新（避免编辑时频繁更新）
  useEffect(() => {
    // 如果是内部更新触发的，不重新设置
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // 将外部传入的 value 转换为数组格式
    const items: SpecificationItem[] = Object.entries(value || {})
      .filter(([name, values]) => name.trim() && Array.isArray(values) && values.length > 0)
      .map(([name, values]) => ({
        name,
        values: values.filter(v => v.trim()),
      }));
    
    setSpecifications(items);
    specsRef.current = items; // 同步更新 ref
  }, [value]);

  // 开始编辑规格名称（点击名称时触发）
  const startEditName = (index: number) => {
    if (disabled) return;
    setEditingNameIndex(index);
    setEditingNameValue(specifications[index].name);
    setTimeout(() => {
      nameInputRefs.current[index]?.focus();
      nameInputRefs.current[index]?.select();
    }, 100);
  };

  // 保存规格名称编辑
  const saveNameEdit = (index: number) => {
    if (!editingNameValue.trim()) {
      message.warning('规格名称不能为空');
      return;
    }

    // 检查名称是否重复（排除当前编辑的行）
    const isDuplicate = specifications.some((spec, i) => 
      i !== index && spec.name.trim() === editingNameValue.trim()
    );
    
    if (isDuplicate) {
      message.warning('规格名称已存在，请使用不同的名称');
      return;
    }

    setSpecifications((currentSpecs) => {
      const newSpecs = [...currentSpecs];
      newSpecs[index] = {
        ...newSpecs[index],
        name: editingNameValue.trim(),
      };
      specsRef.current = newSpecs;
      notifyChange(newSpecs);
      return newSpecs;
    });
    
    setEditingNameIndex(null);
    setEditingNameValue('');
  };

  // 取消编辑规格名称
  const cancelNameEdit = (index: number) => {
    const spec = specifications[index];
    // 如果规格名和值都为空，删除该规格
    if (!spec.name.trim() && spec.values.length === 0) {
      removeSpecification(index);
    }
    setEditingNameIndex(null);
    setEditingNameValue('');
  };

  // 更新规格名称（失焦时通知父组件）
  const updateSpecName = (index: number, newName: string) => {
    setEditingNameValue(newName);
  };

  // 开始添加规格值（显示输入框）
  const startAddSpecValue = (specIndex: number) => {
    setAddingValueIndex(specIndex);
    setNewValueInput('');
    setEditingIndex(specIndex);
    // 聚焦到输入框
    setTimeout(() => {
      inputRefs.current[specIndex]?.focus();
    }, 100);
  };

  // 确认添加规格值
  const confirmAddSpecValue = (specIndex: number) => {
    if (!newValueInput.trim()) {
      setAddingValueIndex(null);
      setNewValueInput('');
      return;
    }

    setSpecifications((currentSpecs) => {
      const newSpecs = [...currentSpecs];
      // 检查值是否已存在
      if (!newSpecs[specIndex].values.includes(newValueInput.trim())) {
        newSpecs[specIndex].values.push(newValueInput.trim());
        specsRef.current = newSpecs;
        notifyChange(newSpecs);
      }
      setAddingValueIndex(null);
      setNewValueInput('');
      return newSpecs;
    });
  };

  // 取消添加规格值
  const cancelAddSpecValue = () => {
    setAddingValueIndex(null);
    setNewValueInput('');
  };

  // 处理添加值输入框的键盘事件
  const handleAddValueKeyDown = (e: React.KeyboardEvent, specIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmAddSpecValue(specIndex);
    } else if (e.key === 'Escape') {
      cancelAddSpecValue();
    }
  };

  // Web3 深色主题配色方案 - 规格值 Tag 使用柔和蓝系列
  const tagColorScheme = {
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
    text: '#7dd3fc',
    hoverBg: 'rgba(59, 130, 246, 0.2)'
  };

  // 添加值 Tag 使用不同的配色方案（柔和绿系列），与规格值保持差异
  const addValueTagColorScheme = {
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.35)',
    text: '#86efac',
    hoverBg: 'rgba(34, 197, 94, 0.2)'
  };

  // 删除规格值
  const removeSpecValue = (specIndex: number, valueIndex: number) => {
    setSpecifications((currentSpecs) => {
      const newSpecs = [...currentSpecs];
      newSpecs[specIndex].values = newSpecs[specIndex].values.filter((_, i) => i !== valueIndex);
      specsRef.current = newSpecs; // 同步更新 ref
      // 立即通知父组件更新，确保数据同步
      notifyChange(newSpecs);
      // 如果删除后没有值了，取消编辑状态
      if (newSpecs[specIndex].values.length === 0) {
        setEditingIndex(null);
      }
      return newSpecs;
    });
  };

  // 添加新规格
  const addSpecification = () => {
    const newSpecs = [...specifications, { name: '', values: [] }];
    setSpecifications(newSpecs);
    const newIndex = newSpecs.length - 1;
    setEditingNameIndex(newIndex);
    setEditingNameValue('');
    setTimeout(() => {
      nameInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  // 从模板添加规格
  const addSpecificationFromTemplate = (template: SpecificationTemplate) => {
    setSpecifications((currentSpecs) => {
      // 检查是否已存在相同名称的规格
      const existingIndex = currentSpecs.findIndex(
        spec => spec.name.trim() === template.label.trim()
      );

      let newSpecs: SpecificationItem[];
      if (existingIndex >= 0) {
        // 如果已存在，合并值（去重）
        const existingSpec = currentSpecs[existingIndex];
        const mergedValues = [
          ...existingSpec.values,
          ...template.values.filter(v => !existingSpec.values.includes(v))
        ];
        newSpecs = [...currentSpecs];
        newSpecs[existingIndex] = {
          ...existingSpec,
          values: mergedValues,
        };
      } else {
        // 如果不存在，添加新规格
        newSpecs = [...currentSpecs, {
          name: template.label,
          values: [...template.values],
        }];
        setEditingIndex(newSpecs.length - 1);
      }
      
      specsRef.current = newSpecs;
      notifyChange(newSpecs);
      return newSpecs;
    });
  };

  // 删除规格
  const removeSpecification = (index: number) => {
    setSpecifications((currentSpecs) => {
      const newSpecs = currentSpecs.filter((_, i) => i !== index);
      specsRef.current = newSpecs; // 同步更新 ref
      notifyChange(newSpecs);
      setEditingIndex(null);
      setEditingNameIndex(null);
      setEditingNameValue('');
      return newSpecs;
    });
  };


  // 通知父组件变化
  const notifyChange = (specs: SpecificationItem[]) => {
    if (!onChange) return;

    // 标记这是内部更新
    isInternalUpdate.current = true;
    
    // 同步更新 ref，确保总是使用最新值
    specsRef.current = specs;

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

    // 立即同步更新父组件，确保数据一致性
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

  // 表格列定义
  const columns: ColumnsType<SpecificationItem & { index: number }> = [
    {
      title: '规格名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (_: any, record: SpecificationItem & { index: number }, index: number) => {
        const isEditing = editingNameIndex === index;
        if (isEditing) {
          return (
            <Input
              ref={(ref) => {
                nameInputRefs.current[index] = ref;
              }}
              value={editingNameValue}
              onChange={(e) => updateSpecName(index, e.target.value)}
              onPressEnter={() => saveNameEdit(index)}
              onBlur={() => {
                setTimeout(() => {
                  if (editingNameValue.trim()) {
                    saveNameEdit(index);
                  } else {
                    cancelNameEdit(index);
                  }
                }, 200);
              }}
              placeholder="请输入规格名称"
              className={styles.tableInput}
              autoFocus
            />
          );
        }
        return (
          <div 
            className={styles.nameCell}
            onClick={() => startEditName(index)}
            onMouseEnter={() => setHoveredNameIndex(index)}
            onMouseLeave={() => setHoveredNameIndex(null)}
            style={{ 
              cursor: disabled ? 'default' : 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              backgroundColor: hoveredNameIndex === index && !disabled ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
          >
            <span className={styles.nameText}>{record.name || '-'}</span>
          </div>
        );
      },
    },
    {
      title: '规格值',
      dataIndex: 'values',
      key: 'values',
      render: (_: any, record: SpecificationItem & { index: number }, index: number) => {
        return (
          <div className={styles.valuesCell}>
            <Space size={[6, 6]} wrap>
              {/* 显示已有的规格值标签 */}
              {record.values.map((value, valueIndex) => (
                <Tag
                  key={valueIndex}
                  closable={!disabled}
                  onClose={(e) => {
                    e.preventDefault();
                    removeSpecValue(index, valueIndex);
                  }}
                  className={styles.specValueTag}
                  style={{
                    backgroundColor: tagColorScheme.bg,
                    borderColor: tagColorScheme.border,
                    color: tagColorScheme.text,
                    borderWidth: 1,
                    borderStyle: 'solid',
                  } as React.CSSProperties}
                >
                  {value}
                </Tag>
              ))}
              
              {/* 添加值的输入框 */}
              {addingValueIndex === index && !disabled ? (
                <Input
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  size="small"
                  style={{ 
                    width: 90,
                    height: 22,
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}
                  value={newValueInput}
                  onChange={(e) => setNewValueInput(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (newValueInput.trim()) {
                        confirmAddSpecValue(index);
                      } else {
                        cancelAddSpecValue();
                      }
                    }, 200);
                  }}
                  onKeyDown={(e) => handleAddValueKeyDown(e, index)}
                  placeholder="输入值"
                  autoFocus
                />
              ) : (
                !disabled && (
                  <Tag
                    onClick={() => startAddSpecValue(index)}
                    className={styles.addValueTag}
                    style={{
                      backgroundColor: addValueTagColorScheme.bg,
                      borderColor: addValueTagColorScheme.border,
                      color: addValueTagColorScheme.text,
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      cursor: 'pointer',
                      userSelect: 'none'
                    } as React.CSSProperties}
                  >
                    <PlusOutlined /> 添加值
                  </Tag>
                )
              )}
            </Space>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: SpecificationItem & { index: number }, index: number) => {
        return (
          <Space size="small">
            {!disabled && (
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeSpecification(index)}
                className={styles.deleteBtn}
              >
                删除
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // 构建表格数据源
  const tableDataSource = specifications.map((spec, index) => ({ ...spec, index }));

  return (
    <div className={styles.specificationEditor}>
      <div className={styles.header}>
        <h4 className={styles.title}>规格设置</h4>
        {!disabled && (
          <Space size="small">
            {templates.length > 0 && (
              <Dropdown 
                menu={{ items: templateMenuItems }} 
                trigger={['click']} 
                placement="bottomRight"
                overlayClassName={styles.templateDropdown}
              >
                <button className={styles.softButton}>
                  从模板添加 <DownOutlined />
                </button>
              </Dropdown>
            )}
            <button 
              className={styles.softButton}
              onClick={addSpecification}
            >
              添加规格
            </button>
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
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={tableDataSource}
            rowKey={(record) => `spec-${record.index}`}
            pagination={false}
            size="small"
            className={styles.specificationTable}
            locale={{
              emptyText: '暂无数据',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SpecificationEditor;
