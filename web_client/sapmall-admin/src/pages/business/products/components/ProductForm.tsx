import React, { useState, useEffect } from 'react';
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
import { commonApiService, CategoryTreeResp } from '../../../../services/api/commonApiService';
import type { ProductSPU, ProductSKU, SaveProductReq } from '../types';
import { ProductStatus } from '../constants';
import AdminButton from '../../../../components/common/AdminButton';
import AttributeEditor, { AttributeItem } from './AttributeEditor';
import SpecificationEditor from './SpecificationEditor';
import SKUManager, { SKUItem } from './SKUManager';
import { useCategoryStore } from '../../../../store/categoryStore';
import styles from './ProductForm.module.scss';

const { TextArea } = Input;

interface ProductFormProps {
  product?: ProductSPU | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface CategoryOption {
  value: number;
  label: string;
  code: string;
  children?: CategoryOption[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 使用 store 中的商品目录数据（menu_type=0）
  const { productCategories: categoryTree, fetchProductCategories } = useCategoryStore();
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
  // 跟踪最大到达的步骤索引（通过"下一步"按钮到达的最远步骤）
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  // 保存当前商品的完整信息（用于暂存后更新）
  const [currentProduct, setCurrentProduct] = useState<ProductSPU | null>(product || null);
  // 标记属性是否已加载（确保只加载一次）
  const [attributesLoaded, setAttributesLoaded] = useState(false);
  // 标记规格数据是否已加载（确保只加载一次）
  const [specificationsLoaded, setSpecificationsLoaded] = useState(false);

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

  // 加载商品目录树（从 store 获取，如果缓存无效则从 API 获取）
  useEffect(() => {
    fetchProductCategories(); // 获取商品目录（menu_type=0）
  }, [fetchProductCategories]);

  // 当分类树加载完成且是编辑模式时，加载对应的二级和三级分类选项
  useEffect(() => {
    const prod = currentProduct || product;
    if (categoryTree.length > 0 && prod?.category1Id) {
      loadCategory2Options(prod.category1Id);
      if (prod.category2Id) {
        loadCategory3Options(prod.category2Id);
      }
    }
  }, [categoryTree, currentProduct?.category1Id, currentProduct?.category2Id, product?.category1Id, product?.category2Id]);

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
    if (product) {
      console.log('ProductForm: product prop 更新:', product);
      setCurrentProduct(product);
    } else {
      setCurrentProduct(null);
    }
  }, [product]);

  // 初始化表单数据（仅当外部传入的product变化时加载，暂存更新currentProduct不触发）
  useEffect(() => {
    // 只有当外部传入product prop时，才加载数据（编辑模式）
    // 暂存成功后更新currentProduct不应该触发这个逻辑
    if (product && product.id) {
      console.log('初始化表单数据，商品信息:', product);
      
      // 编辑模式：填充表单数据
      // 注意：price 和 realPrice 后端返回的是 string 类型，需要转换为 number
      // category2Id 和 category3Id 可能是 0，需要使用 !== undefined 和 !== 0 判断
      const priceValue = product.price 
        ? (typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price))
        : undefined;
      const realPriceValue = product.realPrice 
        ? (typeof product.realPrice === 'string' ? parseFloat(product.realPrice) : Number(product.realPrice))
        : undefined;
      
      // 处理分类ID：如果值为 0，则设置为 undefined（表示未选择）
      const category2IdValue = product.category2Id !== undefined && product.category2Id !== 0 
        ? product.category2Id 
        : undefined;
      const category3IdValue = product.category3Id !== undefined && product.category3Id !== 0 
        ? product.category3Id 
        : undefined;
      
      const formValues = {
        name: product.name || '',
        category1Id: product.category1Id,
        category1Code: product.category1Code || '',
        category2Id: category2IdValue,
        category2Code: product.category2Code || undefined,
        category3Id: category3IdValue,
        category3Code: product.category3Code || undefined,
        brand: product.brand || '',
        description: product.description || '',
        price: priceValue,
        realPrice: realPriceValue,
      };
      
      console.log('设置表单值:', formValues);
      form.setFieldsValue(formValues);

      // 加载图片
      if (product.images) {
        try {
          const imageUrls = typeof product.images === 'string' 
            ? (product.images.includes('[') ? JSON.parse(product.images) : product.images.split(','))
            : [];
          
          if (imageUrls.length > 0) {
            const mainImage = imageUrls[0];
            setMainImageFileList([{
              uid: '-1',
              name: 'main-image',
              status: 'done',
              url: mainImage,
            }]);

            if (imageUrls.length > 1) {
              const additionalImages = imageUrls.slice(1).map((url: string, index: number) => ({
                uid: `-${index + 2}`,
                name: `image-${index + 2}`,
                status: 'done',
                url: url.trim(),
              }));
              setAdditionalImageFileList(additionalImages);
            }
          }
        } catch (error) {
          console.error('解析图片数据失败:', error);
        }
      } else {
        // 如果没有图片，清空图片列表
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

  // 当切换到属性设置步骤时，加载属性数据（只加载一次，仅在编辑模式下）
  useEffect(() => {
    const step = steps[currentStep];
    if (step?.key === 'attributes' && !attributesLoaded) {
      const productId = currentProduct?.id || product?.id;
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
  }, [currentStep, attributesLoaded, currentProduct?.id, product?.id]); // 监听 currentStep 和 attributesLoaded

  // 当切换到规格与SKU步骤时，加载规格和SKU数据（只加载一次，仅在编辑模式下）
  useEffect(() => {
    const step = steps[currentStep];
    if (step?.key === 'specifications' && !specificationsLoaded) {
      const productId = currentProduct?.id || product?.id;
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
  }, [currentStep, specificationsLoaded, currentProduct?.id, product?.id]); // 监听 currentStep 和 specificationsLoaded

  // 当 product 变化时，重置加载标志
  useEffect(() => {
    if (product) {
      setAttributesLoaded(false); // 重置标志，以便下次进入属性设置步骤时重新加载
      setSpecificationsLoaded(false); // 重置标志，以便下次进入规格步骤时重新加载
    }
  }, [product?.id]); // 只监听 product.id 的变化

  // 加载商品属性
  const loadProductAttributes = async (productId: number) => {
    try {
      const response = await productApi.getProductAttrParams(productId);
      console.log('加载商品属性响应:', response);
      if (response.code === 0 && response.data) {
        const attrs = Array.isArray(response.data) ? response.data : [];
        console.log('属性列表:', attrs);
        
        // 查找基础属性和销售属性
        const basicAttr = attrs.find((attr: any) => attr.code === 'BASIC_ATTRS' || attr.attrType === 1);
        const saleAttr = attrs.find((attr: any) => attr.code === 'SALE_ATTRS' || attr.attrType === 2);
        console.log('基础属性:', basicAttr);
        console.log('销售属性:', saleAttr);
        
        let hasAttributes = false;
        
        if (basicAttr && basicAttr.value) {
          try {
            const basicValue = typeof basicAttr.value === 'string' 
              ? JSON.parse(basicAttr.value) 
              : basicAttr.value;
            const parsedBasic = basicValue || {};
            setBasicAttributes(parsedBasic);
            if (Object.keys(parsedBasic).length > 0) {
              hasAttributes = true;
            }
          } catch (error) {
            console.error('解析基础属性失败:', error);
            setBasicAttributes({});
          }
        }
        
        if (saleAttr && saleAttr.value) {
          try {
            const saleValue = typeof saleAttr.value === 'string' 
              ? JSON.parse(saleAttr.value) 
              : saleAttr.value;
            const parsedSale = saleValue || {};
            setSaleAttributes(parsedSale);
            if (Object.keys(parsedSale).length > 0) {
              hasAttributes = true;
            }
          } catch (error) {
            console.error('解析销售属性失败:', error);
            setSaleAttributes({});
          }
        }

      }
    } catch (error) {
      console.error('加载商品属性失败:', error);
    }
  };

  // 加载商品规格和SKU数据
  const loadProductSpecifications = async (productId: number) => {
    try {
      // 加载规格属性
      const attrResponse = await productApi.getProductAttrParams(productId);
      if (attrResponse.code === 0 && attrResponse.data) {
        const attrs = Array.isArray(attrResponse.data) ? attrResponse.data : [];
        const specAttr = attrs.find((attr: any) => attr.code === 'SPEC_ATTRS' || attr.attrType === 3);
        
        if (specAttr && specAttr.value) {
          try {
            const specValue = typeof specAttr.value === 'string' 
              ? JSON.parse(specAttr.value) 
              : specAttr.value;
            // 确保值是数组格式
            const normalizedSpecs: Record<string, string[]> = {};
            Object.entries(specValue || {}).forEach(([key, val]) => {
              normalizedSpecs[key] = Array.isArray(val) ? val : [val as string];
            });
            setSpecifications(normalizedSpecs);
          } catch (error) {
            console.error('解析规格属性失败:', error);
            setSpecifications({});
          }
        }
      }

      // 加载SKU数据
      const skuResponse = await productApi.getSKUList({
        productSpuId: productId,
        page: 1,
        pageSize: 100, // 获取所有SKU
      });
      
      if (skuResponse.code === 0 && skuResponse.data?.list) {
        const skus: SKUItem[] = skuResponse.data.list.map((sku: ProductSKU) => {
          // 根据indexs解析规格组合
          let combination = '';
          try {
            // indexs格式通常是 "0_1" 这样的索引组合
            // 这里可以根据规格定义解析indexs为可读的规格组合
            // 暂时使用indexs作为组合标识，后续可以通过规格定义完善
            combination = sku.indexs;
          } catch (error) {
            combination = sku.indexs;
          }
          
          // 处理价格，可能是字符串或数字
          const price = typeof sku.price === 'string' ? parseFloat(sku.price) : sku.price;
          
          // 处理图片
          let images: string[] = [];
          if (sku.images) {
            try {
              images = typeof sku.images === 'string' 
                ? (sku.images.includes('[') ? JSON.parse(sku.images) : sku.images.split(',').filter(Boolean))
                : Array.isArray(sku.images) ? sku.images : [];
            } catch (error) {
              console.error('解析SKU图片失败:', error);
              images = [];
            }
          }
          
          return {
            indexs: sku.indexs,
            combination: combination,
            price: price || 0,
            stock: sku.stock || 0,
            skuCode: sku.skuCode || '',
            title: sku.title || '',
            images: images,
          };
        });
        setSkuList(skus);
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
  const buildFormData = async (isDraft: boolean = false): Promise<SaveProductReq | null> => {
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
      const priceStr = values.price !== undefined && values.price !== null 
        ? (typeof values.price === 'number' ? values.price.toString() : String(values.price))
        : undefined;
      const realPriceStr = values.realPrice !== undefined && values.realPrice !== null
        ? (typeof values.realPrice === 'number' ? values.realPrice.toString() : String(values.realPrice))
        : undefined;

      const formData: SaveProductReq = {
        id: currentProduct?.id || product?.id,
        name: values.name || '',
        category1Id: values.category1Id,
        category1Code: values.category1Code || '',
        category2Id: values.category2Id,
        category2Code: values.category2Code,
        category3Id: values.category3Id,
        category3Code: values.category3Code,
        brand: values.brand || '',
        description: values.description || '',
        price: priceStr,
        realPrice: realPriceStr,
        status: isDraft ? ProductStatus.DRAFT : ProductStatus.PENDING,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
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
  const buildFormDataFromValues = (values: any): SaveProductReq => {
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
    const priceStr = values.price !== undefined && values.price !== null 
      ? (typeof values.price === 'number' ? values.price.toString() : String(values.price))
      : undefined;
    const realPriceStr = values.realPrice !== undefined && values.realPrice !== null
      ? (typeof values.realPrice === 'number' ? values.realPrice.toString() : String(values.realPrice))
      : undefined;

    return {
      id: currentProduct?.id || product?.id,
      name: values.name || '',
      category1Id: values.category1Id,
      category1Code: values.category1Code || '',
      category2Id: values.category2Id,
      category2Code: values.category2Code,
      category3Id: values.category3Id,
      category3Code: values.category3Code,
      brand: values.brand || '',
      description: values.description || '',
      price: priceStr,
      realPrice: realPriceStr,
      status: ProductStatus.DRAFT,
      images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
    };
  };

  // 暂存功能（保存为草稿）
  const handleSaveDraft = async () => {
    try {
      // 获取表单当前值，不进行验证（暂存允许部分字段为空）
      const values = form.getFieldsValue();
      
      // 使用最新的 currentProduct 或 product 获取 id（确保使用最新的值）
      const latestProductId = currentProduct?.id || product?.id;
      
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
      const priceStr = values.price !== undefined && values.price !== null 
        ? (typeof values.price === 'number' ? values.price.toString() : String(values.price))
        : undefined;
      const realPriceStr = values.realPrice !== undefined && values.realPrice !== null
        ? (typeof values.realPrice === 'number' ? values.realPrice.toString() : String(values.realPrice))
        : undefined;

      // 构建暂存请求数据，为必填字段提供默认值
      // 使用最新的 currentProduct id，确保多次暂存时使用正确的 id
      const draftData: SaveProductReq = {
        id: latestProductId, // 使用最新的 id，如果有则进行更新，否则是新增
        // 如果name为空，使用默认值（草稿状态下允许）
        name: values.name?.trim() || '未命名商品',
        // 如果category1Id为空，设置为0（后端需要，但可以后续修改）
        category1Id: values.category1Id || 0,
        category1Code: values.category1Code || '',
        category2Id: values.category2Id,
        category2Code: values.category2Code,
        category3Id: values.category3Id,
        category3Code: values.category3Code,
        brand: values.brand,
        description: values.description,
        price: priceStr,
        realPrice: realPriceStr,
        status: ProductStatus.DRAFT,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
      };

      setSavingDraft(true);
      console.log('暂存商品请求数据:', draftData);
      
      // 调用后端接口保存商品
      const response = await productApi.saveProduct(draftData);
      console.log('暂存商品响应:', response);
      
      if (response.code === 0 && response.data) {
        // 使用后端返回的完整SPU信息更新本地状态
        const savedProduct: ProductSPU = response.data;
        const productId = savedProduct.id;
        const productCode = savedProduct.code || '';
        
        // 更新本地保存的商品信息（包括ID、code等）
        setCurrentProduct(savedProduct);
        
        // 同步更新表单中的分类编码等信息（如果后端返回了更新的数据）
        if (savedProduct.category1Code && savedProduct.category1Code !== values.category1Code) {
          form.setFieldsValue({
            category1Code: savedProduct.category1Code,
          });
        }
        
        // 保存属性数据（基础属性、销售属性、规格属性）
        if (productId) {
          try {
            // 保存基础属性
            if (Object.keys(basicAttributes).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 1, basicAttributes);
            }
            
            // 保存销售属性
            if (Object.keys(saleAttributes).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 2, saleAttributes);
            }

            // 保存规格属性
            if (Object.keys(specifications).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 3, specifications);
            }

            // 保存SKU数据
            if (skuList.length > 0) {
              try {
                // 先从服务器获取现有的SKU，以便保留已有的id
                const existingSKUResponse = await productApi.getSKUList({
                  productSpuId: productId,
                  page: 1,
                  pageSize: 100,
                });
                
                const existingSKUs: ProductSKU[] = existingSKUResponse.code === 0 && existingSKUResponse.data?.list 
                  ? existingSKUResponse.data.list 
                  : [];
                
                // 构建SKU映射表，以indexs为key
                const existingSKUMap = new Map<string, ProductSKU>();
                existingSKUs.forEach(sku => {
                  existingSKUMap.set(sku.indexs, sku);
                });
                
                await productApi.batchSaveSKUs(
                  productId,
                  productCode,
                  skuList.map(sku => {
                    const existingSKU = existingSKUMap.get(sku.indexs);
                    return {
                      id: existingSKU?.id, // 如果有现有SKU，使用其id进行更新
                      skuCode: sku.skuCode || existingSKU?.skuCode,
                      price: typeof sku.price === 'number' ? sku.price : (sku.price ? parseFloat(String(sku.price)) : 0),
                      stock: sku.stock || 0,
                      status: 1, // 默认启用
                      indexs: sku.indexs,
                      title: sku.title || '',
                      images: Array.isArray(sku.images) ? JSON.stringify(sku.images) : (sku.images || ''),
                    };
                  })
                );
              } catch (error) {
                console.error('暂存SKU失败:', error);
                // SKU保存失败不影响整体暂存，只记录错误
              }
            }
          } catch (error) {
            console.error('暂存属性或SKU失败:', error);
            // 属性保存失败不影响整体暂存，只记录错误
          }
        }
        
        message.success('暂存成功');
        console.log('商品暂存成功，ID:', savedProduct.id, 'Code:', savedProduct.code, 'Name:', savedProduct.name);
        
        // 如果是从新增状态转为已保存状态，提示用户
        if (!product?.id && savedProduct.id) {
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
      const response = await productApi.saveProduct(formData);
      
      if (response.code === 0) {
        const savedProduct = response.data;
        // 使用后端返回的完整SPU信息
        if (savedProduct) {
          setCurrentProduct(savedProduct);
        }
        const productId = savedProduct?.id || currentProduct?.id || product?.id;
        const productCode = savedProduct?.code || currentProduct?.code || product?.code || '';
        
        // 保存属性数据
        if (productId) {
          try {
            // 保存基础属性
            if (Object.keys(basicAttributes).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 1, basicAttributes);
            }
            
            // 保存销售属性
            if (Object.keys(saleAttributes).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 2, saleAttributes);
            }

            // 保存规格属性
            if (Object.keys(specifications).length > 0) {
              await productApi.saveProductAttrParams(productId, productCode, 3, specifications);
            }

            // 保存SKU数据
            if (skuList.length > 0) {
              try {
                // 先从服务器获取现有的SKU，以便保留已有的id
                const existingSKUResponse = await productApi.getSKUList({
                  productSpuId: productId,
                  page: 1,
                  pageSize: 100,
                });
                
                const existingSKUs: ProductSKU[] = existingSKUResponse.code === 0 && existingSKUResponse.data?.list 
                  ? existingSKUResponse.data.list 
                  : [];
                
                // 构建SKU映射表，以indexs为key
                const existingSKUMap = new Map<string, ProductSKU>();
                existingSKUs.forEach(sku => {
                  existingSKUMap.set(sku.indexs, sku);
                });
                
                await productApi.batchSaveSKUs(
                  productId,
                  productCode,
                  skuList.map(sku => {
                    const existingSKU = existingSKUMap.get(sku.indexs);
                    return {
                      id: existingSKU?.id, // 如果有现有SKU，使用其id进行更新
                      skuCode: sku.skuCode || existingSKU?.skuCode,
                      price: typeof sku.price === 'number' ? sku.price : (sku.price ? parseFloat(String(sku.price)) : 0),
                      stock: sku.stock || 0,
                      status: 1, // 默认启用
                      indexs: sku.indexs,
                      title: sku.title || '',
                      images: Array.isArray(sku.images) ? JSON.stringify(sku.images) : (sku.images || ''),
                    };
                  })
                );
              } catch (error) {
                console.error('保存SKU失败:', error);
                message.warning('SKU保存失败，请检查数据');
              }
            }
          } catch (error) {
            console.error('保存属性或SKU失败:', error);
            message.warning('商品保存成功，但部分数据保存失败');
          }
        }
        
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
      // 只允许跳转到最大到达步骤及之前的步骤
      if (step > maxReachedStep) {
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
                    <Input placeholder="请输入商品SPU名称" />
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
                      disabled={category2Options.length === 0}
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
                      disabled={category3Options.length === 0}
                    />
                  </Form.Item>
                  <Form.Item name="category3Code" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="商品品牌" name="brand">
                    <Input placeholder="请输入品牌名称" />
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
                  <Upload {...mainImageUploadProps}>
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
                  <Upload {...additionalImageUploadProps}>
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
                productId={currentProduct?.id || product?.id}
                productCode={currentProduct?.code || product?.code}
                attrType={1}
              />
              
              <AttributeEditor
                title="销售属性"
                value={saleAttributes}
                onChange={setSaleAttributes}
                mode="table"
                productId={currentProduct?.id || product?.id}
                productCode={currentProduct?.code || product?.code}
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
                categoryId={form.getFieldValue('category3Id') || form.getFieldValue('category2Id') || form.getFieldValue('category1Id')}
              />
              
              <SKUManager
                specifications={specifications}
                skus={skuList}
                onChange={setSkuList}
                productName={form.getFieldValue('name') || ''}
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
            items={getStepItems()} 
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
            取消
          </AdminButton>
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
        </Space>
      </div>
    </div>
  );
};

export default ProductForm;
