package delayqueue

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	DefaultQueueKey    = "order:delay_queue"
	DefaultExpireMins  = 30
)

// OrderDelayMessage 延时消息体
type OrderDelayMessage struct {
	OrderCode  string    `json:"order_code"`
	ExpireAt   time.Time `json:"expire_at"`
	CreatedAt  time.Time `json:"created_at"`
}

// OrderDelayQueue 订单延时队列
type OrderDelayQueue struct {
	rdb      *redis.Client
	queueKey string
}

// NewOrderDelayQueue 创建延时队列实例
func NewOrderDelayQueue(rdb *redis.Client, queueKey string) *OrderDelayQueue {
	if queueKey == "" {
		queueKey = DefaultQueueKey
	}
	return &OrderDelayQueue{
		rdb:      rdb,
		queueKey: queueKey,
	}
}

// Enqueue 订单创建时调用，将订单加入延时队列
// score = expireAt 的 Unix 时间戳（秒）
func (q *OrderDelayQueue) Enqueue(ctx context.Context, orderCode string, expireAt time.Time) error {
	msg := OrderDelayMessage{
		OrderCode: orderCode,
		ExpireAt:  expireAt,
		CreatedAt: time.Now(),
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("marshal delay message failed: %w", err)
	}

	score := float64(expireAt.Unix())
	return q.rdb.ZAdd(ctx, q.queueKey, redis.Z{
		Score:  score,
		Member: string(data),
	}).Err()
}

// Dequeue 获取已过期的消息（score <= now）
// 返回值: 消息列表, 删除用的member列表, 错误
func (q *OrderDelayQueue) Dequeue(ctx context.Context, batchSize int) ([]OrderDelayMessage, []string, error) {
	if batchSize <= 0 {
		batchSize = 100
	}

	now := float64(time.Now().Unix())

	// 1. 获取已过期的消息（原子操作：获取 + 删除）
	// 使用 Lua 脚本保证原子性：先获取再删除，避免并发重复消费
	luaScript := `
		local key = KEYS[1]
		local maxScore = tonumber(ARGV[1])
		local limit = tonumber(ARGV[2])
		
		-- 获取 score <= maxScore 的消息
		local items = redis.call('ZRANGEBYSCORE', key, '-inf', maxScore, 'LIMIT', 0, limit)
		if #items == 0 then
			return {}
		end
		
		-- 删除这些消息
		for i, item in ipairs(items) do
			redis.call('ZREM', key, item)
		end
		
		return items
	`

	results, err := q.rdb.Eval(ctx, luaScript, []string{q.queueKey}, now, batchSize).StringSlice()
	if err != nil {
		return nil, nil, fmt.Errorf("dequeue failed: %w", err)
	}

	var messages []OrderDelayMessage
	var members []string
	for _, raw := range results {
		var msg OrderDelayMessage
		if json.Unmarshal([]byte(raw), &msg) == nil {
			messages = append(messages, msg)
			members = append(members, raw)
		}
	}

	return messages, members, nil
}

// Remove 移除指定订单的延时消息（订单已支付时调用）
func (q *OrderDelayQueue) Remove(ctx context.Context, orderCode string) error {
	// 遍历队列查找并移除（消息体较大，需要反序列化匹配）
	members, err := q.rdb.ZRangeWithScores(ctx, q.queueKey, 0, -1).Result()
	if err != nil {
		return fmt.Errorf("remove delay message failed: %w", err)
	}

	for _, member := range members {
		var msg OrderDelayMessage
		if json.Unmarshal([]byte(member.Member.(string)), &msg) == nil {
			if msg.OrderCode == orderCode {
				return q.rdb.ZRem(ctx, q.queueKey, member.Member).Err()
			}
		}
	}
	return nil
}

// Size 获取队列长度
func (q *OrderDelayQueue) Size(ctx context.Context) (int64, error) {
	return q.rdb.ZCard(ctx, q.queueKey).Result()
}
