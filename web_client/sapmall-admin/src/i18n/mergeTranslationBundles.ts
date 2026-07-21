/** 深度合并多个 translation 分片（后者覆盖前者同名键） */
export function mergeTranslationBundles(
  ...bundles: Record<string, unknown>[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const bundle of bundles) {
    deepMerge(result, bundle);
  }
  return result;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const key of Object.keys(source)) {
    const value = source[key];
    const existing = target[key];
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      existing !== null &&
      typeof existing === 'object' &&
      !Array.isArray(existing)
    ) {
      deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      target[key] = value;
    }
  }
}
