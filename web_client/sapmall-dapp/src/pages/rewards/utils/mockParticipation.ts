const STORAGE_KEY = 'sapmall_rewards_claims_v1';

const readClaims = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeClaims = (claims: Record<string, boolean>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
};

export const isCampaignClaimed = (slug: string): boolean => Boolean(readClaims()[slug]);

export const markCampaignClaimed = (slug: string): void => {
  const claims = readClaims();
  claims[slug] = true;
  writeClaims(claims);
};

export const getClaimedCampaignSlugs = (): string[] =>
  Object.entries(readClaims())
    .filter(([, claimed]) => claimed)
    .map(([slug]) => slug);
