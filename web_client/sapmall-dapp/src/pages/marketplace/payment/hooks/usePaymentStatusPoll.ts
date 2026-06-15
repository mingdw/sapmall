import { useCallback, useEffect, useRef, useState } from 'react';
import { orderApi, OrderPaymentStatus, toOrderPaymentStatus } from '../../../../services/api/orderApi';

const POLL_MS = 3000;

export function usePaymentStatusPoll(orderCode: string | null, enabled: boolean) {
  const [status, setStatus] = useState<OrderPaymentStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollOnce = useCallback(async () => {
    if (!orderCode) return null;
    const resp = await orderApi.getOrder(orderCode);
    const next = toOrderPaymentStatus(resp);
    setStatus(next);
    return next;
  }, [orderCode]);

  useEffect(() => {
    if (!enabled || !orderCode) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPolling(false);
      return;
    }

    setPolling(true);
    pollOnce();

    timerRef.current = setInterval(() => {
      pollOnce();
    }, POLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPolling(false);
    };
  }, [enabled, orderCode, pollOnce]);

  return { status, polling, refresh: pollOnce };
}
