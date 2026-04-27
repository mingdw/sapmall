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

type SaveDictCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改系统字典类目
func NewSaveDictCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveDictCategoryLogic {
	return &SaveDictCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveDictCategoryLogic) SaveDictCategory(req *types.SaveDictCategoryReq) (resp *types.BaseResp, err error) {
	dictType := strings.TrimSpace(req.DictType)
	code := strings.TrimSpace(req.Code)
	if dictType == "" || code == "" {
		return customererrors.ParamErrorResp("字典类型和分类编码不能为空"), nil
	}
	allowedDictTypes := map[string]struct{}{
		"0": {},
		"1": {},
		"2": {},
	}
	if _, ok := allowedDictTypes[dictType]; !ok {
		return customererrors.ParamErrorResp("字典类型仅支持：0(系统字典)/1(用户自定义)/2(其它)"), nil
	}
	if req.Status != 0 && req.Status != 1 {
		return customererrors.ParamErrorResp("状态仅支持：0启用，1禁用"), nil
	}

	repo := repository.NewDictCategoryRepository(l.svcCtx.GormDB)
	exists, existsErr := repo.ExistsByDictTypeAndCode(l.ctx, dictType, code, req.ID)
	if existsErr != nil {
		l.Errorf("check dict category exists failed, dictType=%s, code=%s, err=%v", dictType, code, existsErr)
		return customererrors.DatabaseErrorResp("校验字典类目失败"), nil
	}
	if exists {
		return customererrors.ParamErrorResp("字典类目已存在"), nil
	}

	if req.ID > 0 {
		_, getErr := repo.GetByID(l.ctx, req.ID)
		if getErr != nil {
			if errors.Is(getErr, gorm.ErrRecordNotFound) {
				return customererrors.NotFoundResp("字典类目不存在"), nil
			}
			l.Errorf("get dict category by id failed, id=%d, err=%v", req.ID, getErr)
			return customererrors.DatabaseErrorResp("查询字典类目失败"), nil
		}
		updates := map[string]interface{}{
			"dict_type": dictType,
			"code":      code,
			"desc":      req.Desc,
			"level":     req.Level,
			"sort":      req.Sort,
			"status":    req.Status,
			"updator":   "system",
		}
		if updateErr := repo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update dict category failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新字典类目失败"), nil
		}
		return customererrors.SuccessMsg("更新字典类目成功"), nil
	}

	createModel := &model.DictCategory{
		DictType: dictType,
		Code:     code,
		Desc:     req.Desc,
		Level:    int(req.Level),
		Sort:     int(req.Sort),
		Status:   int(req.Status),
		Creator:  "system",
		Updator:  "system",
	}
	if createModel.Level == 0 {
		createModel.Level = 1
	}
	// 默认启用（0）；请求显式传1时为禁用
	if req.Status != 0 {
		createModel.Status = 1
	}
	if createErr := repo.Create(l.ctx, createModel); createErr != nil {
		l.Errorf("create dict category failed, dictType=%s, code=%s, err=%v", dictType, code, createErr)
		return customererrors.DatabaseErrorResp("新增字典类目失败"), nil
	}

	return customererrors.SuccessMsg("新增字典类目成功"), nil
}
