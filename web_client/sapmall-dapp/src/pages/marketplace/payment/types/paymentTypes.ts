import type { ExchangeSwapToken } from '../../../../config/exchangeTokens';
import type { PhoneCountryCode } from '../../../../config/phoneCountryCodes';
import { DEFAULT_PHONE_COUNTRY } from '../../../../config/phoneCountryCodes';

export type PaymentPhase =
  | 'idle'
  | 'submitting'
  | 'intentLoading'
  | 'approving'
  | 'paying'
  | 'confirming'
  | 'success'
  | 'error'
  /** 订单已创建，用户在钱包中取消了代币授权 */
  | 'authCancelled'
  /** 订单已创建，用户在钱包中取消了 payOrder 签名 */
  | 'payCancelled';

export type ArcPaymentToken = 'USDC' | 'EURC' | 'cirBTC';

export type PaymentMethod = ExchangeSwapToken | ArcPaymentToken | 'SAP';

export interface CheckoutContactDraft {
  email: string;
  /** 本地号码（不含国家区号） */
  phone: string;
  phoneCountry: PhoneCountryCode;
  recipientName: string;
}

export const EMPTY_CONTACT: CheckoutContactDraft = {
  email: '',
  phone: '',
  phoneCountry: DEFAULT_PHONE_COUNTRY,
  recipientName: '',
};

/** 结算页促销明细行（labelKey 对应 i18n payment.summary.promotions.*） */
export interface CheckoutPromotionLine {
  id: string;
  labelKey: string;
  amount: number;
}
