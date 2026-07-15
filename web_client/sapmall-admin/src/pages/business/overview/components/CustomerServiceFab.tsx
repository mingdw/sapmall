import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MessageUtils from '../../../../utils/messageUtils';
import type {
  CustomerConversation,
  CustomerMessage,
  RecentOrder,
  TopProduct,
} from '../types';
import styles from '../StoreOverview.module.scss';

interface CustomerServicePanelProps {
  open: boolean;
  conversations: CustomerConversation[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  onClose: () => void;
}

type PickerMode = 'none' | 'emoji' | 'order' | 'product';

const EMOJIS = ['😀', '😁', '😊', '👍', '🙏', '❤️', '🎉', '😅', '😮', '😢', '🔥', '✅', '📦', '🚚', '💬', '✨'];

/** 钱包地址缩写 */
function shortenWallet(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function nowLabel(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 渲染气泡内容 */
const MessageBubble: React.FC<{ msg: CustomerMessage }> = ({ msg }) => {
  const type = msg.type || 'text';

  if (type === 'image' && msg.imageUrl) {
    return (
      <div className={styles.csMsgBubble}>
        <img src={msg.imageUrl} alt={msg.content || '图片'} className={styles.csMsgImage} />
        {msg.content ? <div className={styles.csMsgCaption}>{msg.content}</div> : null}
      </div>
    );
  }

  if (type === 'order' && msg.order) {
    return (
      <div className={`${styles.csMsgBubble} ${styles.csCardBubble}`}>
        <div className={styles.csCardHead}>
          <i className="fas fa-receipt" />
          订单卡片
        </div>
        <div className={styles.csCardTitle}>{msg.order.orderNo}</div>
        <div className={styles.csCardDesc}>{msg.order.productName}</div>
        <div className={styles.csCardAmount}>{msg.order.amount}</div>
      </div>
    );
  }

  if (type === 'product' && msg.product) {
    return (
      <div className={`${styles.csMsgBubble} ${styles.csCardBubble}`}>
        <div className={styles.csCardHead}>
          <i className="fas fa-box" />
          商品卡片
        </div>
        <div className={styles.csCardTitle}>{msg.product.name}</div>
        <div className={styles.csCardAmount}>{msg.product.price}</div>
      </div>
    );
  }

  return <div className={styles.csMsgBubble}>{msg.content}</div>;
};

/**
 * 客服会话面板：买家切换 + 富文本聊天输入（展示态，本地追加预览）
 */
const CustomerServicePanel: React.FC<CustomerServicePanelProps> = ({
  open,
  conversations,
  recentOrders,
  topProducts,
  onClose,
}) => {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const [localMap, setLocalMap] = useState<Record<string, CustomerMessage[]>>({});
  const [draft, setDraft] = useState('');
  const [picker, setPicker] = useState<PickerMode>('none');
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const firstUnread = conversations.find((c) => c.unread > 0);
    setActiveId(firstUnread?.id ?? conversations[0]?.id ?? '');
    setPicker('none');
    setDraft('');
    setPendingImage(null);
  }, [open, conversations]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId]
  );

  const messages = useMemo(() => {
    if (!active) return [] as CustomerMessage[];
    const extra = localMap[active.id] || [];
    return [...active.messages, ...extra];
  }, [active, localMap]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages.length, activeId]);

  const appendMessage = (msg: CustomerMessage) => {
    if (!active) return;
    setLocalMap((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] || []), msg],
    }));
  };

  const handleSend = () => {
    if (!active) return;
    const text = draft.trim();
    if (!text && !pendingImage) {
      MessageUtils.info('请输入内容或添加附件');
      return;
    }

    if (pendingImage) {
      appendMessage({
        id: `local-img-${Date.now()}`,
        from: 'merchant',
        type: 'image',
        content: text || '图片',
        imageUrl: pendingImage,
        time: nowLabel(),
      });
      setPendingImage(null);
    }

    if (text) {
      appendMessage({
        id: `local-text-${Date.now()}`,
        from: 'merchant',
        type: 'text',
        content: text,
        time: nowLabel(),
      });
    }

    setDraft('');
    setPicker('none');
    MessageUtils.success('已加入预览消息（演示，未真正发送）');
  };

  const handlePickEmoji = (emoji: string) => {
    setDraft((v) => v + emoji);
    setPicker('none');
  };

  const handlePickOrder = (order: RecentOrder) => {
    appendMessage({
      id: `local-order-${Date.now()}`,
      from: 'merchant',
      type: 'order',
      content: '订单卡片',
      time: nowLabel(),
      order: {
        orderNo: order.orderNo,
        productName: order.productName,
        amount: order.amount,
      },
    });
    setPicker('none');
    MessageUtils.success('已插入订单卡片（演示）');
  };

  const handlePickProduct = (product: TopProduct) => {
    appendMessage({
      id: `local-product-${Date.now()}`,
      from: 'merchant',
      type: 'product',
      content: '商品卡片',
      time: nowLabel(),
      product: {
        id: product.id,
        name: product.name,
        price: product.revenue,
      },
    });
    setPicker('none');
    MessageUtils.success('已插入商品卡片（演示）');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      MessageUtils.warning('请选择图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    setPendingImage(url);
    setPicker('none');
  };

  if (!open) return null;

  return createPortal(
    <div
      className={styles.csOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="客服会话"
      onClick={onClose}
    >
      <div className={styles.csPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.csTopBar}>
          <div>
            <div className={styles.csTitle}>
              <i className="fas fa-headset" />
              客户咨询
            </div>
            <div className={styles.csHint}>支持表情 / 图片 / 订单与商品卡片 · 本地演示</div>
          </div>
          <button
            type="button"
            className={styles.csClose}
            onClick={onClose}
            aria-label="关闭客服面板"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className={styles.csBody}>
          <aside className={styles.csBuyerList}>
            <div className={styles.csBuyerListHead}>会话列表</div>
            <div className={styles.csBuyerScroll}>
              {conversations.map((conv) => {
                const selected = conv.id === active?.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    className={`${styles.csBuyerItem} ${selected ? styles.csBuyerActive : ''}`}
                    onClick={() => {
                      setActiveId(conv.id);
                      setPicker('none');
                    }}
                  >
                    <div className={styles.csBuyerAvatar}>
                      {shortenWallet(conv.buyerAddress).slice(2, 4).toUpperCase()}
                    </div>
                    <div className={styles.csBuyerMeta}>
                      <div className={styles.csBuyerTop}>
                        <span className={styles.csBuyerAddr}>
                          {shortenWallet(conv.buyerAddress)}
                        </span>
                        <span className={styles.csBuyerTime}>{conv.lastTime}</span>
                      </div>
                      <div className={styles.csBuyerPreview}>
                        <span className={styles.csBuyerLast}>{conv.lastMessage}</span>
                        {conv.unread > 0 ? (
                          <span className={styles.csBuyerUnread}>{conv.unread}</span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className={styles.csChat}>
            {active ? (
              <>
                <div className={styles.csChatHead}>
                  <div>
                    <div className={styles.csChatBuyer}>
                      {shortenWallet(active.buyerAddress)}
                    </div>
                    {active.relatedOrderNo ? (
                      <div className={styles.csChatOrder}>
                        关联订单 {active.relatedOrderNo}
                      </div>
                    ) : null}
                  </div>
                  {active.unread > 0 ? (
                    <span className={styles.csChatUnreadTag}>{active.unread} 条未读</span>
                  ) : (
                    <span className={styles.csChatReadTag}>已读</span>
                  )}
                </div>

                <div className={styles.csMessages} ref={listRef}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.csMsg} ${msg.from === 'merchant' ? styles.csMsgSelf : ''}`}
                    >
                      <div className={styles.csMsgMeta}>
                        <span>{msg.from === 'merchant' ? '我' : '买家'}</span>
                        <span>{msg.time}</span>
                      </div>
                      <MessageBubble msg={msg} />
                    </div>
                  ))}
                </div>

                <div className={styles.csComposerWrap}>
                  <div className={styles.csToolRow}>
                    <button
                      type="button"
                      className={`${styles.csToolBtn} ${picker === 'emoji' ? styles.csToolActive : ''}`}
                      onClick={() => setPicker((p) => (p === 'emoji' ? 'none' : 'emoji'))}
                      title="表情"
                    >
                      <i className="fas fa-smile" />
                      表情
                    </button>
                    <button
                      type="button"
                      className={styles.csToolBtn}
                      onClick={() => fileRef.current?.click()}
                      title="图片"
                    >
                      <i className="fas fa-image" />
                      图片
                    </button>
                    <button
                      type="button"
                      className={`${styles.csToolBtn} ${picker === 'order' ? styles.csToolActive : ''}`}
                      onClick={() => setPicker((p) => (p === 'order' ? 'none' : 'order'))}
                      title="选择订单"
                    >
                      <i className="fas fa-receipt" />
                      选择订单
                    </button>
                    <button
                      type="button"
                      className={`${styles.csToolBtn} ${picker === 'product' ? styles.csToolActive : ''}`}
                      onClick={() => setPicker((p) => (p === 'product' ? 'none' : 'product'))}
                      title="选择商品"
                    >
                      <i className="fas fa-box-open" />
                      选择商品
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className={styles.csHiddenInput}
                      onChange={handleImageChange}
                    />
                  </div>

                  {picker === 'emoji' ? (
                    <div className={styles.csPickerPanel}>
                      <div className={styles.csEmojiGrid}>
                        {EMOJIS.map((e) => (
                          <button
                            key={e}
                            type="button"
                            className={styles.csEmojiBtn}
                            onClick={() => handlePickEmoji(e)}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {picker === 'order' ? (
                    <div className={styles.csPickerPanel}>
                      <div className={styles.csPickerTitle}>选择要发送的订单</div>
                      <div className={styles.csPickerList}>
                        {recentOrders.map((order) => (
                          <button
                            key={order.id}
                            type="button"
                            className={styles.csPickerItem}
                            onClick={() => handlePickOrder(order)}
                          >
                            <span className={styles.csPickerMain}>{order.orderNo}</span>
                            <span className={styles.csPickerSub}>
                              {order.productName} · {order.amount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {picker === 'product' ? (
                    <div className={styles.csPickerPanel}>
                      <div className={styles.csPickerTitle}>选择要发送的商品</div>
                      <div className={styles.csPickerList}>
                        {topProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            className={styles.csPickerItem}
                            onClick={() => handlePickProduct(product)}
                          >
                            <span className={styles.csPickerMain}>{product.name}</span>
                            <span className={styles.csPickerSub}>
                              销量 {product.salesCount} · {product.revenue}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {pendingImage ? (
                    <div className={styles.csPendingImage}>
                      <img src={pendingImage} alt="待发送图片" />
                      <button
                        type="button"
                        className={styles.csPendingRemove}
                        onClick={() => setPendingImage(null)}
                      >
                        移除
                      </button>
                    </div>
                  ) : null}

                  <div className={styles.csComposer}>
                    <textarea
                      className={styles.csTextarea}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="输入回复内容…"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button type="button" className={styles.csSend} onClick={handleSend}>
                      发送
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.csEmpty}>暂无买家消息</div>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomerServicePanel;
