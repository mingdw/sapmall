package order

import (
	"context"
	"fmt"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/types"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
)

const (
	createOrderLockKeyPrefix = "sapmall:order:create:lock:"
	// 略大于创单 P99，防止异常未释放时长时间阻塞同一用户同一 SKU
	createOrderLockTTL = 15 * time.Second
)

var releaseCreateOrderLockScript = redis.NewScript(`
if redis.call("GET", KEYS[1]) == ARGV[1] then
	return redis.call("DEL", KEYS[1])
end
return 0
`)

func createOrderLockKey(userID, skuID int64) string {
	return fmt.Sprintf("%s%d:%d", createOrderLockKeyPrefix, userID, skuID)
}

// acquireCreateOrderLock 获取创单分布式锁；返回 release 函数与失败响应（二者互斥）
func (l *CreateOrderLogic) acquireCreateOrderLock(userID, skuID int64) (release func(), failResp *types.BaseResp) {
	if l.svcCtx.Redis == nil {
		l.Errorf("redis client is nil, skip create order lock")
		return func() {}, nil
	}

	key := createOrderLockKey(userID, skuID)
	token := uuid.NewString()

	ok, err := l.svcCtx.Redis.SetNX(l.ctx, key, token, createOrderLockTTL).Result()
	if err != nil {
		l.Errorf("acquire create order lock failed, key=%s, err=%v", key, err)
		return nil, customererrors.FailMsg("系统繁忙，请稍后重试")
	}
	if !ok {
		return nil, customererrors.FailMsg("订单创建中，请勿重复提交")
	}

	releaseFn := func() {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		if _, err := releaseCreateOrderLockScript.Run(ctx, l.svcCtx.Redis, []string{key}, token).Result(); err != nil {
			logx.WithContext(l.ctx).Errorf("release create order lock failed, key=%s, err=%v", key, err)
		}
	}
	return releaseFn, nil
}
