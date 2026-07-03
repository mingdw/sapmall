import { useEffect } from 'react';
import { useChainConfigStore } from '../store/chainConfigStore';

/**
 * 应用初始化时加载链配置数据
 * 在 App 组件中调用一次即可
 */
export function useChainConfigInit() {
  const fetchChainConfig = useChainConfigStore((s) => s.fetchChainConfig);
  const loaded = useChainConfigStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) {
      fetchChainConfig();
    }
  }, [loaded, fetchChainConfig]);
}
