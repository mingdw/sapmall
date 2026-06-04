/** 结算页电话区号（ISO 风格 code + ITU 拨号，不含 + 前缀） */
export const PHONE_COUNTRY_CODES = [
  { code: 'CN', dial: '86' },
  { code: 'US', dial: '1' },
  { code: 'TW', dial: '886' },
  { code: 'HK', dial: '852' },
  { code: 'MO', dial: '853' },
  { code: 'JP', dial: '81' },
  { code: 'KR', dial: '82' },
  { code: 'SG', dial: '65' },
  { code: 'MY', dial: '60' },
  { code: 'TH', dial: '66' },
  { code: 'VN', dial: '84' },
  { code: 'PH', dial: '63' },
  { code: 'ID', dial: '62' },
  { code: 'IN', dial: '91' },
  { code: 'GB', dial: '44' },
  { code: 'DE', dial: '49' },
  { code: 'FR', dial: '33' },
  { code: 'AU', dial: '61' },
  { code: 'CA', dial: '1' },
  { code: 'RU', dial: '7' },
  { code: 'BR', dial: '55' },
  { code: 'AE', dial: '971' },
] as const;

export type PhoneCountryCode = (typeof PHONE_COUNTRY_CODES)[number]['code'];

export const DEFAULT_PHONE_COUNTRY: PhoneCountryCode = 'CN';

export function getPhoneDialCode(country: PhoneCountryCode): string {
  return PHONE_COUNTRY_CODES.find((c) => c.code === country)?.dial ?? '86';
}

export function isPhoneCountryCode(value: string): value is PhoneCountryCode {
  return PHONE_COUNTRY_CODES.some((c) => c.code === value);
}
