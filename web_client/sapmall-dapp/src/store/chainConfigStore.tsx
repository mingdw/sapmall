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
  swapRouterAddress: string;
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
  /** force=true：忽略 TTL，应用启动时刷新后端配置 */
  fetchChainConfig: (opts?: { force?: boolean }) => Promise<void>;
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

      fetchChainConfig: async (opts) => {
        const state = get();

        // 防止重复请求
        if (state.loading) return;

        // 检查缓存是否过期（启动强制刷新时跳过）
        if (!opts?.force && state.loaded && state.lastFetchAt) {
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
                  sort: Number(chain.sort) || 0,
                  // status: 0 启用可切换，1 仅展示（与 sys_chain_network 注释一致）
                  status: Number(chain.status),
                  paymentTokens: (chain.paymentTokens ?? [])
                    .map((token) => ({
                      ...token,
                      decimals: Number(token.decimals),
                      sort: Number(token.sort) || 0,
                    }))
                    .sort((a, b) => a.sort - b.sort),
                }))
                .sort((a, b) => a.sort - b.sort || a.chainId - b.chainId),
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
        const id = Number(chainId);
        return get().chains.find((c) => Number(c.chainId) === id);
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
      //  bump：清掉旧缓存里错误的 status/sort，避免导航栏长期只开 Arc
      version: 2,
      migrate: () => ({
        chains: [],
        loaded: false,
        loading: false,
        lastFetchAt: null,
      }),
      partialize: (state) => ({
        chains: state.chains,
        loaded: state.loaded,
        lastFetchAt: state.lastFetchAt,
      }),
    }
  )
);
