import { useEffect } from 'react';
import { useChainConfigStore } from '../store/chainConfigStore';

/**
 * 应用初始化时加载链配置数据。
 * 每次挂载强制拉一次（忽略本地 persist 的 loaded），避免 status/sort 变更后导航栏仍用旧缓存。
 */
export function useChainConfigInit() {
  const fetchChainConfig = useChainConfigStore((s) => s.fetchChainConfig);

  useEffect(() => {
    void fetchChainConfig({ force: true });
  }, [fetchChainConfig]);
}
