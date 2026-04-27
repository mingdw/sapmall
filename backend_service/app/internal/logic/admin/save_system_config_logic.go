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

type SaveSystemConfigLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改系统参数
func NewSaveSystemConfigLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveSystemConfigLogic {
	return &SaveSystemConfigLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveSystemConfigLogic) SaveSystemConfig(req *types.SaveSystemConfigReq) (resp *types.BaseResp, err error) {
	configKey := strings.TrimSpace(req.ConfigKey)
	configName := strings.TrimSpace(req.ConfigName)
	if configKey == "" || configName == "" {
		return customererrors.ParamErrorResp("配置键和配置名称不能为空"), nil
	}

	configRepo := repository.NewConfigRepository(l.svcCtx.GormDB)
	//系统参数更新和报错的逻辑如下:
	//先根据请求的key检查数据库中是否存在相同的key，如果存在则返回前端配置键已经存在
	//再根据请求的id是否为0判断新增还是保存

	exists, existsErr := configRepo.ExistsByConfigKey(l.ctx, configKey, 0)
	if existsErr != nil {
		l.Errorf("check config key exists failed, key=%s, err=%v", configKey, existsErr)
		return customererrors.DatabaseErrorResp("校验配置键失败"), nil
	}
	if exists {
		return customererrors.ParamErrorResp("配置键已存在"), nil
	}

	if req.ID > 0 {
		existing, getErr := configRepo.GetByID(l.ctx, req.ID)
		if getErr != nil {
			if errors.Is(getErr, gorm.ErrRecordNotFound) {
				return customererrors.NotFoundResp("系统参数不存在"), nil
			}
			l.Errorf("get config by id failed, id=%d, err=%v", req.ID, getErr)
			return customererrors.DatabaseErrorResp("查询系统参数失败"), nil
		}
		if existing.IsEditable == 0 {
			return customererrors.PermissionDeniedResp("该系统参数不允许编辑"), nil
		}

		updates := map[string]interface{}{
			"config_key":   configKey,
			"config_name":  configName,
			"config_value": req.ConfigValue,
			"config_type":  req.ConfigType,
			"config_group": req.ConfigGroup,
			"description":  req.Description,
			"is_system":    req.IsSystem,
			"is_encrypted": req.IsEncrypted,
			"is_editable":  req.IsEditable,
			"sort":         req.Sort,
			"status":       req.Status,
			"updator":      "system",
		}
		if updateErr := configRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update config failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新系统参数失败"), nil
		}
		return customererrors.SuccessMsg("更新系统参数成功"), nil
	}

	createModel := &model.Config{
		ConfigKey:   configKey,
		ConfigName:  configName,
		ConfigValue: req.ConfigValue,
		ConfigType:  req.ConfigType,
		ConfigGroup: req.ConfigGroup,
		Description: req.Description,
		IsSystem:    int(req.IsSystem),
		IsEncrypted: int(req.IsEncrypted),
		IsEditable:  int(req.IsEditable),
		Sort:        int(req.Sort),
		Status:      int(req.Status),
		Creator:     "system",
		Updator:     "system",
	}
	if createModel.ConfigType == "" {
		createModel.ConfigType = "string"
	}
	if createModel.ConfigGroup == "" {
		createModel.ConfigGroup = "default"
	}
	if createModel.Status == 0 && req.Status == 0 {
		// 显式传0表示禁用；未传时默认启用
	} else if createModel.Status == 0 {
		createModel.Status = 1
	}
	if createModel.IsEditable == 0 && req.IsEditable == 0 {
		// 显式传0表示不可编辑；未传时默认可编辑
	} else if createModel.IsEditable == 0 {
		createModel.IsEditable = 1
	}

	if createErr := configRepo.Create(l.ctx, createModel); createErr != nil {
		l.Errorf("create config failed, key=%s, err=%v", configKey, createErr)
		return customererrors.DatabaseErrorResp("新增系统参数失败"), nil
	}

	return customererrors.SuccessMsg("新增系统参数成功"), nil
}
