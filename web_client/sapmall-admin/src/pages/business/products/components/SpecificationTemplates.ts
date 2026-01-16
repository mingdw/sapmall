// 规格属性模板定义

export interface SpecificationTemplate {
  id: string;
  name: string;
  label: string; // 显示名称，如"颜色"、"尺寸"
  values: string[]; // 默认值列表
  icon?: string; // 图标
  description?: string; // 描述
}

// Mock数据：默认规格模板
export const DEFAULT_SPECIFICATION_TEMPLATES: SpecificationTemplate[] = [
  {
    id: 'color',
    name: '颜色',
    label: '颜色',
    values: ['红色', '蓝色', '绿色', '黄色', '黑色', '白色', '灰色', '紫色'],
    icon: '🎨',
    description: '商品颜色规格',
  },
  {
    id: 'size',
    name: '尺寸',
    label: '尺寸',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    icon: '📏',
    description: '商品尺寸规格',
  },
  {
    id: 'material',
    name: '材质',
    label: '材质',
    values: ['棉', '涤纶', '丝绸', '羊毛', '皮革', '塑料', '金属', '木材'],
    icon: '🧵',
    description: '商品材质规格',
  },
  {
    id: 'capacity',
    name: '容量',
    label: '容量',
    values: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
    icon: '💾',
    description: '存储容量规格',
  },
  {
    id: 'resolution',
    name: '分辨率',
    label: '分辨率',
    values: ['720P', '1080P', '2K', '4K', '8K'],
    icon: '📺',
    description: '显示分辨率规格',
  },
  {
    id: 'version',
    name: '版本',
    label: '版本',
    values: ['标准版', '专业版', '旗舰版', '收藏版', '限量版'],
    icon: '📦',
    description: '商品版本规格',
  },
  {
    id: 'weight',
    name: '重量',
    label: '重量',
    values: ['100g', '200g', '500g', '1kg', '2kg', '5kg'],
    icon: '⚖️',
    description: '商品重量规格',
  },
  {
    id: 'flavor',
    name: '口味',
    label: '口味',
    values: ['原味', '香草', '巧克力', '草莓', '抹茶', '咖啡'],
    icon: '🍰',
    description: '商品口味规格',
  },
];

// 根据分类ID获取规格模板（目前返回mock数据，后期对接API）
export const getSpecificationTemplatesByCategory = async (
  categoryId?: number
): Promise<SpecificationTemplate[]> => {
  // TODO: 后期对接真实API
  // if (categoryId) {
  //   const response = await api.get(`/api/admin/spec-templates?categoryId=${categoryId}`);
  //   return response.data || [];
  // }
  
  // 目前返回默认模板
  return DEFAULT_SPECIFICATION_TEMPLATES;
};
