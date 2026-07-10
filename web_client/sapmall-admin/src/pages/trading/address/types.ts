/** 收货地址标签 */
export type AddressLabel = 'home' | 'company' | 'school' | 'other';

/** 收货地址记录 */
export interface AddressRecord {
  id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode: string;
  addressLabel: AddressLabel;
  isDefault: boolean;
  createTime: string;
  lastUsed: string;
}

/** 地址表单值 */
export interface AddressFormValues {
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode: string;
  addressLabel: AddressLabel;
  isDefault: boolean;
}

/** 标签元数据 */
export interface LabelMeta {
  text: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}
