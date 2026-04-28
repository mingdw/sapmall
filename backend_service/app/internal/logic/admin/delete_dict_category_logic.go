// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type DeleteDictCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除字典类目（级联软删字典项）
func NewDeleteDictCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteDictCategoryLogic {
	return &DeleteDictCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteDictCategoryLogic) DeleteDictCategory(req *types.DeleteDictCategoryReq) (resp *types.BaseResp, err error) {
	categoryRepo := repository.NewDictCategoryRepository(l.svcCtx.GormDB)
	category, getErr := categoryRepo.GetByID(l.ctx, req.ID)
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("字典类目不存在"), nil
		}
		l.Errorf("get dict category by id failed, id=%d, err=%v", req.ID, getErr)
		return customererrors.DatabaseErrorResp("查询字典类目失败"), nil
	}

	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		// 物理删除字典类目
		if err := tx.Where("id = ?", req.ID).Delete(&model.DictCategory{}).Error; err != nil {
			return err
		}

		// 物理删除该类目下所有字典项
		if err := tx.Where("dict_category_code = ?", category.Code).Delete(&model.DictItem{}).Error; err != nil {
			return err
		}
		return nil
	})
	if txErr != nil {
		l.Errorf("delete dict category transaction failed, id=%d, code=%s, err=%v", req.ID, category.Code, txErr)
		return customererrors.DatabaseErrorResp("删除字典类目失败"), nil
	}

	return customererrors.SuccessMsg("删除字典类目成功"), nil
}

