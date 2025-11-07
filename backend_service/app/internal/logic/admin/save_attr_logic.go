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

type SaveAttrLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存属性（新增/编辑）
func NewSaveAttrLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveAttrLogic {
	return &SaveAttrLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveAttrLogic) SaveAttr(req *types.SaveAttrReq) (resp *types.BaseResp, err error) {
	attrRepository := repository.NewAttrRepository(l.svcCtx.GormDB)
	attrGroupRepository := repository.NewAttrGroupRepository(l.svcCtx.GormDB)

	// 通过 ID 判断是新增还是编辑
	if req.ID == 0 {
		// 新增属性
		return l.createAttr(req, attrRepository, attrGroupRepository)
	} else {
		// 编辑属性
		return l.updateAttr(req, attrRepository)
	}
}

// createAttr 新增属性
func (l *SaveAttrLogic) createAttr(req *types.SaveAttrReq, attrRepository repository.AttrRepository, attrGroupRepository repository.AttrGroupRepository) (*types.BaseResp, error) {
	// 1. 验证属性组是否存在
	existingAttrGroup, err := attrGroupRepository.GetAttrGroup(l.ctx, req.AttrGroupID)
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

	// 2. 校验属性编码是否已存在
	existingAttr, err := attrRepository.GetAttrByCode(l.ctx, req.AttrCode)
	if err != nil {
		logx.Errorf("查询属性编码失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询属性编码失败",
			Data: nil,
		}, nil
	}

	if existingAttr != nil {
		return &types.BaseResp{
			Code: 1,
			Msg:  "属性编码已存在",
			Data: nil,
		}, nil
	}

	// 3. 设置默认值
	attrTypeValue := req.AttrType
	if attrTypeValue == 0 {
		attrTypeValue = 1 // 默认文本类型
	}
	// 注意：0=启用，1=禁用
	statusValue := req.Status
	if statusValue != 0 && statusValue != 1 {
		statusValue = 0 // 默认启用
	}

	// 4. 创建属性
	attr := &model.Attr{
		AttrName:      req.AttrName,
		AttrCode:      req.AttrCode,
		AttrGroupID:   req.AttrGroupID,
		AttrGroupCode: req.AttrGroupCode,
		AttrType:      attrTypeValue,
		Status:        statusValue,
		Sort:          req.Sort,
		Description:   req.Description,
	}

	err = attrRepository.Create(l.ctx, attr)
	if err != nil {
		logx.Errorf("创建属性失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("创建属性失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("创建属性成功: ID=%d, Name=%s, Code=%s", attr.ID, attr.AttrName, attr.AttrCode)

	return &types.BaseResp{
		Code: 0,
		Msg:  "创建成功",
		Data: attr,
	}, nil
}

// updateAttr 编辑属性
func (l *SaveAttrLogic) updateAttr(req *types.SaveAttrReq, attrRepository repository.AttrRepository) (*types.BaseResp, error) {
	// 1. 查询属性是否存在
	existingAttr, err := attrRepository.GetAttr(l.ctx, req.ID)
	if err != nil {
		logx.Errorf("查询属性失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询属性失败",
			Data: nil,
		}, nil
	}

	if existingAttr == nil || existingAttr.ID == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "属性不存在",
			Data: nil,
		}, nil
	}

	// 2. 准备更新数据
	updateAttr := &model.Attr{
		ID:            existingAttr.ID,
		AttrName:      existingAttr.AttrName,
		AttrType:      existingAttr.AttrType,
		Status:        existingAttr.Status,
		Sort:          existingAttr.Sort,
		Description:   existingAttr.Description,
		AttrGroupID:   existingAttr.AttrGroupID,
		AttrGroupCode: existingAttr.AttrGroupCode,
	}

	// 更新字段（如果请求中提供了值）
	if req.AttrName != "" {
		updateAttr.AttrName = req.AttrName
	}
	if req.AttrType == 1 || req.AttrType == 2 {
		updateAttr.AttrType = req.AttrType
	}
	if req.Status == 0 || req.Status == 1 {
		updateAttr.Status = req.Status
		logx.Infof("更新属性状态: ID=%d, 旧状态=%d(0=启用,1=禁用), 新状态=%d(0=启用,1=禁用)", req.ID, existingAttr.Status, req.Status)
	}
	if req.Sort != 0 || (req.Sort == 0 && existingAttr.Sort != 0) {
		updateAttr.Sort = req.Sort
	}
	if req.Description != "" {
		updateAttr.Description = req.Description
	}

	// 设置更新时间
	updateAttr.UpdatedAt = time.Now()

	// 3. 执行更新
	err = attrRepository.Update(l.ctx, updateAttr)
	if err != nil {
		logx.Errorf("更新属性失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("更新属性失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("更新属性成功: ID=%d, Name=%s", updateAttr.ID, updateAttr.AttrName)

	return &types.BaseResp{
		Code: 0,
		Msg:  "更新成功",
		Data: updateAttr,
	}, nil
}
