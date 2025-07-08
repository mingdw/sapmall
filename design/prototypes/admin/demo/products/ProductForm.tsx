import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Switch, Tabs, Upload, Button, Space, Table, TreeSelect, message } from 'antd';
import { PlusOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { Product, CategoryResponse, AttrGroup } from '../../../../api/apiService';
import { findCategoryById, findCategoryName } from './utils';
import styles from './ProductsManage.module.scss';
import { uploadImage } from '../../../../api/apiService';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

type SpecCombination = {
  id: string;
  specs: Record<string, string>;
  price: number;
  stock: number;
  skuCode: string;
};

interface ProductFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
  product: Product | null;
  categories: CategoryResponse[];
  attrGroups: AttrGroup[];
  fileList: UploadFile[];
  specCombinations: SpecCombination[];
  setSpecCombinations: React.Dispatch<React.SetStateAction<SpecCombination[]>>;
  onFileChange: (info: any) => void;
  onCategoryChange: (value: string) => void;
  generateSpecCombinations: (specAttrsMap?: Record<string, string[]>, defaultPrice?: number) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  visible,
  onCancel,
  onOk,
  form,
  product,
  categories,
  attrGroups,
  fileList,
  specCombinations,
  setSpecCombinations,
  onFileChange,
  onCategoryChange,
  generateSpecCombinations
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [tempBatchValue, setTempBatchValue] = useState<number | null>(null);
  
  // 规格组合表格列定义
  const specColumns = [
    {
      title: '规格组合',
      dataIndex: 'specs',
      key: 'specs',
      width: '30%',
      render: (specs: Record<string, string>) => (
        <div className={styles.specCombination}>
          {Object.entries(specs).map(([key, value]) => (
            <span key={key} className={styles.specTag}>
              {key}: {value}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: '20%',
      render: (skuCode: string, record: SpecCombination) => (
        <Input
          value={skuCode}
          onChange={(e) => handleSpecChange(record.id, 'skuCode', e.target.value)}
          placeholder="输入SKU编码"
        />
      ),
    },
    {
      title: '价格 (¥)',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (price: number, record: SpecCombination) => (
        <InputNumber
          min={0}
          precision={2}
          value={price}
          onChange={(value) => handleSpecChange(record.id, 'price', value)}
          style={{ width: '100%' }}
          placeholder="输入价格"
        />
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: '20%',
      render: (stock: number, record: SpecCombination) => (
        <InputNumber
          min={0}
          value={stock}
          onChange={(value) => handleSpecChange(record.id, 'stock', value)}
          style={{ width: '100%' }}
          placeholder="输入库存"
        />
      ),
    },
  ];

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    listType: 'picture-card',
    fileList,
    onChange: onFileChange,
    beforeUpload: (file) => {
      console.log('检查文件:', file.name, file.type, file.size);
      
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return Upload.LIST_IGNORE;
      }
      
      // 检查文件大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片不能超过2MB!');
        return Upload.LIST_IGNORE;
      }
      
      // 通过所有检查，允许继续上传
      console.log('文件检查通过，准备上传'); 
      
      // 直接触发上传操作
      handleUpload(file);
      
      // 返回 false 阻止默认上传行为
      return false;
    },
    onPreview: (file) => {
      window.open(file.url || file.thumbUrl, '_blank');
    },
    showUploadList: true,
  };

  // 处理上传文件的函数
  const handleUpload = async (file: File) => {
    console.log('开始上传文件:', file);
    
    // 先创建一个临时的上传中状态文件对象
    const tempFile: UploadFile = {
      uid: Date.now().toString(),
      name: file.name,
      status: 'uploading',
      percent: 0,
      originFileObj: file as any
    };
    
    // 添加到文件列表显示上传中状态
    onFileChange({ file: tempFile, fileList: [...fileList, tempFile] });
    
    try {
      // 调用上传API
      const response = await uploadImage(file);
      
      console.log('上传响应:', response);
      
      if (response) {
        // 上传成功，更新文件状态
        const successFile: UploadFile = {
          uid: response.key,
          name: response.original_name || file.name,
          status: 'done',
          url: response.url,
          thumbUrl: response.url,
          // 保存完整的响应数据，特别是key
          response: response
        };
        
        // 把临时文件替换为成功文件
        const updatedFileList = fileList.map(item => 
          item.uid === tempFile.uid ? successFile : item
        );
        
        if (!updatedFileList.find(item => item.uid === successFile.uid)) {
          updatedFileList.push(successFile);
        }
        
        // 更新文件列表
        onFileChange({ 
          file: { ...successFile },
          fileList: updatedFileList.filter(item => item.uid !== tempFile.uid)
        });
        
        message.success(`${file.name} 上传成功`);
      } else {
        // 上传失败
        const errorFile = {
          ...tempFile,
          status: 'error',
          error: new Error('上传失败，服务器未返回有效数据')
        };
        
        onFileChange({ 
          file: errorFile,
          fileList: fileList.map(item => item.uid === tempFile.uid ? errorFile : item)
        });
        
        message.error(`${file.name} 上传失败`);
      }
    } catch (error: any) {
      console.error('上传图片错误:', error);
      
      // 更新为错误状态
      const errorFile = {
        ...tempFile,
        status: 'error',
        error: error
      };
      
      onFileChange({ 
        file: errorFile,
        fileList: fileList.map(item => item.uid === tempFile.uid ? errorFile : item)
      });
      
      message.error(`${file.name} 上传失败: ${error.message || '未知错误'}`);
    }
  };

  // 处理规格变更
  const handleSpecChange = (id: string, field: string, value: any) => {
    const newCombinations = specCombinations.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSpecCombinations(newCombinations);
  };

  // 渲染分类树
  const renderCategoryTree = (categories: CategoryResponse[]) => {
    return categories.map(category => (
      <TreeNode 
        value={category.id.toString()} 
        title={category.name} 
        key={category.id}
      >
        {category.children && renderCategoryTree(category.children)}
      </TreeNode>
    ));
  };

  // Tab项配置
  const items = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.sectionTitle}>核心信息</div>
            <div className={styles.formGrid}>
              <Form.Item
                label="商品名称"
                name="name"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
              
              <Form.Item
                label="商品编码"
                name="code"
                rules={[{ required: true, message: '请输入商品编码' }]}
              >
                <Input 
                  placeholder="请输入商品编码" 
                  readOnly={!!product}
                  disabled={!!product}
                  className={styles.readOnlyInput}
                />
              </Form.Item>
            </div>
            
            <Form.Item
              label="商品分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择商品分类' }]}
            >
              <TreeSelect
                placeholder="请选择商品分类"
                onChange={onCategoryChange}
                allowClear
                treeDefaultExpandAll
                showSearch
                treeNodeFilterProp="title"
              >
                {renderCategoryTree(categories)}
              </TreeSelect>
            </Form.Item>
          </div>
          
          <div className={styles.formCard}>
            <div className={styles.sectionTitle}>价格与库存</div>
            <div className={styles.formGrid}>
              <Form.Item
                label="原价"
                name="price"
                rules={[{ required: true, message: '请输入商品原价' }]}
              >
                <InputNumber 
                  min={0} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入商品原价" 
                  addonBefore="¥"
                  className={styles.priceInput}
                />
              </Form.Item>
              
              <Form.Item
                label="实际价格"
                name="realPrice"
                rules={[{ required: true, message: '请输入商品实际价格' }]}
              >
                <InputNumber 
                  min={0} 
                  precision={2} 
                  style={{ width: '100%' }} 
                  placeholder="请输入商品实际价格" 
                  addonBefore="¥"
                  className={styles.priceInput}
                />
              </Form.Item>
            </div>
            
            <div className={styles.formGrid}>
              <Form.Item
                label="总库存"
                name="totalStock"
                rules={[{ required: true, message: '请输入商品总库存' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="请输入商品总库存" 
                  className={styles.stockInput}
                />
              </Form.Item>
              
              <Form.Item
                label="商品状态"
                name="status"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="上架" 
                  unCheckedChildren="下架" 
                  className={styles.statusSwitch}
                />
              </Form.Item>
            </div>
          </div>
          
          <div className={styles.formCard}>
            <div className={styles.sectionTitle}>商品详情</div>
            <Form.Item
              label="商品描述"
              name="description"
            >
              <TextArea 
                rows={4} 
                placeholder="请输入商品描述" 
                className={styles.descriptionInput}
              />
            </Form.Item>
            
            <Form.Item
              label="商品图片"
              name="images"
              className={styles.imagesUpload}
            >
              <div className={styles.uploadContainer}>
                <Upload {...uploadProps}>
                  <div className={styles.uploadButton}>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                </Upload>
                <div className={styles.uploadTip}>支持*.jpg, *.png格式，单张图片不超过2MB</div>
              </div>
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: '基础属性',
      children: (
        <div className={styles.formSection}>
          {attrGroups.length > 0 ? (
            <div className={styles.attrGroupsContainer}>
              {attrGroups.map(group => (
                <div key={group.id} className={styles.attrGroupRow}>
                  <div className={styles.attrGroupLabel}>
                    <span>{group.name}</span>
                  </div>
                  <div className={styles.attrGroupField}>
                    <Form.Item
                      name={`basicAttr_${group.id}`}
                      rules={[{ required: true, message: `请选择${group.name}` }]}
                      className={styles.formItemNoMargin}
                    >
                      <Select
                        placeholder={`请选择${group.name}`}
                        allowClear
                        style={{ width: '100%' }}
                        dropdownClassName={styles.attrDropdown}
                        size="large"
                      >
                        {group.attrs.map(attr => (
                          <Select.Option key={attr.id} value={attr.name}>
                            {attr.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyNotice}>请先选择商品分类，获取基础属性</div>
          )}
        </div>
      )
    },
    {
      key: '3',
      label: '销售属性',
      children: (
        <div className={styles.formSection}>
          <Form.List name="saleAttrs" initialValue={[{ key: '', value: '' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true, message: '请输入属性名称' }]}
                    >
                      <Input placeholder="属性名称" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: '请输入属性值' }]}
                    >
                      <Input placeholder="属性值" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加销售属性
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      )
    },
    {
      key: '4',
      label: '规格属性',
      children: (
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.sectionTitle}>规格设置</div>
            <div className={styles.specSettingTips}>
              <p>设置商品规格，如颜色、尺码等，不同规格组合可以设置不同的价格和库存。</p>
              <p>添加规格名称和规格值后，点击"生成规格组合"按钮生成所有组合。</p>
            </div>
            
            <Form.List name="specAttrs" initialValue={[{ key: '', values: [] }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className={styles.specRow}>
                      <div className={styles.specNameSection}>
                        <Form.Item
                          {...restField}
                          name={[name, 'key']}
                          rules={[{ required: true, message: '请输入规格名称' }]}
                          label="规格名称"
                        >
                          <Input placeholder="例如：颜色、尺码、材质等" />
                        </Form.Item>
                      </div>
                      
                      <div className={styles.specValuesSection}>
                        <Form.Item
                          {...restField}
                          name={[name, 'values']}
                          rules={[{ required: true, message: '请添加规格值' }]}
                          label="规格值"
                          className={styles.specValuesFormItem}
                        >
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="输入规格值后按回车添加，如：红色、蓝色、S、M、L等"
                            tokenSeparators={[',']}
                            dropdownClassName={styles.attrDropdown}
                          />
                        </Form.Item>
                      </div>
                      
                      {fields.length > 1 && (
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)}
                          className={styles.removeSpecBtn}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      className={styles.addSpecBtn}
                    >
                      添加规格项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          
          <div className={styles.formCard}>
            <div className={styles.sectionTitle}>规格组合与预览</div>
            <div className={styles.specPreviewDescription}>
              <p>根据上方添加的规格项自动生成所有可能的规格组合，您可以为每个组合设置对应的价格、库存和SKU编码。</p>
            </div>
            
            <div className={styles.generateSpecSection}>
              <Button 
                type="primary" 
                onClick={() => {
                  // 获取当前表单中的规格属性值
                  const specAttrsValues = form.getFieldValue('specAttrs');
                  
                  // 检查是否有有效的规格属性
                  if (!specAttrsValues || specAttrsValues.length === 0 || 
                      !specAttrsValues[0].key || !specAttrsValues[0].values || specAttrsValues[0].values.length === 0) {
                    message.warning('请至少添加一个规格项及其规格值');
                    return;
                  }
                  
                  // 转换为 generateSpecCombinations 所需的格式
                  const specAttrsMap: Record<string, string[]> = {};
                  specAttrsValues.forEach((item: any) => {
                    if (item.key && item.values && item.values.length > 0) {
                      specAttrsMap[item.key] = item.values;
                    }
                  });
                  
                  // 如果没有有效的规格属性，提示用户
                  if (Object.keys(specAttrsMap).length === 0) {
                    message.warning('请至少添加一个规格项及其规格值');
                    return;
                  }
                  
                  // 获取实际价格作为默认价格
                  const defaultPrice = form.getFieldValue('realPrice') || 0;
                  
                  // 调用生成规格组合函数
                  generateSpecCombinations(specAttrsMap, defaultPrice);
                }}
                icon={<AppstoreOutlined />}
                size="large"
              >
                生成规格组合
              </Button>
            </div>
            
            {specCombinations.length > 0 ? (
              <div className={styles.specCombinationsTable}>
                <div className={styles.batchActions}>
                  <Space>
                    <span className={styles.batchTitle}>批量设置：</span>
                    <Button size="small" onClick={() => handleBatchSetPrice()}>统一价格</Button>
                    <Button size="small" onClick={() => handleBatchSetStock()}>统一库存</Button>
                  </Space>
                </div>
                
                <Table
                  columns={specColumns}
                  dataSource={specCombinations}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  bordered
                  className={styles.skuTable}
                />
              </div>
            ) : (
              <div className={styles.emptySpec}>
                <div className={styles.emptySpecIcon}><AppstoreOutlined /></div>
                <p>请先添加规格项并点击"生成规格组合"按钮</p>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  // 批量设置价格
  const handleBatchSetPrice = () => {
    Modal.confirm({
      title: '批量设置价格',
      content: (
        <div>
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '100%' }}
            placeholder="请输入统一价格"
            onChange={(value) => setTempBatchValue(value)}
            addonBefore="¥"
          />
        </div>
      ),
      onOk: () => {
        if (tempBatchValue !== null) {
          const newCombinations = specCombinations.map(item => ({
            ...item,
            price: tempBatchValue
          }));
          setSpecCombinations(newCombinations);
          setTempBatchValue(null);
          message.success('已批量设置价格');
        }
      },
    });
  };

  // 批量设置库存
  const handleBatchSetStock = () => {
    Modal.confirm({
      title: '批量设置库存',
      content: (
        <div>
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="请输入统一库存"
            onChange={(value) => setTempBatchValue(value)}
          />
        </div>
      ),
      onOk: () => {
        if (tempBatchValue !== null) {
          const newCombinations = specCombinations.map(item => ({
            ...item,
            stock: tempBatchValue
          }));
          setSpecCombinations(newCombinations);
          setTempBatchValue(null);
          message.success('已批量设置库存');
        }
      },
    });
  };

  useEffect(() => {
    // 监听 realPrice 变更，用于规格组合的默认价格
    const realPrice = form.getFieldValue('realPrice');
    if (realPrice && specCombinations.length === 0) {
      // 如果有实际价格但没有规格组合，可以设置一个默认值
      form.setFieldsValue({ 
        specAttrs: [{ key: '', values: [] }] 
      });
    }
  }, [form]);

  return (
    <Modal
      title={product ? '编辑商品' : '添加商品'}
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={1000}
      className={styles.productFormModal}
      okText={product ? '保存' : '添加'}
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
          price: 0,
          realPrice: 0,
          totalStock: 0,
        }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={items}
        />
      </Form>
    </Modal>
  );
};

export default ProductForm; 