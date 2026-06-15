import React from 'react';
import { Descriptions, Drawer, Empty, Spin, Tag } from 'antd';
import type { GetOrderResp } from '../../../../services/api/orderApi';
import {
  orderStatusTagColor,
  paymentStatusTagColor,
} from '../constants';

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

const OrderDetailDrawer: React.FC<Props> = ({ open, loading, detail, onClose }) => {
  const order = detail?.order;
  const payment = detail?.payment;

  return (
    <Drawer
      title="订单明细"
      width={560}
      open={open}
      onClose={onClose}
      destroyOnClose
      className="[&_.ant-drawer-body]:bg-slate-50/60"
    >
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Spin tip="加载中…" />
        </div>
      ) : !order ? (
        <Empty description="暂无订单数据" />
      ) : (
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">订单信息</h4>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="订单号">
                <span className="font-mono text-xs text-slate-700">{order.orderCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={orderStatusTagColor(order.orderStatus)}>
                  {order.orderStatusDesc || order.orderStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="支付状态">
                <Tag color={paymentStatusTagColor(order.paymentStatus)}>
                  {order.paymentStatusDesc || order.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">{formatTime(order.orderDate)}</Descriptions.Item>
              <Descriptions.Item label="支付截止">{formatTime(order.expireAt)}</Descriptions.Item>
              <Descriptions.Item label="实付金额">
                {formatAmount(order.payAmount, order.currency)}
              </Descriptions.Item>
              {order.orderRemark ? (
                <Descriptions.Item label="买家留言">{order.orderRemark}</Descriptions.Item>
              ) : null}
            </Descriptions>
          </section>

          <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">商品快照</h4>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="商品">{order.productName || '—'}</Descriptions.Item>
              <Descriptions.Item label="SKU">{order.skuCode || order.skuId || '—'}</Descriptions.Item>
              <Descriptions.Item label="数量">{order.productQuantity ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="单价">
                {order.productPrice != null ? `${order.productPrice.toFixed(2)}` : '—'}
              </Descriptions.Item>
            </Descriptions>
          </section>

          {payment ? (
            <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-slate-800">链上支付</h4>
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label="Intent ID">
                  <span className="break-all font-mono text-xs">{payment.intentId}</span>
                </Descriptions.Item>
                <Descriptions.Item label="付款地址">
                  <span className="break-all font-mono text-xs">{payment.payerAddress}</span>
                </Descriptions.Item>
                <Descriptions.Item label="代币">{payment.tokenSymbol}</Descriptions.Item>
                <Descriptions.Item label="链 ID">{payment.chainId}</Descriptions.Item>
                {payment.txHash ? (
                  <Descriptions.Item label="交易哈希">
                    <span className="break-all font-mono text-xs">{payment.txHash}</span>
                  </Descriptions.Item>
                ) : null}
              </Descriptions>
            </section>
          ) : null}

          {detail?.delivery &&
          (detail.delivery.receiverName || detail.delivery.receiverPhone || detail.delivery.receiverEmail) ? (
            <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-slate-800">收货 / 联系信息</h4>
              <Descriptions column={1} size="small" colon={false}>
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
            <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-slate-800">促销明细</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                {detail.promotions.map((item) => (
                  <li
                    key={item.promoId}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span>{item.label || item.labelKey}</span>
                    <span className="font-medium text-emerald-600">-{item.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </Drawer>
  );
};

export default OrderDetailDrawer;
