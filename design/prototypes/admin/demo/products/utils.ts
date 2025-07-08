import { message } from 'antd';
import type { Product, CategoryResponse, AttrGroup } from '../../../../api/apiService';
import type { UploadFile } from 'antd/es/upload/interface';

type SpecCombination = {
  id: string;
  specs: Record<string, string>;
  price: number;
  stock: number;
  skuCode: string;
};

/**
 * 根据ID查找分类
 * @param categories 分类列表
 * @param id 分类ID
 * @returns 找到的分类或null
 */
export const findCategoryById = (categories: CategoryResponse[], id: number): CategoryResponse | null => {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 根据ID查找分类名称
 * @param categories 分类列表
 * @param categoryId 分类ID
 * @returns 找到的分类名称或null
 */
export const findCategoryName = (categories: CategoryResponse[], categoryId: number): string | null => {
  for (const cat of categories) {
    if (cat.id === categoryId) {
      return cat.name;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryName(cat.children, categoryId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 生成商品规格组合
 * @param specAttrs 规格属性
 * @param existingCombinations 已存在的组合
 * @param defaultPrice 默认价格
 * @returns 生成的规格组合数组
 */
export const generateSpecCombinations = (
  specAttrs: Record<string, string[]>,
  existingCombinations: SpecCombination[] = [],
  defaultPrice: number = 0
): SpecCombination[] => {
  // 如果没有规格属性，则返回空数组
  if (Object.keys(specAttrs).length === 0) {
    return [];
  }

  // 获取所有规格属性的键和值
  const specKeys = Object.keys(specAttrs);
  const specValues = specKeys.map(key => specAttrs[key]);

  // 生成所有可能的规格组合
  const generateCombinations = (index: number, current: Record<string, string>): Record<string, string>[] => {
    if (index === specKeys.length) {
      return [current];
    }

    const key = specKeys[index];
    const values = specValues[index];
    const result: Record<string, string>[] = [];

    values.forEach(value => {
      const newCurrent = { ...current, [key]: value };
      result.push(...generateCombinations(index + 1, newCurrent));
    });

    return result;
  };

  // 生成所有组合
  const allCombinations = generateCombinations(0, {});

  // 转换为SpecCombination格式
  return allCombinations.map((specs, index) => {
    // 查找现有的组合，如果存在则保留价格和库存
    const existingCombination = existingCombinations.find(c => {
      return Object.keys(specs).every(key => c.specs[key] === specs[key]);
    });

    return {
      id: existingCombination?.id || `spec_${index}`,
      specs,
      price: existingCombination?.price || defaultPrice,
      stock: existingCombination?.stock || 0,
      skuCode: existingCombination?.skuCode || `SKU_${Date.now()}_${index}`
    };
  });
};

/**
 * 处理商品图片数据，转换为UploadFile格式
 * @param images 图片URL数组
 * @returns UploadFile数组
 */
export const processProductImages = (images?: string[]): UploadFile[] => {
  if (!images || images.length === 0) return [];
  
  return images.map((img, index) => ({
    uid: `-${index}`,
    name: img.split('/').pop() || `image-${index}.jpg`,
    status: 'done',
    url: img,
    thumbUrl: img
  }));
};

/**
 * 从上传文件列表中提取图片URL
 * @param fileList 上传文件列表
 * @returns 图片URL数组
 */
export const extractImageUrls = (fileList: UploadFile[]): string[] => {
  return fileList
    .filter(file => file.status === 'done') // 只获取上传成功的
    .map(file => {
      // 优先使用文件的 URL
      if (file.url) {
        return file.url;
      }
      
      // 如果没有URL但有响应数据
      if (file.response) {
        // 根据响应结构提取URL
        if (typeof file.response === 'object') {
          return file.response.url;
        }
      }
      
      // 后备选项
      if (file.thumbUrl) {
        return file.thumbUrl;
      }
      
      return '';
    })
    .filter(Boolean); // 过滤掉空字符串
};

/**
 * 解析商品属性
 * @param product 商品对象
 * @returns 解析后的属性数据
 */
export const parseProductAttributes = (product: Product) => {
  try {
    // 解析基础属性
    const basicAttrsData = product.attributes?.basicAttrs
      ? JSON.parse(product.attributes.basicAttrs)
      : {};
    
    // 解析销售属性
    const saleAttrsData = product.attributes?.saleAttrs
      ? JSON.parse(product.attributes.saleAttrs)
      : {};
    
    // 解析规格属性
    const specAttrsData = product.attributes?.specAttrs
      ? JSON.parse(product.attributes.specAttrs)
      : {};
    
    return {
      basicAttrsData,
      saleAttrsData,
      specAttrsData
    };
  } catch (error) {
    console.error('解析商品属性失败:', error);
    message.error('解析商品属性失败');
    return {
      basicAttrsData: {},
      saleAttrsData: {},
      specAttrsData: {}
    };
  }
}; 