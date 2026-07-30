/**
 * 演示视频目录：运行时从 JSON 配置加载（可本地 public 或远程 URL）
 *
 * 优先级：
 * 1. REACT_APP_DEMO_VIDEOS_URL（CDN / 对象存储 / 后端静态文件）
 * 2. 站点内 /config/demo-videos.json
 */

export type LocaleText = {
  zh?: string;
  en?: string;
  /** 缺省语言回退 */
  default?: string;
};

export type DemoVideoConfigItem = {
  id: string;
  /** YouTube 视频 ID；与 url 二选一即可 */
  youtubeId?: string;
  /** 完整链接（youtu.be / watch?v= / embed/），会自动解析 ID */
  url?: string;
  duration?: string;
  hasCc?: boolean;
  /** 自定义封面；缺省用 YouTube 官方缩略图 */
  thumbUrl?: string;
  title: LocaleText | string;
  views?: LocaleText | string;
  published?: LocaleText | string;
};

export type DemoCategoryConfig = {
  id: string;
  title: LocaleText | string;
  videos: DemoVideoConfigItem[];
};

export type DemoVideosConfigFile = {
  channelName?: LocaleText | string;
  categories: DemoCategoryConfig[];
};

/** 页面渲染用（已按当前语言解析） */
export type DemoVideo = {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  views: string;
  published: string;
  hasCc?: boolean;
  thumbUrl?: string;
};

export type DemoVideoCategory = {
  id: string;
  title: string;
  videos: DemoVideo[];
};

export type DemoVideosCatalog = {
  channelName: string;
  categories: DemoVideoCategory[];
};

const DEFAULT_CONFIG_PATH = '/config/demo-videos.json';

/** 从 watch / youtu.be / embed / shorts 链接解析视频 ID */
export function extractYoutubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
      if (embedIdx >= 0 && parts[embedIdx + 1] && /^[\w-]{11}$/.test(parts[embedIdx + 1])) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    // 非 URL
  }
  return null;
}

function pickLocale(value: LocaleText | string | undefined, lang: string, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  const isZh = lang.toLowerCase().startsWith('zh');
  if (isZh) return value.zh || value.default || value.en || fallback;
  return value.en || value.default || value.zh || fallback;
}

export function resolveDemoCatalog(
  file: DemoVideosConfigFile,
  lang: string,
): DemoVideosCatalog {
  const categories: DemoVideoCategory[] = (file.categories ?? [])
    .map((cat) => {
      const videos = (cat.videos ?? [])
        .map((item): DemoVideo | null => {
          const youtubeId =
            (item.youtubeId && extractYoutubeId(item.youtubeId)) ||
            (item.url && extractYoutubeId(item.url)) ||
            null;
          if (!youtubeId) return null;
          return {
            id: item.id || youtubeId,
            youtubeId,
            title: pickLocale(item.title, lang, item.id || youtubeId),
            duration: item.duration?.trim() || '',
            views: pickLocale(item.views, lang),
            published: pickLocale(item.published, lang),
            hasCc: item.hasCc,
            thumbUrl: item.thumbUrl?.trim() || undefined,
          };
        })
        .filter((v): v is DemoVideo => !!v);

      if (!videos.length) return null;
      return {
        id: cat.id,
        title: pickLocale(cat.title, lang, cat.id),
        videos,
      };
    })
    .filter((c): c is DemoVideoCategory => !!c);

  return {
    channelName: pickLocale(file.channelName, lang, 'Sapphire Mall'),
    categories,
  };
}

export function findDemoVideo(
  categories: readonly DemoVideoCategory[],
  id: string,
): DemoVideo | undefined {
  for (const cat of categories) {
    const hit = cat.videos.find((v) => v.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export function youtubeThumb(youtubeId: string, thumbUrl?: string): string {
  return youtubeThumbCandidates(youtubeId, thumbUrl)[0];
}

/**
 * 封面候选：自定义 URL 优先，其次 YouTube 官方多档缩略图（部分视频无 maxres）
 */
export function youtubeThumbCandidates(youtubeId: string, thumbUrl?: string): string[] {
  const list: string[] = [];
  if (thumbUrl?.trim()) list.push(thumbUrl.trim());
  // hqdefault 兼容性最好；sd/mq 作降级；maxres 画质高但常 404
  list.push(
    `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
  );
  return Array.from(new Set(list));
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function youtubeEmbedUrl(youtubeId: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

/** 配置地址：远程优先，否则站点内 JSON */
export function getDemoVideosConfigUrl(): string {
  const remote = process.env.REACT_APP_DEMO_VIDEOS_URL?.trim();
  if (remote) return remote;
  return DEFAULT_CONFIG_PATH;
}

export async function fetchDemoVideosConfig(signal?: AbortSignal): Promise<DemoVideosConfigFile> {
  const url = getDemoVideosConfigUrl();
  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error(`加载演示视频配置失败：HTTP ${res.status}`);
  }
  const data = (await res.json()) as DemoVideosConfigFile;
  if (!data || !Array.isArray(data.categories)) {
    throw new Error('演示视频配置格式无效：缺少 categories');
  }
  return data;
}
