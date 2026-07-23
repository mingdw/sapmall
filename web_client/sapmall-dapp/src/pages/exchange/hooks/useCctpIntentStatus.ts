import { useCallback, useEffect, useRef, useState } from 'react';
import cctpApi, { type CctpIntentStatus } from '../../../services/api/cctpApi';

interface UseCctpIntentStatusOptions {
  intentId: string | null;
  /** 达到该状态后停止轮询，默认 3（minted） */
  stopAtStatus?: number;
  intervalMs?: number;
  enabled?: boolean;
}

interface UseCctpIntentStatusResult {
  intent: CctpIntentStatus | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** 判断轮询结果是否相对上次有实质变化（避免无变化反复 setState 导致信息区抖动） */
function hasIntentMeaningfulChange(
  prev: CctpIntentStatus | null,
  next: CctpIntentStatus,
): boolean {
  if (!prev) return true;
  return (
    prev.status !== next.status ||
    prev.statusDesc !== next.statusDesc ||
    prev.errorMsg !== next.errorMsg ||
    prev.burnTxHash !== next.burnTxHash ||
    prev.mintTxHash !== next.mintTxHash ||
    prev.swapTxHash !== next.swapTxHash ||
    prev.burnGasFee !== next.burnGasFee ||
    prev.mintGasFee !== next.mintGasFee ||
    prev.swapGasFee !== next.swapGasFee ||
    prev.messageHash !== next.messageHash ||
    prev.completedAt !== next.completedAt ||
    prev.amountIn !== next.amountIn
  );
}

/** 轮询 GET /api/cctp/intent/:intent_id */
export function useCctpIntentStatus({
  intentId,
  stopAtStatus = 3,
  intervalMs = 5_000,
  enabled = true,
}: UseCctpIntentStatusOptions): UseCctpIntentStatusResult {
  const [intent, setIntent] = useState<CctpIntentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intentRef = useRef<CctpIntentStatus | null>(null);
  const intentIdRef = useRef(intentId);

  intentIdRef.current = intentId;

  const applyIntent = useCallback((data: CctpIntentStatus) => {
    if (!hasIntentMeaningfulChange(intentRef.current, data)) {
      return;
    }
    intentRef.current = data;
    setIntent(data);
  }, []);

  const refresh = useCallback(async () => {
    const id = intentIdRef.current;
    if (!id) return;

    // 仅首次（尚无数据）显示 loading，后续静默轮询，避免状态文字闪「...」
    const isFirstLoad = intentRef.current == null;
    if (isFirstLoad) setIsLoading(true);

    try {
      const data = await cctpApi.getIntent(id);
      if (intentIdRef.current !== id) return;
      applyIntent(data);
      setError(null);
    } catch (err) {
      if (intentIdRef.current !== id) return;
      setError(err instanceof Error ? err.message : '查询意图失败');
    } finally {
      if (isFirstLoad) setIsLoading(false);
    }
  }, [applyIntent]);

  useEffect(() => {
    if (!enabled || !intentId) {
      intentRef.current = null;
      setIntent(null);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    // 切换 intent 时清空旧单，避免短暂展示上一笔状态
    intentRef.current = null;
    setIntent(null);
    setError(null);

    void refresh();
    pollingRef.current = setInterval(() => {
      void refresh();
    }, intervalMs);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [enabled, intentId, intervalMs, refresh]);

  useEffect(() => {
    if (!intent) return;
    if (intent.status >= stopAtStatus || intent.status === 5) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [intent, stopAtStatus]);

  return { intent, isLoading, error, refresh };
}
