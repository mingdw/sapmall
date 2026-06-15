import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Empty, Modal, Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AdminButton from '../../../components/common/AdminButton';
import MessageUtils from '../../../utils/messageUtils';
import chainApi from '../../../services/api/chainApi';
import type {
  ChainNetworkInfo,
  ChainPaymentTokenInfo,
  SaveChainNetworkReq,
  SaveChainPaymentTokenReq,
} from '../../../services/api/chainApi';
import styles from './ChainNetManager.module.scss';
import { chainnetTheme } from './chainnetTheme';
import {
  ChainNetworkDetailPanel,
  ChainPaymentTokenPanel,
  ChainNetworkModal,
  ChainPaymentTokenModal,
} from './components';

const ChainNetManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chainList, setChainList] = useState<ChainNetworkInfo[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>('');

  const [chainModalOpen, setChainModalOpen] = useState(false);
  const [chainSubmitting, setChainSubmitting] = useState(false);
  const [chainSavingId, setChainSavingId] = useState<number>();

  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<ChainPaymentTokenInfo | null>(null);
  const [tokenSubmitting, setTokenSubmitting] = useState(false);
  const [togglingTokenId, setTogglingTokenId] = useState<number>();

  const activeChain = useMemo(
    () => chainList.find((item) => String(item.id) === activeTabKey) ?? null,
    [chainList, activeTabKey],
  );

  const loadChains = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await chainApi.listChainNetwork({ page: 1, pageSize: 200 });
      const list = Array.isArray(resp.data?.list) ? resp.data.list : [];
      setChainList(list);
      if (list.length === 0) {
        setActiveTabKey('');
        return;
      }
      setActiveTabKey((prev) => {
        if (prev && list.some((item) => String(item.id) === prev)) return prev;
        return String(list[0].id);
      });
    } catch {
      MessageUtils.error('加载链配置失败');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    loadChains().catch(() => undefined);
  }, [loadChains]);



  const handleSaveChain = async (payload: SaveChainNetworkReq) => {
    setChainSavingId(payload.id);
    try {
      await chainApi.saveChainNetwork(payload);
      MessageUtils.success('链配置已保存');
      await loadChains();
    } catch {
      MessageUtils.error('保存链配置失败');
    } finally {
      setChainSavingId(undefined);
    }
  };

  const handleCreateChain = async (payload: SaveChainNetworkReq) => {
    setChainSubmitting(true);
    try {
      await chainApi.saveChainNetwork(payload);
      MessageUtils.success('链配置已创建');
      setChainModalOpen(false);
      const resp = await chainApi.listChainNetwork({ page: 1, pageSize: 200 });
      const list = Array.isArray(resp.data?.list) ? resp.data.list : [];
      setChainList(list);
      const created = list.find((item) => item.chainId === payload.chainId);
      if (created) setActiveTabKey(String(created.id));
    } catch {
      MessageUtils.error('保存链配置失败');
    } finally {
      setChainSubmitting(false);
    }
  };

  const handleDeleteChain = async (chain: ChainNetworkInfo) => {
    try {
      await chainApi.deleteChainNetwork(chain.id);
      MessageUtils.success('已删除链配置');
      await loadChains();
    } catch {
      MessageUtils.error('删除链配置失败');
    }
  };

  const handleSaveToken = async (payload: SaveChainPaymentTokenReq) => {
    setTokenSubmitting(true);
    try {
      await chainApi.saveChainPaymentToken(payload);
      MessageUtils.success(payload.id ? '代币已更新' : '代币已创建');
      setTokenModalOpen(false);
      setEditingToken(null);
      await loadChains();
    } catch {
      MessageUtils.error('保存支付代币失败');
    } finally {
      setTokenSubmitting(false);
    }
  };

  const handleDeleteToken = (token: ChainPaymentTokenInfo) => {
    Modal.confirm({
      title: '确认删除支付代币？',
      content: `将删除 ${token.symbol}（${token.contractAddress}）`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await chainApi.deleteChainPaymentToken(token.id);
          MessageUtils.success('已删除支付代币');
          await loadChains();
        } catch {
          MessageUtils.error('删除支付代币失败');
        }
      },
    });
  };

  const handleToggleToken = async (token: ChainPaymentTokenInfo) => {
    setTogglingTokenId(token.id);
    try {
      await chainApi.saveChainPaymentToken({ ...token, status: token.status === 0 ? 1 : 0 });
      MessageUtils.success(token.status === 0 ? '代币已禁用' : '代币已启用');
      await loadChains();
    } catch {
      MessageUtils.error('切换代币状态失败');
    } finally {
      setTogglingTokenId(undefined);
    }
  };

  const tabItems: TabsProps['items'] = chainList.map((chain) => {
    const tokens = chain.paymentTokens ?? [];
    const enabledCount = tokens.filter((t) => t.status === 0).length;

    return {
      key: String(chain.id),
      label: (
        <span className={styles.tabLabel}>
          {chain.name}
          <span className={styles.tabChainId}>{chain.chainId}</span>
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <ChainNetworkDetailPanel
            chain={chain}
            saving={chainSavingId === chain.id}
            onSave={handleSaveChain}
            onDelete={handleDeleteChain}
          />
          <ChainPaymentTokenPanel
            loading={loading && activeChain?.id === chain.id}
            list={tokens}
            enabledCount={enabledCount}
            togglingTokenId={togglingTokenId}
            onRefresh={() => loadChains().catch(() => undefined)}
            onAdd={() => {
              setActiveTabKey(String(chain.id));
              setEditingToken(null);
              setTokenModalOpen(true);
            }}
            onEdit={(token: ChainPaymentTokenInfo) => {
              setActiveTabKey(String(chain.id));
              setEditingToken(token);
              setTokenModalOpen(true);
            }}
            onToggleStatus={handleToggleToken}
            onDelete={handleDeleteToken}
          />
        </div>
      ),
    };
  });

  return (
    <ConfigProvider theme={chainnetTheme}>
      <div className={styles.chainnetPage}>
      <Spin spinning={loading}>
        {chainList.length === 0 ? (
          <div className={styles.emptyState}>
            <Empty description={null} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            <div className={styles.emptyCopy}>
              <p className={styles.emptyTitle}>暂无链配置</p>
              <p className={styles.emptyHint}>添加第一条区块链网络后，可在此配置 RPC、合约地址与支付代币。</p>
            </div>
            <AdminButton variant="primary" size="sm" className={styles.chainBtnPrimary} icon="fas fa-plus" onClick={() => setChainModalOpen(true)}>
              新增链
            </AdminButton>
          </div>
        ) : (
          <Tabs
            className={styles.chainTabs}
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={tabItems}
            destroyInactiveTabPane={false}
            tabBarExtraContent={
              <AdminButton variant="outline" size="sm" className={styles.chainBtnGhost} icon="fas fa-plus" onClick={() => setChainModalOpen(true)}>
                新增链
              </AdminButton>
            }
          />
        )}
      </Spin>

      <ChainNetworkModal
        open={chainModalOpen}
        submitting={chainSubmitting}
        initial={null}
        onCancel={() => setChainModalOpen(false)}
        onSubmit={handleCreateChain}
      />

      <ChainPaymentTokenModal
        open={tokenModalOpen}
        submitting={tokenSubmitting}
        chainId={activeChain?.chainId}
        initial={editingToken}
        onCancel={() => {
          setTokenModalOpen(false);
          setEditingToken(null);
        }}
        onSubmit={handleSaveToken}
      />
      </div>
    </ConfigProvider>
  );
};

export default ChainNetManager;
