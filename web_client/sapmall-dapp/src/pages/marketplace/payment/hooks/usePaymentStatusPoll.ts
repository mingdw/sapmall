import { useCallback, useEffect, useRef, useState } from 'react';
import { orderApi, PaymentIntentStatus } from '../../../../services/api/orderApi';

const POLL_MS = 3000;

export function usePaymentStatusPoll(intentId: string | null, enabled: boolean) {
  const [status, setStatus] = useState<PaymentIntentStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollOnce = useCallback(async () => {
    if (!intentId) return null;
    const next = await orderApi.getPaymentIntent(intentId);
    setStatus(next);
    return next;
  }, [intentId]);

  useEffect(() => {
    if (!enabled || !intentId) {
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
  }, [enabled, intentId, pollOnce]);

  return { status, polling, refresh: pollOnce };
}
