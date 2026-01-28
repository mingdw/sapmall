import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Steps,
  Row,
  Col,
  InputNumber,
  Space,
} from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { productApi } from '../../../../services/api/productApi';
import type { ProductSPU, ProductSKU, SaveProductReq, ProductDetailResp, ProductAttrsInfo, ProductAttrParamInfo } from '../types';
import {
  parseImageUrls,
  convertSkuToItem,
  extractBasicAttributes,
  extractSaleAttributes,
  extractSpecifications,
  extractSkus,
  formatPriceToString,
  buildBasicAttr,
  buildSaleAttr,
  buildSpecAttr,
  convertItemToSku,
} from './ProductForm.utils';
import { ProductStatus } from '../constants';
import AdminButton from '../../../../components/common/AdminButton';
import AttributeEditor, { AttributeItem } from './AttributeEditor';
import SpecificationEditor from './SpecificationEditor';
import SKUManager, { SKUItem } from './SKUManager';
import { useCategoryStore } from '../../../../store/categoryStore';
import styles from './ProductForm.module.scss';

const { TextArea } = Input;

interface ProductFormProps {
  // 兼容：列表页旧结构（ProductSPU）与详情接口新结构（ProductDetailResp）
  product?: ProductSPU | ProductDetailResp | null;
  onCancel: () => void;
  onSuccess: () => void;
  // 模式：'view' 查看模式（只读），'edit' 编辑模式（可编辑），默认为 'edit'
  mode?: 'view' | 'edit';
}

interface CategoryOption {
  value: number;
  label: string;
  code: string;
  children?: CategoryOption[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onCancel, onSuccess, mode = 'edit' }) => {
  const isViewMode = mode === 'view';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 使用 store 中的商品目录数据（menu_type=0）
  const { productCategories: categoryTree, fetchProductCategories, hasHydrated } = useCategoryStore();
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [category2Options, setCategory2Options] = useState<CategoryOption[]>([]);
  const [category3Options, setCategory3Options] = useState<CategoryOption[]>([]);
  const [mainImageFileList, setMainImageFileList] = useState<UploadFile[]>([]);
  const [additionalImageFileList, setAdditionalImageFileList] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [basicAttributes, setBasicAttributes] = useState<Record<string, string>>({});
  const [saleAttributes, setSaleAttributes] = useState<Record<string, string>>({});
  const [specifications, setSpecifications] = useState<Record<string, string[]>>({});
  const [skuList, setSkuList] = useState<SKUItem[]>([]);
  // 用于获取SKUManager组件中最新的SKU列表
  const getLatestSkuListRef = useRef<(() => SKUItem[]) | null>(null);
  // 跟踪最大到达的步骤索引（通过"下一步"按钮到达的最远步骤）
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  // 保存当前商品的完整信息（用于暂存后更新）
  const [currentProduct, setCurrentProduct] = useState<ProductSPU | ProductDetailResp | null>(null);
  // 标记属性是否已加载（确保只加载一次）
  const [attributesLoaded, setAttributesLoaded] = useState(false);
  // 标记规格数据是否已加载（确保只加载一次）
  const [specificationsLoaded, setSpecificationsLoaded] = useState(false);

  const isDetailResp = (p: any): p is ProductDetailResp => {
    return !!p && typeof p === 'object' && 'spu' in p;
  };

  const getSpuFromProp = (p: ProductFormProps['product']): ProductSPU | null => {
    if (!p) return null;
    if (isDetailResp(p)) return p.spu || null;
    return p as ProductSPU;
  };

  const getAttrsFromProp = (p: ProductFormProps['product']): ProductAttrsInfo | null => {
    if (!p) return null;
    if (isDetailResp(p)) return p.attrs || null;
    return null;
  };

  // 从 currentProduct 中安全获取 SPU 信息
  const getSpuFromCurrentProduct = (): ProductSPU | null => {
    if (!currentProduct) return null;
    if (isDetailResp(currentProduct)) return currentProduct.spu || null;
    return currentProduct as ProductSPU;
  };

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

  // 商品目录：优先使用 store 缓存；仅在缓存为空且 persist 已回放完成后，才触发获取（避免页面加载即打接口）
  useEffect(() => {
    if (!hasHydrated) return;
    if (categoryTree.length > 0) return;
    fetchProductCategories(); // 获取商品目录（menu_type=0）
  }, [hasHydrated, categoryTree.length, fetchProductCategories]);

  // 当分类树加载完成且是编辑模式时，加载对应的二级和三级分类选项
  useEffect(() => {
    const spuFromCurrent = getSpuFromCurrentProduct();
    const prod = spuFromCurrent || getSpuFromProp(product);
    if (categoryTree.length > 0 && prod?.category1Id) {
      loadCategory2Options(prod.category1Id);
      if (prod.category2Id) {
        loadCategory3Options(prod.category2Id);
      }
    }
  }, [categoryTree, currentProduct, product]);

  // 控制连线显示：隐藏从 maxReachedStep 到下一个 wait 步骤的连线
  useEffect(() => {
    const timer = setTimeout(() => {
      const stepsContainer = document.querySelector('.ant-steps');
      if (!stepsContainer) return;
      
      const stepsItems = Array.from(stepsContainer.querySelectorAll('.ant-steps-item'));
      stepsItems.forEach((item, index) => {
        // 移除之前的 no-tail 类
        item.classList.remove('no-tail');
        
        // 如果是 maxReachedStep，且下一个步骤是 wait，添加 no-tail 类
        if (index === maxReachedStep && index < steps.length - 1) {
          const nextItem = stepsItems[index + 1];
          if (nextItem && nextItem.classList.contains('ant-steps-item-wait')) {
            item.classList.add('no-tail');
          }
        }
      });
    }, 0);
    
    return () => clearTimeout(timer);
  }, [currentStep, maxReachedStep, steps.length]);

  // 当外部product prop变化时，更新currentProduct
  useEffect(() => {
    // 如果是完整的 ProductDetailResp，直接设置到 currentProduct
    if (product && isDetailResp(product)) {
      console.log('ProductForm: product prop 更新，设置完整的 ProductDetailResp:', product);
      setCurrentProduct(product);
      
      // 从完整的明细数据中回显属性
      if (product.attrs) {
        try {
          setBasicAttributes(extractBasicAttributes(product.attrs));
          setSaleAttributes(extractSaleAttributes(product.attrs));
          setAttributesLoaded(true);
        } catch (e) {
          console.error('从明细接口 attrs 回显失败:', e);
        }
      }
      
      // 从完整的明细数据中回显规格和SKU
      if (product.skus && product.skus.length > 0) {
        try {
          setSkuList(extractSkus(product));
          setSpecificationsLoaded(true);
        } catch (e) {
          console.error('从明细接口 skus 回显失败:', e);
        }
      }
    } else {
      // 如果只是 ProductSPU，只设置 spu
      const spu = getSpuFromProp(product);
      console.log('ProductForm: product prop 更新，解析到 spu:', spu);
      setCurrentProduct(spu);
    }
  }, [product]);

  // 初始化表单数据（仅当外部传入的product变化时加载，暂存更新currentProduct不触发）
  useEffect(() => {
    // 只有当外部传入product prop时，才加载数据（编辑模式）
    // 暂存成功后更新currentProduct不应该触发这个逻辑
    const spu = getSpuFromProp(product);
    if (spu && spu.id) {
      console.log('初始化表单数据，商品SPU信息:', spu);
      
      // 编辑模式：填充表单数据
      // 注意：price 和 realPrice 后端返回的是 string 类型，需要转换为 number
      // category2Id 和 category3Id 可能是 0，需要使用 !== undefined 和 !== 0 判断
      const priceValue = (spu as any).price 
        ? (typeof (spu as any).price === 'string' ? parseFloat((spu as any).price) : Number((spu as any).price))
        : undefined;
      const realPriceValue = (spu as any).realPrice 
        ? (typeof (spu as any).realPrice === 'string' ? parseFloat((spu as any).realPrice) : Number((spu as any).realPrice))
        : undefined;
      
      // 处理分类ID：如果值为 0，则设置为 undefined（表示未选择）
      const category2IdValue = (spu as any).category2Id !== undefined && (spu as any).category2Id !== 0 
        ? (spu as any).category2Id 
        : undefined;
      const category3IdValue = (spu as any).category3Id !== undefined && (spu as any).category3Id !== 0 
        ? (spu as any).category3Id 
        : undefined;
      
      const formValues = {
        name: spu.name || '',
        category1Id: spu.category1Id,
        category1Code: spu.category1Code || '',
        category2Id: category2IdValue,
        category2Code: spu.category2Code || undefined,
        category3Id: category3IdValue,
        category3Code: spu.category3Code || undefined,
        brand: spu.brand || '',
        description: spu.description || '',
        price: priceValue,
        realPrice: realPriceValue,
      };
      
      console.log('设置表单值:', formValues);
      form.setFieldsValue(formValues);

      // 加载图片
      const imageUrls = parseImageUrls(spu.images);
      if (imageUrls.length > 0) {
        setMainImageFileList([{
          uid: '-1',
          name: 'main-image',
          status: 'done' as const,
          url: imageUrls[0],
        }]);
        if (imageUrls.length > 1) {
          const additionalImages = imageUrls.slice(1).map((url: string, index: number) => ({
            uid: `-${index + 2}`,
            name: `image-${index + 2}`,
            status: 'done' as const,
            url: url.trim(),
          }));
          setAdditionalImageFileList(additionalImages);
        }
      } else {
        setMainImageFileList([]);
        setAdditionalImageFileList([]);
      }

      // 注意：属性数据和规格数据不在初始化时加载，而是在进入对应步骤时加载
      } else if (!product) {
      // 新增模式：清空表单数据
      form.resetFields();
      setMainImageFileList([]);
      setAdditionalImageFileList([]);
      setBasicAttributes({});
      setSaleAttributes({});
      setSpecifications({});
      setSkuList([]);
      setAttributesLoaded(false); // 重置属性加载标志，以便下次进入属性设置步骤时重新加载
      setSpecificationsLoaded(false); // 重置规格加载标志，以便下次进入规格步骤时重新加载
    }
  }, [product, form]); // 只监听 product prop，不监听 currentProduct

  // 当目录缓存回放完成且目录已加载后，若 spu 中 categoryCode 缺失，则根据缓存目录补齐（用于回显）
  useEffect(() => {
    if (!hasHydrated) return;
    if (categoryTree.length === 0) return;
    const spuFromCurrent = getSpuFromCurrentProduct();
    const spu = getSpuFromProp(product) || spuFromCurrent;
    if (!spu) return;

    const findById = (nodes: any[], id?: number): any | null => {
      if (!id) return null;
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children?.length) {
          const found = findById(n.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const c1 = findById(categoryTree as any[], spu.category1Id);
    const c2 = findById(categoryTree as any[], spu.category2Id);
    const c3 = findById(categoryTree as any[], spu.category3Id);

    const code1 = (c1 as any)?.code || (c1 as any)?.url || spu.category1Code || '';
    const code2 = (c2 as any)?.code || (c2 as any)?.url || spu.category2Code;
    const code3 = (c3 as any)?.code || (c3 as any)?.url || spu.category3Code;

    const patch: any = {};
    if (!form.getFieldValue('category1Code') && code1) patch.category1Code = code1;
    if (!form.getFieldValue('category2Code') && code2) patch.category2Code = code2;
    if (!form.getFieldValue('category3Code') && code3) patch.category3Code = code3;

    if (Object.keys(patch).length > 0) {
      form.setFieldsValue(patch);
    }
  }, [hasHydrated, categoryTree.length, product, currentProduct, form]);

  // 当切换到属性设置步骤时，加载属性数据（只加载一次，仅在编辑模式下）
  useEffect(() => {
    const step = steps[currentStep];
    if (step?.key === 'attributes' && !attributesLoaded) {
      const spuFromCurrent = getSpuFromCurrentProduct();
      const productId = spuFromCurrent?.id || getSpuFromProp(product)?.id;
      if (productId) {
        // 编辑模式：加载已有属性
        console.log('切换到属性设置步骤，加载属性数据，商品ID:', productId);
        loadProductAttributes(productId);
        setAttributesLoaded(true);
      } else {
        // 新增模式：标记为已加载（不需要调用接口）
        setAttributesLoaded(true);
      }
    }
  }, [currentStep, attributesLoaded, currentProduct, product]); // 监听 currentStep 和 attributesLoaded

  // 当切换到规格与SKU步骤时，加载规格和SKU数据（只加载一次，仅在编辑模式下）
  useEffect(() => {
    const step = steps[currentStep];
    if (step?.key === 'specifications' && !specificationsLoaded) {
      const spuFromCurrent = getSpuFromCurrentProduct();
      const productId = spuFromCurrent?.id || getSpuFromProp(product)?.id;
      if (productId) {
        // 编辑模式：加载规格和SKU数据
        console.log('切换到规格与SKU步骤，加载规格数据，商品ID:', productId);
        loadProductSpecifications(productId);
        setSpecificationsLoaded(true);
      } else {
        // 新增模式：标记为已加载（不需要调用接口）
        setSpecificationsLoaded(true);
      }
    }
  }, [currentStep, specificationsLoaded, currentProduct, product]); // 监听 currentStep 和 specificationsLoaded

  // 当 product 变化时，重置加载标志
  useEffect(() => {
    if (getSpuFromProp(product)) {
      setAttributesLoaded(false); // 重置标志，以便下次进入属性设置步骤时重新加载
      setSpecificationsLoaded(false); // 重置标志，以便下次进入规格步骤时重新加载
    }
  }, [product]); // 兼容聚合结构

  // 加载商品属性（优先使用 currentProduct 中的数据，避免重复调用接口）
  const loadProductAttributes = async (productId: number) => {
    try {
      // 优先从 currentProduct 中获取属性数据（暂存成功后已包含完整数据）
      const currentDetail = currentProduct || (product && isDetailResp(product) ? product : null);
      if (currentDetail && isDetailResp(currentDetail) && currentDetail.attrs) {
        console.log('从 currentProduct 加载商品属性，商品ID:', productId);
        try {
          setBasicAttributes(extractBasicAttributes(currentDetail.attrs));
          setSaleAttributes(extractSaleAttributes(currentDetail.attrs));
          return; // 成功从本地数据加载，直接返回
        } catch (error) {
          console.error('从 currentProduct 解析属性失败，将调用接口:', error);
        }
      }
      
      // 如果本地没有数据，才调用接口获取
      console.log('调用接口加载商品属性，商品ID:', productId);
      const response = await productApi.getProductDetail(productId);
      if (response.code === 0 && response.data) {
        const detailResp: ProductDetailResp = response.data;
        setCurrentProduct(detailResp);
        setBasicAttributes(extractBasicAttributes(detailResp.attrs));
        setSaleAttributes(extractSaleAttributes(detailResp.attrs));
      }
    } catch (error) {
      console.error('加载商品属性失败:', error);
    }
  };

  // 加载商品规格和SKU数据（优先使用 currentProduct 中的数据，避免重复调用接口）
  const loadProductSpecifications = async (productId: number) => {
    try {
      // 优先从 currentProduct 中获取规格和SKU数据（暂存成功后已包含完整数据）
      const currentDetail = currentProduct || (product && isDetailResp(product) ? product : null);
      if (currentDetail && isDetailResp(currentDetail)) {
        console.log('从 currentProduct 加载商品规格和SKU，商品ID:', productId);
        try {
          setSpecifications(extractSpecifications(currentDetail.attrs));
          if (currentDetail.skus && currentDetail.skus.length > 0) {
            setSkuList(extractSkus(currentDetail));
          }
          return; // 成功从本地数据加载，直接返回
        } catch (error) {
          console.error('从 currentProduct 解析规格和SKU失败，将调用接口:', error);
        }
      }
      
      // 如果本地没有数据，才调用接口获取完整明细
      console.log('调用接口加载商品规格和SKU，商品ID:', productId);
      const response = await productApi.getProductDetail(productId);
      if (response.code === 0 && response.data) {
        const detailResp: ProductDetailResp = response.data;
        setCurrentProduct(detailResp);
        setSpecifications(extractSpecifications(detailResp.attrs));
        setSkuList(extractSkus(detailResp));
      }
    } catch (error) {
      console.error('加载商品规格和SKU失败:', error);
    }
  };

  // 当分类树数据变化时，更新分类选项
  useEffect(() => {
    if (categoryTree.length > 0) {
      // 转换为一级分类选项（只包含一级分类，不包含子级，子级通过联动加载）
      // 注意：categoryTree 可能来自不同的类型定义，需要兼容处理
      const options = categoryTree.map(cat => ({
        value: cat.id,
        label: cat.name,
        code: (cat as any).code || (cat as any).url || '',
      }));
      setCategoryOptions(options);
    }
  }, [categoryTree]);

  // 加载二级分类选项
  const loadCategory2Options = (category1Id: number) => {
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
  };

  // 加载三级分类选项
  const loadCategory3Options = (category2Id: number) => {
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
  };

  // 处理一级分类变化
  const handleCategory1Change = (value: number) => {
    const category1 = categoryOptions.find(opt => opt.value === value);
    form.setFieldsValue({
      category1Code: category1?.code || '',
      category2Id: undefined,
      category2Code: undefined,
      category3Id: undefined,
      category3Code: undefined,
    });
    loadCategory2Options(value);
  };

  // 处理二级分类变化
  const handleCategory2Change = (value: number) => {
    const category2 = category2Options.find(opt => opt.value === value);
    form.setFieldsValue({
      category2Code: category2?.code || '',
      category3Id: undefined,
      category3Code: undefined,
    });
    loadCategory3Options(value);
  };

  // 处理三级分类变化
  const handleCategory3Change = (value: number) => {
    const category3 = category3Options.find(opt => opt.value === value);
    form.setFieldsValue({
      category3Code: category3?.code || '',
    });
  };

  // 图片上传配置
  const mainImageUploadProps: UploadProps = {
    fileList: mainImageFileList,
    listType: 'picture-card',
    maxCount: 1,
    accept: 'image/*',
    beforeUpload: (file) => {
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
      return false; // 阻止自动上传
    },
    onChange: ({ fileList }) => {
      setMainImageFileList(fileList);
    },
    onRemove: () => {
      setMainImageFileList([]);
    },
  };

  const additionalImageUploadProps: UploadProps = {
    fileList: additionalImageFileList,
    listType: 'picture-card',
    maxCount: 8,
    accept: 'image/*',
    beforeUpload: (file) => {
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
      return false; // 阻止自动上传
    },
    onChange: ({ fileList }) => {
      setAdditionalImageFileList(fileList);
    },
  };

  // 构建表单数据
  const buildFormData = async (isDraft: boolean = false): Promise<ProductSPU | null> => {
    try {
      // 如果是暂存，不进行表单验证；如果是提交，进行完整验证
      const values = isDraft 
        ? await form.validateFields().catch(() => form.getFieldsValue())
        : await form.validateFields();
      
      // 处理图片
      const imageUrls: string[] = [];
      
      // 主图
      if (mainImageFileList.length > 0) {
        const mainImage = mainImageFileList[0];
        if (mainImage.url) {
          imageUrls.push(mainImage.url);
        } else if (mainImage.originFileObj) {
          // 这里应该上传到服务器，暂时使用本地预览
          // TODO: 实现图片上传到服务器的逻辑
          if (!isDraft) {
            message.warning('图片上传功能待实现，请先上传图片到服务器');
            return null;
          }
        }
      }

      // 附加图片
      additionalImageFileList.forEach(file => {
        if (file.url) {
          imageUrls.push(file.url);
        } else if (file.originFileObj) {
          // TODO: 实现图片上传到服务器的逻辑
        }
      });

      // 将价格转换为字符串（后端API要求）
      const priceStr = formatPriceToString(values.price);
      const realPriceStr = formatPriceToString(values.realPrice);

      const spuFromProp = getSpuFromProp(product);
      const spuFromCurrent = getSpuFromCurrentProduct();
      const formData: ProductSPU = {
        id: spuFromCurrent?.id || spuFromProp?.id || 0,
        code: spuFromCurrent?.code || spuFromProp?.code || '',
        name: values.name || '',
        category1Id: values.category1Id,
        category1Code: values.category1Code || '',
        category2Id: values.category2Id,
        category2Code: values.category2Code,
        category3Id: values.category3Id,
        category3Code: values.category3Code,
        brand: values.brand || '',
        description: values.description || '',
        price: priceStr || '0',
        realPrice: realPriceStr,
        status: isDraft ? ProductStatus.DRAFT : ProductStatus.PENDING,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
        totalSales: spuFromCurrent?.totalSales || spuFromProp?.totalSales || 0,
        totalStock: spuFromCurrent?.totalStock || spuFromProp?.totalStock || 0,
      };

      return formData;
    } catch (error: any) {
      if (error.errorFields && !isDraft) {
        // 表单验证错误（仅在提交时抛出）
        throw error;
      }
      // 暂存时，即使有验证错误也返回部分数据
      return buildFormDataFromValues(form.getFieldsValue());
    }
  };

  // 从表单值构建数据（用于暂存）
  const buildFormDataFromValues = (values: any): ProductSPU => {
    const imageUrls: string[] = [];
    
    if (mainImageFileList.length > 0 && mainImageFileList[0].url) {
      imageUrls.push(mainImageFileList[0].url);
    }
    additionalImageFileList.forEach(file => {
      if (file.url) {
        imageUrls.push(file.url);
      }
    });

    // 将价格转换为字符串（后端API要求）
    const priceStr = formatPriceToString(values.price);
    const realPriceStr = formatPriceToString(values.realPrice);

    const spuFromProp = getSpuFromProp(product);
    const spuFromCurrent = getSpuFromCurrentProduct();
    return {
      id: spuFromCurrent?.id || spuFromProp?.id || 0,
      code: spuFromCurrent?.code || spuFromProp?.code || '',
      name: values.name || '',
      category1Id: values.category1Id,
      category1Code: values.category1Code || '',
      category2Id: values.category2Id,
      category2Code: values.category2Code,
      category3Id: values.category3Id,
      category3Code: values.category3Code,
      brand: values.brand || '',
      description: values.description || '',
      price: priceStr || '0',
      realPrice: realPriceStr,
      status: ProductStatus.DRAFT,
      images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
      totalSales: spuFromCurrent?.totalSales || spuFromProp?.totalSales || 0,
      totalStock: spuFromCurrent?.totalStock || spuFromProp?.totalStock || 0,
    };
  };

  // 获取已有属性的ID（用于更新时保留id）
  // attrType: 1-基础属性, 2-销售属性, 3-规格属性（规格属性也在base_attrs中）
  const getExistingAttrId = (attrType: number, code: string): number => {
    if (!currentProduct || !isDetailResp(currentProduct) || !currentProduct.attrs) {
      return 0;
    }
    
    // 规格属性（attrType=3）也在base_attrs中
    if (attrType === 1 || attrType === 3) {
      const attrs = currentProduct.attrs.base_attrs || [];
      const existingAttr = attrs.find(
        (a: ProductAttrParamInfo) => (a.code === code && a.attrType === attrType) || 
                                     (a.attrType === attrType && (code === 'SPEC_ATTRS' || a.code === code))
      );
      return existingAttr?.id || 0;
    } else if (attrType === 2) {
      const attrs = currentProduct.attrs.sale_attrs || [];
      const existingAttr = attrs.find(
        (a: ProductAttrParamInfo) => a.code === code || a.attrType === attrType
      );
      return existingAttr?.id || 0;
    }
    
    return 0;
  };

  // 获取已有SKU的ID（通过indexs匹配）
  const getExistingSkuId = (indexs: string): number => {
    if (!currentProduct || !isDetailResp(currentProduct) || !currentProduct.skus) {
      return 0;
    }
    
    const existingSku = currentProduct.skus.find(
      (sku: ProductSKU) => sku.indexs === indexs
    );
    
    return existingSku?.id || 0;
  };

  // 获取已有SKU的完整信息（通过indexs匹配）
  const getExistingSku = (indexs: string): ProductSKU | null => {
    if (!currentProduct || !isDetailResp(currentProduct) || !currentProduct.skus) {
      return null;
    }
    
    return currentProduct.skus.find(
      (sku: ProductSKU) => sku.indexs === indexs
    ) || null;
  };

  // 暂存功能（保存为草稿）
  const handleSaveDraft = async () => {
    try {
      // 获取表单当前值，不进行验证（暂存允许部分字段为空）
      const values = form.getFieldsValue();
      
      // 使用最新的 currentProduct 或 product 获取 id（确保使用最新的值）
      const spuFromCurrent = getSpuFromCurrentProduct();
      const latestProductId = spuFromCurrent?.id || getSpuFromProp(product)?.id;
      const latestProductCode = spuFromCurrent?.code || (getSpuFromProp(product)?.code || '');
      
      // 暂存时至少需要有一个标识，如果没有ID也没有name和category，则提示用户至少填写一些基本信息
      if (!latestProductId && (!values.name || values.name.trim() === '') && !values.category1Id) {
        message.warning('请至少填写商品名称或选择分类后再暂存');
        return;
      }

      // 处理图片
      const imageUrls: string[] = [];
      if (mainImageFileList.length > 0 && mainImageFileList[0].url) {
        imageUrls.push(mainImageFileList[0].url);
      }
      additionalImageFileList.forEach(file => {
        if (file.url) {
          imageUrls.push(file.url);
        }
      });

      // 将价格转换为字符串（后端API要求）
      const priceStr = formatPriceToString(values.price);
      const realPriceStr = formatPriceToString(values.realPrice);

      // 获取已有属性的ID（用于更新时保留id）
      const basicAttrId = getExistingAttrId(1, 'BASIC_ATTRS');
      const saleAttrId = getExistingAttrId(2, 'SALE_ATTRS');
      const specAttrId = getExistingAttrId(3, 'SPEC_ATTRS');

      // 构建基础属性和销售属性数组
      const baseAttrs: ProductAttrParamInfo[] = [];
      const basicAttr = buildBasicAttr(basicAttributes, latestProductId || 0, latestProductCode, basicAttrId);
      if (basicAttr) baseAttrs.push(basicAttr);
      
      const specAttr = buildSpecAttr(specifications, latestProductId || 0, latestProductCode, specAttrId);
      if (specAttr) baseAttrs.push(specAttr);

      // 构建暂存请求数据，为必填字段提供默认值
      // 使用最新的 currentProduct id，确保多次暂存时使用正确的 id
      const draftData: SaveProductReq = {
        spu: {
          id: latestProductId || 0,
          code: latestProductCode,
          name: values.name?.trim() || '未命名商品',
          category1Id: values.category1Id || 0,
          category1Code: values.category1Code || '',
          category2Id: values.category2Id,
          category2Code: values.category2Code,
          category3Id: values.category3Id,
          category3Code: values.category3Code,
          brand: values.brand,
          description: values.description,
          price: priceStr || '0',
          realPrice: realPriceStr,
          status: ProductStatus.DRAFT,
          images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
          totalSales: spuFromCurrent?.totalSales || 0,
          totalStock: spuFromCurrent?.totalStock || 0,
        },
        // 包含属性、SKU和详情数据，后端会根据id判断是新增还是更新
        attrs: {
          base_attrs: baseAttrs,
          sale_attrs: (() => {
            const saleAttr = buildSaleAttr(saleAttributes, latestProductId || 0, latestProductCode, saleAttrId);
            return saleAttr ? [saleAttr] : [];
          })(),
        },
        skus: (() => {
          // 优先使用ref获取最新的SKU列表，如果没有则使用state
          const latestSkus = getLatestSkuListRef.current?.() || skuList;
          return latestSkus.map(sku => {
            const existingSku = getExistingSku(sku.indexs);
            return convertItemToSku(sku, latestProductId || 0, latestProductCode, existingSku || undefined);
          });
        })(),
        // 暂存时不传递details，保持为空
        details: undefined,
      };

      setSavingDraft(true);
      console.log('暂存商品请求数据:', draftData);
      
      // 调用后端接口保存商品
      const response = await productApi.saveProduct(draftData);
      console.log('暂存商品响应:', response);
      
      if (response.code === 0 && response.data) {
        // 使用后端返回的完整 ProductDetailResp 更新本地状态
        const savedProductDetail: ProductDetailResp = response.data;
        const savedProduct: ProductSPU = savedProductDetail.spu;
        const productId = savedProduct.id;
        
        // 更新本地保存的完整商品信息（包括SPU、属性、SKU、详情）
        setCurrentProduct(savedProductDetail);
        
        // 同步更新表单中的分类编码等信息（如果后端返回了更新的数据）
        if (savedProduct.category1Code && savedProduct.category1Code !== values.category1Code) {
          form.setFieldsValue({
            category1Code: savedProduct.category1Code,
          });
        }
        
        // 从返回的完整数据中更新属性状态（避免再次调用接口）
        try {
          setBasicAttributes(extractBasicAttributes(savedProductDetail.attrs));
          setSaleAttributes(extractSaleAttributes(savedProductDetail.attrs));
          setSpecifications(extractSpecifications(savedProductDetail.attrs));
          // 使用后端返回的SKU数据更新列表（后端返回的是实际保存的SKU，可能少于根据规格生成的数量）
          if (savedProductDetail.skus && savedProductDetail.skus.length > 0) {
            const returnedSkus = extractSkus(savedProductDetail);
            console.log('暂存成功，更新SKU列表。返回数量:', returnedSkus.length, '当前数量:', skuList.length);
            // 直接使用后端返回的SKU数据，因为这是实际保存的数据
            setSkuList(returnedSkus);
          } else if (savedProductDetail.skus && savedProductDetail.skus.length === 0) {
            // 如果后端返回空数组，说明所有SKU都被删除了，清空列表
            console.log('暂存成功，后端返回空SKU列表，清空当前列表');
            setSkuList([]);
          }
        } catch (error) {
          console.error('从返回数据更新属性状态失败:', error);
        }
        
        // 重置属性加载标志，因为已经通过返回数据更新了
        setAttributesLoaded(true);
        setSpecificationsLoaded(true);
        
        message.success('暂存成功');
        console.log('商品暂存成功，ID:', savedProduct.id, 'Code:', savedProduct.code, 'Name:', savedProduct.name);
        
        // 如果是从新增状态转为已保存状态，提示用户
        if (!getSpuFromProp(product)?.id && savedProduct.id) {
          message.info(`商品已保存，ID: ${savedProduct.id}，编码: ${savedProduct.code}`);
        }
        // 注意：暂存功能不会调用 onSuccess()，因此不会触发父组件的列表刷新
        // 只有最终提交（handleSubmit）才会调用 onSuccess() 并刷新列表
      } else {
        message.error(response.message || '暂存失败');
      }
    } catch (error: any) {
      console.error('暂存商品失败:', error);
      // 提供更详细的错误信息
      if (error?.response?.data?.message) {
        message.error(`暂存失败: ${error.response.data.message}`);
      } else if (error?.message) {
        message.error(`暂存失败: ${error.message}`);
      } else {
        message.error('暂存失败，请检查网络连接或联系管理员');
      }
    } finally {
      setSavingDraft(false);
    }
  };

  // 提交表单（最终保存）
  const handleSubmit = async () => {
    try {
      const formData = await buildFormData(false);
      if (!formData) {
        return;
      }

      setLoading(true);
      
      // 使用最新的 currentProduct 或 product 获取 id（确保使用最新的值）
      const spuFromCurrent = getSpuFromCurrentProduct();
      const latestProductId = spuFromCurrent?.id || getSpuFromProp(product)?.id;
      const latestProductCode = spuFromCurrent?.code || (getSpuFromProp(product)?.code || formData.code || '');
      
      // 获取已有属性的ID（用于更新时保留id）
      const basicAttrId = getExistingAttrId(1, 'BASIC_ATTRS');
      const saleAttrId = getExistingAttrId(2, 'SALE_ATTRS');
      const specAttrId = getExistingAttrId(3, 'SPEC_ATTRS');
      
      // 构建完整的保存请求数据，包含spu、attrs、skus、details
      const baseAttrs: ProductAttrParamInfo[] = [];
      const basicAttr = buildBasicAttr(basicAttributes, latestProductId || 0, latestProductCode, basicAttrId);
      if (basicAttr) baseAttrs.push(basicAttr);
      
      const specAttr = buildSpecAttr(specifications, latestProductId || 0, latestProductCode, specAttrId);
      if (specAttr) baseAttrs.push(specAttr);
      
      const saleAttr = buildSaleAttr(saleAttributes, latestProductId || 0, latestProductCode, saleAttrId);
      
      const saveData: SaveProductReq = {
        spu: formData,
        attrs: {
          base_attrs: baseAttrs,
          sale_attrs: saleAttr ? [saleAttr] : [],
        },
        skus: (() => {
          // 优先使用ref获取最新的SKU列表，如果没有则使用state
          const latestSkus = getLatestSkuListRef.current?.() || skuList;
          return latestSkus.map(sku => {
            const existingSku = getExistingSku(sku.indexs);
            return convertItemToSku(sku, latestProductId || 0, latestProductCode, existingSku || undefined);
          });
        })(),
        details: currentProduct && isDetailResp(currentProduct) && currentProduct.details 
          ? {
              ...currentProduct.details,
              productSpuId: latestProductId || 0,
              productSpuCode: latestProductCode,
            }
          : undefined,
      };
      
      // 调用统一接口保存所有数据
      const response = await productApi.saveProduct(saveData);
      
      if (response.code === 0 && response.data) {
        // 使用后端返回的完整 ProductDetailResp
        const savedProductDetail: ProductDetailResp = response.data;
        const savedProduct = savedProductDetail.spu;
        
        // 更新 currentProduct 为完整的明细数据
        setCurrentProduct(savedProductDetail);
        
        message.success(product ? '编辑成功' : '添加成功');
        onSuccess();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        message.error('请检查表单填写是否正确');
        // 跳转到第一个有错误的步骤
        const errorFields = error.errorFields || [];
        if (errorFields.length > 0) {
          // 可以根据错误字段判断应该跳转到哪个步骤
          setCurrentStep(0);
        }
      } else {
        console.error('保存商品失败:', error);
        message.error('保存失败');
      }
    } finally {
      setLoading(false);
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

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 处理步骤点击
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

  // 根据最大到达步骤生成步骤配置
  // 使用 Ant Design Steps 的默认行为：通过 current 属性自动设置步骤状态
  const getStepItems = () => {
    return steps.map((step, index) => {
      return {
        ...step,
        // 最大到达步骤之后的步骤禁用点击
        disabled: index > maxReachedStep,
        // 添加 className 用于 CSS 控制连线显示
        className: index === maxReachedStep ? 'max-reached-step' : undefined,
      };
    });
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.key) {
      case 'basic':
        return (
          <>
            <div className={styles.formSection}>
              <h4 className={styles.sectionTitle}>SPU基础信息</h4>
              <Row gutter={16}>
                <Col span={24}> 
                  <Form.Item
                    label="商品名称"
                    name="name"
                    rules={[{ required: true, message: '请输入商品名称' }]}
                  >
                    <Input placeholder="请输入商品SPU名称" disabled={isViewMode} />
                  </Form.Item>
                  <small className={styles.fieldTip}>
                    建议包含品牌、产品类型、核心卖点等关键词
                  </small>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="商品类目"
                    name="category1Id"
                    rules={[{ required: true, message: '请选择商品类目' }]}
                  >
                    <Select
                      placeholder="请选择一级分类"
                      onChange={handleCategory1Change}
                      options={categoryOptions}
                      disabled={isViewMode}
                    />
                  </Form.Item>
                  <Form.Item name="category1Code" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="二级分类" name="category2Id">
                    <Select
                      placeholder="请选择二级分类（可选）"
                      onChange={handleCategory2Change}
                      options={category2Options}
                      disabled={isViewMode || category2Options.length === 0}
                    />
                  </Form.Item>
                  <Form.Item name="category2Code" hidden>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="三级分类" name="category3Id">
                    <Select
                      placeholder="请选择三级分类（可选）"
                      onChange={handleCategory3Change}
                      options={category3Options}
                      disabled={isViewMode || category3Options.length === 0}
                    />
                  </Form.Item>
                  <Form.Item name="category3Code" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="商品品牌" name="brand">
                    <Input placeholder="请输入品牌名称" disabled={isViewMode} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="销售价格 (SAP)" name="price">
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      precision={2}
                      disabled={isViewMode}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="原价 (USD)" name="realPrice">
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      precision={2}
                      disabled={isViewMode}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="商品简介" name="description">
                <TextArea
                  rows={4}
                  placeholder="请输入商品的简短介绍，建议不超过200字"
                  maxLength={200}
                  showCount
                  disabled={isViewMode}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    color: '#e2e8f0',
                    borderRadius: '6px',
                  }}
                />
              </Form.Item>
            </div>

            {/* SPU图片管理 */}
            <div className={styles.formSection}>
              <h4 className={styles.sectionTitle}>SPU通用图片</h4>
              <p className={styles.sectionDescription}>
                适用于所有规格的通用图片，如包装、证书、场景图等
              </p>

              <div className={styles.imageUploadSection}>
                <div className={styles.mainImageArea}>
                  <label>SPU主图</label>
                  <Upload {...mainImageUploadProps} disabled={isViewMode}>
                    {mainImageFileList.length < 1 && (
                      <div>
                        <PlusOutlined style={{ color: '#e2e8f0' }} />
                        <div style={{ marginTop: 8, color: '#94a3b8' }}>上传主图</div>
                        <small style={{ color: '#64748b' }}>建议800x800px</small>
                      </div>
                    )}
                  </Upload>
                </div>

                <div className={styles.additionalImagesArea}>
                  <label>SPU附加图片 <span className={styles.optional}>(包装、证书等)</span></label>
                  <Upload {...additionalImageUploadProps} disabled={isViewMode}>
                    {additionalImageFileList.length < 8 && (
                      <div>
                        <PlusOutlined style={{ color: '#e2e8f0' }} />
                        <div style={{ marginTop: 8, color: '#94a3b8' }}>添加图片</div>
                      </div>
                    )}
                  </Upload>
                  <p className={styles.uploadTip}>
                    支持JPG、PNG格式，单张≤5MB，最多8张
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case 'attributes':
        return (
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>属性设置</h4>
            <p className={styles.sectionDescription}>
              设置商品的基础属性和销售属性，这些属性将用于商品展示和搜索
            </p>
            
            <div className={styles.attributesContainer}>
              <AttributeEditor
                title="基础属性"
                value={basicAttributes}
                onChange={setBasicAttributes}
                mode="table"
                disabled={isViewMode}
                productId={getSpuFromCurrentProduct()?.id || getSpuFromProp(product)?.id}
                productCode={getSpuFromCurrentProduct()?.code || getSpuFromProp(product)?.code}
                attrType={1}
              />
              
              <AttributeEditor
                title="销售属性"
                value={saleAttributes}
                onChange={setSaleAttributes}
                mode="table"
                disabled={isViewMode}
                productId={getSpuFromCurrentProduct()?.id || getSpuFromProp(product)?.id}
                productCode={getSpuFromCurrentProduct()?.code || getSpuFromProp(product)?.code}
                attrType={2}
              />
            </div>
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
                value={specifications}
                onChange={setSpecifications}
                disabled={isViewMode}
                categoryId={form.getFieldValue('category3Id') || form.getFieldValue('category2Id') || form.getFieldValue('category1Id')}
              />
              
              <SKUManager
                specifications={specifications}
                skus={skuList}
                onChange={setSkuList}
                disabled={isViewMode}
                productName={form.getFieldValue('name') || ''}
                onSkuListRef={(getSkuList) => {
                  getLatestSkuListRef.current = getSkuList;
                }}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.comingSoon}>功能开发中...</div>
        );
    }
  };

  return (
    <div className={styles.productForm}>
      <Form
        form={form}
        layout="vertical"
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
          <AdminButton variant="cancel" onClick={onCancel}>
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
            // 编辑模式：显示完整的操作按钮
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
                  {product ? '保存商品' : '添加商品'}
                </AdminButton>
              )}
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default ProductForm;
