package admin

import (
	"context"
	"fmt"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type SaveCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存目录（新增/编辑）
func NewSaveCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveCategoryLogic {
	return &SaveCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveCategoryLogic) SaveCategory(req *types.SaveCategoryReq) (resp *types.BaseResp, err error) {
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)

	// 通过 ID 判断是新增还是编辑
	if req.ID == 0 {
		// 新增目录
		return l.createCategory(req, categoryRepository)
	} else {
		// 编辑目录
		return l.updateCategory(req, categoryRepository)
	}
}

// createCategory 新增目录
func (l *SaveCategoryLogic) createCategory(req *types.SaveCategoryReq, categoryRepository repository.CategoryRepository) (*types.BaseResp, error) {
	// 1. 校验目录编码是否已存在
	existingCategory, err := categoryRepository.GetCategoryByCode(l.ctx, req.Code)
	if err != nil {
		logx.Errorf("查询目录编码失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询目录编码失败",
			Data: nil,
		}, nil
	}

	if existingCategory != nil {
		return &types.BaseResp{
			Code: 1,
			Msg:  "目录编码已存在",
			Data: nil,
		}, nil
	}

	// 2. 如果有父目录，验证父目录是否存在并自动设置层级
	var level int
	var parentCode string

	if req.ParentID > 0 {
		parentCategory, err := categoryRepository.GetCategory(l.ctx, int64(req.ParentID))
		if err != nil {
			logx.Errorf("查询父目录失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "查询父目录失败",
				Data: nil,
			}, nil
		}

		if parentCategory == nil || parentCategory.ID == 0 {
			return &types.BaseResp{
				Code: 1,
				Msg:  "父目录不存在",
				Data: nil,
			}, nil
		}

		// 自动设置父目录编码和层级
		parentCode = parentCategory.Code
		level = parentCategory.Level + 1
	} else {
		// 根目录
		parentCode = ""
		level = 1
	}

	// 3. 创建目录
	category := &model.Category{
		Code:       req.Code,
		Name:       req.Name,
		ParentID:   req.ParentID,
		ParentCode: parentCode,
		Level:      level,
		Sort:       req.Sort,
		Icon:       req.Icon,
		Status:     0, // 默认启用
		IsDeleted:  0,
	}

	err = categoryRepository.Create(l.ctx, category)
	if err != nil {
		logx.Errorf("创建目录失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("创建目录失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("创建目录成功: ID=%d, Name=%s, Code=%s", category.ID, category.Name, category.Code)

	return &types.BaseResp{
		Code: 0,
		Msg:  "创建成功",
		Data: category,
	}, nil
}

// updateCategory 编辑目录
func (l *SaveCategoryLogic) updateCategory(req *types.SaveCategoryReq, categoryRepository repository.CategoryRepository) (*types.BaseResp, error) {
	// 1. 查询目录是否存在
	existingCategory, err := categoryRepository.GetCategory(l.ctx, int64(req.ID))
	if err != nil {
		logx.Errorf("查询目录失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询目录失败",
			Data: nil,
		}, nil
	}

	if existingCategory == nil || existingCategory.ID == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "目录不存在",
			Data: nil,
		}, nil
	}

	// 2. 如果更新编码，检查新编码是否已被其他目录使用
	if req.Code != "" && req.Code != existingCategory.Code {
		categoryByCode, err := categoryRepository.GetCategoryByCode(l.ctx, req.Code)
		if err != nil {
			logx.Errorf("查询目录编码失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "查询目录编码失败",
				Data: nil,
			}, nil
		}

		if categoryByCode != nil && categoryByCode.ID != req.ID {
			return &types.BaseResp{
				Code: 1,
				Msg:  "目录编码已被使用",
				Data: nil,
			}, nil
		}
	}

	// 3. 准备更新数据
	updateCategory := &model.Category{}
	updateCategory.ID = req.ID

	// 更新字段
	if req.Name != "" {
		updateCategory.Name = req.Name
	}
	if req.Code != "" {
		updateCategory.Code = req.Code
	}
	if req.Sort != 0 {
		updateCategory.Sort = req.Sort
	}
	if req.Icon != "" {
		updateCategory.Icon = req.Icon
	}

	// 如果修改了父目录，需要重新计算层级
	if req.ParentID != existingCategory.ParentID {
		if req.ParentID > 0 {
			parentCategory, err := categoryRepository.GetCategory(l.ctx, int64(req.ParentID))
			if err != nil {
				logx.Errorf("查询父目录失败: %v", err)
				return &types.BaseResp{
					Code: 1,
					Msg:  "查询父目录失败",
					Data: nil,
				}, nil
			}

			if parentCategory == nil || parentCategory.ID == 0 {
				return &types.BaseResp{
					Code: 1,
					Msg:  "父目录不存在",
					Data: nil,
				}, nil
			}

			// 检查是否形成循环引用（不能将目录移动到自己的子目录下）
			if parentCategory.ParentID == req.ID {
				return &types.BaseResp{
					Code: 1,
					Msg:  "不能将目录移动到自己的子目录下",
					Data: nil,
				}, nil
			}

			updateCategory.ParentID = req.ParentID
			updateCategory.ParentCode = parentCategory.Code
			updateCategory.Level = parentCategory.Level + 1
		} else {
			// 移动到根目录
			updateCategory.ParentID = 0
			updateCategory.ParentCode = ""
			updateCategory.Level = 1
		}
	}

	// 4. 执行更新
	err = categoryRepository.Update(l.ctx, updateCategory)
	if err != nil {
		logx.Errorf("更新目录失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("更新目录失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("更新目录成功: ID=%d, Name=%s", req.ID, req.Name)

	return &types.BaseResp{
		Code: 0,
		Msg:  "更新成功",
		Data: updateCategory,
	}, nil
}
