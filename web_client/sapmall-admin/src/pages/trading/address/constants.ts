import type { AddressLabel, AddressRecord, LabelMeta } from './types';

/** 省市区联动数据 */
export const REGION_DATA: Record<string, Record<string, string[]>> = {
  '北京市': {
    '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
  },
  '上海市': {
    '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
  },
  '广东省': {
    '广州市': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
    '深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
    '珠海市': ['香洲区', '斗门区', '金湾区'],
  },
  '江苏省': {
    '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
    '苏州市': ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市'],
  },
  '浙江省': {
    '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
    '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '余姚市', '慈溪市', '象山县', '宁海县'],
  },
};

/** 标签元数据映射 */
export const LABEL_META: Record<AddressLabel, LabelMeta> = {
  home:    { text: '家',   icon: 'fas fa-home',         color: '#60a5fa', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
  company: { text: '公司', icon: 'fas fa-building',     color: '#a78bfa', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)' },
  school:  { text: '学校', icon: 'fas fa-graduation-cap', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)' },
  other:   { text: '其他', icon: 'fas fa-map-pin',      color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)' },
};

/** 标签下拉选项 */
export const LABEL_OPTIONS: { value: AddressLabel; label: string }[] = [
  { value: 'home', label: '家' },
  { value: 'company', label: '公司' },
  { value: 'school', label: '学校' },
  { value: 'other', label: '其他' },
];

/** Mock 地址数据 */
export const MOCK_ADDRESSES: AddressRecord[] = [
  {
    id: 'addr_001',
    receiverName: '张三',
    receiverPhone: '138****1234',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detailAddress: '建国路88号SOHO现代城A座2208室',
    postalCode: '100022',
    addressLabel: 'company',
    isDefault: true,
    createTime: '2024-01-15',
    lastUsed: '2024-05-28',
  },
  {
    id: 'addr_002',
    receiverName: '李四',
    receiverPhone: '139****5678',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detailAddress: '陆家嘴环路1000号恒生银行大厦36楼',
    postalCode: '200120',
    addressLabel: 'company',
    isDefault: false,
    createTime: '2024-02-20',
    lastUsed: '2024-05-25',
  },
  {
    id: 'addr_003',
    receiverName: '王五',
    receiverPhone: '136****9999',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detailAddress: '深南大道10000号腾讯滨海大厦39楼',
    postalCode: '518054',
    addressLabel: 'home',
    isDefault: false,
    createTime: '2024-03-10',
    lastUsed: '2024-04-15',
  },
];

/** 手机号校验正则 */
export const PHONE_REGEX = /^1[3-9]\d{9}$/;
