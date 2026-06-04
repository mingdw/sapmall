import type { PhoneCountryCode } from './phoneCountryCodes';

/** 国家/地区名称：各使用当地常用书写（不随 App 界面语言切换） */
export const PHONE_COUNTRY_NATIVE_NAMES: Record<PhoneCountryCode, string> = {
  CN: '中国',
  US: 'United States',
  TW: '台灣',
  HK: '香港',
  MO: '澳門',
  JP: '日本',
  KR: '대한민국',
  SG: 'Singapore',
  MY: 'Malaysia',
  TH: 'ประเทศไทย',
  VN: 'Việt Nam',
  PH: 'Philippines',
  ID: 'Indonesia',
  IN: 'भारत',
  GB: 'United Kingdom',
  DE: 'Deutschland',
  FR: 'France',
  AU: 'Australia',
  CA: 'Canada',
  RU: 'Россия',
  BR: 'Brasil',
  AE: 'الإمارات العربية المتحدة',
};

export function getPhoneCountryNativeName(code: PhoneCountryCode): string {
  return PHONE_COUNTRY_NATIVE_NAMES[code] ?? code;
}
