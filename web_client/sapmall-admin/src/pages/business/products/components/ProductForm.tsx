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
import type { ProductSPU, SaveProductReq } from '../types';
import { ProductStatus } from '../constants';
import AdminButton from '../../../../components/common/AdminButton';
import AttributeEditor, { AttributeItem } from './AttributeEditor';
import SpecificationEditor from './SpecificationEditor';
import SKUManager, { SKUItem } from './SKUManager';
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
  const [categoryTree, setCategoryTree] = useState<CategoryTreeResp[]>([]);
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

  // 加载分类树
  useEffect(() => {
    loadCategoryTree();
  }, []);

  // 当分类树加载完成且是编辑模式时，加载对应的二级和三级分类选项
  useEffect(() => {
    if (categoryTree.length > 0 && product?.category1Id) {
      loadCategory2Options(product.category1Id);
      if (product.category2Id) {
        loadCategory3Options(product.category2Id);
      }
    }
  }, [categoryTree, product?.category1Id, product?.category2Id]);


  // 初始化表单数据
  useEffect(() => {
    if (product) {
      // 编辑模式：填充表单数据
      form.setFieldsValue({
        name: product.name,
        category1Id: product.category1Id,
        category1Code: product.category1Code,
        category2Id: product.category2Id || undefined,
        category2Code: product.category2Code || undefined,
        category3Id: product.category3Id || undefined,
        category3Code: product.category3Code || undefined,
        brand: product.brand || '',
        description: product.description || '',
        price: product.price ? Number(product.price) : undefined,
        realPrice: product.realPrice ? Number(product.realPrice) : undefined,
      });

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
      }

      // 加载属性数据
      loadProductAttributes(product.id);
      // 加载规格和SKU数据
      loadProductSpecifications(product.id);
    }
  }, [product, form]);

  // 加载商品属性
  const loadProductAttributes = async (productId: number) => {
    try {
      const response = await productApi.getProductAttrParams(productId);
      if (response.code === 0 && response.data) {
        const attrs = Array.isArray(response.data) ? response.data : [];
        
        // 查找基础属性和销售属性
        const basicAttr = attrs.find((attr: any) => attr.code === 'BASIC_ATTRS' || attr.attrType === 1);
        const saleAttr = attrs.find((attr: any) => attr.code === 'SALE_ATTRS' || attr.attrType === 2);
        
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
      // TODO: 需要添加获取SKU列表的API
      // const skuResponse = await productApi.getProductSKUs(productId);
      // if (skuResponse.code === 0 && skuResponse.data) {
      //   const skus: SKUItem[] = skuResponse.data.map((sku: any) => ({
      //     indexs: sku.indexs,
      //     combination: '', // 需要根据indexs和规格计算
      //     price: sku.price,
      //     stock: sku.stock,
      //     skuCode: sku.skuCode,
      //     title: sku.title,
      //     images: sku.images ? (typeof sku.images === 'string' ? JSON.parse(sku.images) : sku.images) : [],
      //   }));
      //   setSkuList(skus);
      // }
    } catch (error) {
      console.error('加载商品规格和SKU失败:', error);
    }
  };

  // 加载分类树
  const loadCategoryTree = async () => {
    try {
      const tree = await commonApiService.getCategoryTree(0); // 0 表示商品分类
      setCategoryTree(tree);
      
      // 转换为一级分类选项（只包含一级分类，不包含子级，子级通过联动加载）
      const options = tree.map(cat => ({
        value: cat.id,
        label: cat.name,
        code: cat.code,
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error('加载分类树失败:', error);
      message.error('加载分类失败');
    }
  };

  // 加载二级分类选项
  const loadCategory2Options = (category1Id: number) => {
    const category1 = categoryTree.find(cat => cat.id === category1Id);
    if (category1?.children) {
      const options = category1.children.map(child => ({
        value: child.id,
        label: child.name,
        code: child.code,
        children: child.children?.map(grandchild => ({
          value: grandchild.id,
          label: grandchild.name,
          code: grandchild.code,
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
        code: child.code,
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

      const formData: SaveProductReq = {
        id: product?.id,
        name: values.name || '',
        category1Id: values.category1Id,
        category1Code: values.category1Code || '',
        category2Id: values.category2Id,
        category2Code: values.category2Code,
        category3Id: values.category3Id,
        category3Code: values.category3Code,
        brand: values.brand || '',
        description: values.description || '',
        price: typeof values.price === 'number' ? values.price : (values.price ? Number(values.price) : undefined),
        realPrice: typeof values.realPrice === 'number' ? values.realPrice : (values.realPrice ? Number(values.realPrice) : undefined),
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

    return {
      id: product?.id,
      name: values.name || '',
      category1Id: values.category1Id,
      category1Code: values.category1Code || '',
      category2Id: values.category2Id,
      category2Code: values.category2Code,
      category3Id: values.category3Id,
      category3Code: values.category3Code,
      brand: values.brand || '',
      description: values.description || '',
      price: typeof values.price === 'number' ? values.price : (values.price ? Number(values.price) : undefined),
      realPrice: typeof values.realPrice === 'number' ? values.realPrice : (values.realPrice ? Number(values.realPrice) : undefined),
      status: ProductStatus.DRAFT,
      images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
    };
  };

  // 暂存功能（保存为草稿）
  const handleSaveDraft = async () => {
    try {
      const formData = await buildFormData(true);
      if (!formData) {
        return;
      }

      setSavingDraft(true);
      const response = await productApi.saveProduct(formData);
      
      if (response.code === 0) {
        message.success('暂存成功');
        // 如果保存成功且有返回的ID，更新product的ID以便后续编辑
        if (response.data?.id && !product?.id) {
          // 这里可以触发父组件更新product数据
        }
      } else {
        message.error(response.message || '暂存失败');
      }
    } catch (error: any) {
      console.error('暂存商品失败:', error);
      message.error('暂存失败');
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
        const productId = savedProduct?.id || product?.id;
        const productCode = savedProduct?.code || product?.code || '';
        
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
            // TODO: 需要添加保存SKU列表的API
            // if (skuList.length > 0) {
            //   await productApi.saveProductSKUs(productId, productCode, skuList);
            // }
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
  const getStepItems = () => {
    return steps.map((step, index) => {
      let status: 'wait' | 'process' | 'finish' | 'error' = 'wait';
      
      if (index <= maxReachedStep) {
        // 最大到达步骤及之前的所有步骤标记为完成（显示连线）
        status = 'finish';
        // 如果当前步骤在最大到达步骤范围内，当前步骤显示为进行中
        // CSS 中已经为 process 状态添加了连线样式，确保连线显示
        if (index === currentStep) {
          status = 'process';
        }
      } else {
        // 最大到达步骤之后的步骤标记为等待
        status = 'wait';
      }
      
      return {
        ...step,
        status,
        // 最大到达步骤之后的步骤禁用点击
        disabled: index > maxReachedStep,
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
              />
              
              <AttributeEditor
                title="销售属性"
                value={saleAttributes}
                onChange={setSaleAttributes}
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
