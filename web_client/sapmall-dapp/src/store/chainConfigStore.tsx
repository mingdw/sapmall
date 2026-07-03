import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { baseClient } from '../services/api/baseClient';

// ========== 类型定义 ==========

export interface PaymentToken {
  symbol: string;
  displayName: string;
  contractAddress: string;
  decimals: number;
  sort: number;
}

export interface ChainNetwork {
  chainId: number;
  code: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeSymbol: string;
  platformConfigAddress: string;
  paymentRouterAddress: string;
  settlementVaultAddress: string;
  sort: number;
  status: number;
  paymentTokens: PaymentToken[];
}

// ========== Store 状态 ==========

interface ChainConfigState {
  // 数据
  chains: ChainNetwork[];
  loaded: boolean;
  loading: boolean;
  lastFetchAt: number | null;

  // 操作
  fetchChainConfig: () => Promise<void>;
  getChainByChainId: (chainId: number) => ChainNetwork | undefined;
  getPaymentTokens: (chainId: number) => PaymentToken[];
  isTokenSupported: (chainId: number, symbol: string) => boolean;
  getTokenConfig: (chainId: number, symbol: string) => PaymentToken | undefined;
  getExplorerUrl: (chainId: number, txHash: string) => string | undefined;
  clearCache: () => void;
}

// ========== 缓存过期时间（毫秒）==========
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

// ========== Store 定义 ==========

export const useChainConfigStore = create<ChainConfigState>()(
  persist(
    (set, get) => ({
      chains: [],
      loaded: false,
      loading: false,
      lastFetchAt: null,

      fetchChainConfig: async () => {
        const state = get();

        // 防止重复请求
        if (state.loading) return;

        // 检查缓存是否过期
        if (state.loaded && state.lastFetchAt) {
          const elapsed = Date.now() - state.lastFetchAt;
          if (elapsed < CACHE_TTL) return;
        }

        set({ loading: true });

        try {
          const resp = await baseClient.get<{ list: ChainNetwork[] }>(
            '/api/common/chain_config',
            { silent: true }
          );

          if (resp?.data?.list) {
            set({
              chains: resp.data.list
                .map((chain) => ({
                  ...chain,
                  chainId: Number(chain.chainId),
                }))
                .sort((a, b) => a.sort - b.sort),
              loaded: true,
              lastFetchAt: Date.now(),
            });
          }
        } catch (err) {
          console.error('[ChainConfigStore] fetch chain config failed:', err);
        } finally {
          set({ loading: false });
        }
      },

      getChainByChainId: (chainId: number) => {
        return get().chains.find((c) => c.chainId === chainId);
      },

      getPaymentTokens: (chainId: number) => {
        const chain = get().getChainByChainId(chainId);
        return chain?.paymentTokens?.sort((a, b) => a.sort - b.sort) ?? [];
      },

      isTokenSupported: (chainId: number, symbol: string) => {
        const tokens = get().getPaymentTokens(chainId);
        return tokens.some((t) => t.symbol === symbol);
      },

      getTokenConfig: (chainId: number, symbol: string) => {
        const tokens = get().getPaymentTokens(chainId);
        const normalized = symbol.trim().toUpperCase();
        return tokens.find((t) => t.symbol.trim().toUpperCase() === normalized);
      },

      getExplorerUrl: (chainId: number, txHash: string) => {
        const chain = get().getChainByChainId(chainId);
        if (!chain?.explorerUrl) return undefined;
        const hash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
        return `${chain.explorerUrl}/tx/${hash}`;
      },

      clearCache: () => {
        set({ chains: [], loaded: false, lastFetchAt: null });
      },
    }),
    {
      name: 'chain-config-storage',
      partialize: (state) => ({
        chains: state.chains,
        loaded: state.loaded,
        lastFetchAt: state.lastFetchAt,
      }),
    }
  )
);
