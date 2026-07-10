import React, { useMemo, useState } from 'react';
import { Tag, Tooltip } from 'antd';
import { Copy, ExternalLink } from 'lucide-react';
import type { ChainNetworkInfo } from '../../../../services/api/chainApi';
import type { ContractCategory, ContractInfo } from '../types';
import {
  CONTRACT_CATEGORY_LABELS,
  CONTRACT_CATEGORY_COLORS,
  CONTRACT_CATEGORY_ICONS,
  CONTRACT_TYPE_LABELS,
} from '../constants';
import { CONTRACT_DEFINITIONS, mockDeploymentRecords } from '../mock/contractMockData';
import MessageUtils from '../../../../utils/messageUtils';
import styles from '../ContractManager.module.scss';

interface ContractOverviewProps {
  chainList: ChainNetworkInfo[];
  loading: boolean;
}

/** 从 chain_network + 部署记录 构建合约信息列表 */
function buildContractList(chainList: ChainNetworkInfo[]): ContractInfo[] {
  const result: ContractInfo[] = [];

  for (const chain of chainList) {
    const deployment = mockDeploymentRecords.find((d) => d.chainId === chain.chainId);
    const deployedAddresses: Record<string, string> = {};
    if (deployment) {
      for (const c of deployment.contracts) {
        deployedAddresses[c.name] = c.address;
      }
    }

    for (const def of CONTRACT_DEFINITIONS) {
      let address = '';
      let status: 'deployed' | 'notConfigured' = 'notConfigured';
      let version: string | undefined;

      // 映射合约名称到 chain_network 字段
      switch (def.name) {
        case 'PaymentRouter':
          address = chain.paymentRouterAddress || deployedAddresses['PaymentRouter'] || '';
          break;
        case 'SettlementVault':
          address = chain.settlementVaultAddress || deployedAddresses['SettlementVault'] || '';
          break;
        case 'SAPSwapRouter':
          address = chain.swapRouterAddress || deployedAddresses['SAPSwapRouter'] || '';
          break;
        case 'PlatformConfig':
          address = chain.platformConfigAddress || deployedAddresses['PlatformConfig'] || '';
          break;
        case 'PaymentRouterImpl':
          address = deployedAddresses['PaymentRouterImpl'] || '';
          break;
        case 'SAPSwapRouterImpl':
          address = deployedAddresses['SAPSwapRouterImpl'] || '';
          break;
        case 'SAPToken':
          address = deployedAddresses['SAPToken'] || '';
          break;
        case 'SAPTokenImpl':
          address = deployedAddresses['SAPTokenImpl'] || '';
          break;
        case 'PlatformConfigImpl':
          address = deployedAddresses['PlatformConfigImpl'] || '';
          break;
        default:
          address = deployedAddresses[def.name] || '';
      }

      if (address && address !== '0x0000000000000000000000000000000000000000') {
        status = 'deployed';
      }

      if (deployment) {
        version = 'v1.0';
      }

      result.push({
        id: `${chain.chainId}-${def.name}`,
        name: def.name,
        category: def.category,
        type: def.type,
        address,
        chainId: chain.chainId,
        chainName: chain.name,
        chainCode: chain.code,
        explorerUrl: chain.explorerUrl,
        version,
        deployedAt: deployment?.deployedAt,
        status,
        description: def.description,
      });
    }
  }

  return result;
}

const ContractOverview: React.FC<ContractOverviewProps> = ({ chainList, loading }) => {
  const [activeChainId, setActiveChainId] = useState<number | null>(null);

  const contractList = useMemo(() => buildContractList(chainList), [chainList]);

  const filteredContracts = useMemo(() => {
    if (activeChainId === null) return contractList;
    return contractList.filter((c) => c.chainId === activeChainId);
  }, [contractList, activeChainId]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<ContractCategory, ContractInfo[]> = {
      payment: [],
      swap: [],
      token: [],
      platformConfig: [],
    };
    for (const c of filteredContracts) {
      groups[c.category].push(c);
    }
    return groups;
  }, [filteredContracts]);

  const stats = useMemo(() => {
    const total = filteredContracts.length;
    const deployed = filteredContracts.filter((c) => c.status === 'deployed').length;
    const notConfigured = total - deployed;
    return { total, deployed, notConfigured };
  }, [filteredContracts]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      MessageUtils.success('已复制到剪贴板');
    }).catch(() => {
      MessageUtils.error('复制失败');
    });
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return <div className={styles.loadingState}>加载中...</div>;
  }

  if (chainList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>暂无链配置</p>
        <p className={styles.emptyHint}>请先在「链网络管理」中添加区块链网络配置。</p>
      </div>
    );
  }

  const categoryOrder: ContractCategory[] = ['payment', 'swap', 'token', 'platformConfig'];

  return (
    <div className={styles.overviewContainer}>
      {/* 链切换标签 */}
      <div className={styles.chainFilterBar}>
        <button
          className={`${styles.chainFilterBtn} ${activeChainId === null ? styles.chainFilterBtnActive : ''}`}
          onClick={() => setActiveChainId(null)}
        >
          全部
        </button>
        {chainList.map((chain) => (
          <button
            key={chain.id}
            className={`${styles.chainFilterBtn} ${activeChainId === chain.chainId ? styles.chainFilterBtnActive : ''}`}
            onClick={() => setActiveChainId(chain.chainId)}
          >
            {chain.name}
            <span className={styles.chainFilterId}>{chain.chainId}</span>
          </button>
        ))}
      </div>

      {/* 统计概览 */}
      <div className={styles.statsBar}>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>合约总数</span>
          <span className={styles.statsValue}>{stats.total}</span>
        </div>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>已部署</span>
          <span className={`${styles.statsValue} ${styles.statsValueOk}`}>{stats.deployed}</span>
        </div>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>未配置</span>
          <span className={`${styles.statsValue} ${styles.statsValueWarn}`}>{stats.notConfigured}</span>
        </div>
      </div>

      {/* 按分类分组展示 */}
      {categoryOrder.map((category) => {
        const contracts = groupedByCategory[category];
        if (contracts.length === 0) return null;

        return (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <i className={`${CONTRACT_CATEGORY_ICONS[category]} ${styles.categoryIcon}`} style={{ color: CONTRACT_CATEGORY_COLORS[category] }} />
              <span className={styles.categoryTitle}>{CONTRACT_CATEGORY_LABELS[category]}</span>
              <span className={styles.categoryCount}>{contracts.length}</span>
            </div>
            <div className={styles.contractCardGrid}>
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className={`${styles.contractCard} ${contract.status === 'notConfigured' ? styles.contractCardInactive : ''}`}
                >
                  <div className={styles.contractCardHead}>
                    <span className={styles.contractName}>{contract.name}</span>
                    <div className={styles.contractTags}>
                      <Tag className={styles.contractTypeTag}>{CONTRACT_TYPE_LABELS[contract.type]}</Tag>
                      {contract.status === 'deployed' ? (
                        <Tag color="success" className={styles.contractStatusTag}>已部署</Tag>
                      ) : (
                        <Tag color="default" className={styles.contractStatusTag}>未配置</Tag>
                      )}
                    </div>
                  </div>
                  {contract.description && (
                    <p className={styles.contractDesc}>{contract.description}</p>
                  )}
                  <div className={styles.contractCardBody}>
                    <div className={styles.contractAddrRow}>
                      <span className={styles.contractAddrLabel}>地址</span>
                      {contract.address ? (
                        <div className={styles.contractAddrValue}>
                          <code className={styles.monoText}>{formatAddress(contract.address)}</code>
                          <Tooltip title="复制地址">
                            <button className={styles.iconBtn} onClick={() => handleCopy(contract.address)}>
                              <Copy size={12} />
                            </button>
                          </Tooltip>
                          {contract.explorerUrl && (
                            <Tooltip title="在浏览器中查看">
                              <a
                                className={styles.iconBtn}
                                href={`${contract.explorerUrl}/address/${contract.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </Tooltip>
                          )}
                        </div>
                      ) : (
                        <span className={styles.contractAddrEmpty}>—</span>
                      )}
                    </div>
                    <div className={styles.contractMeta}>
                      <span className={styles.contractMetaItem}>
                        <span className={styles.contractMetaLabel}>链</span>
                        <span>{contract.chainName}</span>
                      </span>
                      {contract.version && (
                        <span className={styles.contractMetaItem}>
                          <span className={styles.contractMetaLabel}>版本</span>
                          <span>{contract.version}</span>
                        </span>
                      )}
                      {contract.deployedAt && (
                        <span className={styles.contractMetaItem}>
                          <span className={styles.contractMetaLabel}>部署时间</span>
                          <span>{new Date(contract.deployedAt).toLocaleDateString('zh-CN')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContractOverview;
