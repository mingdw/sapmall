import { ARC_TESTNET_CHAIN_ID } from '../../../../config/chains/arcTestnet';
import { getPhoneDialCode } from '../../../../config/phoneCountryCodes';
import type {
  CreateOrderReq,
  OrderPreviewResult,
} from '../../../../services/api/orderApi';
import type { CheckoutContactDraft, PaymentMethod } from '../types/paymentTypes';
import { calcPlatformFeeUsdc, calcTotalDueUsdc } from './paymentFee';
import { estimateGasFeeUsdc } from './estimateGasFee';

export interface BuildCreateOrderPayloadInput {
  preview: OrderPreviewResult;
  skuId: number;
  quantity: number;
  payerAddress: string;
  chainId?: number;
  paymentMethod: PaymentMethod;
  contact: CheckoutContactDraft;
  buyerMessage?: string;
}

/** 将结算页数据组装为 POST /api/order/create 请求体 */
export function buildCreateOrderPayload(input: BuildCreateOrderPayloadInput): CreateOrderReq {
  const item = input.preview.items[0];
  const discountAmount = input.preview.discountAmount ?? 0;
  const payableAmount = input.preview.totalAmount;
  const chainId = input.chainId && input.chainId > 0 ? input.chainId : ARC_TESTNET_CHAIN_ID;
  const gasFeeUsdc = estimateGasFeeUsdc(chainId);
  const platformFeeAmount = calcPlatformFeeUsdc(payableAmount, input.paymentMethod);
  const payAmount = calcTotalDueUsdc(payableAmount, input.paymentMethod, gasFeeUsdc);

  const dial = getPhoneDialCode(input.contact.phoneCountry);
  const localPhone = input.contact.phone.trim();
  const receiverPhone = dial ? `+${dial}${localPhone}` : localPhone;

  return {
    skuId: input.skuId,
    skuCode: item?.skuCode,
    productName: item?.productName,
    productPrice: item?.unitPrice,
    quantity: input.quantity,
    totalAmount: item?.subtotal,
    payerAddress: input.payerAddress,
    chainId,
    tokenSymbol: input.paymentMethod === 'USDC' ? 'USDC' : 'USDC',
    promotions: input.preview.promotions?.map((p) => ({
      promoId: p.id,
      labelKey: p.labelKey,
      amount: p.amount,
    })),
    discountAmount,
    payableAmount,
    platformFeeAmount,
    estGasFee: gasFeeUsdc,
    payAmount,
    currency: 'USDC',
    orderRemark: input.buyerMessage?.trim() || undefined,
    delivery: {
      receiverName: input.contact.recipientName.trim(),
      receiverPhone,
      receiverEmail: input.contact.email.trim(),
    },
  };
}
