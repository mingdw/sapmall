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
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
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
	// 从 context 获取用户信息
	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return nil, errors.New("获取用户信息失败")
	}

	configKey := strings.TrimSpace(req.ConfigKey)
	configName := strings.TrimSpace(req.ConfigName)
	if configKey == "" || configName == "" {
		return customererrors.ParamErrorResp("配置键和配置名称不能为空"), nil
	}

	configRepo := repository.NewConfigRepository(l.svcCtx.GormDB)
	//系统参数更新和报错的逻辑如下:
	//先根据请求的key检查数据库中是否存在相同的key，如果存在则返回前端配置键已经存在
	//再根据请求的id是否为0判断新增还是保存
	if req.ID > 0 {
		//代表着更新，不需要校验上送的configkey是否存在，直接根据id更新最细的结果即可
		//根据请求参数构建	updates := map[string]interface{}，并且调用configRepo.UpdateColumnsByID(l.ctx, req.ID, updates)更新
		updates := make(map[string]interface{})
		if req.ConfigKey != "" {
			updates["config_key"] = req.ConfigKey
		}
		if req.ConfigName != "" {
			updates["config_name"] = req.ConfigName
		}
		if req.ConfigValue != "" {
			updates["config_value"] = req.ConfigValue
		}
		if req.ConfigType != "" {
			updates["config_type"] = req.ConfigType
		}
		if req.ConfigGroup != "" {
			updates["config_group"] = req.ConfigGroup
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if req.IsSystem != 0 {
			updates["is_system"] = req.IsSystem
		}
		if req.IsEncrypted != 0 {
			updates["is_encrypted"] = req.IsEncrypted
		}
		if req.IsEditable != 0 {
			updates["is_editable"] = req.IsEditable
		}
		if req.Sort != 0 {
			updates["sort"] = req.Sort
		}
		if req.Status != 0 {
			updates["status"] = req.Status
		}
		if updateErr := configRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update config failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新系统参数失败"), nil
		}
		return customererrors.SuccessMsg("更新系统参数成功"), nil
	} else {
		//新增，需要校验上送的configkey是否存在
		exists, existsErr := configRepo.ExistsByConfigKey(l.ctx, configKey)
		if existsErr != nil {
			l.Errorf("check config key exists failed, key=%s, err=%v", configKey, existsErr)
			return customererrors.DatabaseErrorResp("校验配置键失败"), nil
		}
		if exists {
			return customererrors.ParamErrorResp("配置键已存在"), nil
		}
		//创建model.Config
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
			Creator:     userInfo.UserCode,
			Updator:     userInfo.UserCode,
		}
		if createErr := configRepo.Create(l.ctx, createModel); createErr != nil {
			l.Errorf("create config failed, key=%s, err=%v", configKey, createErr)
			return customererrors.DatabaseErrorResp("新增系统参数失败"), nil
		}
		return customererrors.SuccessMsg("新增系统参数成功"), nil
	}

}
