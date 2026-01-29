// ProductForm 工具函数
import type { ProductSKU, ProductDetailResp, ProductAttrsInfo, ProductAttrParamInfo } from '../types';
import type { SKUItem } from './SKUManager';
import { ProductStatus } from '../constants';

// 解析图片字符串（支持JSON数组或逗号分隔）
export const parseImageUrls = (images: string | string[] | undefined): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      return images.includes('[') ? JSON.parse(images) : images.split(',').filter(Boolean);
    } catch {
      return images.split(',').filter(Boolean);
    }
  }
  return [];
};

// 转换 ProductSKU 到 SKUItem
// 注意：combination 字段会在 SKUManager 中根据规格重新生成，这里先使用 indexs 作为占位符
export const convertSkuToItem = (sku: ProductSKU): SKUItem => {
  const price = typeof sku.price === 'string' ? parseFloat(sku.price) : sku.price;
  const images = parseImageUrls(sku.images);
  
  return {
    indexs: sku.indexs,
    combination: sku.indexs, // SKUManager 会根据规格重新生成正确的 combination
    price: price || 0,
    stock: sku.stock || 0,
    skuCode: sku.skuCode || '',
    title: sku.title || '', // 使用 title 字段，与后端保持一致
    images: images,
  };
};

// 从 ProductDetailResp 中提取基础属性
export const extractBasicAttributes = (attrs: ProductAttrsInfo | undefined): Record<string, string> => {
  if (!attrs?.base_attrs) return {};
  
  const basicItem = attrs.base_attrs.find(
    (a) => a.code === 'BASIC_ATTRS' || a.attrType === 1
  ) || attrs.base_attrs[0];
  
  if (!basicItem?.value) return {};
  
  try {
    return typeof basicItem.value === 'string' 
      ? JSON.parse(basicItem.value) 
      : basicItem.value;
  } catch {
    return {};
  }
};

// 从 ProductDetailResp 中提取销售属性
export const extractSaleAttributes = (attrs: ProductAttrsInfo | undefined): Record<string, string> => {
  if (!attrs?.sale_attrs) return {};
  
  const saleItem = attrs.sale_attrs.find(
    (a) => a.code === 'SALE_ATTRS' || a.attrType === 2
  ) || attrs.sale_attrs[0];
  
  if (!saleItem?.value) return {};
  
  try {
    return typeof saleItem.value === 'string' 
      ? JSON.parse(saleItem.value) 
      : saleItem.value;
  } catch {
    return {};
  }
};

// 从 ProductDetailResp 中提取规格属性
// 优先从 spec_attrs 中提取，如果没有则从 base_attrs 中查找（兼容旧数据）
export const extractSpecifications = (attrs: ProductAttrsInfo | undefined): Record<string, string[]> => {
  if (!attrs) return {};
  
  // 优先从 spec_attrs 中提取规格属性
  if (attrs.spec_attrs && attrs.spec_attrs.length > 0) {
    const specItem = attrs.spec_attrs.find(
      (a) => a.code === 'SPEC_ATTRS' || a.attrType === 3
    );
    
    if (specItem?.value) {
      try {
        const specValue = typeof specItem.value === 'string' 
          ? JSON.parse(specItem.value) 
          : specItem.value;
        
        const normalizedSpecs: Record<string, string[]> = {};
        Object.entries(specValue || {}).forEach(([key, val]) => {
          normalizedSpecs[key] = Array.isArray(val) ? val : [val as string];
        });
        return normalizedSpecs;
      } catch {
        // 解析失败，继续尝试从 base_attrs 中查找
      }
    }
  }
  
  // 兼容旧数据：从 base_attrs 中查找规格属性
  if (attrs.base_attrs && attrs.base_attrs.length > 0) {
    const specItem = attrs.base_attrs.find(
      (a) => a.code === 'SPEC_ATTRS' || a.attrType === 3
    );
    
    if (specItem?.value) {
      try {
        const specValue = typeof specItem.value === 'string' 
          ? JSON.parse(specItem.value) 
          : specItem.value;
        
        const normalizedSpecs: Record<string, string[]> = {};
        Object.entries(specValue || {}).forEach(([key, val]) => {
          normalizedSpecs[key] = Array.isArray(val) ? val : [val as string];
        });
        return normalizedSpecs;
      } catch {
        return {};
      }
    }
  }
  
  return {};
};

// 从 ProductDetailResp 中提取所有SKU
export const extractSkus = (detailResp: ProductDetailResp): SKUItem[] => {
  if (!detailResp.skus || detailResp.skus.length === 0) return [];
  return detailResp.skus.map(convertSkuToItem);
};

// 转换价格为字符串（后端API要求）
export const formatPriceToString = (price: number | string | undefined | null): string | undefined => {
  if (price === undefined || price === null) return undefined;
  return typeof price === 'number' ? price.toString() : String(price);
};

// 构建基础属性对象
export const buildBasicAttr = (
  basicAttributes: Record<string, string>,
  productId: number,
  productCode: string,
  existingId: number = 0
): ProductAttrParamInfo | null => {
  if (Object.keys(basicAttributes).length === 0) return null;
  
  return {
    id: existingId,
    productSpuId: productId,
    productSpuCode: productCode,
    code: 'BASIC_ATTRS',
    name: '基础属性',
    attrType: 1,
    valueType: 5,
    value: JSON.stringify(basicAttributes),
    sort: 1,
    status: 1,
    isRequired: 0,
    isGeneric: 0,
  };
};

// 构建销售属性对象
export const buildSaleAttr = (
  saleAttributes: Record<string, string>,
  productId: number,
  productCode: string,
  existingId: number = 0
): ProductAttrParamInfo | null => {
  if (Object.keys(saleAttributes).length === 0) return null;
  
  return {
    id: existingId,
    productSpuId: productId,
    productSpuCode: productCode,
    code: 'SALE_ATTRS',
    name: '销售属性',
    attrType: 2,
    valueType: 5,
    value: JSON.stringify(saleAttributes),
    sort: 2,
    status: 1,
    isRequired: 0,
    isGeneric: 0,
  };
};

// 构建规格属性对象
export const buildSpecAttr = (
  specifications: Record<string, string[]>,
  productId: number,
  productCode: string,
  existingId: number = 0
): ProductAttrParamInfo | null => {
  if (Object.keys(specifications).length === 0) return null;
  
  return {
    id: existingId,
    productSpuId: productId,
    productSpuCode: productCode,
    code: 'SPEC_ATTRS',
    name: '规格属性',
    attrType: 3,
    valueType: 5,
    value: JSON.stringify(specifications),
    sort: 3,
    status: 1,
    isRequired: 0,
    isGeneric: 0,
  };
};

// 转换 SKUItem 到 ProductSKU（用于保存）
// 前后端统一使用 title 字段
export const convertItemToSku = (
  item: SKUItem,
  productId: number,
  productCode: string,
  existingSku?: ProductSKU
): ProductSKU => {
  return {
    id: existingSku?.id || 0,
    productSpuId: productId,
    productSpuCode: productCode,
    skuCode: item.skuCode || existingSku?.skuCode || '',
    price: typeof item.price === 'number' ? item.price.toString() : String(item.price || '0'),
    stock: item.stock || 0,
    saleCount: existingSku?.saleCount || 0,
    status: 1,
    indexs: item.indexs,
    title: item.title || existingSku?.title || '', // 使用 title 字段，与后端保持一致
    images: Array.isArray(item.images) ? JSON.stringify(item.images) : (item.images || ''),
  };
};
