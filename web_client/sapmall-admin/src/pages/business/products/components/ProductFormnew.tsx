import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import {
  Form,
  Steps,
  Space,
  message,
  Upload,
  Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { 
  ProductDetailResp, 
  SaveProductReq,
  ProductAttrsInfo,
  ProductSKU,
  ProductDetailInfo,
  ProductSPU
} from '../types';
import { ProductStatus } from '../constants';
import AdminButton from '../../../../components/common/AdminButton';
import BasicInfoStep from './BasicInfoStep';
import AttributesEditor from './AttributesEditor';
import SpecificationEditor from './SpecificationEditor';
import SKUManager, { SKUItem } from './SKUManager';
import {
  extractBasicAttributes,
  extractSaleAttributes,
  extractSpecifications,
  extractSkus,
  parseImageUrls,
  convertSkuToItem,
  convertItemToSku,
  formatPriceToString,
  buildBasicAttr,
  buildSaleAttr,
  buildSpecAttr,
} from './ProductForm.utils';
import { useCategoryStore } from '../../../../store/categoryStore';
import { commonApiService } from '../../../../services/api/commonApiService';
import { productApi } from '../../../../services/api/productApi';
import styles from './ProductFormnew.module.scss';

// 使用动态导入延迟加载 ProductDetailEditor，避免 react-quill 的 findDOMNode 警告
const ProductDetailEditor = lazy(() => import('./ProductDetailEditor'));

interface CategoryOption {
  value: number;
  label: string;
  code: string;
  children?: CategoryOption[];
}

interface ProductFormnewProps {
  // 商品详情数据（新增时传入 null 或 undefined）
  product?: ProductDetailResp | null;
  onCancel: () => void;
  onSuccess: () => void;
  // 模式：'view' 查看模式（只读），'add' 新增模式，'edit' 编辑模式（可编辑），默认为 'edit'
  mode?: 'view' | 'add' | 'edit';
}

/**
 * 创建空的商品数据
 */
const createEmptyProductData = (): SaveProductReq => {
  return {
    spu: {
      id: 0,
      code: '',
      name: '',
      category1Id: 0,
      category1Code: '',
      totalSales: 0,
      totalStock: 0,
      price: '0',
      status: ProductStatus.DRAFT,
    },
    attrs: {
      base_attrs: [],
      sale_attrs: [],
      spec_attrs: [],
    },
    skus: [],
    details: undefined,
  };
};

/**
 * 从 ProductDetailResp 初始化数据
 * 根据 mode 确定初始化逻辑：
 * - add: 新增模式，始终返回空数据（即使传入了 product）
 * - view: 查看模式，如果有 product 则加载，否则返回空数据
 * - edit: 编辑模式，如果有 product 则加载，否则返回空数据
 */
const initializeProductData = (
  product: ProductDetailResp | null | undefined,
  mode: 'view' | 'add' | 'edit' = 'edit'
): SaveProductReq => {
  // 新增模式：始终返回空数据（即使传入了 product）
  if (mode === 'add') {
    return createEmptyProductData();
  }

  // 非新增模式（view 或 edit）：需要将 product 数据转换为 SaveProductReq 数据
  // 如果没有 product，返回空数据
  if (!product) {
    return createEmptyProductData();
  }

  // 有 product 时，转换为 SaveProductReq 格式
  // ProductDetailResp 结构：包含完整的 spu、attrs、skus、details
  const saveProductReq: SaveProductReq = {
    spu: product.spu,
    attrs: product.attrs || {
      base_attrs: [],
      sale_attrs: [],
      spec_attrs: [],
    },
    skus: product.skus || [],
    details: product.details,
  };
  
  return saveProductReq;
};

/**
 * 重构后的商品表单组件
 * 在组件内部管理 SaveProductReq 数据，通过回调函数与子组件通信
 */
const ProductFormnew: React.FC<ProductFormnewProps> = ({ 
  product, 
  onCancel, 
  onSuccess, 
  mode = 'edit' 
}) => {
  const isViewMode = mode === 'view';
  const isAddMode = mode === 'add';
  const isEditMode = mode === 'edit';
  const isEditOrViewMode = isEditMode || isViewMode;

  // 表单实例
  const [form] = Form.useForm();

  // 步骤管理
  const [currentStep, setCurrentStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // 分类选择相关
  const { productCategories: categoryTree, fetchProductCategories, hasHydrated } = useCategoryStore();
  const [category1Options, setCategory1Options] = useState<CategoryOption[]>([]);
  const [category2Options, setCategory2Options] = useState<CategoryOption[]>([]);
  const [category3Options, setCategory3Options] = useState<CategoryOption[]>([]);

  // 图片上传相关（临时状态，上传完成后会更新到 productData.spu.images）
  const [uploadingMainImage, setUploadingMainImage] = useState<any>(null);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState<any[]>([]);

  // 用于获取SKUManager组件中最新的SKU列表
  const getLatestSkuListRef = useRef<(() => SKUItem[]) | null>(null);
  // 控制SKUManager是否根据规格自动生成所有SKU
  // 初始化：如果有后端数据（编辑/查看模式），则使用后端数据，不自动生成；新增模式则自动生成
  const [autoGenerateSkus, setAutoGenerateSkus] = useState<boolean>(() => {
    // 如果是新增模式，默认自动生成
    if (mode === 'add') {
      return true;
    }
    // 如果是编辑/查看模式，检查是否有后端 SKU 数据
    if (product?.skus && product.skus.length > 0) {
      return false; // 有后端数据，不自动生成，直接回显
    }
    return true; // 没有后端数据，自动生成
  });

  // 步骤配置
  const steps = [
    {
      title: '基本信息',
      key: 'basic',
      description: '填写商品基本信息和图片',
    },
    {
      title: '属性设置',
      key: 'attributes',
      description: '设置基础属性和销售属性',
    },
    {
      title: '规格与SKU',
      key: 'specifications',
      description: '设置商品规格并管理SKU',
    },
    {
      title: '商品详情',
      key: 'product-details',
      description: '编辑商品详情页',
    },
  ];

  // 核心数据：以 SaveProductReq 结构存储
  const [productData, setProductData] = useState<SaveProductReq>(() => {
    return initializeProductData(product, mode);
  });

  // 使用 ref 存储最新的数据，确保在异步操作中获取到最新值
  const productDataRef = useRef<SaveProductReq>(productData);

  // 同步 ref
  useEffect(() => {
    productDataRef.current = productData;
  }, [productData]);

  // 初始化：当外部传入的 product 或 mode 变化时，重新加载数据
  useEffect(() => {
    const newData = initializeProductData(product, mode);
    setProductData(newData);
    
    // 根据是否有后端 SKU 数据来设置 autoGenerateSkus
    if (newData.skus && newData.skus.length > 0) {
      // 有后端数据，不自动生成，直接回显
      setAutoGenerateSkus(false);
    } else if (isAddMode) {
      // 新增模式且没有数据，自动生成
      setAutoGenerateSkus(true);
    }
    
    // 如果是编辑或查看模式，初始化表单数据
    if (isEditOrViewMode && newData.spu.id > 0) {
      const spu = newData.spu;
      const priceValue = spu.price ? parseFloat(spu.price) : undefined;
      const realPriceValue = spu.realPrice ? parseFloat(spu.realPrice) : undefined;
      
      form.setFieldsValue({
        name: spu.name || '',
        category1Id: spu.category1Id,
        category1Code: spu.category1Code || '',
        category2Id: spu.category2Id && spu.category2Id !== 0 ? spu.category2Id : undefined,
        category2Code: spu.category2Code || undefined,
        category3Id: spu.category3Id && spu.category3Id !== 0 ? spu.category3Id : undefined,
        category3Code: spu.category3Code || undefined,
        brand: spu.brand || '',
        description: spu.description || '',
        price: priceValue,
        realPrice: realPriceValue,
      });
    } else if (isAddMode) {
      // 新增模式：清空表单
      form.resetFields();
    }
  }, [product, mode, form, isEditOrViewMode, isAddMode]);

  // ========== 回调函数：用于子组件更新和获取数据 ==========

  /**
   * 更新商品数据（支持部分更新）
   * 可以更新 SPU、attrs、skus、details 中的任意部分
   */
  const onUpdateProduct = useCallback((updates: Partial<SaveProductReq>) => {
    setProductData(prev => {
      const updated: SaveProductReq = { ...prev };

      // 更新 SPU（支持部分更新）
      if (updates.spu) {
        updated.spu = {
          ...prev.spu,
          ...updates.spu,
        };
      }

      // 更新属性数据
      if (updates.attrs !== undefined) {
        updated.attrs = updates.attrs;
      }

      // 更新 SKU 列表
      if (updates.skus !== undefined) {
        updated.skus = updates.skus;
      }

      // 更新商品详情
      if (updates.details !== undefined) {
        updated.details = updates.details;
      }

      return updated;
    });
  }, []);

  /**
   * 获取完整的 SaveProductReq 数据
   */
  const getProductData = useCallback((): SaveProductReq => {
    return productDataRef.current;
  }, []);

  /**
   * 构建用于保存的 SaveProductReq（用于暂存或提交）
   */
  const buildSaveRequest = useCallback((isDraft: boolean = false): SaveProductReq => {
    const currentData = productDataRef.current;
    
    return {
      spu: {
        ...currentData.spu,
        status: isDraft ? ProductStatus.DRAFT : ProductStatus.PENDING,
      },
      attrs: currentData.attrs,
      skus: currentData.skus,
      details: currentData.details,
    };
  }, []);

  // 步骤切换处理
  const handleStepChange = (step: number) => {
    if (step >= 0 && step < steps.length) {
      // 查看模式下可以自由切换步骤，编辑模式下只允许跳转到最大到达步骤及之前的步骤
      if (!isViewMode && step > maxReachedStep) {
        message.warning('请先完成前面的步骤');
        return;
      }
      setCurrentStep(step);
    }
  };

  // 下一步
  const handleNext = async () => {
    try {
      // 验证当前步骤的表单字段
      const currentStepKey = steps[currentStep].key;
      if (currentStepKey === 'basic') {
        // 验证基本信息必填字段
        await form.validateFields(['name', 'category1Id']);
      }
      
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        // 更新最大到达步骤
        if (nextStep > maxReachedStep) {
          setMaxReachedStep(nextStep);
        }
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('请先完成当前步骤的必填项');
      }
    }
  };

  // 处理取消操作
  const handleCancel = async () => {
    onCancel();
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ========== 分类选择逻辑 ==========

  // 商品目录：优先使用 store 缓存
  useEffect(() => {
    if (!hasHydrated) return;
    if (categoryTree.length > 0) return;
    fetchProductCategories();
  }, [hasHydrated, categoryTree.length, fetchProductCategories]);

  // 当分类树数据变化时，更新分类选项
  useEffect(() => {
    if (categoryTree.length > 0) {
      const options = categoryTree.map(cat => ({
        value: cat.id,
        label: cat.name,
        code: (cat as any).code || (cat as any).url || '',
      }));
      setCategory1Options(options);
    }
  }, [categoryTree]);

  // 当分类树加载完成且是编辑/查看模式时，加载对应的二级和三级分类选项
  useEffect(() => {
    const spu = getProductData().spu;
    if (categoryTree.length > 0 && spu?.category1Id) {
      loadCategory2Options(spu.category1Id);
      if (spu.category2Id) {
        loadCategory3Options(spu.category2Id);
      }
    }
  }, [categoryTree, productData]);

  // 加载二级分类选项
  const loadCategory2Options = useCallback((category1Id: number) => {
    const category1 = categoryTree.find(cat => cat.id === category1Id);
    if (category1?.children) {
      const options = category1.children.map(child => ({
        value: child.id,
        label: child.name,
        code: (child as any).code || (child as any).url || '',
        children: child.children?.map(grandchild => ({
          value: grandchild.id,
          label: grandchild.name,
          code: (grandchild as any).code || (grandchild as any).url || '',
        })),
      }));
      setCategory2Options(options);
    } else {
      setCategory2Options([]);
    }
    setCategory3Options([]);
  }, [categoryTree]);

  // 加载三级分类选项
  const loadCategory3Options = useCallback((category2Id: number) => {
    const category2 = categoryTree
      .flatMap(cat => cat.children || [])
      .find(child => child.id === category2Id);
    
    if (category2?.children) {
      const options = category2.children.map(child => ({
        value: child.id,
        label: child.name,
        code: (child as any).code || (child as any).url || '',
      }));
      setCategory3Options(options);
    } else {
      setCategory3Options([]);
    }
  }, [categoryTree]);

  // 处理一级分类变化
  const handleCategory1Change = useCallback((value: number) => {
    const category1 = category1Options.find(opt => opt.value === value);
    form.setFieldsValue({
      category1Code: category1?.code || '',
      category2Id: undefined,
      category2Code: undefined,
      category3Id: undefined,
      category3Code: undefined,
    });
    loadCategory2Options(value);
    // 更新 productData（使用 Partial 类型）
    const currentData = getProductData();
    onUpdateProduct({
      spu: {
        ...currentData.spu,
        category1Id: value,
        category1Code: category1?.code || '',
        category2Id: undefined,
        category2Code: undefined,
        category3Id: undefined,
        category3Code: undefined,
      },
    });
  }, [form, category1Options, loadCategory2Options, onUpdateProduct, getProductData]);

  // 处理二级分类变化
  const handleCategory2Change = useCallback((value: number) => {
    const category2 = category2Options.find(opt => opt.value === value);
    form.setFieldsValue({
      category2Code: category2?.code || '',
      category3Id: undefined,
      category3Code: undefined,
    });
    loadCategory3Options(value);
    // 更新 productData
    const currentData = getProductData();
    onUpdateProduct({
      spu: {
        ...currentData.spu,
        category2Id: value,
        category2Code: category2?.code || '',
        category3Id: undefined,
        category3Code: undefined,
      },
    });
  }, [form, category2Options, loadCategory3Options, onUpdateProduct, getProductData]);

  // 处理三级分类变化
  const handleCategory3Change = useCallback((value: number) => {
    const category3 = category3Options.find(opt => opt.value === value);
    form.setFieldsValue({
      category3Code: category3?.code || '',
    });
    // 更新 productData
    const currentData = getProductData();
    onUpdateProduct({
      spu: {
        ...currentData.spu,
        category3Id: value,
        category3Code: category3?.code || '',
      },
    });
  }, [form, category3Options, onUpdateProduct, getProductData]);

  // ========== 图片上传逻辑 ==========

  // 从 SPU images 转换为 UploadFile[]（主图）
  const getMainImageFileList = useCallback((): UploadFile[] => {
    const spu = productData.spu;
    const imageUrls = parseImageUrls(spu?.images || '');
    
    if (imageUrls.length > 0) {
      return [{
        uid: `main-${imageUrls[0]}`,
        name: 'main-image',
        status: 'done' as const,
        url: imageUrls[0],
      }];
    }
    
    if (uploadingMainImage) {
      return [uploadingMainImage];
    }
    
    return [];
  }, [productData, uploadingMainImage]);

  // 从 SPU images 转换为 UploadFile[]（附加图片）
  const getAdditionalImageFileList = useCallback((): UploadFile[] => {
    const spu = productData.spu;
    const imageUrls = parseImageUrls(spu?.images || '');
    
    const additionalImages = imageUrls.slice(1).map((url: string, index: number) => ({
      uid: `additional-${index}-${url}`,
      name: `image-${index + 2}`,
      status: 'done' as const,
      url: url.trim(),
    }));
    
    return [...additionalImages, ...uploadingAdditionalImages];
  }, [productData, uploadingAdditionalImages]);

  // 主图上传处理
  const handleMainImageUpload = async (file: File): Promise<string> => {
    try {
      console.info("新处理模式图片上传: "+file.name)
      const currentData = getProductData();
      const uploadOptions: { category: string; folder: string; businessType?: string; businessId?: string } = {
        category: 'image',
        folder: 'products',
      };
      
      // 编辑模式下，如果有SPU ID，传递业务信息
      if (currentData.spu.id && currentData.spu.id > 0) {
        uploadOptions.businessType = 'product';
        uploadOptions.businessId = currentData.spu.id.toString();
      }
      
      const fileInfo = await commonApiService.uploadFile(file, uploadOptions);
      return fileInfo.url;
    } catch (error: any) {
      console.error('主图上传失败:', error);
      throw new Error(error.message || '图片上传失败，请重试');
    }
  };

  // 主图上传配置
  const mainImageUploadProps: UploadProps = {
    fileList: getMainImageFileList(),
    listType: 'picture-card',
    maxCount: 1,
    accept: 'image/*',
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!');
        return false;
      }

      const uploadFile: UploadFile = {
        uid: `upload-${Date.now()}`,
        name: file.name,
        status: 'uploading',
        percent: 0,
        originFileObj: file,
      };
      setUploadingMainImage(uploadFile);

      try {
        const url = await handleMainImageUpload(file);
        const currentData = getProductData();
        const currentImages = parseImageUrls(currentData.spu.images || '');
        const additionalImages = currentImages.slice(1);
        const newImages = [url, ...additionalImages];
        
        onUpdateProduct({
          spu: {
            ...currentData.spu,
            images: JSON.stringify(newImages),
          },
        });
        
        setUploadingMainImage(null);
        message.success('主图上传成功');
      } catch (error: any) {
        console.error('上传过程中出错:', error);
        setUploadingMainImage(null);
        message.error(error.message || '图片上传失败');
      }

      return false;
    },
    onRemove: async (file) => {
      if (!file.url) {
        setUploadingMainImage(null);
        return true;
      }

      const currentData = getProductData();
      const currentImages = parseImageUrls(currentData.spu.images || '');
      
      if (!currentImages.includes(file.url)) {
        setUploadingMainImage(null);
        return true;
      }

      try {
        // 如果商品ID存在，传入业务类型和业务ID
        const deleteOptions: { urls: string[]; businessType?: string; businessId?: string } = {
          urls: [file.url],
        };
        if (currentData.spu.id && currentData.spu.id > 0) {
          deleteOptions.businessType = 'product';
          deleteOptions.businessId = currentData.spu.id.toString();
        }
        
        await commonApiService.deleteFiles(deleteOptions);
        const updatedImages = currentImages.filter(img => img !== file.url);
        const updatedImagesStr = updatedImages.length > 0 ? JSON.stringify(updatedImages) : undefined;
        
        onUpdateProduct({
          spu: {
            ...currentData.spu,
            images: updatedImagesStr,
          },
        });
        
        message.success('图片删除成功');
        return true;
      } catch (error: any) {
        console.error('删除图片失败:', error);
        message.error(error.message || '删除图片失败');
        return false;
      }
    },
  };

  // 附加图片上传处理
  const handleAdditionalImageUpload = async (file: File): Promise<string> => {
    try {
      const currentData = getProductData();
      const uploadOptions: { category: string; folder: string; businessType?: string; businessId?: string } = {
        category: 'image',
        folder: 'products',
      };
      
      // 编辑模式下，如果有SPU ID，传递业务信息
      if (isEditMode && currentData.spu.id && currentData.spu.id > 0) {
        uploadOptions.businessType = 'product';
        uploadOptions.businessId = currentData.spu.id.toString();
      }
      
      const fileInfo = await commonApiService.uploadFile(file, uploadOptions);
      return fileInfo.url;
    } catch (error: any) {
      console.error('附加图片上传失败:', error);
      throw new Error(error.message || '图片上传失败，请重试');
    }
  };

  // 附加图片上传配置
  const additionalImageUploadProps: UploadProps = {
    fileList: getAdditionalImageFileList(),
    listType: 'picture-card',
    maxCount: 8,
    accept: 'image/*',
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!');
        return false;
      }

      const uploadFile: UploadFile = {
        uid: `upload-${Date.now()}-${Math.random()}`,
        name: file.name,
        status: 'uploading',
        percent: 0,
        originFileObj: file,
      };
      setUploadingAdditionalImages(prev => [...prev, uploadFile]);

      try {
        const url = await handleAdditionalImageUpload(file);
        const currentData = getProductData();
        const currentImages = parseImageUrls(currentData.spu.images || '');
        const mainImage = currentImages.length > 0 ? [currentImages[0]] : [];
        const newImages = [...mainImage, ...currentImages.slice(1), url];
        
        onUpdateProduct({
          spu: {
            ...currentData.spu,
            images: JSON.stringify(newImages),
          },
        });
        
        setUploadingAdditionalImages(prev => prev.filter(item => item.uid !== uploadFile.uid));
        message.success('图片上传成功');
      } catch (error: any) {
        setUploadingAdditionalImages(prev => prev.filter(item => item.uid !== uploadFile.uid));
        message.error(error.message || '图片上传失败');
      }

      return false;
    },
    onRemove: async (file) => {
      if (!file.url) {
        setUploadingAdditionalImages(prev => prev.filter(item => item.uid !== file.uid));
        return true;
      }

      const currentData = getProductData();
      const currentImages = parseImageUrls(currentData.spu.images || '');
      
      if (!currentImages.includes(file.url)) {
        setUploadingAdditionalImages(prev => prev.filter(item => item.uid !== file.uid));
        return true;
      }

      try {
        // 如果商品ID存在，传入业务类型和业务ID
        const deleteOptions: { urls: string[]; businessType?: string; businessId?: string } = {
          urls: [file.url],
        };
        if (currentData.spu.id && currentData.spu.id > 0) {
          deleteOptions.businessType = 'product';
          deleteOptions.businessId = currentData.spu.id.toString();
        }
        
        await commonApiService.deleteFiles(deleteOptions);
        const updatedImages = currentImages.filter(img => img !== file.url);
        const updatedImagesStr = updatedImages.length > 0 ? JSON.stringify(updatedImages) : undefined;
        
        onUpdateProduct({
          spu: {
            ...currentData.spu,
            images: updatedImagesStr,
          },
        });
        
        message.success('图片删除成功');
        return true;
      } catch (error: any) {
        console.error('删除图片失败:', error);
        message.error(error.message || '删除图片失败');
        return false;
      }
    },
  };

  // ========== 表单字段变化监听 ==========

  // 处理表单字段变化，同步更新 productData
  const handleFormValuesChange = useCallback((changedValues: any, allValues: any) => {
    const currentData = getProductData();
    const priceStr = formatPriceToString(allValues.price);
    const realPriceStr = formatPriceToString(allValues.realPrice);
    
    onUpdateProduct({
      spu: {
        ...currentData.spu,
        name: allValues.name || '',
        category1Id: allValues.category1Id || 0,
        category1Code: allValues.category1Code || '',
        category2Id: allValues.category2Id,
        category2Code: allValues.category2Code,
        category3Id: allValues.category3Id,
        category3Code: allValues.category3Code,
        brand: allValues.brand || '',
        description: allValues.description || '',
        price: priceStr || '0',
        realPrice: realPriceStr,
      },
    });
  }, [getProductData, onUpdateProduct]);

  // 根据最大到达步骤生成步骤配置
  const getStepItems = () => {
    return steps.map((step, index) => ({
      ...step,
      disabled: index > maxReachedStep,
    }));
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    const step = steps[currentStep];
    const currentData = getProductData();
    
    switch (step.key) {
      case 'basic':
        return (
          <BasicInfoStep
            form={form}
            spu={currentData.spu}
            disabled={isViewMode}
            category1Options={category1Options}
            category2Options={category2Options}
            category3Options={category3Options}
            onCategory1Change={handleCategory1Change}
            onCategory2Change={handleCategory2Change}
            onCategory3Change={handleCategory3Change}
            mainImageFileList={getMainImageFileList()}
            additionalImageFileList={getAdditionalImageFileList()}
            mainImageUploadProps={mainImageUploadProps}
            additionalImageUploadProps={additionalImageUploadProps}
          />
        );
      case 'attributes':
        return (
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>属性设置</h4>
            <p className={styles.sectionDescription}>
              设置商品的基础属性和销售属性，这些属性将用于商品展示和搜索
            </p>
            <AttributesEditor
              basicAttributes={extractBasicAttributes(currentData.attrs)}
              saleAttributes={extractSaleAttributes(currentData.attrs)}
              onBasicAttributesChange={(basicAttrs) => {
                // 需要将编辑器格式转换为后端格式
                const productId = currentData.spu.id || 0;
                const productCode = currentData.spu.code || '';
                const basicAttr = buildBasicAttr(basicAttrs, productId, productCode, 0);
                const baseAttrs = basicAttr ? [basicAttr] : [];
                
                onUpdateProduct({
                  attrs: {
                    ...currentData.attrs,
                    base_attrs: baseAttrs,
                  },
                });
              }}
              onSaleAttributesChange={(saleAttrs) => {
                const productId = currentData.spu.id || 0;
                const productCode = currentData.spu.code || '';
                const saleAttr = buildSaleAttr(saleAttrs, productId, productCode, 0);
                const saleAttrsList = saleAttr ? [saleAttr] : [];
                
                onUpdateProduct({
                  attrs: {
                    ...currentData.attrs,
                    sale_attrs: saleAttrsList,
                  },
                });
              }}
              disabled={isViewMode}
              productId={currentData.spu.id}
              productCode={currentData.spu.code}
            />
          </div>
        );
      case 'specifications':
        return (
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>规格与SKU管理</h4>
            <p className={styles.sectionDescription}>
              设置商品规格属性，系统将根据规格组合自动生成SKU，您可以为每个SKU设置独立的价格和库存
            </p>
            <div className={styles.specAndSkuContainer}>
              <SpecificationEditor
                value={extractSpecifications(currentData.attrs)}
                onChange={(newSpecs) => {
                  const productId = currentData.spu.id || 0;
                  const productCode = currentData.spu.code || '';
                  const specAttr = buildSpecAttr(newSpecs, productId, productCode, 0);
                  const specAttrs = specAttr ? [specAttr] : [];
                  
                  onUpdateProduct({
                    attrs: {
                      ...currentData.attrs,
                      spec_attrs: specAttrs,
                    },
                  });
                  
                  setAutoGenerateSkus(true);
                }}
                disabled={isViewMode}
                categoryId={form.getFieldValue('category3Id') || form.getFieldValue('category2Id') || form.getFieldValue('category1Id')}
              />
              <SKUManager
                specifications={extractSpecifications(currentData.attrs)}
                skus={currentData.skus ? currentData.skus.map(convertSkuToItem) : []}
                onChange={(newSkus) => {
                  const productId = currentData.spu.id || 0;
                  const productCode = currentData.spu.code || '';
                  const skus = newSkus.map(sku => {
                    const existingSku = currentData.skus?.find(s => s.indexs === sku.indexs);
                    return convertItemToSku(sku, productId, productCode, existingSku);
                  });
                  
                  onUpdateProduct({
                    skus,
                  });
                }}
                disabled={isViewMode}
                productName={form.getFieldValue('name') || ''}
                onSkuListRef={(getSkuList) => {
                  getLatestSkuListRef.current = getSkuList;
                }}
                autoGenerate={autoGenerateSkus}
              />
            </div>
          </div>
        );
      case 'product-details':
        return (
          <div className={styles.formSection}>
            <Suspense fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" tip="加载编辑器..." />
              </div>
            }>
              <ProductDetailEditor
                value={currentData.details}
                onChange={(details) => {
                  onUpdateProduct({
                    details,
                  });
                }}
                disabled={isViewMode}
                productSpuId={currentData.spu.id || 0}
                productSpuCode={currentData.spu.code || ''}
              />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className={styles.comingSoon}>功能开发中...</div>
        );
    }
  };

  // 暂存功能
  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      
      // 构建暂存数据
      const saveData = buildSaveRequest(true);
      console.log('暂存数据:', saveData);
      
      // 调用后端 API 保存商品（暂存）
      const response = await productApi.saveProduct(saveData);
      
      if (response.code === 0 && response.data) {
        // 使用后端返回的完整 ProductDetailResp 更新本地状态
        const savedProductDetail: ProductDetailResp = response.data;
        
        // 更新 productData
        setProductData({
          spu: savedProductDetail.spu,
          attrs: savedProductDetail.attrs || {
            base_attrs: [],
            sale_attrs: [],
            spec_attrs: [],
          },
          skus: savedProductDetail.skus || [],
          details: savedProductDetail.details,
        });
        
        // 如果有后端返回的 SKU 数据，设置为不自动生成，直接回显
        if (savedProductDetail.skus && savedProductDetail.skus.length > 0) {
          setAutoGenerateSkus(false);
        }
        
        // 同步更新表单数据（如果有新的字段）
        const spu = savedProductDetail.spu;
        if (spu.id > 0) {
          const priceValue = spu.price ? parseFloat(spu.price) : undefined;
          const realPriceValue = spu.realPrice ? parseFloat(spu.realPrice) : undefined;
          
          form.setFieldsValue({
            name: spu.name || '',
            category1Id: spu.category1Id,
            category1Code: spu.category1Code || '',
            category2Id: spu.category2Id && spu.category2Id !== 0 ? spu.category2Id : undefined,
            category2Code: spu.category2Code || undefined,
            category3Id: spu.category3Id && spu.category3Id !== 0 ? spu.category3Id : undefined,
            category3Code: spu.category3Code || undefined,
            brand: spu.brand || '',
            description: spu.description || '',
            price: priceValue,
            realPrice: realPriceValue,
          });
        }
        
        message.success('暂存成功');
      } else {
        throw new Error(response.message || '暂存失败');
      }
    } catch (error: any) {
      console.error('暂存商品失败:', error);
      message.error(error.message || '暂存失败');
    } finally {
      setSavingDraft(false);
    }
  };

  // 提交功能
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // 构建提交数据
      const saveData = buildSaveRequest(false);
      console.log('提交数据:', saveData);
      
      // 调用后端 API 保存商品（提交）
      const response = await productApi.saveProduct(saveData);
      
      if (response.code === 0 && response.data) {
        message.success(isAddMode ? '添加成功' : '编辑成功');
        onSuccess();
      } else {
        throw new Error(response.message || '保存失败');
      }
    } catch (error: any) {
      console.error('保存商品失败:', error);
      message.error(error.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.productForm}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormValuesChange}
      >
        {/* 步骤条 */}
        <div style={{ marginBottom: 32 }}>
          <Steps 
            current={currentStep} 
            items={isViewMode ? steps.map((step, index) => ({ ...step, disabled: false })) : getStepItems()} 
            onChange={handleStepChange}
          />
        </div>

        {/* 步骤内容 */}
        <div className={styles.stepContent}>
          {renderStepContent()}
        </div>
      </Form>

      {/* 底部操作按钮 */}
      <div className={styles.formFooter}>
        <Space>
          <AdminButton variant="cancel" onClick={handleCancel}>
            {isViewMode ? '关闭' : '取消'}
          </AdminButton>
          {isViewMode ? (
            // 查看模式：显示上一步和下一步按钮
            <>
              {currentStep > 0 && (
                <AdminButton variant="prev" onClick={handlePrev}>
                  上一步
                </AdminButton>
              )}
              {currentStep < steps.length - 1 && (
                <AdminButton variant="next" onClick={handleNext}>
                  下一步
                </AdminButton>
              )}
            </>
          ) : (
            // 编辑/新增模式：显示完整的操作按钮
            <>
              {currentStep > 0 && (
                <AdminButton variant="prev" onClick={handlePrev}>
                  上一步
                </AdminButton>
              )}
              <AdminButton 
                variant="draft"
                loading={savingDraft} 
                onClick={handleSaveDraft}
              >
                暂存
              </AdminButton>
              {currentStep < steps.length - 1 ? (
                <AdminButton variant="next" onClick={handleNext}>
                  下一步
                </AdminButton>
              ) : (
                <AdminButton 
                  variant="save" 
                  loading={loading} 
                  onClick={handleSubmit}
                >
                  {isAddMode ? '添加商品' : '发布商品'}
                </AdminButton>
              )}
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default ProductFormnew;
