import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Tabs,
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
import { ProductStatus, PRODUCT_STATUS_OPTIONS } from '../constants';
import styles from './ProductForm.module.scss';

const { TextArea } = Input;
const { TabPane } = Tabs;

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
  const [activeTab, setActiveTab] = useState('basic');

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
        status: product.status,
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

    } else {
      // 新增模式：设置默认值
      form.setFieldsValue({
        status: ProductStatus.DRAFT,
      });
    }
  }, [product, form]);

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

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
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
          message.warning('图片上传功能待实现，请先上传图片到服务器');
          return;
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
        name: values.name,
        category1Id: values.category1Id,
        category1Code: values.category1Code,
        category2Id: values.category2Id,
        category2Code: values.category2Code,
        category3Id: values.category3Id,
        category3Code: values.category3Code,
        brand: values.brand || '',
        description: values.description || '',
        price: typeof values.price === 'number' ? values.price : (values.price ? Number(values.price) : undefined),
        realPrice: typeof values.realPrice === 'number' ? values.realPrice : (values.realPrice ? Number(values.realPrice) : undefined),
        status: values.status,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
      };

      setLoading(true);
      const response = await productApi.saveProduct(formData);
      
      if (response.code === 0) {
        message.success(product ? '编辑成功' : '添加成功');
        onSuccess();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        message.error('请检查表单填写是否正确');
      } else {
        console.error('保存商品失败:', error);
        message.error('保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.productForm}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: ProductStatus.DRAFT,
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 基本信息标签页 */}
          <TabPane tab="基本信息" key="basic">
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="商品状态"
                    name="status"
                    rules={[{ required: true, message: '请选择商品状态' }]}
                  >
                    <Select options={PRODUCT_STATUS_OPTIONS.filter(opt => opt.value !== '')} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="商品简介" name="description">
                <TextArea
                  rows={4}
                  placeholder="请输入商品的简短介绍，建议不超过200字"
                  maxLength={200}
                  showCount
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
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传主图</div>
                        <small>建议800x800px</small>
                      </div>
                    )}
                  </Upload>
                </div>

                <div className={styles.additionalImagesArea}>
                  <label>SPU附加图片 <span className={styles.optional}>(包装、证书等)</span></label>
                  <Upload {...additionalImageUploadProps}>
                    {additionalImageFileList.length < 8 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>添加图片</div>
                      </div>
                    )}
                  </Upload>
                  <p className={styles.uploadTip}>
                    支持JPG、PNG格式，单张≤5MB，最多8张
                  </p>
                </div>
              </div>
            </div>
          </TabPane>

          {/* 其他标签页占位 */}
          <TabPane tab="销售属性" key="sales-attrs" disabled>
            <div className={styles.comingSoon}>功能开发中...</div>
          </TabPane>
          <TabPane tab="规格属性" key="spec-attrs" disabled>
            <div className={styles.comingSoon}>功能开发中...</div>
          </TabPane>
          <TabPane tab="SKU管理" key="sku-management" disabled>
            <div className={styles.comingSoon}>功能开发中...</div>
          </TabPane>
          <TabPane tab="商品详情" key="product-details" disabled>
            <div className={styles.comingSoon}>功能开发中...</div>
          </TabPane>
          <TabPane tab="SEO设置" key="seo-settings" disabled>
            <div className={styles.comingSoon}>功能开发中...</div>
          </TabPane>
        </Tabs>
      </Form>

      <div className={styles.formFooter}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            {product ? '保存商品' : '添加商品'}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ProductForm;
