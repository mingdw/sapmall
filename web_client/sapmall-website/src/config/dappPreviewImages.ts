/** DApp 界面预览图（来源：仓库根目录 pic/，与 README 截图一致） */
export const dappPreviewImages = {
  zh: [
    { src: '/images/dapp/marketplace-zh.png', altKey: 'howItWorks.previewSteps.browse' },
    { src: '/images/dapp/wallet-pay-zh.png', altKey: 'howItWorks.previewSteps.pay' },
    { src: '/images/dapp/order-success-zh.png', altKey: 'howItWorks.previewSteps.confirm' },
  ],
  en: [
    { src: '/images/dapp/marketplace-en.png', altKey: 'howItWorks.previewSteps.browse' },
    { src: '/images/dapp/authorize-pay-en.png', altKey: 'howItWorks.previewSteps.pay' },
    { src: '/images/dapp/order-complete-en.png', altKey: 'howItWorks.previewSteps.confirm' },
  ],
} as const;

export type DappPreviewLang = keyof typeof dappPreviewImages;

export function getDappPreviewImage(lang: string, step: number) {
  const key: DappPreviewLang = lang.startsWith('zh') ? 'zh' : 'en';
  const list = dappPreviewImages[key];
  const index = Math.min(Math.max(step, 0), list.length - 1);
  return list[index];
}
