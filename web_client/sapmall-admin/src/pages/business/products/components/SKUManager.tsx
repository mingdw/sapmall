import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, InputNumber, Table, Space, Tag, Upload, Image, Popover, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AdminButton from '../../../../components/common/AdminButton';
import styles from './SKUManager.module.scss';

export interface SKUItem {
  indexs: string; // 规格索引，如 "0_1"
  combination: string; // 规格组合显示文本，如 "4K + 标准版"
  price: number;
  stock: number;
  skuCode?: string;
  title?: string; // SKU名称（与后端字段一致）
  images?: string[]; // 规格图片
}

interface SKUManagerProps {
  specifications: Record<string, string[]>; // 规格数据，例如 {"分辨率":["4K","8K"],"版本":["标准版","收藏版"]}
  skus?: SKUItem[]; // 已有的SKU数据
  onChange?: (skus: SKUItem[]) => void;
  disabled?: boolean;
  productName?: string; // SPU商品名称
  onSkuListRef?: (getSkuList: () => SKUItem[]) => void; // 用于获取最新的SKU列表
  autoGenerate?: boolean; // 是否根据规格自动生成所有SKU（默认true，从后端加载数据时应设为false）
}

// 生成笛卡尔积
const generateCartesianProduct = (arrays: string[][]): string[][] => {
  if (arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map(item => [item]);
  
  const [first, ...rest] = arrays;
  const restProduct = generateCartesianProduct(rest);
  const result: string[][] = [];
  
  first.forEach(item => {
    restProduct.forEach(combo => {
      result.push([item, ...combo]);
    });
  });
  
  return result;
};

// 生成规格索引
// 保持规格顺序与规格设置一致（不排序）
// 计算逻辑：
// - combination: 规格值数组，如 ["红色", "S"]
// - specKeys: 规格键数组，按规格设置的顺序，如 ["颜色", "尺寸"]
// - specifications: 规格对象，如 {"颜色": ["红色", "绿色"], "尺寸": ["S", "M"]}
// 返回：索引字符串，如 "0_0" 表示红色(第0个) + S(第0个)
// 对于单一属性，如只有 "颜色": ["红色", "绿色"]，组合 ["绿色"] 返回 "1"
const generateIndexs = (combination: string[], specKeys: string[], specifications: Record<string, string[]>): string => {
  const indexes = specKeys.map((key, idx) => {
    const values = specifications[key];
    const selectedValue = combination[idx];
    const index = values.indexOf(selectedValue);
    if (index === -1) {
      console.warn(`规格值 "${selectedValue}" 在规格 "${key}" 中未找到，可用值:`, values);
    }
    return index;
  });
  const result = indexes.join('_');
  return result;
};

const SKUManager: React.FC<SKUManagerProps> = ({
  specifications,
  skus = [],
  onChange,
  disabled = false,
  productName = '',
  onSkuListRef,
  autoGenerate = true, // 默认根据规格自动生成所有SKU
}) => {
  // 根据规格生成SKU组合
  // 保持规格顺序与规格设置一致（不排序，使用对象插入顺序）
  const generatedSKUs = useMemo(() => {
    // 保持规格的原始顺序（不排序），确保与规格设置中的顺序一致
    // 只使用有值的规格来生成 SKU（过滤掉空数组的规格）
    const specKeys = Object.keys(specifications);
    const validSpecs: { key: string; values: string[] }[] = specKeys
      .map(key => ({ key, values: specifications[key] }))
      .filter(({ values }) => Array.isArray(values) && values.length > 0);
    
    // 如果没有有效的规格（所有规格都没有值），返回空数组
    if (validSpecs.length === 0) {
      return [];
    }

    // 提取有效的规格键和值
    const validSpecKeys = validSpecs.map(spec => spec.key);
    const validSpecValues = validSpecs.map(spec => spec.values);

    const combinations = generateCartesianProduct(validSpecValues);
    
    return combinations.map((combo, index) => {
      // 传递 validSpecKeys 以确保索引生成时使用相同的顺序
      // indexs 计算：根据规格值在对应规格数组中的索引位置
      // 例如：规格设置 {"颜色": ["红色", "绿色"], "尺寸": ["S", "M"]}
      // 组合 ["红色", "S"] -> indexs = "0_0" (红色是第0个，S是第0个)
      // 组合 ["绿色", "M"] -> indexs = "1_1" (绿色是第1个，M是第1个)
      // 注意：只使用有值的规格来生成索引
      const validSpecsMap: Record<string, string[]> = {};
      validSpecs.forEach(({ key, values }) => {
        validSpecsMap[key] = values;
      });
      const indexs = generateIndexs(combo, validSpecKeys, validSpecsMap);
      // 按照规格设置的顺序组合显示
      const combination = combo.join(' + ');
      
      // 查找是否已有该SKU
      const existingSku = skus.find(sku => sku.indexs === indexs);
      
      // 生成默认名称：SPU名称 + 规格组合 + 001（递增）
      const defaultTitle = existingSku?.title || 
        `${productName} ${combination} ${String(index + 1).padStart(3, '0')}`;
      
      return {
        indexs,
        combination,
        title: defaultTitle,
        price: existingSku?.price || 0,
        stock: existingSku?.stock || 0,
        skuCode: existingSku?.skuCode || '',
        images: existingSku?.images || [],
      };
    });
  }, [specifications, skus, productName]);

  // 维护已删除的SKU索引集合（用于排除已删除的SKU）
  const [deletedIndexs, setDeletedIndexs] = useState<Set<string>>(new Set());
  
  // 使用 ref 跟踪上一次的规格，只在规格键真正变化时清除已删除记录
  const prevSpecKeysRef = useRef<string>('');

  // 当规格键变化时，清除已删除记录（因为规格键变化会导致SKU索引重新生成）
  // 但规格值变化时不清除，避免删除操作被覆盖
  useEffect(() => {
    const currentSpecKeys = Object.keys(specifications).sort().join(',');
    if (currentSpecKeys !== prevSpecKeysRef.current) {
      // 规格键变化了（添加或删除规格），清除已删除记录
      setDeletedIndexs(new Set());
      prevSpecKeysRef.current = currentSpecKeys;
    }
  }, [specifications]);

  // 根据规格生成SKU组合，排除已删除的SKU
  const filteredGeneratedSKUs = useMemo(() => {
    return generatedSKUs.filter(sku => !deletedIndexs.has(sku.indexs));
  }, [generatedSKUs, deletedIndexs]);

  // 根据最新规格生成SKU列表，并保留已存在的SKU数据
  // 如果 autoGenerate 为 true：总是根据最新规格生成所有可能的SKU组合，并保留已存在的SKU数据
  // 如果 autoGenerate 为 false：只显示外部传入的SKU数据（用于从后端加载数据时）
  const finalSkuList = useMemo(() => {
    // 如果不需要自动生成，直接返回外部传入的SKU数据（但需要更新combination显示文本）
    if (!autoGenerate && skus && skus.length > 0) {
      const specKeys = Object.keys(specifications);
      // 排除已删除的 SKU
      return skus
        .filter(sku => !deletedIndexs.has(sku.indexs))
        .map(existingSku => {
          // 根据indexs找到对应的规格组合，更新combination显示文本
          const indexsArray = existingSku.indexs.split('_').map(idx => parseInt(idx, 10));
          const combinationParts: string[] = [];
          
          specKeys.forEach((key, idx) => {
            const values = specifications[key];
            const valueIndex = indexsArray[idx];
            if (valueIndex >= 0 && valueIndex < values.length) {
              combinationParts.push(values[valueIndex]);
            }
          });
          
          const combination = combinationParts.join(' + ');
          
          return {
            ...existingSku,
            combination: combination || existingSku.combination, // 使用重新生成的combination
          };
        });
    }
    
    // 如果需要自动生成，根据最新规格生成所有可能的SKU组合
    // 创建一个映射，用于快速查找已存在的SKU数据（排除已删除的）
    const existingSkuMap = new Map<string, SKUItem>();
    if (skus && skus.length > 0) {
      skus
        .filter(sku => !deletedIndexs.has(sku.indexs)) // 排除已删除的 SKU
        .forEach(sku => {
          existingSkuMap.set(sku.indexs, sku);
        });
    }
    
    // 如果生成了新的 SKU，使用生成的 SKU（合并已存在的 SKU 数据）
    if (filteredGeneratedSKUs.length > 0) {
      return filteredGeneratedSKUs.map(generatedSku => {
        const existingSku = existingSkuMap.get(generatedSku.indexs);
        if (existingSku) {
          // 如果已存在，保留其数据，但更新combination显示文本（因为规格可能变化了）
          return {
            ...existingSku,
            combination: generatedSku.combination, // 使用最新生成的combination
          };
        }
        // 如果不存在，使用生成的默认SKU
        return generatedSku;
      });
    }
    
    // 如果没有生成新的 SKU（例如所有规格都没有值），保留现有的 SKU
    // 但需要更新 combination 显示文本（基于当前规格）
    const specKeys = Object.keys(specifications);
    return Array.from(existingSkuMap.values()).map(existingSku => {
      // 根据 indexs 找到对应的规格组合，更新 combination 显示文本
      const indexsArray = existingSku.indexs.split('_').map(idx => parseInt(idx, 10));
      const combinationParts: string[] = [];
      
      specKeys.forEach((key, idx) => {
        const values = specifications[key];
        const valueIndex = indexsArray[idx];
        if (valueIndex >= 0 && valueIndex < values.length) {
          combinationParts.push(values[valueIndex]);
        }
      });
      
      const combination = combinationParts.join(' + ');
      
      return {
        ...existingSku,
        combination: combination || existingSku.combination, // 使用重新生成的 combination
      };
    });
  }, [skus, filteredGeneratedSKUs, specifications, autoGenerate, deletedIndexs]);

  const [skuList, setSkuList] = useState<SKUItem[]>(finalSkuList);
  // 使用 ref 跟踪是否正在手动删除 SKU，避免 useEffect 覆盖删除操作
  const isDeletingRef = useRef<boolean>(false);

  // ✅ 当最终SKU列表变化时，更新本地状态并通知父组件
  // 这确保了当规格变化时（从模板添加、添加规格、删除规格），SKU列表会自动更新
  // 使用 useRef 存储上一次的值，避免无限循环
  const prevFinalSkuListRef = useRef<SKUItem[]>([]);
  
  useEffect(() => {
    // 如果正在手动删除 SKU，不更新（避免覆盖删除操作）
    if (isDeletingRef.current) {
      isDeletingRef.current = false;
      return;
    }

    // 确保 finalSkuList 中不包含已删除的 SKU（双重保险）
    const filteredFinalSkuList = finalSkuList.filter(sku => !deletedIndexs.has(sku.indexs));

    // 深度比较，避免相同内容但不同引用的对象触发更新
    const prevList = prevFinalSkuListRef.current;
    const isEqual = prevList.length === filteredFinalSkuList.length &&
      prevList.every((prevSku, index) => {
        const currentSku = filteredFinalSkuList[index];
        return prevSku.indexs === currentSku.indexs &&
          prevSku.price === currentSku.price &&
          prevSku.stock === currentSku.stock &&
          prevSku.title === currentSku.title &&
          JSON.stringify(prevSku.images) === JSON.stringify(currentSku.images);
      });
    
    if (!isEqual) {
      setSkuList(filteredFinalSkuList);
      prevFinalSkuListRef.current = filteredFinalSkuList;
      
      // 只在真正变化时才通知父组件（排除手动删除的情况）
      if (onChange) {
        onChange(filteredFinalSkuList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalSkuList, deletedIndexs]); // 确保规格变化时自动更新SKU列表，不包含 onChange 避免循环更新

  // 提供获取最新SKU列表的方法给父组件
  useEffect(() => {
    if (onSkuListRef) {
      onSkuListRef(() => skuList);
    }
  }, [skuList, onSkuListRef]);

  // 更新SKU字段
  const updateSKU = (indexs: string, field: keyof SKUItem, value: any) => {
    const newSkuList = skuList.map(sku => {
      if (sku.indexs === indexs) {
        return { ...sku, [field]: value };
      }
      return sku;
    });
    setSkuList(newSkuList);
    onChange?.(newSkuList);
  };

  // 处理图片上传
  const handleImageChange = (indexs: string, fileList: UploadFile[]) => {
    const imageUrls = fileList
      .filter(file => {
        if (file.status === 'removed') return false;
        return file.url || file.response?.url || file.thumbUrl;
      })
      .map(file => file.url || file.response?.url || file.thumbUrl || '');
    updateSKU(indexs, 'images', imageUrls);
  };

  // 删除图片
  const handleRemoveImage = (indexs: string, imageIndex: number) => {
    const sku = skuList.find(s => s.indexs === indexs);
    if (sku && sku.images) {
      const newImages = sku.images.filter((_, idx) => idx !== imageIndex);
      updateSKU(indexs, 'images', newImages);
    }
  };

  // 添加图片
  const handleAddImage = (indexs: string, file: File) => {
    const sku = skuList.find(s => s.indexs === indexs);
    const currentImages = sku?.images || [];
    
    // 使用FileReader读取本地文件作为预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      updateSKU(indexs, 'images', [...currentImages, url]);
    };
    reader.readAsDataURL(file);
    
    // TODO: 实际应该上传到服务器，获取服务器返回的URL
  };

  // 删除SKU
  const handleDeleteSKU = (indexs: string) => {
    // 标记正在删除，避免 useEffect 覆盖删除操作
    isDeletingRef.current = true;
    
    // 将删除的SKU索引添加到已删除集合中
    setDeletedIndexs(prev => new Set([...prev, indexs]));
    
    // 从当前列表中移除
    const newSkuList = skuList.filter(sku => sku.indexs !== indexs);
    setSkuList(newSkuList);
    
    // 更新 prevFinalSkuListRef，避免 useEffect 认为列表变化了
    prevFinalSkuListRef.current = newSkuList;
    
    // 通知父组件更新
    onChange?.(newSkuList);
  };

  const columns: ColumnsType<SKUItem> = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: SKUItem) => (
        <div className={styles.nameCell}>
          <Input
            value={text || ''}
            onChange={(e) => updateSKU(record.indexs, 'title', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            placeholder="SKU名称"
            disabled={disabled}
            className={styles.nameInput}
            title={text}
          />
        </div>
      ),
    },
    {
      title: '规格图片',
      dataIndex: 'images',
      key: 'images',
      width: 180,
      render: (images: string[] = [], record: SKUItem) => {
        const imageList = images || [];
        
        return (
          <div className={styles.imageListContainer}>
            <div className={styles.imageThumbnails}>
              {imageList.map((url, index) => (
                <div key={index} className={styles.imageThumbnail}>
                  <Popover
                    content={
                      <Image
                        src={url}
                        alt={`SKU图片${index + 1}`}
                        style={{ maxWidth: 300, maxHeight: 300 }}
                        preview={false}
                      />
                    }
                    trigger="hover"
                    placement="right"
                  >
                    <div className={styles.thumbnailWrapper}>
                      <img src={url} alt={`SKU图片${index + 1}`} />
                      {!disabled && (
                        <button
                          className={styles.removeImageBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(record.indexs, index);
                          }}
                          type="button"
                          title="删除图片"
                        >
                          <DeleteOutlined />
                        </button>
                      )}
                    </div>
                  </Popover>
                </div>
              ))}
            </div>
            {!disabled && (
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    return false;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    return false;
                  }
                  handleAddImage(record.indexs, file);
                  return false; // 阻止自动上传
                }}
                accept="image/*"
                className={styles.addImageBtn}
              >
                <button type="button" className={styles.addImageButton}>
                  <PlusOutlined />
                  <span>添加</span>
                </button>
              </Upload>
            )}
          </div>
        );
      },
    },
    {
      title: '规格组合',
      dataIndex: 'combination',
      key: 'combination',
      width: 150,
      render: (text: string) => (
        <div className={styles.combinationCell}>
          {text.split(' + ').map((item, idx) => (
            <Tag key={idx} color="blue" className={styles.specTag}>
              {item}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '价格 (SAP)',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (value: number, record: SKUItem) => (
        <InputNumber
          value={value}
          onChange={(val) => updateSKU(record.indexs, 'price', val || 0)}
          min={0}
          step={0.01}
          precision={2}
          disabled={disabled}
          className={styles.priceInput}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (value: number, record: SKUItem) => (
        <InputNumber
          value={value}
          onChange={(val) => updateSKU(record.indexs, 'stock', val || 0)}
          min={0}
          step={1}
          precision={0}
          disabled={disabled}
          className={styles.stockInput}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: SKUItem) => (
        <Space size="small">
          <Popconfirm
            title="确定要删除这个SKU吗？"
            description="删除后无法恢复，请谨慎操作"
            onConfirm={() => handleDeleteSKU(record.indexs)}
            okText="确定"
            cancelText="取消"
            disabled={disabled}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={disabled}
              className={styles.deleteBtn}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (Object.keys(specifications).length === 0) {
    return (
      <div className={styles.skuManager}>
        <div className={styles.header}>
          <h4 className={styles.title}>SKU管理</h4>
        </div>
        <div className={styles.emptyTip}>
          <div className={styles.emptyIcon}>📦</div>
          <p className={styles.emptyText}>请先设置商品规格</p>
          <p className={styles.emptyHint}>设置规格后，系统将自动生成对应的SKU</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.skuManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h4 className={styles.title}>SKU管理</h4>
          <div className={styles.skuCount}>
            共 {skuList.length} 个SKU
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={skuList}
          rowKey="indexs"
          pagination={false}
          size="small"
          className={styles.skuTable}
          rowClassName={() => styles.skuTableRow}
          scroll={{ y: 500, x: 'max-content' }}
          locale={{
            emptyText: '暂无数据',
          }}
        />
      </div>
    </div>
  );
};

export default SKUManager;
