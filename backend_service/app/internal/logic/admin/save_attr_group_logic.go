// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

type SaveAttrGroupLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存属性组（新增/编辑）
func NewSaveAttrGroupLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveAttrGroupLogic {
	return &SaveAttrGroupLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveAttrGroupLogic) SaveAttrGroup(req *types.SaveAttrGroupReq) (resp *types.BaseResp, err error) {
	attrGroupRepository := repository.NewAttrGroupRepository(l.svcCtx.GormDB)

	// 通过 ID 判断是新增还是编辑
	if req.ID == 0 {
		// 新增属性组
		return l.createAttrGroup(req, attrGroupRepository)
	} else {
		// 编辑属性组
		return l.updateAttrGroup(req, attrGroupRepository)
	}
}

// createAttrGroup 新增属性组
func (l *SaveAttrGroupLogic) createAttrGroup(req *types.SaveAttrGroupReq, attrGroupRepository repository.AttrGroupRepository) (*types.BaseResp, error) {
	// 1. 校验属性组编码是否已存在
	existingAttrGroup, err := attrGroupRepository.GetAttrGroupByCode(l.ctx, req.AttrGroupCode)
	if err != nil {
		logx.Errorf("查询属性组编码失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询属性组编码失败",
			Data: nil,
		}, nil
	}

	if existingAttrGroup != nil {
		return &types.BaseResp{
			Code: 1,
			Msg:  "属性组编码已存在",
			Data: nil,
		}, nil
	}

	// 2. 设置默认值
	typeValue := req.Type
	if typeValue == 0 {
		typeValue = 0 // 默认通用
	}
	// 注意：0=启用，1=禁用
	// 如果请求中没有传递status或值无效，默认使用0（启用）
	statusValue := req.Status
	if statusValue != 0 && statusValue != 1 {
		// 如果status不是0也不是1，使用默认值0（启用）
		statusValue = 0
	}
	// statusValue == 0 时保持0（启用），statusValue == 1 时保持1（禁用）

	// 3. 创建属性组
	attrGroup := &model.AttrGroup{
		AttrGroupName: req.AttrGroupName,
		AttrGroupCode: req.AttrGroupCode,
		Type:          typeValue,
		Status:        statusValue,
		Sort:          req.Sort,
		Description:   req.Description,
	}

	attrGroupID, err := attrGroupRepository.Create(l.ctx, attrGroup)
	if err != nil {
		logx.Errorf("创建属性组失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("创建属性组失败: %v", err),
			Data: nil,
		}, nil
	}

	attrGroup.ID = attrGroupID
	logx.Infof("创建属性组成功: ID=%d, Name=%s, Code=%s", attrGroup.ID, attrGroup.AttrGroupName, attrGroup.AttrGroupCode)

	// 4. 如果是目录专用属性组（Type=1）且提供了目录ID，创建目录-属性组关联
	if typeValue == 1 && req.CategoryID > 0 {
		err = l.createCategoryAttrGroup(req.CategoryID, attrGroupID, req.AttrGroupCode)
		if err != nil {
			logx.Errorf("创建目录-属性组关联失败: %v", err)
			// 即使关联创建失败，属性组已创建成功，返回成功但记录错误
			logx.Infof("属性组创建成功，但目录关联创建失败: %v", err)
		}
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "创建成功",
		Data: attrGroup,
	}, nil
}

// updateAttrGroup 编辑属性组
func (l *SaveAttrGroupLogic) updateAttrGroup(req *types.SaveAttrGroupReq, attrGroupRepository repository.AttrGroupRepository) (*types.BaseResp, error) {
	// 1. 查询属性组是否存在
	existingAttrGroup, err := attrGroupRepository.GetAttrGroup(l.ctx, req.ID)
	if err != nil {
		logx.Errorf("查询属性组失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询属性组失败",
			Data: nil,
		}, nil
	}

	if existingAttrGroup == nil || existingAttrGroup.ID == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "属性组不存在",
			Data: nil,
		}, nil
	}

	// 2. 如果更新编码，检查新编码是否已被其他属性组使用
	if req.AttrGroupCode != "" && req.AttrGroupCode != existingAttrGroup.AttrGroupCode {
		attrGroupByCode, err := attrGroupRepository.GetAttrGroupByCode(l.ctx, req.AttrGroupCode)
		if err != nil {
			logx.Errorf("查询属性组编码失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "查询属性组编码失败",
				Data: nil,
			}, nil
		}

		if attrGroupByCode != nil && attrGroupByCode.ID != req.ID {
			return &types.BaseResp{
				Code: 1,
				Msg:  "属性组编码已被使用",
				Data: nil,
			}, nil
		}
	}

	// 3. 准备更新数据
	// 使用现有值作为基础，然后用请求中的值覆盖（如果提供了）
	updateAttrGroup := &model.AttrGroup{
		ID:            existingAttrGroup.ID,
		AttrGroupName: existingAttrGroup.AttrGroupName,
		AttrGroupCode: existingAttrGroup.AttrGroupCode,
		Type:          existingAttrGroup.Type,
		Status:        existingAttrGroup.Status,
		Sort:          existingAttrGroup.Sort,
		Description:   existingAttrGroup.Description,
	}

	// 更新字段（如果请求中提供了值）
	if req.AttrGroupName != "" {
		updateAttrGroup.AttrGroupName = req.AttrGroupName
	}
	// AttrGroupCode 已经在步骤2中验证过，如果不同则更新
	if req.AttrGroupCode != "" && req.AttrGroupCode != existingAttrGroup.AttrGroupCode {
		updateAttrGroup.AttrGroupCode = req.AttrGroupCode
	}
	if req.Sort != 0 || (req.Sort == 0 && existingAttrGroup.Sort != 0) {
		// 如果请求中明确传递了 Sort 值（包括0），则更新
		updateAttrGroup.Sort = req.Sort
	}
	if req.Description != "" {
		updateAttrGroup.Description = req.Description
	}
	// Status 和 Type：注意：Status=0表示启用，Status=1表示禁用；Type=0表示通用，Type=1表示目录专用
	// 前端在编辑时会始终传递这些字段的值（0 或 1），所以我们直接使用请求值
	// 注意：前端必须确保在编辑时总是传递 status 和 type 字段
	if req.Status == 0 || req.Status == 1 {
		updateAttrGroup.Status = req.Status
		logx.Infof("更新属性组状态: ID=%d, 旧状态=%d(0=启用,1=禁用), 新状态=%d(0=启用,1=禁用)", req.ID, existingAttrGroup.Status, req.Status)
	}
	if req.Type == 0 || req.Type == 1 {
		updateAttrGroup.Type = req.Type
	}

	// 设置更新时间（GORM 可能会自动更新，但为了确保正确，手动设置）
	updateAttrGroup.UpdatedAt = time.Now()
	// 如果需要设置 updator，可以从上下文或其他地方获取，这里暂时保持原有值
	// updateAttrGroup.Updator = "admin" // 可以根据实际情况设置

	// 4. 执行更新
	err = attrGroupRepository.Update(l.ctx, updateAttrGroup)
	if err != nil {
		logx.Errorf("更新属性组失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("更新属性组失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("更新属性组成功: ID=%d, Name=%s", req.ID, req.AttrGroupName)

	// 5. 如果是目录专用属性组（Type=1）且提供了目录ID，更新目录-属性组关联
	if req.Type == 1 && req.CategoryID > 0 {
		err = l.updateCategoryAttrGroup(req.CategoryID, req.ID, req.AttrGroupCode)
		if err != nil {
			logx.Errorf("更新目录-属性组关联失败: %v", err)
			// 即使关联更新失败，属性组已更新成功，返回成功但记录错误
			logx.Infof("属性组更新成功，但目录关联更新失败: %v", err)
		}
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "更新成功",
		Data: updateAttrGroup,
	}, nil
}

// createCategoryAttrGroup 创建目录-属性组关联
func (l *SaveAttrGroupLogic) createCategoryAttrGroup(categoryID uint, attrGroupID uint, attrGroupCode string) error {
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)
	categoryAttrGroupRepository := repository.NewCategoryAttrGroupRepository(l.svcCtx.GormDB)

	// 1. 查询目录信息
	category, err := categoryRepository.GetCategory(l.ctx, int64(categoryID))
	if err != nil {
		return fmt.Errorf("查询目录失败: %v", err)
	}

	if category == nil || category.ID == 0 {
		return fmt.Errorf("目录不存在")
	}

	// 2. 检查关联是否已存在
	existingRelations, err := categoryAttrGroupRepository.FindByCategoryID(l.ctx, int64(categoryID))
	if err != nil {
		return fmt.Errorf("查询目录-属性组关联失败: %v", err)
	}

	for _, relation := range existingRelations {
		if relation.AttrGroupID == attrGroupID {
			// 关联已存在，不需要重复创建
			return nil
		}
	}

	// 3. 创建关联
	categoryAttrGroup := &model.CategoryAttrGroup{
		CategoryID:    categoryID,
		CategoryCode:  category.Code,
		AttrGroupID:   attrGroupID,
		AttrGroupCode: attrGroupCode,
		Status:        1, // 默认启用
	}

	_, err = categoryAttrGroupRepository.Create(l.ctx, categoryAttrGroup)
	if err != nil {
		return fmt.Errorf("创建目录-属性组关联失败: %v", err)
	}

	logx.Infof("创建目录-属性组关联成功: CategoryID=%d, AttrGroupID=%d", categoryID, attrGroupID)
	return nil
}

// updateCategoryAttrGroup 更新目录-属性组关联
func (l *SaveAttrGroupLogic) updateCategoryAttrGroup(categoryID uint, attrGroupID uint, attrGroupCode string) error {
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)
	categoryAttrGroupRepository := repository.NewCategoryAttrGroupRepository(l.svcCtx.GormDB)

	// 1. 查询目录信息
	category, err := categoryRepository.GetCategory(l.ctx, int64(categoryID))
	if err != nil {
		return fmt.Errorf("查询目录失败: %v", err)
	}

	if category == nil || category.ID == 0 {
		return fmt.Errorf("目录不存在")
	}

	// 2. 查询现有的关联
	existingRelations, err := categoryAttrGroupRepository.FindByAttrGroupID(l.ctx, attrGroupID)
	if err != nil {
		return fmt.Errorf("查询属性组关联失败: %v", err)
	}

	// 3. 检查是否已存在该目录的关联
	found := false
	for _, relation := range existingRelations {
		if relation.CategoryID == categoryID {
			// 关联已存在，更新编码（如果属性组编码改变了）
			if relation.AttrGroupCode != attrGroupCode {
				relation.AttrGroupCode = attrGroupCode
				relation.CategoryCode = category.Code
				// 这里可以添加更新逻辑，如果需要的话
			}
			found = true
			break
		}
	}

	// 4. 如果不存在，创建新关联
	if !found {
		categoryAttrGroup := &model.CategoryAttrGroup{
			CategoryID:    categoryID,
			CategoryCode:  category.Code,
			AttrGroupID:   attrGroupID,
			AttrGroupCode: attrGroupCode,
			Status:        1, // 默认启用
		}

		_, err = categoryAttrGroupRepository.Create(l.ctx, categoryAttrGroup)
		if err != nil {
			return fmt.Errorf("创建目录-属性组关联失败: %v", err)
		}

		logx.Infof("创建目录-属性组关联成功: CategoryID=%d, AttrGroupID=%d", categoryID, attrGroupID)
	}

	return nil
}
