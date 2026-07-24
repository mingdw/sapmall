/**
 * 产品演示视频（YouTube 风格分类横滑列表）
 * 缩略图使用 YouTube 官方封面；可通过环境变量覆盖各视频 ID
 */
export type DemoVideo = {
  id: string;
  youtubeId: string;
  /** i18n：demo.videos.{key}.title */
  titleKey: string;
  duration: string;
  publishedKey: string;
  viewsKey: string;
  hasCc?: boolean;
};

export type DemoVideoCategory = {
  id: string;
  /** i18n：demo.categories.{id} */
  titleKey: string;
  videos: readonly DemoVideo[];
};

export const DEMO_CHANNEL_NAME = 'Sapphire Mall';

const YT = {
  default: process.env.REACT_APP_DEMO_YOUTUBE_ID || 'OUI7sCNBWMQ',
  marketplace: process.env.REACT_APP_DEMO_YT_MARKETPLACE || 'OUI7sCNBWMQ',
  checkout: process.env.REACT_APP_DEMO_YT_CHECKOUT || 'OUI7sCNBWMQ',
  governance: process.env.REACT_APP_DEMO_YT_GOVERNANCE || 'OUI7sCNBWMQ',
  cctp: process.env.REACT_APP_DEMO_YT_CCTP || 'OUI7sCNBWMQ',
  wallet: process.env.REACT_APP_DEMO_YT_WALLET || 'OUI7sCNBWMQ',
  seller: process.env.REACT_APP_DEMO_YT_SELLER || 'OUI7sCNBWMQ',
} as const;

function video(
  id: string,
  youtubeId: string,
  duration: string,
  hasCc = true,
): DemoVideo {
  return {
    id,
    youtubeId,
    titleKey: `demo.videos.${id}.title`,
    duration,
    publishedKey: `demo.videos.${id}.published`,
    viewsKey: `demo.videos.${id}.views`,
    hasCc,
  };
}

/** 分类横滑：热门 / 产品功能 / 进阶玩法 */
export const demoVideoCategories: readonly DemoVideoCategory[] = [
  {
    id: 'popular',
    titleKey: 'demo.categories.popular',
    videos: [
      video('overview', YT.default, '03:42'),
      video('marketplace', YT.marketplace, '04:18'),
      video('checkout', YT.checkout, '05:06'),
      video('governance', YT.governance, '06:24', false),
      video('cctp', YT.cctp, '04:55'),
    ],
  },
  {
    id: 'product',
    titleKey: 'demo.categories.product',
    videos: [
      video('marketplace', YT.marketplace, '04:18'),
      video('checkout', YT.checkout, '05:06'),
      video('wallet', YT.wallet, '03:28'),
      video('seller', YT.seller, '05:40'),
      video('overview', YT.default, '03:42'),
    ],
  },
  {
    id: 'advanced',
    titleKey: 'demo.categories.advanced',
    videos: [
      video('cctp', YT.cctp, '04:55'),
      video('governance', YT.governance, '06:24', false),
      video('seller', YT.seller, '05:40'),
      video('wallet', YT.wallet, '03:28'),
      video('checkout', YT.checkout, '05:06'),
    ],
  },
];

/** 扁平查找（播放器标题用） */
export function findDemoVideo(id: string): DemoVideo | undefined {
  for (const cat of demoVideoCategories) {
    const hit = cat.videos.find((v) => v.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export function youtubeThumb(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`;
}
