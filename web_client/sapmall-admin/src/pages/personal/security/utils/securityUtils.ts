export function formatAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function getScoreColor(score: number): string {
  if (score <= 30) return '#ef4444';
  if (score <= 60) return '#f59e0b';
  return '#22c55e';
}

export function calcDashArray(score: number, circumference: number): string {
  return `${(score / 100) * circumference}, ${circumference}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-');
}
