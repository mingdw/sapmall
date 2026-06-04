export function truncateProductBrief(text: string | undefined, maxLen = 56): string {
  if (!text?.trim()) return '';
  const line = text.split('\n').map((s) => s.trim()).find(Boolean) ?? '';
  if (!line) return '';
  if (line.length <= maxLen) return line;
  return `${line.slice(0, maxLen)}…`;
}
