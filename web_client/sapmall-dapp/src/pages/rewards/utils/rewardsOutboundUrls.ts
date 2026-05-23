const BAGS_HOSTS = ['bags.fm', 'www.bags.fm'];

export const isAllowedBagsUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return BAGS_HOSTS.includes(hostname);
  } catch {
    return false;
  }
};

export const openBagsOutbound = (url: string): void => {
  if (!isAllowedBagsUrl(url)) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};
