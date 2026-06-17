import React, { useMemo } from 'react';
import { ConfigProvider, Descriptions, Drawer, Empty, Spin, Tag } from 'antd';
import type { GetOrderResp } from '../../../../services/api/orderApi';
import { getPaymentChainLabel, getTxExplorerUrl } from '../utils/paymentChainUtils';
import OrderProductThumb from './OrderProductThumb';
import PaymentStatusTag from './PaymentStatusTag';
import { ORDER_STATUS } from '../constants';
import styles from './OrderDetailDrawer.module.scss';

interface Props {
  open: boolean;
  loading: boolean;
  detail: GetOrderResp | null;
  onClose: () => void;
}

function formatTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatAmount(amount?: number, currency?: string): string {
  if (amount == null) return '—';
  return `${amount.toFixed(2)} ${currency || 'USDC'}`;
}

function MoneyText({
  amount,
  currency,
  prefix,
}: {
  amount?: number;
  currency?: string;
  prefix?: string;
}) {
  if (amount == null) return <span className={styles.mutedValue}>—</span>;
  return (
    <span className={styles.moneyRed}>
      {prefix}
      {formatAmount(amount, currency)}
    </span>
  );
}

function getOrderStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    [ORDER_STATUS.PENDING_PAY]: 'warning',
    [ORDER_STATUS.ON_CHAIN_CONFIRMING]: 'processing',
    [ORDER_STATUS.PAID]: 'success',
    [ORDER_STATUS.TO_SHIP]: 'processing',
    [ORDER_STATUS.SHIPPED]: 'blue',
    [ORDER_STATUS.COMPLETED]: 'green',
    [ORDER_STATUS.CANCELLED]: 'default',
    [ORDER_STATUS.EXPIRED]: 'error',
    [ORDER_STATUS.PAY_FAILED]: 'error',
  };
  return colorMap[status] || 'default';
}

const OrderDetailDrawer: React.FC<Props> = ({ open, loading, detail, onClose }) => {
  const order = detail?.order;
  const payment = detail?.payment;
  const currency = order?.currency || 'USDC';

  const drawerTheme = useMemo(
    () => ({
      components: {
        Spin: { colorPrimary: '#3b82f6' },
      },
    }),
    [],
  );

  const txExplorerUrl =
    payment?.txHash && payment.chainId
      ? getTxExplorerUrl(payment.chainId, payment.txHash)
      : undefined;

  return (
    <ConfigProvider theme={drawerTheme}>
      <Drawer
        title="订单明细"
        width={560}
        open={open}
        onClose={onClose}
        destroyOnClose
        className={styles.detailDrawer}
      >
        {loading ? (
          <div className={styles.loadingWrap}>
            <Spin tip="加载中…" />
          </div>
        ) : !order ? (
          <div className={styles.emptyWrap}>
            <Empty description="暂无订单数据" />
          </div>
        ) : (
          <div className={styles.detailContent}>
            <section className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>基本信息</h4>
              <Descriptions column={2} size="small" colon={false} className={styles.detailDescriptions}>
                <Descriptions.Item label="订单号">
                  <span className={styles.monoValue}>{order.orderCode}</span>
                </Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  <Tag
                    color={getOrderStatusColor(order.orderStatus)}
                    className={styles.detailOrderStatusTag}
                  >
                    {order.orderStatusDesc || order.orderStatus}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="支付状态">
                  <PaymentStatusTag
                    status={order.paymentStatus}
                    label={order.paymentStatusDesc}
                    className={styles.detailPaymentTag}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="下单时间">{formatTime(order.orderDate)}</Descriptions.Item>
                <Descriptions.Item label="支付截止" span={2}>{formatTime(order.expireAt)}</Descriptions.Item>
              </Descriptions>
            </section>

            <section className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>费用明细</h4>
              <Descriptions column={1} size="small" colon={false} className={styles.detailDescriptions}>
                {order.totalAmount != null ? (
                  <Descriptions.Item label="商品总额">
                    <MoneyText amount={order.totalAmount} currency={currency} />
                  </Descriptions.Item>
                ) : null}
                {order.discountAmount != null && order.discountAmount > 0 ? (
                  <Descriptions.Item label="优惠抵扣">
                    <MoneyText amount={order.discountAmount} currency={currency} prefix="-" />
                  </Descriptions.Item>
                ) : null}
                {order.payableAmount != null ? (
                  <Descriptions.Item label="应付金额">
                    <MoneyText amount={order.payableAmount} currency={currency} />
                  </Descriptions.Item>
                ) : null}
                {order.platformFeeAmount != null ? (
                  <Descriptions.Item label="手续费">
                    <MoneyText amount={order.platformFeeAmount} currency={currency} />
                  </Descriptions.Item>
                ) : null}
                {order.estGasFee != null ? (
                  <Descriptions.Item label="预估 GAS 费">
                    <MoneyText amount={order.estGasFee} currency={currency} />
                  </Descriptions.Item>
                ) : null}
                {order.orderRemark ? (
                  <Descriptions.Item label="买家留言">{order.orderRemark}</Descriptions.Item>
                ) : null}
              </Descriptions>
            </section>

            <section className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>商品快照</h4>
              <div className={styles.productRow}>
                <div className={styles.productMeta}>
                  <p className={styles.productName}>{order.productName || '—'}</p>
                  <p className={styles.productSku}>
                    SKU: {order.skuCode || order.skuId || '—'} · ×{order.productQuantity ?? '—'}
                  </p>
                </div>
              </div>
              <Descriptions
                column={1}
                size="small"
                colon={false}
                className={styles.detailDescriptions}
                style={{ marginTop: 12 }}
              >
                <Descriptions.Item label="单价">
                  {order.productPrice != null ? (
                    <MoneyText amount={order.productPrice} currency={currency} />
                  ) : (
                    '—'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </section>

            {payment ? (
              <section className={styles.sectionCard}>
                <h4 className={styles.sectionTitle}>链上支付</h4>
                <Descriptions column={1} size="small" colon={false} className={styles.detailDescriptions}>
                  <Descriptions.Item label="链名称">
                    {getPaymentChainLabel(payment.chainId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Intent ID">
                    <span className={styles.monoValue}>{payment.intentId}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="付款地址">
                    <span className={styles.monoValue}>{payment.payerAddress}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="代币">{payment.tokenSymbol}</Descriptions.Item>
                  {payment.txHash ? (
                    <Descriptions.Item label="交易哈希">
                      {txExplorerUrl ? (
                        <a
                          href={txExplorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.txLink}
                        >
                          {payment.txHash}
                        </a>
                      ) : (
                        <span className={styles.monoValue}>{payment.txHash}</span>
                      )}
                    </Descriptions.Item>
                  ) : null}
                  {payment.confirmations != null ? (
                    <Descriptions.Item label="确认数">
                      {payment.confirmations}
                      {payment.requiredConfirmations != null
                        ? ` / ${payment.requiredConfirmations}`
                        : ''}
                    </Descriptions.Item>
                  ) : null}
                  {payment.paidAt ? (
                    <Descriptions.Item label="支付时间">{formatTime(payment.paidAt)}</Descriptions.Item>
                  ) : null}
                  {payment.estGasFee != null ? (
                    <Descriptions.Item label="预估 GAS 费">
                      <MoneyText amount={payment.estGasFee} currency={currency} />
                    </Descriptions.Item>
                  ) : null}
                  <Descriptions.Item label="实际 GAS 费">
                    {payment.actGasFee != null ? (
                      <MoneyText amount={payment.actGasFee} currency={currency} />
                    ) : (
                      <span className={styles.mutedValue}>—</span>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </section>
            ) : null}

            {detail?.delivery &&
            (detail.delivery.receiverName ||
              detail.delivery.receiverPhone ||
              detail.delivery.receiverEmail) ? (
              <section className={styles.sectionCard}>
                <h4 className={styles.sectionTitle}>收货 / 联系信息</h4>
                <Descriptions column={1} size="small" colon={false} className={styles.detailDescriptions}>
                  {detail.delivery.receiverName ? (
                    <Descriptions.Item label="收件人">{detail.delivery.receiverName}</Descriptions.Item>
                  ) : null}
                  {detail.delivery.receiverPhone ? (
                    <Descriptions.Item label="手机">{detail.delivery.receiverPhone}</Descriptions.Item>
                  ) : null}
                  {detail.delivery.receiverEmail ? (
                    <Descriptions.Item label="邮箱">{detail.delivery.receiverEmail}</Descriptions.Item>
                  ) : null}
                </Descriptions>
              </section>
            ) : null}

            {detail?.promotions && detail.promotions.length > 0 ? (
              <section className={styles.sectionCard}>
                <h4 className={styles.sectionTitle}>促销明细</h4>
                <ul className={styles.promoList}>
                  {detail.promotions.map((item) => (
                    <li key={item.promoId} className={styles.promoItem}>
                      <span>{item.label || item.labelKey}</span>
                      <span className={styles.moneyRed}>-{item.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className={styles.payAmountCard}>
              <span className={styles.payAmountCardLabel}>实付金额</span>
              <span className={styles.payAmountCardValue}>
                {formatAmount(order.realAmount || order.payAmount, currency)}
              </span>
            </section>

            <div className={styles.drawerFooter}>
              <button type="button" onClick={onClose} className={styles.footerCloseBtn}>
                关闭
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </ConfigProvider>
  );
};

export default OrderDetailDrawer;