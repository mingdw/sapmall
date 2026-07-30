import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchDemoVideosConfig,
  resolveDemoCatalog,
  type DemoVideosCatalog,
  type DemoVideosConfigFile,
} from '../content/demoVideos';

type UseDemoVideosResult = {
  catalog: DemoVideosCatalog;
  loading: boolean;
  error: string | null;
  /** 原始配置（便于调试） */
  raw: DemoVideosConfigFile | null;
};

const EMPTY: DemoVideosCatalog = { channelName: 'Sapphire Mall', categories: [] };

/**
 * 运行时加载演示视频目录，并按当前语言解析文案
 */
export function useDemoVideos(): UseDemoVideosResult {
  const { i18n } = useTranslation();
  const [raw, setRaw] = useState<DemoVideosConfigFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const data = await fetchDemoVideosConfig(ac.signal);
        if (ac.signal.aborted) return;
        setRaw(data);
      } catch (err) {
        if (ac.signal.aborted) return;
        setRaw(null);
        setError(err instanceof Error ? err.message : '加载演示视频配置失败');
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const catalog = useMemo(() => {
    if (!raw) return EMPTY;
    return resolveDemoCatalog(raw, i18n.language);
  }, [raw, i18n.language]);

  return { catalog, loading, error, raw };
}
