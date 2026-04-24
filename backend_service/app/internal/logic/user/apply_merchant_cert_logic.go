// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package user

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/google/uuid"
	"github.com/zeromicro/go-zero/core/logx"
)

type ApplyMerchantCertLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func (l *ApplyMerchantCertLogic) merchantDepositConfig() (amount, tokenSymbol, tokenAddress string, chainID int64, contractAddress string, expireMins int64) {
	cfg := l.svcCtx.Config.MerchantDeposit
	amount = cfg.Amount
	if amount == "" {
		amount = "100"
	}
	tokenSymbol = cfg.TokenSymbol
	if tokenSymbol == "" {
		tokenSymbol = "USDT"
	}
	tokenAddress = cfg.TokenAddress
	chainID = cfg.ChainID
	if chainID <= 0 {
		chainID = 56
	}
	contractAddress = cfg.ContractAddress
	if contractAddress == "" {
		contractAddress = "0x0000000000000000000000000000000000000000"
	}
	expireMins = cfg.IntentExpireMins
	if expireMins <= 0 {
		expireMins = 30
	}
	return
}

// 申请商家认证
func NewApplyMerchantCertLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ApplyMerchantCertLogic {
	return &ApplyMerchantCertLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ApplyMerchantCertLogic) ApplyMerchantCert(req *types.ApplyMerchantCertReq) (resp *types.BaseResp, err error) {
	// 此处需要处理用户申请商家认证的逻辑，你需要做一些必要的检查
	// 1. 检查用户是否已经申请过商家认证
	currentUser, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		logx.Errorf("获取用户信息失败: %v", authErr)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	userRepo := repository.NewUserRepository(l.svcCtx.GormDB)
	dbUser, dbErr := userRepo.GetByID(l.ctx, currentUser.ID)
	if dbErr != nil || dbUser == nil {
		logx.Errorf("查询用户失败，userID=%d, err=%v", currentUser.ID, dbErr)
		return customererrors.NotFoundResp("用户不存在"), nil
	}

	// 0未缴纳 1待支付 2确认中 3已确认
	if dbUser.MerchantDepositStatus == 3 {
		return customererrors.SuccessMsg("当前用户已完成商家认证"), nil
	}

	type userDepositRecord struct {
		ID              int64      `gorm:"column:id"`
		IntentID        string     `gorm:"column:intent_id"`
		UserID          int64      `gorm:"column:user_id"`
		UserCode        string     `gorm:"column:user_code"`
		BusinessType    string     `gorm:"column:business_type"`
		DepositStatus   int        `gorm:"column:deposit_status"`
		Amount          string     `gorm:"column:amount"`
		TokenSymbol     string     `gorm:"column:token_symbol"`
		TokenAddress    string     `gorm:"column:token_address"`
		ChainID         int64      `gorm:"column:chain_id"`
		ContractAddress string     `gorm:"column:contract_address"`
		TxHash          string     `gorm:"column:tx_hash"`
		ExpireAt        *time.Time `gorm:"column:expire_at"`
		IsDeleted       int        `gorm:"column:is_deleted"`
		Creator         string     `gorm:"column:creator"`
		Updator         string     `gorm:"column:updator"`
	}

	var latestDeposit userDepositRecord
	queryLatestErr := l.svcCtx.GormDB.WithContext(l.ctx).
		Table("sys_user_deposit").
		Where("user_id = ? AND is_deleted = 0", dbUser.ID).
		Order("id DESC").
		First(&latestDeposit).Error

	if queryLatestErr == nil && (latestDeposit.DepositStatus == 1 || latestDeposit.DepositStatus == 2) {
		expireAt := ""
		if latestDeposit.ExpireAt != nil {
			expireAt = latestDeposit.ExpireAt.Format(time.DateTime)
		}
		return customererrors.SuccessData(types.ApplyMerchantCertResp{
			Intent: types.MerchantDepositIntentResp{
				IntentId:        latestDeposit.IntentID,
				Amount:          latestDeposit.Amount,
				Token:           latestDeposit.TokenSymbol,
				ChainId:         latestDeposit.ChainID,
				ContractAddress: latestDeposit.ContractAddress,
				ExpireAt:        expireAt,
				TokenAddress:    latestDeposit.TokenAddress,
				TxHash:          latestDeposit.TxHash,
			},
		}), nil
	}

	intentID := fmt.Sprintf("mdi_%s", uuid.NewString())
	amount, tokenSymbol, tokenAddress, chainID, contractAddress, expireMins := l.merchantDepositConfig()
	expireAt := time.Now().Add(time.Duration(expireMins) * time.Minute)
	intentResp := types.MerchantDepositIntentResp{
		IntentId:        intentID,
		Amount:          amount,
		Token:           tokenSymbol,
		ChainId:         chainID,
		ContractAddress: contractAddress,
		ExpireAt:        expireAt.Format(time.DateTime),
		TokenAddress:    tokenAddress,
	}

	newDeposit := userDepositRecord{
		IntentID:        intentID,
		UserID:          dbUser.ID,
		UserCode:        dbUser.UserCode,
		BusinessType:    "merchant_deposit",
		DepositStatus:   1,
		Amount:          intentResp.Amount,
		TokenSymbol:     intentResp.Token,
		TokenAddress:    intentResp.TokenAddress,
		ChainID:         intentResp.ChainId,
		ContractAddress: intentResp.ContractAddress,
		ExpireAt:        &expireAt,
		Creator:         dbUser.UserCode,
		Updator:         dbUser.UserCode,
	}
	if createDepositErr := l.svcCtx.GormDB.WithContext(l.ctx).Table("sys_user_deposit").Create(&newDeposit).Error; createDepositErr != nil {
		logx.Errorf("创建保证金意图单失败，userID=%d, err=%v", dbUser.ID, createDepositErr)
		return customererrors.DatabaseErrorResp("创建保证金意图单失败"), nil
	}

	beforeJSON, _ := json.Marshal(map[string]interface{}{
		"merchantDepositStatus": dbUser.MerchantDepositStatus,
		"termsVersion":          req.TermsVersion,
	})
	if updateUserErr := userRepo.UpdateColumnsByID(l.ctx, dbUser.ID, map[string]interface{}{
		"merchant_deposit_status": 1,
		"updator":                 dbUser.UserCode,
	}); updateUserErr != nil {
		logx.Errorf("更新用户商家状态失败，userID=%d, err=%v", dbUser.ID, updateUserErr)
		return customererrors.DatabaseErrorResp("更新用户商家状态失败"), nil
	}
	afterJSON, _ := json.Marshal(map[string]interface{}{
		"merchantDepositStatus": 1,
		"intentId":              intentResp.IntentId,
		"termsVersion":          req.TermsVersion,
	})

	repo := repository.NewRepository(l.svcCtx.GormDB)
	logRepo := repository.NewOperationLogRepository(repo)
	logCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	logErr := logRepo.CreateOperationLog(logCtx, &model.OperationLog{
		UserID:        dbUser.ID,
		Username:      dbUser.UserCode,
		BizModule:     "merchant",
		ActionType:    "apply_merchant_cert",
		ActionSummary: "申请商家认证",
		Before:        string(beforeJSON),
		After:         string(afterJSON),
		ObjectType:    "sys_user",
		ObjectID:      fmt.Sprintf("%d", dbUser.ID),
		DetailJSON:    "{}",
		ResultStatus:  1,
		Creator:       dbUser.UserCode,
		Updator:       dbUser.UserCode,
	})
	if logErr != nil {
		l.Errorf("create operation log failed, userID=%d, err=%v", dbUser.ID, logErr)
	}

	return customererrors.SuccessData(types.ApplyMerchantCertResp{
		Intent: intentResp,
	}), nil
}
