// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListSystemConfigLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取系统参数列表
func NewListSystemConfigLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListSystemConfigLogic {
	return &ListSystemConfigLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListSystemConfigLogic) ListSystemConfig(req *types.ListSystemConfigReq) (resp *types.BaseResp, err error) {
	page := req.Page
	if page <= 0 {
		page = 1
	}
	pageSize := req.PageSize
	if pageSize <= 0 {
		pageSize = 20
	}
	if pageSize > 200 {
		pageSize = 200
	}
	offset := int((page - 1) * pageSize)

	configRepo := repository.NewConfigRepository(l.svcCtx.GormDB)
	configList, total, listErr := configRepo.ListByCondition(
		l.ctx,
		req.ConfigKey,
		req.ConfigName,
		req.ConfigType,
		req.ConfigGroup,
		nil,
		offset,
		int(pageSize),
	)
	if listErr != nil {
		l.Errorf("list system config failed, err=%v", listErr)
		return customererrors.DatabaseErrorResp("查询系统参数失败"), nil
	}

	result := make([]types.SystemConfigInfo, 0, len(configList))
	for _, item := range configList {
		result = append(result, types.SystemConfigInfo{
			ID:          item.ID,
			ConfigKey:   item.ConfigKey,
			ConfigName:  item.ConfigName,
			ConfigValue: item.ConfigValue,
			ConfigType:  item.ConfigType,
			ConfigGroup: item.ConfigGroup,
			Description: item.Description,
			IsSystem:    int64(item.IsSystem),
			IsEncrypted: int64(item.IsEncrypted),
			IsEditable:  int64(item.IsEditable),
			SyncChainStatus: int64(item.SyncChainStatus),
			Sort:        int64(item.Sort),
			Status:      int64(item.Status),
			CreatedAt:   item.CreateAt.Format(time.DateTime),
			UpdatedAt:   item.UpdateAt.Format(time.DateTime),
			Creator:     item.Creator,
			Updator:     item.Updator,
		})
	}

	return customererrors.SuccessData(types.ListSystemConfigResp{
		List:  result,
		Total: total,
	}), nil
}
