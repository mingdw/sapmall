// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type SaveDictItemLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改字典项
func NewSaveDictItemLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveDictItemLogic {
	return &SaveDictItemLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveDictItemLogic) SaveDictItem(req *types.SaveDictItemReq) (resp *types.BaseResp, err error) {
	dictCategoryCode := strings.TrimSpace(req.DictCategoryCode)
	code := strings.TrimSpace(req.Code)
	value := strings.TrimSpace(req.Value)
	if dictCategoryCode == "" || code == "" || value == "" {
		return customererrors.ParamErrorResp("字典类目编码、编码、字典值不能为空"), nil
	}

	itemRepo := repository.NewDictItemRepository(l.svcCtx.GormDB)
	exists, existsErr := itemRepo.ExistsByCategoryCodeAndCode(l.ctx, dictCategoryCode, code, req.ID)
	if existsErr != nil {
		l.Errorf("check dict item exists failed, dictCategoryCode=%s, code=%s, err=%v", dictCategoryCode, code, existsErr)
		return customererrors.DatabaseErrorResp("校验字典项失败"), nil
	}
	if exists {
		return customererrors.ParamErrorResp("字典项已存在"), nil
	}

	// 字典项必须挂在已存在的字典类目下
	categoryRepo := repository.NewDictCategoryRepository(l.svcCtx.GormDB)
	_, categoryErr := categoryRepo.GetByCode(l.ctx, dictCategoryCode)
	if categoryErr != nil {
		if errors.Is(categoryErr, gorm.ErrRecordNotFound) {
			return customererrors.ParamErrorResp("字典类目不存在，请先创建字典类目"), nil
		}
		l.Errorf("check dict category failed, dictCategoryCode=%s, err=%v", dictCategoryCode, categoryErr)
		return customererrors.DatabaseErrorResp("校验字典类目失败"), nil
	}

	if req.ID > 0 {
		_, getErr := itemRepo.GetByID(l.ctx, req.ID)
		if getErr != nil {
			if errors.Is(getErr, gorm.ErrRecordNotFound) {
				return customererrors.NotFoundResp("字典项不存在"), nil
			}
			l.Errorf("get dict item by id failed, id=%d, err=%v", req.ID, getErr)
			return customererrors.DatabaseErrorResp("查询字典项失败"), nil
		}
		updates := map[string]interface{}{
			"dict_category_code": dictCategoryCode,
			"code":               code,
			"value":              value,
			"desc":               req.Desc,
			"level":              req.Level,
			"sort":               req.Sort,
			"status":             req.Status,
			"updator":            "system",
		}
		if updateErr := itemRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update dict item failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新字典项失败"), nil
		}
		return customererrors.SuccessMsg("更新字典项成功"), nil
	}

	createModel := &model.DictItem{
		DictCategoryCode: dictCategoryCode,
		Code:             code,
		Value:            value,
		Desc:             req.Desc,
		Level:            int(req.Level),
		Sort:             int(req.Sort),
		Status:           int(req.Status),
		Creator:          "system",
		Updator:          "system",
	}
	if createModel.Level == 0 {
		createModel.Level = 1
	}
	if createModel.Status == 0 && req.Status == 0 {
		// 允许显式传0禁用
	} else if createModel.Status == 0 {
		createModel.Status = 1
	}
	if createErr := itemRepo.Create(l.ctx, createModel); createErr != nil {
		l.Errorf("create dict item failed, dictCategoryCode=%s, code=%s, err=%v", dictCategoryCode, code, createErr)
		return customererrors.DatabaseErrorResp("新增字典项失败"), nil
	}

	return customererrors.SuccessMsg("新增字典项成功"), nil
}
