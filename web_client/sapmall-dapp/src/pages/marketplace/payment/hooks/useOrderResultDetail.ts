import { useEffect, useState } from 'react';
import { orderApi, type GetOrderResp, type OrderStatusResp } from '../../../../services/api/orderApi';

const PAID_STATUS = 3;
const POLL_MS = 5000;
const MAX_POLL_ATTEMPTS = 40;

function mergeOrderWithStatusTx(
  detail: GetOrderResp,
  status: OrderStatusResp,
  txHashFallback?: string,
): GetOrderResp {
  const fallbackTx = txHashFallback?.trim();
  const statusTx = status.txHash?.trim() || fallbackTx;
  const paymentTx = detail.payment.txHash?.trim();
  const chainId = detail.payment.chainId || status.chainId;
  const mergedPayment: GetOrderResp['payment'] = {
    ...detail.payment,
    txHash: paymentTx || statusTx || detail.payment.txHash || fallbackTx,
    chainId: chainId || detail.payment.chainId,
    payAmount: detail.payment.payAmount ?? status.payAmount,
    tokenSymbol: detail.payment.tokenSymbol || status.tokenSymbol || 'USDC',
    estGasFee: detail.payment.estGasFee ?? status.gasFeeUsdc,
    paidAt: detail.payment.paidAt || status.paidAt,
  };
  const mergedOrder = {
    ...detail.order,
    totalAmount: detail.order.totalAmount ?? status.totalAmount,
    discountAmount: detail.order.discountAmount ?? status.discountAmount,
    payableAmount: detail.order.payableAmount ?? status.payableAmount,
    platformFeeAmount: detail.order.platformFeeAmount ?? status.platformFeeAmount,
  };
  if (!statusTx && paymentTx) {
    return { ...detail, order: mergedOrder, payment: mergedPayment };
  }
  return {
    ...detail,
    order: mergedOrder,
    payment: mergedPayment,
  };
}

/**
 * 结果页：先 /status（必要时轮询至已支付），再 GetOrder 拉完整订单详情
 */
export function useOrderResultDetail(params: {
  orderCode?: string;
  txHash?: string;
  chainId?: number;
}) {
  const { orderCode, txHash, chainId } = params;
  const [orderDetail, setOrderDetail] = useState<GetOrderResp | null>(null);
  const [statusDetail, setStatusDetail] = useState<OrderStatusResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const code = orderCode?.trim();
    if (!code) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    let attempts = 0;

    const fetchAfterPaid = async (): Promise<boolean> => {
      const status = await orderApi.getStatus({
        orderCode: code,
        txHash,
        chainId,
      });
      if (cancelled) return true;
      setStatusDetail(status);
      if (status.paymentStatus !== PAID_STATUS) {
        return false;
      }
      const detail = await orderApi.getOrder(code);
      if (cancelled) return true;
      setOrderDetail(mergeOrderWithStatusTx(detail, status, txHash));
      setPaymentConfirmed(true);
      setLoading(false);
      return true;
    };

    const start = async () => {
      setLoading(true);
      try {
        const done = await fetchAfterPaid();
        if (cancelled || done) {
          if (!done && !cancelled) setLoading(false);
          return;
        }
        timer = setInterval(async () => {
          attempts += 1;
          try {
            const ok = await fetchAfterPaid();
            if (ok && timer) {
              clearInterval(timer);
              timer = null;
            } else if (attempts >= MAX_POLL_ATTEMPTS && timer) {
              clearInterval(timer);
              timer = null;
              if (!cancelled) setLoading(false);
            }
          } catch {
            if (attempts >= MAX_POLL_ATTEMPTS && timer) {
              clearInterval(timer);
              timer = null;
              if (!cancelled) setLoading(false);
            }
          }
        }, POLL_MS);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [orderCode, txHash, chainId]);

  return { orderDetail, statusDetail, loading, paymentConfirmed };
}
