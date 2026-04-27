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

type ListDictItemByTypeLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 根据字典类目code查询字典列表
func NewListDictItemByTypeLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListDictItemByTypeLogic {
	return &ListDictItemByTypeLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListDictItemByTypeLogic) ListDictItemByType(req *types.ListDictItemByTypeReq) (resp *types.BaseResp, err error) {
	if req.DictCategoryCode == "" {
		return customererrors.ParamErrorResp("字典类目编码不能为空"), nil
	}

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

	var statusPtr *int64
	if req.Status == 0 || req.Status == 1 {
		status := req.Status
		statusPtr = &status
	}

	repo := repository.NewDictItemRepository(l.svcCtx.GormDB)
	list, total, listErr := repo.ListByCategoryCode(l.ctx, req.DictCategoryCode, statusPtr, offset, int(pageSize))
	if listErr != nil {
		l.Errorf("list dict item by type failed, dictCategoryCode=%s, err=%v", req.DictCategoryCode, listErr)
		return customererrors.DatabaseErrorResp("查询字典项失败"), nil
	}

	result := make([]types.DictItemInfo, 0, len(list))
	for _, item := range list {
		result = append(result, types.DictItemInfo{
			ID:               item.ID,
			DictCategoryCode: item.DictCategoryCode,
			Code:             item.Code,
			Value:            item.Value,
			Desc:             item.Desc,
			Level:            int64(item.Level),
			Sort:             int64(item.Sort),
			Status:           int64(item.Status),
			CreatedAt:        item.CreateAt.Format(time.DateTime),
			UpdatedAt:        item.UpdateAt.Format(time.DateTime),
			Creator:          item.Creator,
			Updator:          item.Updator,
		})
	}

	return customererrors.SuccessData(types.ListDictItemByTypeResp{
		List:  result,
		Total: total,
	}), nil
}
