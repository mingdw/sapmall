package swap

import (
	"context"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetSwapStatusLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetSwapStatusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetSwapStatusLogic {
	return &GetSwapStatusLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// GetSwapStatus 前端轮询查询兑换状态
func (l *GetSwapStatusLogic) GetSwapStatus(req *types.GetSwapStatusReq) (resp *types.BaseResp, err error) {
	_, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		l.Errorf("获取用户信息失败: %v", authErr)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	if req.SwapId == 0 {
		return customererrors.ParamErrorResp("swapId 不能为空"), nil
	}

	swapRepo := repository.NewChainEventSwapRepository(l.svcCtx.GormDB)
	event, getErr := swapRepo.GetByID(l.ctx, req.SwapId)
	if getErr != nil {
		l.Errorf("查询兑换记录失败: swapId=%d, err=%v", req.SwapId, getErr)
		return customererrors.NotFoundResp("兑换记录不存在"), nil
	}

	statusDesc := processStatusDesc(event.ProcessStatus)

	respData := types.GetSwapStatusResp{
		SwapId:            event.ID,
		BusinessCode:      event.BusinessCode,
		ProcessStatus:     int64(event.ProcessStatus),
		ProcessStatusDesc: statusDesc,
		TxHash:            event.TxHash,
		BlockNumber:       event.BlockNumber,
		EventPayload:      event.EventPayload,
		ErrorMsg:          event.ErrorMsg,
		CreatedAt:         formatTime(event.CreatedAt),
		UpdatedAt:         formatTime(event.UpdatedAt),
	}

	return customererrors.SuccessData(respData), nil
}

func processStatusDesc(status int) string {
	switch status {
	case 0:
		return "待处理"
	case 1:
		return "处理中"
	case 2:
		return "处理成功"
	case 3:
		return "处理失败"
	case 4:
		return "其它"
	default:
		return "未知"
	}
}

func formatTime(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.Format("2006-01-02 15:04:05")
}
