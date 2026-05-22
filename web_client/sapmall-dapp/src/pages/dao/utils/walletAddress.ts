export const shortenWalletAddress = (address: string): string => {
  const trimmed = address.trim();
  if (trimmed.length < 10) {
    return trimmed;
  }
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
};
