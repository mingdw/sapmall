import React, { useState, useEffect, useMemo } from 'react';
import { Input, InputNumber, Table, Space, Tag, Upload, Image, Popover, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
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
}) => {
  // 根据规格生成SKU组合
  // 保持规格顺序与规格设置一致（不排序，使用对象插入顺序）
  const generatedSKUs = useMemo(() => {
    // 保持规格的原始顺序（不排序），确保与规格设置中的顺序一致
    const specKeys = Object.keys(specifications);
    const specValues = specKeys.map(key => specifications[key]);
    
    if (specKeys.length === 0 || specValues.some(v => v.length === 0)) {
      return [];
    }

    const combinations = generateCartesianProduct(specValues);
    
    return combinations.map((combo, index) => {
      // 传递 specKeys 以确保索引生成时使用相同的顺序
      // indexs 计算：根据规格值在对应规格数组中的索引位置
      // 例如：规格设置 {"颜色": ["红色", "绿色"], "尺寸": ["S", "M"]}
      // 组合 ["红色", "S"] -> indexs = "0_0" (红色是第0个，S是第0个)
      // 组合 ["绿色", "M"] -> indexs = "1_1" (绿色是第1个，M是第1个)
      const indexs = generateIndexs(combo, specKeys, specifications);
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

  // 当规格变化时，清除已删除记录（因为规格变化会导致SKU索引重新生成）
  useEffect(() => {
    setDeletedIndexs(new Set());
  }, [specifications]);

  // 根据规格生成SKU组合，排除已删除的SKU
  const filteredGeneratedSKUs = useMemo(() => {
    return generatedSKUs.filter(sku => !deletedIndexs.has(sku.indexs));
  }, [generatedSKUs, deletedIndexs]);

  // 决定使用哪个SKU列表：
  // 1. 如果外部传入的skus有数据，优先使用外部数据（后端返回的实际保存的SKU）
  // 2. 如果外部skus为空，则根据规格生成所有可能的SKU组合
  // 3. 对于外部传入的SKU，需要根据规格重新生成combination显示文本
  const finalSkuList = useMemo(() => {
    // 如果外部传入的skus有数据，优先使用外部数据（这是后端返回的实际保存的SKU）
    if (skus && skus.length > 0) {
      // 为每个外部SKU重新生成combination显示文本
      return skus.map(existingSku => {
        // 根据indexs找到对应的规格组合
        const indexsArray = existingSku.indexs.split('_').map(idx => parseInt(idx, 10));
        const specKeys = Object.keys(specifications);
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
    
    // 如果外部skus为空，根据规格生成所有可能的SKU组合
    return filteredGeneratedSKUs;
  }, [skus, filteredGeneratedSKUs, specifications]);

  const [skuList, setSkuList] = useState<SKUItem[]>(finalSkuList);

  // 当最终SKU列表变化时，更新本地状态并通知父组件
  useEffect(() => {
    setSkuList(finalSkuList);
    if (onChange) {
      onChange(finalSkuList);
    }
  }, [finalSkuList]); // 移除 onChange 依赖，避免循环更新

  // 刷新SKU：根据规格重新生成SKU列表，但保留已存在的SKU数据
  const handleRefreshSKUs = () => {
    // 根据规格生成所有可能的SKU组合
    const specKeys = Object.keys(specifications);
    const specValues = specKeys.map(key => specifications[key]);
    
    if (specKeys.length === 0 || specValues.some(v => v.length === 0)) {
      return;
    }

    const combinations = generateCartesianProduct(specValues);
    const newGeneratedSKUs = combinations.map((combo, index) => {
      const indexs = generateIndexs(combo, specKeys, specifications);
      const combination = combo.join(' + ');
      
      // 查找当前SKU列表中是否已存在该SKU（通过indexs匹配）
      const existingSku = skuList.find(sku => sku.indexs === indexs);
      
      if (existingSku) {
        // 如果已存在，保留现有数据（价格、库存、名称等），但更新combination显示文本
        return {
          ...existingSku,
          combination: combination, // 更新combination显示文本
        };
      }
      
      // 如果不存在，创建新的SKU
      const defaultTitle = `${productName} ${combination} ${String(index + 1).padStart(3, '0')}`;
      return {
        indexs,
        combination,
        title: defaultTitle,
        price: 0,
        stock: 0,
        skuCode: '',
        images: [],
      };
    });

    // 更新SKU列表
    setSkuList(newGeneratedSKUs);
    if (onChange) {
      onChange(newGeneratedSKUs);
    }
  };

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
    // 将删除的SKU索引添加到已删除集合中
    setDeletedIndexs(prev => new Set([...prev, indexs]));
    // 从当前列表中移除
    const newSkuList = skuList.filter(sku => sku.indexs !== indexs);
    setSkuList(newSkuList);
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
        {!disabled && (
          <button 
            className={styles.refreshButton}
            onClick={handleRefreshSKUs}
            title="根据规格设置重新生成SKU列表"
          >
            <ReloadOutlined /> 刷新SKU
          </button>
        )}
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
