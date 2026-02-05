import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { ProductSPU } from '../types';
import { parseImageUrls } from './ProductForm.utils';
import styles from './ProductFormnew.module.scss';

const { TextArea } = Input;

interface CategoryOption {
  value: number;
  label: string;
  code: string;
  children?: CategoryOption[];
}

interface BasicInfoStepProps {
  form: FormInstance;
  spu: ProductSPU;
  disabled?: boolean;
  category1Options: CategoryOption[];
  category2Options: CategoryOption[];
  category3Options: CategoryOption[];
  onCategory1Change: (value: number) => void;
  onCategory2Change: (value: number) => void;
  onCategory3Change: (value: number) => void;
  mainImageFileList: any[];
  additionalImageFileList: any[];
  mainImageUploadProps: any;
  additionalImageUploadProps: any;
}

/**
 * 基本信息步骤组件
 */
const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  form,
  spu,
  disabled = false,
  category1Options,
  category2Options,
  category3Options,
  onCategory1Change,
  onCategory2Change,
  onCategory3Change,
  mainImageFileList,
  additionalImageFileList,
  mainImageUploadProps,
  additionalImageUploadProps,
}) => {
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
              <Input placeholder="请输入商品SPU名称" disabled={disabled} />
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
                onChange={onCategory1Change}
                options={category1Options}
                disabled={disabled}
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
                onChange={onCategory2Change}
                options={category2Options}
                disabled={disabled || category2Options.length === 0}
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
                onChange={onCategory3Change}
                options={category3Options}
                disabled={disabled || category3Options.length === 0}
              />
            </Form.Item>
            <Form.Item name="category3Code" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品品牌" name="brand">
              <Input placeholder="请输入品牌名称" disabled={disabled} />
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
                disabled={disabled}
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
                disabled={disabled}
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
            disabled={disabled}
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
            <Upload {...mainImageUploadProps} disabled={disabled}>
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
            <Upload {...additionalImageUploadProps} disabled={disabled}>
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
};

export default BasicInfoStep;
