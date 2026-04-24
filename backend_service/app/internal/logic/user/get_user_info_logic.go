package user

import (
	"context"
	"time"

	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserInfoLogic {
	return &GetUserInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserInfoLogic) GetUserInfo(req *types.GetUserInfoReq) (resp *types.GetUserInfoResp, err error) {
	userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
	user, err := userRepository.GetByID(l.ctx, req.UserId)
	if err != nil {
		return nil, err
	}

	// 查询用户角色
	userRoleRepository := repository.NewUserRoleRepository(l.svcCtx.GormDB)
	userRoles, err := userRoleRepository.GetByUserID(l.ctx, req.UserId)
	if err != nil {
		return nil, err
	}

	roleRepository := repository.NewRoleRepository(l.svcCtx.GormDB)
	roles := make([]types.GetUserRoleInfo, 0, len(userRoles))
	for _, userRole := range userRoles {
		roleList, roleErr := roleRepository.GetByID(l.ctx, userRole.RoleID)
		if roleErr != nil {
			return nil, roleErr
		}
		for _, role := range roleList {
			roles = append(roles, types.GetUserRoleInfo{
				RoleID:      role.ID,
				RoleCode:    role.Code,
				RoleName:    role.Name,
				Description: role.Description,
			})
		}
	}

	// 查询用户的操作日志（默认返回最近10条）
	repo := repository.NewRepository(l.svcCtx.GormDB)
	operationLogRepository := repository.NewOperationLogRepository(repo)
	operationLogs, _, err := operationLogRepository.ListOperationLogsByUserID(l.ctx, req.UserId, 0, 10)
	if err != nil {
		return nil, err
	}

	logItems := make([]types.GetUserOperationLogItem, 0, len(operationLogs))
	for _, logItem := range operationLogs {
		logItems = append(logItems, types.GetUserOperationLogItem{
			ID:            logItem.ID,
			UserID:        logItem.UserID,
			Username:      logItem.Username,
			BizModule:     logItem.BizModule,
			ActionType:    logItem.ActionType,
			ActionSummary: logItem.ActionSummary,
			Before:        logItem.Before,
			After:         logItem.After,
			ObjectType:    logItem.ObjectType,
			ObjectID:      logItem.ObjectID,
			DetailJSON:    logItem.DetailJSON,
			ResultStatus:  int64(logItem.ResultStatus),
			ErrorMessage:  logItem.ErrorMessage,
			ClientType:    logItem.ClientType,
			RequestID:     logItem.RequestID,
			IP:            logItem.IP,
			Item1:         logItem.Item1,
			Item2:         logItem.Item2,
			Item3:         logItem.Item3,
			CreatedAt:     logItem.CreatedAt.Format(time.DateTime),
			UpdatedAt:     logItem.UpdatedAt.Format(time.DateTime),
		})
	}

	birthday := ""
	if user.Birthday != nil {
		birthday = user.Birthday.Format("2006-01-02")
	}

	resp = &types.GetUserInfoResp{
		BasicInfo: types.GetUserBasicInfo{
			ID:                    user.ID,
			UniqueID:              user.UniqueId,
			UserCode:              user.UserCode,
			Nickname:              user.Nickname,
			Avatar:                user.Avatar,
			Gender:                int64(user.Gender),
			Birthday:              birthday,
			Email:                 user.Email,
			Phone:                 user.Phone,
			Status:                int64(user.Status),
			StatusDesc:            user.StatusDesc,
			Type:                  int64(user.Type),
			TypeDesc:              user.TypeDesc,
			KycStatus:             int64(user.KycStatus),
			MerchantDepositStatus: int64(user.MerchantDepositStatus),
			CreatedAt:             user.CreatedAt.Format(time.DateTime),
			UpdatedAt:             user.UpdatedAt.Format(time.DateTime),
		},
		Roles:         roles,
		OperationLogs: logItems,
	}
	return resp, nil
}
