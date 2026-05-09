/**
 * Bags / 生态外链白名单（与 docs/Bags_Activity_Marketing_PRD.md 一致）
 */

const ALLOWED_BAGS_HOSTS = new Set(['bags.fm', 'www.bags.fm', 'dev.bags.fm']);

export function isAllowedBagsOutboundUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    return ALLOWED_BAGS_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function openBagsOutbound(url: string): void {
  if (!isAllowedBagsOutboundUrl(url)) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
