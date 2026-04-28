// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package user

import (
	"context"
	"time"

	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type GetUserDepositLatestLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 查询用户的申请单
func NewGetUserDepositLatestLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserDepositLatestLogic {
	return &GetUserDepositLatestLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserDepositLatestLogic) GetUserDepositLatest() (resp *types.GetUserDepositLatestResp, err error) {
	currentUser, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		logx.Errorf("获取用户信息失败: %v", authErr)
		return nil, authErr
	}

	userDepositRepo := repository.NewUserDepositRepository(l.svcCtx.GormDB)
	latestDeposit, queryErr := userDepositRepo.GetLatestByUserID(l.ctx, currentUser.ID)
	if queryErr != nil {
		if queryErr == gorm.ErrRecordNotFound {
			return &types.GetUserDepositLatestResp{
				Exists: false,
			}, nil
		}
		logx.Errorf("查询用户最新申请单失败，userID=%d, err=%v", currentUser.ID, queryErr)
		return nil, queryErr
	}

	formatTimeValue := func(t time.Time) string {
		if t.IsZero() {
			return ""
		}
		return t.Format(time.DateTime)
	}

	resp = &types.GetUserDepositLatestResp{
		Exists: true,
		Deposit: types.UserDepositInfo{
			ID:                latestDeposit.ID,
			IntentId:          latestDeposit.IntentId,
			UserId:            latestDeposit.UserId,
			UserCode:          latestDeposit.UserCode,
			BusinessType:      latestDeposit.BusinessType,
			DepositStatus:     int64(latestDeposit.DepositStatus),
			DepositStatusDesc: latestDeposit.DepositStatusDesc,
			Amount:            latestDeposit.Amount,
			TokenSymbol:       latestDeposit.TokenSymbol,
			TokenAddress:      latestDeposit.TokenAddress,
			ChainId:           int64(latestDeposit.ChainId),
			ContractAddress:   latestDeposit.ContractAddress,
			TxHash:            latestDeposit.TxHash,
			BlockNumber:       latestDeposit.BlockNumber,
			Confirmations:     int64(latestDeposit.Confirmations),
			RefundTxHash:      latestDeposit.RefundTxHash,
			ExpireAt:          formatTimeValue(latestDeposit.ExpireAt),
			PaidAt:            formatTimeValue(latestDeposit.PaidAt),
			ConfirmedAt:       formatTimeValue(latestDeposit.ConfirmedAt),
			RefundedAt:        formatTimeValue(latestDeposit.RefundedAt),
			FailReason:        latestDeposit.FailReason,
			Remark:            latestDeposit.Remark,
			CreatedAt:         formatTimeValue(latestDeposit.CreateAt),
			UpdatedAt:         formatTimeValue(latestDeposit.UpdateAt),
		},
	}
	return resp, nil
}
