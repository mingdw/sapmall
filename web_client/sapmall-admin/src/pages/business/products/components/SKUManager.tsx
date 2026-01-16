import React, { useState, useEffect, useMemo } from 'react';
import { Input, InputNumber, Table, Space, Tag, Upload, Image, Popover } from 'antd';
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
  name?: string; // SKU名称
  skuCode?: string;
  title?: string;
  images?: string[]; // 规格图片
}

interface SKUManagerProps {
  specifications: Record<string, string[]>; // 规格数据，例如 {"分辨率":["4K","8K"],"版本":["标准版","收藏版"]}
  skus?: SKUItem[]; // 已有的SKU数据
  onChange?: (skus: SKUItem[]) => void;
  disabled?: boolean;
  productName?: string; // SPU商品名称
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
const generateIndexs = (combination: string[], specifications: Record<string, string[]>): string => {
  const sortedKeys = Object.keys(specifications).sort();
  const indexes = sortedKeys.map((key, idx) => {
    const values = specifications[key];
    const selectedValue = combination[idx];
    return values.indexOf(selectedValue);
  });
  return indexes.join('_');
};

const SKUManager: React.FC<SKUManagerProps> = ({
  specifications,
  skus = [],
  onChange,
  disabled = false,
  productName = '',
}) => {
  // 根据规格生成SKU组合
  const generatedSKUs = useMemo(() => {
    const specKeys = Object.keys(specifications).sort();
    const specValues = specKeys.map(key => specifications[key]);
    
    if (specKeys.length === 0 || specValues.some(v => v.length === 0)) {
      return [];
    }

    const combinations = generateCartesianProduct(specValues);
    
    return combinations.map((combo, index) => {
      const indexs = generateIndexs(combo, specifications);
      const combination = combo.join(' + ');
      
      // 查找是否已有该SKU
      const existingSku = skus.find(sku => sku.indexs === indexs);
      
      // 生成默认名称：SPU名称 + 规格组合 + 001（递增）
      const defaultName = existingSku?.name || 
        `${productName} ${combination} ${String(index + 1).padStart(3, '0')}`;
      
      return {
        indexs,
        combination,
        name: defaultName,
        price: existingSku?.price || 0,
        stock: existingSku?.stock || 0,
        skuCode: existingSku?.skuCode || '',
        title: existingSku?.title || '',
        images: existingSku?.images || [],
      };
    });
  }, [specifications, skus, productName]);

  const [skuList, setSkuList] = useState<SKUItem[]>(generatedSKUs);

  // 当规格变化时，更新SKU列表并通知父组件
  useEffect(() => {
    setSkuList(generatedSKUs);
    // 当规格变化导致SKU列表变化时，同步通知父组件
    // 使用 setTimeout 确保在状态更新后通知，避免潜在的循环更新
    if (onChange) {
      // 使用函数式更新，确保获取最新的 generatedSKUs
      onChange(generatedSKUs);
    }
  }, [generatedSKUs]); // 移除 onChange 依赖，避免循环更新

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

  const columns: ColumnsType<SKUItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: SKUItem) => (
        <div className={styles.nameCell}>
          <Input
            value={text}
            onChange={(e) => updateSKU(record.indexs, 'name', e.target.value)}
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
        <h4 className={styles.title}>SKU管理</h4>
        <div className={styles.skuCount}>
          共 {skuList.length} 个SKU
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
        />
      </div>
    </div>
  );
};

export default SKUManager;
