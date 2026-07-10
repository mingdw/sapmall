import React, { useState } from 'react';
import { Drawer, Tag, Tooltip } from 'antd';
import { Copy, ExternalLink } from 'lucide-react';
import type { ChainNetworkInfo } from '../../../../services/api/chainApi';
import type { DeploymentRecord } from '../types';
import {
  CONTRACT_CATEGORY_LABELS,
  CONTRACT_CATEGORY_COLORS,
  CONTRACT_TYPE_LABELS,
} from '../constants';
import { mockDeploymentRecords } from '../mock/contractMockData';
import MessageUtils from '../../../../utils/messageUtils';
import styles from '../ContractManager.module.scss';

interface DeploymentRecordsProps {
  chainList: ChainNetworkInfo[];
}

const DeploymentRecords: React.FC<DeploymentRecordsProps> = ({ chainList }) => {
  const [detailRecord, setDetailRecord] = useState<DeploymentRecord | null>(null);

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

  const getExplorerUrl = (chainId: number): string | undefined => {
    const chain = chainList.find((c) => c.chainId === chainId);
    return chain?.explorerUrl;
  };

  if (mockDeploymentRecords.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>暂无部署记录</p>
        <p className={styles.emptyHint}>合约部署后，部署记录将显示在此处。</p>
      </div>
    );
  }

  return (
    <div className={styles.deploymentContainer}>
      <div className={styles.deploymentList}>
        {mockDeploymentRecords.map((record) => {
          const explorerUrl = getExplorerUrl(record.chainId);
          const deployedDate = new Date(record.deployedAt);
          const contractCount = record.contracts.length;

          return (
            <div
              key={record.id}
              className={styles.deploymentCard}
              onClick={() => setDetailRecord(record)}
            >
              <div className={styles.deploymentCardHead}>
                <div className={styles.deploymentCardTitle}>
                  <span className={styles.deploymentNetwork}>{record.network}</span>
                  <Tag className={styles.chainIdBadge}>{record.chainId}</Tag>
                </div>
                <span className={styles.deploymentDate}>
                  {deployedDate.toLocaleString('zh-CN')}
                </span>
              </div>

              <div className={styles.deploymentCardBody}>
                <div className={styles.deploymentMetaRow}>
                  <div className={styles.deploymentMetaItem}>
                    <span className={styles.deploymentMetaLabel}>部署者</span>
                    <div className={styles.deploymentAddrValue}>
                      <code className={styles.monoText}>{formatAddress(record.deployer)}</code>
                      <button
                        className={styles.iconBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(record.deployer);
                        }}
                      >
                        <Copy size={12} />
                      </button>
                      {explorerUrl && (
                        <a
                          className={styles.iconBtn}
                          href={`${explorerUrl}/address/${record.deployer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={styles.deploymentMetaItem}>
                    <span className={styles.deploymentMetaLabel}>管理员</span>
                    <div className={styles.deploymentAddrValue}>
                      <code className={styles.monoText}>{formatAddress(record.admin)}</code>
                      <button
                        className={styles.iconBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(record.admin);
                        }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.deploymentContracts}>
                  {record.contracts.map((c) => (
                    <div key={c.name} className={styles.deploymentContractItem}>
                      <span
                        className={styles.deploymentContractDot}
                        style={{ background: CONTRACT_CATEGORY_COLORS[c.category] }}
                      />
                      <span className={styles.deploymentContractName}>{c.name}</span>
                      <Tag className={styles.deploymentContractType}>
                        {CONTRACT_TYPE_LABELS[c.type]}
                      </Tag>
                      <Tooltip title={c.address}>
                        <code className={`${styles.monoText} ${styles.deploymentContractAddr}`}>
                          {formatAddress(c.address)}
                        </code>
                      </Tooltip>
                    </div>
                  ))}
                </div>

                <div className={styles.deploymentCardFooter}>
                  <span className={styles.deploymentContractCount}>
                    共 {contractCount} 个合约
                  </span>
                  {record.paymentToken && (
                    <span className={styles.deploymentToken}>
                      支付代币: <code className={styles.monoText}>{formatAddress(record.paymentToken)}</code>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 详情抽屉 */}
      <Drawer
        title={`部署记录 - ${detailRecord?.network ?? ''}`}
        open={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        width={620}
        className={styles.eventDetailDrawer}
      >
        {detailRecord && (
          <div className={styles.eventDetail}>
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>基本信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>网络</span>
                  <span className={styles.detailValue}>{detailRecord.network}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>链 ID</span>
                  <span className={styles.detailValue}>{detailRecord.chainId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>部署时间</span>
                  <span className={styles.detailValue}>
                    {new Date(detailRecord.deployedAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>合约数</span>
                  <span className={styles.detailValue}>{detailRecord.contracts.length}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>账户信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>部署者地址</span>
                  <div className={styles.detailMonoValue}>
                    <code className={styles.monoText}>{detailRecord.deployer}</code>
                    <button className={styles.iconBtn} onClick={() => handleCopy(detailRecord.deployer)}>
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>管理员地址</span>
                  <div className={styles.detailMonoValue}>
                    <code className={styles.monoText}>{detailRecord.admin}</code>
                    <button className={styles.iconBtn} onClick={() => handleCopy(detailRecord.admin)}>
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                {detailRecord.platformConfigAdmin && (
                  <div className={styles.detailItemFull}>
                    <span className={styles.detailLabel}>PlatformConfig Admin</span>
                    <div className={styles.detailMonoValue}>
                      <code className={styles.monoText}>{detailRecord.platformConfigAdmin}</code>
                      <button className={styles.iconBtn} onClick={() => handleCopy(detailRecord.platformConfigAdmin!)}>
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}
                {detailRecord.paymentToken && (
                  <div className={styles.detailItemFull}>
                    <span className={styles.detailLabel}>支付代币地址</span>
                    <div className={styles.detailMonoValue}>
                      <code className={styles.monoText}>{detailRecord.paymentToken}</code>
                      <button className={styles.iconBtn} onClick={() => handleCopy(detailRecord.paymentToken!)}>
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>合约清单</h4>
              <div className={styles.deploymentContractList}>
                {detailRecord.contracts.map((c) => (
                  <div key={c.name} className={styles.deploymentContractDetailItem}>
                    <div className={styles.deploymentContractDetailHead}>
                      <span
                        className={styles.deploymentContractDot}
                        style={{ background: CONTRACT_CATEGORY_COLORS[c.category] }}
                      />
                      <span className={styles.deploymentContractName}>{c.name}</span>
                      <Tag>{CONTRACT_CATEGORY_LABELS[c.category]}</Tag>
                      <Tag>{CONTRACT_TYPE_LABELS[c.type]}</Tag>
                    </div>
                    <div className={styles.detailMonoValue}>
                      <code className={styles.monoText}>{c.address}</code>
                      <button className={styles.iconBtn} onClick={() => handleCopy(c.address)}>
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>原始记录 (JSON)</h4>
              <pre className={styles.jsonBlock}>
                {JSON.stringify(detailRecord.raw, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DeploymentRecords;
