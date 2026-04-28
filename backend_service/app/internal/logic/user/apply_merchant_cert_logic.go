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
	"gorm.io/gorm"
)

type ApplyMerchantCertLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func formatTimeValue(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.Format(time.DateTime)
}

func merchantDepositStatusDesc(status int) string {
	switch status {
	case 0:
		return "初始化"
	case 1:
		return "待支付"
	case 2:
		return "链上确认中"
	case 3:
		return "已确认"
	case 4:
		return "已退还"
	case 5:
		return "失败"
	case 6:
		return "已过期"
	default:
		return "未知状态"
	}
}

func buildMerchantDepositIntentResp(deposit *model.UserDeposit) types.MerchantDepositIntentResp {
	if deposit == nil {
		return types.MerchantDepositIntentResp{}
	}
	statusDesc := deposit.DepositStatusDesc
	if statusDesc == "" {
		statusDesc = merchantDepositStatusDesc(deposit.DepositStatus)
	}
	return types.MerchantDepositIntentResp{
		ID:                deposit.ID,
		IntentId:          deposit.IntentId,
		BusinessType:      deposit.BusinessType,
		DepositStatus:     int64(deposit.DepositStatus),
		DepositStatusDesc: statusDesc,
		Amount:            deposit.Amount,
		Token:             deposit.TokenSymbol,
		ChainId:           int64(deposit.ChainId),
		ContractAddress:   deposit.ContractAddress,
		ExpireAt:          formatTimeValue(deposit.ExpireAt),
		TokenAddress:      deposit.TokenAddress,
		TxHash:            deposit.TxHash,
		RefundTxHash:      deposit.RefundTxHash,
		BlockNumber:       deposit.BlockNumber,
		Confirmations:     int64(deposit.Confirmations),
		FailReason:        deposit.FailReason,
		Remark:            deposit.Remark,
		PaidAt:            formatTimeValue(deposit.PaidAt),
		ConfirmedAt:       formatTimeValue(deposit.ConfirmedAt),
		RefundedAt:        formatTimeValue(deposit.RefundedAt),
		CreatedAt:         formatTimeValue(deposit.CreateAt),
		UpdatedAt:         formatTimeValue(deposit.UpdateAt),
	}
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
	if dbUser.MerchantDepositStatus != 0 {
		return customererrors.SuccessMsg("当前用户正在申请成为商家，请勿重复申请"), nil
	}

	userDepositRepo := repository.NewUserDepositRepository(l.svcCtx.GormDB)
	latestDeposit, queryLatestErr := userDepositRepo.GetLatestByUserID(l.ctx, dbUser.ID)
	if queryLatestErr == nil && latestDeposit != nil && (latestDeposit.DepositStatus == 1 || latestDeposit.DepositStatus == 2) {
		return customererrors.SuccessData(types.ApplyMerchantCertResp{
			Intent: buildMerchantDepositIntentResp(latestDeposit),
		}), nil
	}
	if queryLatestErr != nil && queryLatestErr != gorm.ErrRecordNotFound {
		logx.Errorf("查询最新保证金意图单失败，userID=%d, err=%v", dbUser.ID, queryLatestErr)
		return customererrors.DatabaseErrorResp("查询保证金意图单失败"), nil
	}

	intentID := fmt.Sprintf("mdi_%s", uuid.NewString())
	amount, tokenSymbol, tokenAddress, chainID, contractAddress, expireMins := l.merchantDepositConfig()
	expireAt := time.Now().Add(time.Duration(expireMins) * time.Minute)
	intentResp := types.MerchantDepositIntentResp{
		IntentId:          intentID,
		BusinessType:      "merchant_deposit",
		DepositStatus:     1,
		DepositStatusDesc: merchantDepositStatusDesc(1),
		Amount:            amount,
		Token:             tokenSymbol,
		ChainId:           chainID,
		ContractAddress:   contractAddress,
		ExpireAt:          expireAt.Format(time.DateTime),
		TokenAddress:      tokenAddress,
	}

	newDeposit := model.UserDeposit{
		IntentId:        intentID,
		UserId:          dbUser.ID,
		UserCode:        dbUser.UserCode,
		BusinessType:    "merchant_deposit",
		DepositStatus:   1,
		Amount:          intentResp.Amount,
		TokenSymbol:     intentResp.Token,
		TokenAddress:    intentResp.TokenAddress,
		ChainId:         int(intentResp.ChainId),
		ContractAddress: intentResp.ContractAddress,
		ExpireAt:        expireAt,
		Creator:         dbUser.UserCode,
		Updator:         dbUser.UserCode,
	}
	if createDepositErr := userDepositRepo.Create(l.ctx, &newDeposit); createDepositErr != nil {
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
