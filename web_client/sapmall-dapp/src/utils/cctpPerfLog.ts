/**
 * CCTP 钱包弹窗耗时诊断日志。
 * 浏览器控制台过滤 `[CCTP:perf]` 即可按步骤看毫秒耗时。
 */

const PREFIX = '[CCTP:perf]';

export type CctpPerfTimer = {
  /** 相对本 timer 起点的耗时日志 */
  mark: (step: string, extra?: Record<string, unknown>) => void;
  /** 结束并打印总耗时 */
  done: (outcome: string, extra?: Record<string, unknown>) => void;
  /** 自起点经过的毫秒 */
  elapsed: () => number;
};

function nowMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function formatExtra(extra?: Record<string, unknown>): string {
  if (!extra || Object.keys(extra).length === 0) return '';
  try {
    return ` ${JSON.stringify(extra)}`;
  } catch {
    return '';
  }
}

/** 开始一段计时（如 burn / swap / switchChain） */
export function startCctpPerf(scope: string, meta?: Record<string, unknown>): CctpPerfTimer {
  const t0 = nowMs();
  let last = t0;
  console.log(`${PREFIX} ▶ ${scope} start${formatExtra(meta)}`);

  return {
    mark(step, extra) {
      const t = nowMs();
      const sinceStart = Math.round(t - t0);
      const sinceLast = Math.round(t - last);
      last = t;
      console.log(
        `${PREFIX} · ${scope} | ${step} | +${sinceLast}ms (累计 ${sinceStart}ms)${formatExtra(extra)}`,
      );
    },
    done(outcome, extra) {
      const total = Math.round(nowMs() - t0);
      console.log(`${PREFIX} ■ ${scope} ${outcome} | 总耗时 ${total}ms${formatExtra(extra)}`);
    },
    elapsed() {
      return Math.round(nowMs() - t0);
    },
  };
}

/** 单次异步操作包装：打印开始/结束/耗时 */
export async function timedCctpPerf<T>(
  scope: string,
  step: string,
  fn: () => Promise<T>,
  extra?: Record<string, unknown>,
): Promise<T> {
  const t0 = nowMs();
  console.log(`${PREFIX} → ${scope}/${step} begin${formatExtra(extra)}`);
  try {
    const result = await fn();
    console.log(
      `${PREFIX} ← ${scope}/${step} ok | ${Math.round(nowMs() - t0)}ms${formatExtra(extra)}`,
    );
    return result;
  } catch (err) {
    console.warn(
      `${PREFIX} ← ${scope}/${step} FAIL | ${Math.round(nowMs() - t0)}ms`,
      err,
    );
    throw err;
  }
}
