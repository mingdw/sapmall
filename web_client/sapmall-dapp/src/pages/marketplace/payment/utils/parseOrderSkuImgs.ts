/** 解析订单快照 skuImgs（JSON 数组 / 逗号分隔 / 单 URL） */
export function parseOrderSkuImgs(raw?: string): string[] {
  if (!raw?.trim()) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (item != null ? String(item).trim() : ''))
          .filter(Boolean);
      }
      if (typeof parsed === 'string' && parsed.trim()) {
        return [parsed.trim()];
      }
    } catch {
      // 降级为分隔解析
    }
  }
  return trimmed
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
