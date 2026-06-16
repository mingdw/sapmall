package delayqueue

import (
	"context"
	"fmt"
	"time"

	"sapphire-mall/app/internal/repository"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	DefaultPollIntervalSec = 5
)

// WorkerConfig 延时队列 Worker 配置
type WorkerConfig struct {
	Enabled         bool `json:",optional"`
	PollIntervalSec int  `json:",optional"`
	QueueKey        string `json:",optional"`
}

// OrderDelayWorker 订单延时队列消费者
type OrderDelayWorker struct {
	queue    *OrderDelayQueue
	db       *gorm.DB
	interval time.Duration
	stopCh   chan struct{}
}

// NewOrderDelayWorker 创建 Worker
func NewOrderDelayWorker(rdb *redis.Client, db *gorm.DB, cfg WorkerConfig) *OrderDelayWorker {
	interval := time.Duration(DefaultPollIntervalSec) * time.Second
	if cfg.PollIntervalSec > 0 {
		interval = time.Duration(cfg.PollIntervalSec) * time.Second
	}

	return &OrderDelayWorker{
		queue:    NewOrderDelayQueue(rdb, cfg.QueueKey),
		db:       db,
		interval: interval,
		stopCh:   make(chan struct{}),
	}
}

// Start 启动后台消费协程
func (w *OrderDelayWorker) Start() {
	go w.run()
	logx.Infof("OrderDelayWorker started, poll interval: %v", w.interval)
}

// Stop 停止 Worker
func (w *OrderDelayWorker) Stop() {
	close(w.stopCh)
	logx.Info("OrderDelayWorker stopped")
}

func (w *OrderDelayWorker) run() {
	ticker := time.NewTicker(w.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			w.processBatch()
		case <-w.stopCh:
			return
		}
	}
}

func (w *OrderDelayWorker) processBatch() {
	ctx := context.Background()
	messages, _, err := w.queue.Dequeue(ctx, 100)
	if err != nil {
		logx.Errorf("OrderDelayWorker dequeue failed: %v", err)
		return
	}

	if len(messages) == 0 {
		return
	}

	logx.Infof("OrderDelayWorker processing %d expired orders", len(messages))

	for _, msg := range messages {
		if err := w.cancelOrder(ctx, msg.OrderCode); err != nil {
			logx.Errorf("OrderDelayWorker cancel order %s failed: %v", msg.OrderCode, err)
		}
	}
}

func (w *OrderDelayWorker) cancelOrder(ctx context.Context, orderCode string) error {
	orderRepo := repository.NewOrderRepository(w.db)

	// 1. 查询订单
	order, err := orderRepo.GetByOrderCode(ctx, orderCode)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			logx.Infof("Order %s not found, skip", orderCode)
			return nil
		}
		return fmt.Errorf("query order failed: %w", err)
	}

	// 2. 检查订单状态：只有待支付状态才需要取消
	if order.OrderStatus != 10 { // 10 = OrderStatusPendingPay
		logx.Infof("Order %s status is %d, not pending pay, skip", orderCode, order.OrderStatus)
		return nil
	}

	// 3. 检查支付状态：如果已支付或确认中，跳过
	if order.PaymentStatus != 1 { // 1 = PaymentStatusUnpaid
		logx.Infof("Order %s payment status is %d, not unpaid, skip", orderCode, order.PaymentStatus)
		return nil
	}

	// 4. 检查是否已过期（双重检查）
	if time.Now().Before(order.ExpireAt) {
		logx.Infof("Order %s expire_at is %v, not expired yet, skip", orderCode, order.ExpireAt)
		return nil
	}

	// 5. 事务更新订单和支付记录状态
	repo := repository.NewRepository(w.db)
	txErr := repo.Transaction(ctx, func(ctx context.Context) error {
		// 更新订单状态为已过期（80 = OrderStatusExpired）
		orderUpdates := map[string]interface{}{
			"order_status":        80,
			"order_status_desc":   "已过期",
			"payment_status":      4, // 4 = PaymentStatusClosed
			"payment_status_desc": "已关闭",
		}
		if err := orderRepo.UpdateColumnsByID(ctx, order.ID, orderUpdates); err != nil {
			return err
		}

		// 更新支付记录状态
		paymentRepo := repository.NewOrderPaymentRepository(w.db)
		paymentUpdates := map[string]interface{}{
			"payment_status":      4, // 4 = PaymentStatusClosed
			"payment_status_desc": "已关闭",
			"fail_reason":         "订单超时未支付，自动关闭",
		}
		if err := paymentRepo.UpdateColumnsByOrderID(ctx, order.ID, paymentUpdates); err != nil {
			return err
		}

		return nil
	})

	if txErr != nil {
		return fmt.Errorf("cancel order transaction failed: %w", txErr)
	}

	logx.Infof("Order %s auto cancelled due to timeout", orderCode)
	return nil
}
