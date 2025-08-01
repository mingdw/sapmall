package category

import (
	"context"
	"errors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ModifyCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 修改商品目录
func NewModifyCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ModifyCategoryLogic {
	return &ModifyCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ModifyCategoryLogic) ModifyCategory(req *types.CategoryModifyRequest) error {

	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)

	category, err := categoryRepository.GetCategoryByCode(l.ctx, req.Code)

	if err != nil {
		return err
	}

	if req.ID != 0 {
		// 更新
		if category != nil && category.ID != req.ID {
			return errors.New("code已存在")
		}
		category := model.Category{
			ID:         req.ID,
			Name:       req.Name,
			Code:       req.Code,
			Sort:       req.Sort,
			ParentID:   req.ParentID,
			ParentCode: req.ParentCode,
			Level:      req.Level,
			Icon:       req.Icon,
			Status:     req.Status,
		}
		err := categoryRepository.Update(l.ctx, &category)
		if err != nil {
			return err
		}
	} else {
		//先判断保存的code是否存在
		if category != nil {
			return errors.New("code已存在")
		}
		// 创建
		category := model.Category{
			Name:       req.Name,
			Code:       req.Code,
			Sort:       req.Sort,
			ParentID:   req.ParentID,
			ParentCode: req.ParentCode,
			Level:      req.Level,
			Icon:       req.Icon,
			Status:     req.Status,
		}
		err2 := categoryRepository.Create(l.ctx, &category)
		if err2 != nil {
			return err2
		}
	}

	return nil
}
