import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Button, Space, Dropdown, message } from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import { EyeOutlined, EditOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { ProductDetailInfo } from '../types';
import { getTemplatesByCategory, type DetailTemplate } from './ProductDetailTemplates';
import baseClient from '../../../../services/api/baseClient';
import styles from './ProductDetailEditor.module.scss';

interface ProductDetailEditorProps {
  value?: ProductDetailInfo;
  onChange?: (value: ProductDetailInfo) => void;
  disabled?: boolean;
  productSpuId?: number;
  productSpuCode?: string;
}

// 富文本编辑器配置
const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      image: function() {
        // 图片上传处理将在组件中实现
      }
    }
  }
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'script', 'indent', 'direction',
  'color', 'background', 'align',
  'link', 'image', 'video'
];

const ProductDetailEditor: React.FC<ProductDetailEditorProps> = ({
  value,
  onChange,
  disabled = false,
  productSpuId = 0,
  productSpuCode = '',
}) => {
  // 三个编辑区域的内容
  const [detailContent, setDetailContent] = useState<string>('');
  const [packingContent, setPackingContent] = useState<string>('');
  const [afterSaleContent, setAfterSaleContent] = useState<string>('');

  // 预览模式状态（每个面板独立）
  const [previewMode, setPreviewMode] = useState<{
    detail: boolean;
    packing: boolean;
    afterSale: boolean;
  }>({
    detail: false,
    packing: false,
    afterSale: false,
  });

  // 编辑器引用
  const detailQuillRef = useRef<ReactQuill>(null);
  const packingQuillRef = useRef<ReactQuill>(null);
  const afterSaleQuillRef = useRef<ReactQuill>(null);

  // 从外部 value 初始化内容
  useEffect(() => {
    if (value) {
      setDetailContent(value.detail || '');
      setPackingContent(value.packingList || '');
      setAfterSaleContent(value.afterSale || '');
    } else {
      setDetailContent('');
      setPackingContent('');
      setAfterSaleContent('');
    }
  }, [value]);

  // 通知父组件内容变化
  const notifyChange = (detail?: string, packingList?: string, afterSale?: string) => {
    if (!onChange) return;
    
    const newValue: ProductDetailInfo = {
      productSpuId: productSpuId || value?.productSpuId || 0,
      productSpuCode: productSpuCode || value?.productSpuCode || '',
      detail: detail !== undefined ? detail : detailContent,
      packingList: packingList !== undefined ? packingList : packingContent,
      afterSale: afterSale !== undefined ? afterSale : afterSaleContent,
    };
    
    onChange(newValue);
  };

  // 处理内容变化
  const handleDetailChange = (content: string) => {
    setDetailContent(content);
    notifyChange(content);
  };

  const handlePackingChange = (content: string) => {
    setPackingContent(content);
    notifyChange(undefined, content);
  };

  const handleAfterSaleChange = (content: string) => {
    setAfterSaleContent(content);
    notifyChange(undefined, undefined, content);
  };

  // 切换预览模式
  const togglePreview = (type: 'detail' | 'packing' | 'afterSale') => {
    setPreviewMode(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 清空内容
  const handleClear = (type: 'detail' | 'packing' | 'afterSale') => {
    if (type === 'detail') {
      setDetailContent('');
      notifyChange('');
    } else if (type === 'packing') {
      setPackingContent('');
      notifyChange(undefined, '');
    } else if (type === 'afterSale') {
      setAfterSaleContent('');
      notifyChange(undefined, undefined, '');
    }
    message.success('内容已清空');
  };

  // 应用模板
  const applyTemplate = (template: DetailTemplate) => {
    if (template.category === 'detail') {
      setDetailContent(template.content);
      notifyChange(template.content);
    } else if (template.category === 'packing') {
      setPackingContent(template.content);
      notifyChange(undefined, template.content);
    } else if (template.category === 'afterSale') {
      setAfterSaleContent(template.content);
      notifyChange(undefined, undefined, template.content);
    }
    message.success(`已应用模板：${template.name}`);
  };

  // 图片上传处理
  const handleImageUpload = async (file: File, editor: ReactQuill | null) => {
    if (!editor) return;

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'product_detail');
      formData.append('folder', 'product_details');

      // 上传图片
      const response = await baseClient.upload<{ fileInfo: { url: string } }>('/api/common/upload', formData);
      
      if (response.code === 0 && response.data?.fileInfo?.url) {
        // 获取当前光标位置
        const range = editor.getEditor().getSelection(true);
        // 插入图片
        editor.getEditor().insertEmbed(range?.index || 0, 'image', response.data.fileInfo.url);
        message.success('图片上传成功');
      } else {
        message.error(response.message || '图片上传失败');
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      message.error('图片上传失败，请重试');
    }
  };

  // 配置图片上传
  const setupImageUpload = (quillRef: React.RefObject<ReactQuill>) => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const toolbar = quill.getModule('toolbar');
    
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          // 验证文件大小（5MB）
          if (file.size > 5 * 1024 * 1024) {
            message.error('图片大小不能超过 5MB');
            return;
          }
          // 验证文件类型
          if (!file.type.startsWith('image/')) {
            message.error('只能上传图片文件');
            return;
          }
          await handleImageUpload(file, quillRef.current);
        }
      };
    });
  };

  // 初始化图片上传功能
  useEffect(() => {
    if (!disabled) {
      setupImageUpload(detailQuillRef);
      setupImageUpload(packingQuillRef);
      setupImageUpload(afterSaleQuillRef);
    }
  }, [disabled]);

  // 渲染操作按钮栏
  const renderActionBar = (type: 'detail' | 'packing' | 'afterSale') => {
    const isPreview = previewMode[type];
    const templates = getTemplatesByCategory(type);

    return (
      <div className={styles.actionBar}>
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={isPreview ? <EditOutlined /> : <EyeOutlined />}
            onClick={() => togglePreview(type)}
            disabled={disabled}
            className={styles.actionButton}
          >
            {isPreview ? '编辑' : '预览'}
          </Button>
          {templates.length > 0 && (
            <Dropdown
              menu={{ items: buildTemplateMenu(type) }}
              trigger={['click']}
              disabled={disabled}
            >
              <Button
                type="text"
                size="small"
                icon={<FileTextOutlined />}
                disabled={disabled}
                className={styles.actionButton}
              >
                模板
              </Button>
            </Dropdown>
          )}
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handleClear(type)}
            disabled={disabled}
            className={styles.actionButton}
          >
            清空
          </Button>
        </Space>
      </div>
    );
  };

  // 构建模板菜单
  const buildTemplateMenu = (category: 'detail' | 'packing' | 'afterSale'): MenuProps['items'] => {
    const templates = getTemplatesByCategory(category);
    return templates.map(template => ({
      key: template.id,
      label: template.name,
      onClick: () => applyTemplate(template),
    }));
  };


  // 渲染编辑器或预览
  const renderEditorOrPreview = (
    content: string,
    onChange: (content: string) => void,
    quillRef: React.RefObject<ReactQuill>,
    type: 'detail' | 'packing' | 'afterSale'
  ) => {
    const isPreview = previewMode[type];

    if (isPreview) {
      return (
        <div className={styles.previewWrapper}>
          <div className={styles.previewContainer}>
            <div 
              className={styles.previewContent}
              dangerouslySetInnerHTML={{ __html: content || '<p style="color: #94a3b8; text-align: center; padding: 40px;">暂无内容</p>' }}
            />
          </div>
          {renderActionBar(type)}
        </div>
      );
    }

    return (
      <div className={styles.editorContainer}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={onChange}
          modules={quillModules}
          formats={quillFormats}
          readOnly={disabled}
          placeholder={`请输入${type === 'detail' ? '商品详情' : type === 'packing' ? '包装清单' : '售后服务'}内容...`}
          className={styles.quillEditor}
        />
        {renderActionBar(type)}
      </div>
    );
  };


  // Tab 配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'detail',
      label: (
        <div className={styles.tabLabel}>
          <span className={styles.tabTitle}>商品详情</span>
          <span className={styles.tabDescription}>详细介绍商品特点、功能、使用方法</span>
        </div>
      ),
      children: (
        <div className={styles.tabContent}>
          {renderEditorOrPreview(detailContent, handleDetailChange, detailQuillRef, 'detail')}
        </div>
      ),
    },
    {
      key: 'packing',
      label: (
        <div className={styles.tabLabel}>
          <span className={styles.tabTitle}>包装清单</span>
          <span className={styles.tabDescription}>列出包装中包含的所有物品</span>
        </div>
      ),
      children: (
        <div className={styles.tabContent}>
          {renderEditorOrPreview(packingContent, handlePackingChange, packingQuillRef, 'packing')}
        </div>
      ),
    },
    {
      key: 'afterSale',
      label: (
        <div className={styles.tabLabel}>
          <span className={styles.tabTitle}>售后服务</span>
          <span className={styles.tabDescription}>说明保修政策、退换货规则</span>
        </div>
      ),
      children: (
        <div className={styles.tabContent}>
          {renderEditorOrPreview(afterSaleContent, handleAfterSaleChange, afterSaleQuillRef, 'afterSale')}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.productDetailEditor}>
      <Tabs
        defaultActiveKey="detail"
        items={tabItems}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
};

export default ProductDetailEditor;
