import { useCallback, useEffect, useRef, useState } from 'react';
import { orderApi, OrderPaymentStatus, OrderStatusResp } from '../../../../services/api/orderApi';
import { ApiError } from '../../../../services/api/baseClient';

const POLL_MS = 5000;
const MAX_AUTO_POLL_ATTEMPTS = 10;
const MANUAL_CONFIRM_COOLDOWN_MS = 30_000;
const CONFIRMING_STATUS = 2;
const PAID_STATUS = 3;
const CLOSED_STATUS = 4;

export type ManualConfirmResult = 'paid' | 'closed' | 'still_confirming' | 'error';

function toPaymentStatus(resp: OrderStatusResp): OrderPaymentStatus {
  return {
    intentId: '',
    orderCode: resp.orderCode ?? '',
    paymentStatus: resp.paymentStatus,
    txHash: resp.txHash,
    failReason: resp.failReason,
    confirmations: resp.paymentStatus === PAID_STATUS ? 6 : 0,
    requiredConfirmations: 6,
  };
}

function isTerminalStatus(paymentStatus: number): boolean {
  return paymentStatus === PAID_STATUS || paymentStatus === CLOSED_STATUS;
}

export function usePaymentStatusPoll(
  orderCode: string | null,
  txHash: string | null,
  chainId: number | undefined,
  enabled: boolean,
) {
  const [status, setStatus] = useState<OrderPaymentStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollExhausted, setPollExhausted] = useState(false);
  const [manualConfirming, setManualConfirming] = useState(false);
  const [manualCooldownSec, setManualCooldownSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  const stopAutoPoll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPolling(false);
  }, []);

  const pollOnce = useCallback(async () => {
    if (!orderCode) return null;
    try {
      const resp = await orderApi.getStatus({
        orderCode,
        txHash: txHash || undefined,
        chainId: chainId ?? undefined,
      });
      const next = toPaymentStatus(resp);
      setStatus(next);
      return next;
    } catch (err) {
      if (err instanceof ApiError && err.status === 405) {
        console.warn('[usePaymentStatusPoll] /api/order/status 返回 405，后端路由可能未注册，跳过本次轮询');
        return null;
      }
      throw err;
    }
  }, [orderCode, txHash, chainId]);

  const markPollExhaustedIfNeeded = useCallback(() => {
    if (attemptsRef.current >= MAX_AUTO_POLL_ATTEMPTS) {
      stopAutoPoll();
      setPollExhausted(true);
    }
  }, [stopAutoPoll]);

  useEffect(() => {
    if (!enabled || !orderCode) {
      stopAutoPoll();
      setPollExhausted(false);
      setManualCooldownSec(0);
      setStatus(null);
      attemptsRef.current = 0;
      return;
    }

    setStatus(null);
    setPollExhausted(false);
    setManualCooldownSec(0);
    setPolling(true);
    attemptsRef.current = 0;
    let stopped = false;

    const runPoll = async () => {
      if (stopped) return;
      attemptsRef.current += 1;
      try {
        const next = await pollOnce();
        if (stopped) return;
        if (!next) {
          markPollExhaustedIfNeeded();
          return;
        }
        if (isTerminalStatus(next.paymentStatus)) {
          stopAutoPoll();
          return;
        }
        if (
          attemptsRef.current >= MAX_AUTO_POLL_ATTEMPTS &&
          next.paymentStatus === CONFIRMING_STATUS
        ) {
          stopAutoPoll();
          setPollExhausted(true);
        }
      } catch {
        markPollExhaustedIfNeeded();
      }
    };

    void runPoll();
    timerRef.current = setInterval(() => {
      void runPoll();
    }, POLL_MS);

    return () => {
      stopped = true;
      stopAutoPoll();
    };
  }, [enabled, orderCode, pollOnce, stopAutoPoll, markPollExhaustedIfNeeded]);

  useEffect(() => {
    if (manualCooldownSec <= 0) return;
    const timer = setInterval(() => {
      setManualCooldownSec((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [manualCooldownSec]);

  const startManualCooldown = useCallback(() => {
    setManualCooldownSec(Math.ceil(MANUAL_CONFIRM_COOLDOWN_MS / 1000));
  }, []);

  const manualConfirm = useCallback(async (): Promise<ManualConfirmResult> => {
    if (manualConfirming || manualCooldownSec > 0) return 'error';
    setManualConfirming(true);
    try {
      const next = await pollOnce();
      if (!next) return 'error';
      if (next.paymentStatus === PAID_STATUS) return 'paid';
      if (next.paymentStatus === CLOSED_STATUS) return 'closed';
      if (next.paymentStatus === CONFIRMING_STATUS) {
        startManualCooldown();
        return 'still_confirming';
      }
      startManualCooldown();
      return 'still_confirming';
    } catch {
      return 'error';
    } finally {
      setManualConfirming(false);
    }
  }, [manualConfirming, manualCooldownSec, pollOnce, startManualCooldown]);

  return {
    status,
    polling,
    pollExhausted,
    manualConfirming,
    manualCooldownSec,
    manualConfirm,
    refresh: pollOnce,
  };
}
