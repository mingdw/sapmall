import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import type { ChainNetworkInfo } from '../../../services/api/chainApi';
import chainApi from '../../../services/api/chainApi';
import MessageUtils from '../../../utils/messageUtils';
import { ContractOverview, ChainEventTable, ListenerStatus, DeploymentRecords } from './components';
import { contractTheme } from './contractTheme';
import styles from './ContractManager.module.scss';

const ContractManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chainList, setChainList] = useState<ChainNetworkInfo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const loadChains = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await chainApi.listChainNetwork({ page: 1, pageSize: 200 });
      const list = Array.isArray(resp.data?.list) ? resp.data.list : [];
      setChainList(list);
    } catch {
      MessageUtils.error('加载链配置失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChains().catch(() => undefined);
  }, [loadChains]);

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-th-large" />
          合约总览
        </span>
      ),
      children: <ContractOverview chainList={chainList} loading={loading} />,
    },
    {
      key: 'events',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-stream" />
          链上事件
        </span>
      ),
      children: <ChainEventTable chainList={chainList} />,
    },
    {
      key: 'listeners',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-satellite-dish" />
          监听器状态
        </span>
      ),
      children: <ListenerStatus chainList={chainList} loading={loading} onRefresh={loadChains} />,
    },
    {
      key: 'deployments',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-rocket" />
          部署记录
        </span>
      ),
      children: <DeploymentRecords chainList={chainList} />,
    },
  ];

  return (
    <ConfigProvider theme={contractTheme}>
      <div className={styles.contractsPage}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h2 className={styles.pageTitle}>
              <i className="fas fa-file-contract" />
              合约管理
            </h2>
            <p className={styles.pageSubtitle}>
              管理智能合约部署、监控链上事件与监听器运行状态
            </p>
          </div>
        </div>

        <Spin spinning={loading}>
          <Tabs
            className={styles.contractTabs}
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            destroyInactiveTabPane={false}
          />
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default ContractManager;
