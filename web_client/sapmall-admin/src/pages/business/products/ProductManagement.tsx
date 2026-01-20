import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal,
  message, 
  Spin,
  Image,
  Popconfirm,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import AdminCard from '../../../components/common/AdminCard';
import { productApi } from '../../../services/api/productApi';
import type { ProductSPU, ProductListParams } from './types';
import { ProductStatus, type ViewMode, type StatsPeriod, DEFAULT_PAGE_SIZE } from './constants';
import { parseProductImages, formatDateTime, getBlockchainExplorerUrl } from './utils';
import ProductStatusTag from './components/ProductStatusTag';
import ChainStatusTag from './components/ChainStatusTag';
import ProductToolbar from './components/ProductToolbar';
import ProductActionBar from './components/ProductActionBar';
import ProductStatsSection from './components/ProductStatsSection';
import ProductForm from './components/ProductForm';
import styles from './ProductManagement.module.scss';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductSPU[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchParams, setSearchParams] = useState<ProductListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    productName: '',
    status: '',
    chainStatus: '',
    timeRange: '',
  });
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductSPU | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('day');

  // 加载商品列表
  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  // 加载统计数据
  useEffect(() => {
    loadStats();
  }, [statsPeriod]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getProductList(searchParams);
      if (response.code === 0 && response.data) {
        setProducts(response.data.list || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载商品列表失败:', error);
      message.error('加载商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await productApi.getProductStats(statsPeriod);
      if (response.code === 0 && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams({
      ...searchParams,
      productName: value,
      page: 1,
    });
  };

  // 处理筛选
  const handleFilterChange = (key: keyof ProductListParams, value: any) => {
    setSearchParams({
      ...searchParams,
      [key]: value,
      page: 1,
    });
  };

  // 清除筛选
  const handleClearFilters = () => {
    setSearchParams({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      productName: '',
      productCode: '',
      status: '',
      chainStatus: '',
      timeRange: '',
    });
  };

  // 查询
  const handleQuery = () => {
    loadProducts();
  };

  // 处理分页
  const handleTableChange = (page: number, pageSize?: number) => {
    setSearchParams({
      ...searchParams,
      page,
      pageSize: pageSize || searchParams.pageSize,
    });
  };

  // 添加商品
  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalVisible(true);
  };

  // 编辑商品
  const handleEdit = async (record: ProductSPU) => {
    try {
      setLoading(true);
      const response = await productApi.getProductDetail(record.id);
      if (response.code === 0 && response.data) {
        setCurrentProduct(response.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error('获取商品详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除商品
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await productApi.deleteProduct(id);
      if (response.code === 0) {
        message.success('删除成功');
        await loadProducts();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的商品');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await productApi.batchDeleteProducts(selectedRowKeys as number[]);
          if (response.code === 0) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            await loadProducts();
          } else {
            message.error(response.message || '批量删除失败');
          }
        } catch (error) {
          message.error('批量删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 批量下架
  const handleBatchDeactivate = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要下架的商品');
      return;
    }

    Modal.confirm({
      title: '确认批量下架',
      content: `确定要下架选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await productApi.batchDeactivateProducts(selectedRowKeys as number[]);
          if (response.code === 0) {
            message.success('批量下架成功');
            setSelectedRowKeys([]);
            await loadProducts();
          } else {
            message.error(response.message || '批量下架失败');
          }
        } catch (error) {
          message.error('批量下架失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 导出数据
  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await productApi.exportProducts(searchParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看商品详情
  const handleViewDetail = (record: ProductSPU) => {
    handleEdit(record);
  };

  // 表格列定义
  const columns = [
    {
      title: '商品',
      key: 'product',
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      render: (_: any, record: ProductSPU) => {
        const imageList = parseProductImages(record.images);
        const firstImage = imageList.length > 0 ? imageList[0] : '';
        // 图片高度：需要容纳两行文字（名称+编码）
        const imageHeight = 44;
        const imageWidth = 44;
        
        return (
          <Tooltip title={`${record.name} (${record.code})`} placement="topLeft">
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12, 
                cursor: 'pointer', 
                width: '100%', 
                minWidth: 0,
                padding: '4px 0'
              }} 
              onClick={() => handleViewDetail(record)}
              className={styles.productCell}
            >
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt="商品图片"
                  width={imageWidth}
                  height={imageHeight}
                  style={{ 
                    objectFit: 'cover', 
                    borderRadius: 4, 
                    flexShrink: 0,
                    display: 'block'
                  }}
                  preview={false}
                />
              ) : (
                <div style={{ 
                  width: imageWidth, 
                  height: imageHeight, 
                  background: 'rgba(51, 65, 85, 0.3)', 
                  borderRadius: 4, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>无图</span>
                </div>
              )}
              <div 
                style={{ 
                  flex: 1,
                  minWidth: 0,
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  paddingTop: 2
                }}
              >
                {/* 第一行：商品名称 */}
                <span 
                  style={{ 
                    color: '#3b82f6',
                    fontSize: 12,
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    width: '100%',
                    maxWidth: '100%',
                    transition: 'color 0.2s ease',
                    wordWrap: 'break-word',
                    fontWeight: 500
                  }}
                >
                  {record.name}
                </span>
                {/* 第二行：商品编码 */}
                <span 
                  style={{ 
                    color: '#94a3b8',
                    fontSize: 11,
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                >
                  {record.code}
                </span>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number, record: ProductSPU) => {
        if (!price) return '-';
        const sapPrice = `${price} SAP`;
        const usdPrice = record.realPrice ? `$${record.realPrice}` : '';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#e2e8f0', fontSize: 12 }}>{sapPrice}</span>
            {usdPrice && <span style={{ color: '#94a3b8', fontSize: 11 }}>{usdPrice}</span>}
          </div>
        );
      },
    },
    {
      title: '库存',
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 80,
    },
    {
      title: '销量',
      dataIndex: 'totalSales',
      key: 'totalSales',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => <ProductStatusTag status={status as ProductStatus} />,
    },
    {
      title: '链上状态',
      dataIndex: 'chainStatus',
      key: 'chainStatus',
      width: 100,
      render: (_: any, record: ProductSPU) => <ChainStatusTag chainStatus={record.chainStatus} />,
    },
    {
      title: '交易地址',
      dataIndex: 'chainTxHash',
      key: 'chainTxHash',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (_: any, record: ProductSPU) => {
        if (!record.chainTxHash) {
          return <span style={{ color: '#94a3b8' }}>-</span>;
        }
        
        const explorerUrl = getBlockchainExplorerUrl(record.chainId, record.chainTxHash);
        const displayHash = record.chainTxHash.length > 16 
          ? `${record.chainTxHash.slice(0, 8)}...${record.chainTxHash.slice(-8)}`
          : record.chainTxHash;
        
        if (explorerUrl) {
          return (
            <Tooltip title={`点击查看交易详情: ${record.chainTxHash}`} placement="topLeft">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  width: '100%',
                  transition: 'color 0.2s ease'
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#60a5fa';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {displayHash}
              </a>
            </Tooltip>
          );
        }
        
        return (
          <span style={{ 
            color: '#94a3b8', 
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
          }}>
            {displayHash}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ProductSPU) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <div className={styles.productManagement}>
      <Spin spinning={loading}>
        {/* 区域一：商品概览 */}
        <ProductStatsSection
          stats={stats}
          period={statsPeriod}
          onPeriodChange={setStatsPeriod}
        />

        {/* 区域二：商品管理 */}
        <AdminCard icon="fas fa-boxes" title="商品管理">
          {/* 筛选区域和表格合并为一个整体区域 */}
          <div className={styles.filterAndTableContainer}>
            {/* 筛选工具栏 */}
            <div className={styles.filterToolbar}>
              <ProductToolbar
                searchParams={searchParams}
                viewMode={viewMode}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onViewModeChange={setViewMode}
                onAdd={handleAdd}
                selectedCount={selectedRowKeys.length}
                onBatchDelete={handleBatchDelete}
                onBatchDeactivate={handleBatchDeactivate}
                onExport={handleExport}
                onQuery={handleQuery}
              />
            </div>

            {/* 商品列表表格 */}
            {viewMode === 'table' && (
              <div className={styles.tableWrapper}>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={products}
                  rowKey="id"
                  pagination={{
                    current: searchParams.page,
                    pageSize: searchParams.pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: handleTableChange,
                    onShowSizeChange: handleTableChange,
                  }}
                  scroll={{ x: 1260 }}
                  className={styles.productTable}
                  locale={{
                    emptyText: '暂无数据',
                  }}
                />
              </div>
            )}
          </div>

          {/* 网格视图（待实现） */}
          {viewMode === 'grid' && (
            <div className={styles.gridView}>
              <p>网格视图功能待实现</p>
            </div>
          )}
        </AdminCard>
      </Spin>

      {/* 添加/编辑商品模态框 */}
      <Modal
        title={currentProduct ? '编辑商品' : '添加商品'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentProduct(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
        centered
        maskClosable={false}
      >
        <ProductForm
          product={currentProduct}
          onCancel={() => {
            setIsModalVisible(false);
            setCurrentProduct(null);
          }}
          onSuccess={() => {
            setIsModalVisible(false);
            setCurrentProduct(null);
            loadProducts();
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductManagement;
