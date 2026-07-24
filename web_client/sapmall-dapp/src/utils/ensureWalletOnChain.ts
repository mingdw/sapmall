import type { Config } from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import type { WalletClient } from 'viem';
import {
  beginUserWalletChainSwitch,
  endUserWalletChainSwitch,
} from './walletChainSwitchGuard';
import { startCctpPerf } from './cctpPerfLog';

type WagmiChainId = (typeof import('../config/wagmi').config.chains)[number]['id'];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function readConnectorChainId(
  connector: NonNullable<ReturnType<typeof getAccount>['connector']>,
): Promise<number | null> {
  if (typeof connector.getChainId === 'function') {
    try {
      return await connector.getChainId();
    } catch {
      // 继续走 provider
    }
  }
  try {
    const provider = await connector.getProvider();
    if (provider && typeof provider === 'object' && 'request' in provider) {
      const hex = await (
        provider as { request: (args: { method: string }) => Promise<string> }
      ).request({ method: 'eth_chainId' });
      return Number.parseInt(hex, 16);
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * 确保钱包 connector 与 wagmi connection 都落在目标链，再返回可用的 WalletClient。
 *
 * 解决 CCTP 跨链场景下：
 * - switchChainAsync 更新了 connection，但 MetaMask 仍停在旧链
 * - getWalletClient({ chainId }) 抛出 ConnectorChainMismatchError
 * - WagmiChainMismatchRecovery 在主动切链期间把链抢回旧网络
 */
export async function ensureWalletOnChain(
  config: Config,
  targetChainId: number,
  switchChainAsync: (args: { chainId: WagmiChainId }) => Promise<unknown>,
  chainLabel?: string,
): Promise<WalletClient> {
  beginUserWalletChainSwitch();
  const label = chainLabel ?? `Chain ${targetChainId}`;
  const perf = startCctpPerf('ensureWalletOnChain', {
    targetChainId,
    label,
  });

  try {
    const account = getAccount(config);
    const { connector } = account;
    if (!connector) {
      throw new Error('请先连接钱包');
    }

    let connectorChainId = await readConnectorChainId(connector);
    perf.mark('readConnectorChainId', {
      connectorChainId,
      wagmiChainId: account.chainId ?? null,
      alreadyOnTarget: connectorChainId === targetChainId,
    });

    if (connectorChainId !== targetChainId) {
      perf.mark('switchChainAsync:requestWalletPopup', {
        from: connectorChainId,
        to: targetChainId,
      });
      const switchT0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
      await switchChainAsync({ chainId: targetChainId as WagmiChainId });
      perf.mark('switchChainAsync:resolved', {
        ms: Math.round(
          (typeof performance !== 'undefined' ? performance.now() : Date.now()) - switchT0,
        ),
        note: '含用户确认切链弹窗等待时间',
      });

      // 等待用户在 MetaMask 确认切链，且 connector 真正落到目标链
      // （wagmi connection 可能已先更新，此时若立刻 getWalletClient 会报 mismatch）
      let synced = false;
      let pollCount = 0;
      for (let i = 0; i < 60; i++) {
        await sleep(250);
        pollCount = i + 1;
        connectorChainId = await readConnectorChainId(connector);
        const connectionChainId = getAccount(config).chainId;
        if (connectorChainId === targetChainId && connectionChainId === targetChainId) {
          synced = true;
          break;
        }
      }

      perf.mark('waitConnectorSync', {
        synced,
        pollCount,
        pollMs: pollCount * 250,
        connectorChainId,
        wagmiChainId: getAccount(config).chainId ?? null,
      });

      if (!synced) {
        connectorChainId = await readConnectorChainId(connector);
        if (connectorChainId !== targetChainId) {
          throw new Error(
            `请在钱包中手动切换到 ${label} 后再试（当前链 ID: ${connectorChainId ?? '未知'}）`,
          );
        }
      }
    } else if (getAccount(config).chainId !== targetChainId) {
      // connector 已在目标链，但 wagmi connection 不同步 → 再调一次 switch 对齐 store
      perf.mark('alignWagmiStoreOnly', {
        connectorChainId,
        wagmiChainId: getAccount(config).chainId ?? null,
      });
      try {
        await switchChainAsync({ chainId: targetChainId as WagmiChainId });
      } catch {
        // 对齐失败时若 connector 正确，仍尝试取 client
      }
      await sleep(100);
    } else {
      perf.mark('alreadyOnTargetSkipSwitch');
    }

    await sleep(50);

    const walletClient = await getWalletClient(config, {
      chainId: targetChainId as WagmiChainId,
    });
    if (!walletClient) {
      throw new Error(`无法连接 ${label}，请确认钱包已切换到该网络`);
    }
    perf.done('ok', { hasWalletClient: true });
    return walletClient;
  } catch (err) {
    perf.done('FAIL', {
      message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  } finally {
    window.setTimeout(() => {
      endUserWalletChainSwitch();
    }, 2000);
  }
}
