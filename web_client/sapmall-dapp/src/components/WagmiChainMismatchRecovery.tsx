import { useCallback, useEffect, useRef } from 'react';
import { connect } from 'wagmi/actions';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { config } from '../config/wagmi';
import {
  isChainMismatchError,
  isConnectorNotConnectedErrorFrom,
  isRecoverableWalletChain,
  parseChainMismatchMessage,
} from '../utils/wagmiChainMismatch';
import { isUserWalletDisconnecting } from '../utils/walletDisconnectGuard';

async function readConnectorChainId(
  connector: NonNullable<ReturnType<typeof useAccount>['connector']>,
): Promise<number | null> {
  if (typeof connector.getChainId === 'function') {
    return connector.getChainId();
  }
  try {
    const provider = await connector.getProvider();
    if (provider && typeof provider === 'object' && 'request' in provider) {
      const hex = await (provider as { request: (args: { method: string }) => Promise<string> }).request({
        method: 'eth_chainId',
      });
      return Number.parseInt(hex, 16);
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * 当 wagmi connection 链与钱包实际链不一致时自动同步（常见于 MetaMask 切换网络后刷新页面）。
 * 支持 Arc / Linea / Base Sepolia 等支付链，避免 ConnectorChainMismatchError 阻断连接。
 */
export function WagmiChainMismatchRecovery() {
  const { isConnected, chainId, connector } = useAccount();
  const { error: connectError } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { disconnectAsync } = useDisconnect();
  const recoveringRef = useRef(false);
  const lastAttemptKeyRef = useRef<string | null>(null);

  const trySyncToWalletChain = useCallback(
    async (targetChainId: number, reason: string) => {
      if (isUserWalletDisconnecting()) return;
      if (!isRecoverableWalletChain(targetChainId)) return;
      const attemptKey = `${reason}:${targetChainId}`;
      if (recoveringRef.current || lastAttemptKeyRef.current === attemptKey) return;

      recoveringRef.current = true;
      lastAttemptKeyRef.current = attemptKey;

      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (switchError) {
        if (isUserWalletDisconnecting() || isConnectorNotConnectedErrorFrom(switchError)) {
          return;
        }
        console.warn('[WagmiChainMismatchRecovery] switchChain failed, reconnecting…', switchError);
        try {
          if (isUserWalletDisconnecting()) return;
          const activeConnector = connector;
          await disconnectAsync();
          if (activeConnector && !isUserWalletDisconnecting()) {
            await connect(config, {
              connector: activeConnector,
              chainId: targetChainId as (typeof config.chains)[number]['id'],
            });
          }
        } catch (reconnectError) {
          if (!isConnectorNotConnectedErrorFrom(reconnectError)) {
            console.error('[WagmiChainMismatchRecovery] reconnect failed', reconnectError);
          }
        }
      } finally {
        recoveringRef.current = false;
        window.setTimeout(() => {
          if (lastAttemptKeyRef.current === attemptKey) {
            lastAttemptKeyRef.current = null;
          }
        }, 2000);
      }
    },
    [connector, disconnectAsync, switchChainAsync],
  );

  useEffect(() => {
    if (isUserWalletDisconnecting()) return;
    if (!connectError?.message || !isChainMismatchError(connectError.message)) return;
    const parsed = parseChainMismatchMessage(connectError.message);
    if (!parsed) return;
    void trySyncToWalletChain(parsed.connectorChainId, 'connect-error');
  }, [connectError, trySyncToWalletChain]);

  useEffect(() => {
    if (!isConnected || !connector || isUserWalletDisconnecting()) return;

    let cancelled = false;
    void (async () => {
      try {
        const connectorChainId = await readConnectorChainId(connector);
        if (connectorChainId == null) return;
        if (cancelled || isUserWalletDisconnecting()) return;
        if (connectorChainId === chainId) return;
        if (!isRecoverableWalletChain(connectorChainId)) return;
        await trySyncToWalletChain(connectorChainId, 'connected-sync');
      } catch (err) {
        if (!isConnectorNotConnectedErrorFrom(err)) {
          console.warn('[WagmiChainMismatchRecovery] connector chain probe failed', err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConnected, connector, chainId, trySyncToWalletChain]);

  return null;
}
