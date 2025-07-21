package common

import (
	"context"
	"crypto/rand"
	"math/big"
	"strconv"
	"time"

	"sapphire-mall/app/internal/errors"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetNonceByAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取随机数
func NewGetNonceByAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetNonceByAddressLogic {
	return &GetNonceByAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetNonceByAddressLogic) GetNonceByAddress(req *types.GetNonceByAddressReq) (resp *types.GetNonceByAddressResp, err error) {
	// 从Redis获取已存在的nonce
	nonce, err := l.svcCtx.Redis.Get(context.TODO(), req.WalletAddress).Result()
	if err != nil {
		if err.Error() != "redis: nil" {
			return nil, errors.DefaultError("Redis Server Error")
		}
	}

	// 如果nonce不存在或为空，生成新的6位数随机数
	if nonce == "" {
		nonce, err = l.generateSixDigitNonce()
		if err != nil {
			return nil, err
		}

		// 将6位数随机数存储到Redis，有效期24小时
		err = l.svcCtx.Redis.Set(context.TODO(), req.WalletAddress, nonce, time.Hour*24).Err()
		if err != nil {
			logx.Errorf("存储nonce到Redis失败: %v", err)
			return nil, errors.DefaultError("Redis Server Error")
		}
		logx.Infof("为钱包地址 %s 生成新的6位数nonce: %s", req.WalletAddress, nonce)
	}

	resp = &types.GetNonceByAddressResp{
		Nonce: nonce,
	}
	return
}

// 生成6位数随机数 (100000-999999)
func (l *GetNonceByAddressLogic) generateSixDigitNonce() (string, error) {
	// 使用crypto/rand生成安全的随机数
	// 范围：100000 到 999999 (共900000个数)
	max := big.NewInt(900000)
	randomNum, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", errors.DefaultError("生成随机数失败")
	}

	// 将随机数转换为100000-999999范围
	result := randomNum.Int64() + 100000

	return strconv.FormatInt(result, 10), nil
}
