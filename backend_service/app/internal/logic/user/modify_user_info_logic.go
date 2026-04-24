// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package user

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type ModifyUserInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 修改用户信息
func NewModifyUserInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ModifyUserInfoLogic {
	return &ModifyUserInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ModifyUserInfoLogic) ModifyUserInfo(req *types.ModifyUserInfoReq) (resp *types.BaseResp, err error) {
	// 通过token获取用户的id，修改前端传过来的参数，记录修改日志，返回结果
	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		logx.Errorf("获取用户信息失败: %v", err)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	if strings.TrimSpace(req.Nickname) == "" &&
		req.Gender == 0 &&
		strings.TrimSpace(req.Birthday) == "" &&
		strings.TrimSpace(req.Email) == "" &&
		strings.TrimSpace(req.Phone) == "" &&
		strings.TrimSpace(req.Avatar) == "" {
		return customererrors.ParamErrorResp("请至少传入一个需要修改的字段"), nil
	}

	if req.Gender != 0 && req.Gender != 1 && req.Gender != 2 {
		return customererrors.ParamErrorResp("性别参数仅支持 1(男) 或 2(女)"), nil
	}

	var birthdayPtr *time.Time
	if birthday := strings.TrimSpace(req.Birthday); birthday != "" {
		parsed, parseErr := time.Parse("2006-01-02", birthday)
		if parseErr != nil {
			return customererrors.ParamErrorResp("生日格式错误，应为 YYYY-MM-DD"), nil
		}
		birthdayPtr = &parsed
	}

	userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
	userInfo, dbErr := userRepository.GetByID(l.ctx, userInfo.ID)
	if dbErr != nil || userInfo == nil {
		l.Errorf("query user failed, userID=%d, err=%v", userInfo.ID, dbErr)
		return customererrors.NotFoundResp("用户不存在"), nil
	}

	beforeJSON, _ := json.Marshal(userInfo)
	afterUserInfo := *userInfo

	updates := map[string]interface{}{}
	if nickname := strings.TrimSpace(req.Nickname); nickname != "" && nickname != userInfo.Nickname {
		updates["nickname"] = nickname
		afterUserInfo.Nickname = nickname
	}
	if req.Gender == 1 || req.Gender == 2 {
		nextGender := int(req.Gender)
		if nextGender != userInfo.Gender {
			updates["gender"] = nextGender
			afterUserInfo.Gender = nextGender
		}
	}
	if birthdayPtr != nil {
		oldBirthday := ""
		if userInfo.Birthday != nil {
			oldBirthday = userInfo.Birthday.Format("2006-01-02")
		}
		if birthdayPtr.Format("2006-01-02") != oldBirthday {
			updates["birthday"] = birthdayPtr
			afterUserInfo.Birthday = birthdayPtr
		}
	}
	if email := strings.TrimSpace(req.Email); email != "" && email != userInfo.Email {
		updates["email"] = email
		afterUserInfo.Email = email
	}
	if phone := strings.TrimSpace(req.Phone); phone != "" && phone != userInfo.Phone {
		updates["phone"] = phone
		afterUserInfo.Phone = phone
	}
	if avatar := strings.TrimSpace(req.Avatar); avatar != "" && avatar != userInfo.Avatar {
		updates["avatar"] = avatar
		afterUserInfo.Avatar = avatar
	}
	if len(updates) == 0 {
		return &types.BaseResp{
			Code:    consts.SUCCESS,
			Message: "未检测到变更",
			Data:    nil,
			Total:   0,
		}, nil
	}
	updates["updator"] = userInfo.UserCode
	afterUserInfo.Updator = userInfo.UserCode

	if updateErr := userRepository.UpdateColumnsByID(l.ctx, userInfo.ID, updates); updateErr != nil {
		l.Errorf("update user info failed, userID=%d, err=%v", userInfo.ID, updateErr)
		return customererrors.DatabaseErrorResp("修改用户信息失败"), nil
	}

	afterJSON, _ := json.Marshal(afterUserInfo)

	repo := repository.NewRepository(l.svcCtx.GormDB)
	operationLogRepository := repository.NewOperationLogRepository(repo)
	logCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	logErr := operationLogRepository.CreateOperationLog(logCtx, &model.OperationLog{
		UserID:        userInfo.ID,
		Username:      userInfo.Nickname,
		BizModule:     "profile",
		ActionType:    "modify_user_info",
		ActionSummary: "修改个人信息",
		Before:        string(beforeJSON),
		After:         string(afterJSON),
		ObjectType:    "sys_user",
		ObjectID:      fmt.Sprintf("%d", afterUserInfo.ID),
		DetailJSON:    "{}",
		ResultStatus:  1,
		Creator:       userInfo.Nickname,
		Updator:       userInfo.Nickname,
	})
	if logErr != nil {
		// 日志写入失败不影响主流程，避免请求上下文超时导致日志落库失败
		l.Errorf("create operation log failed, userID=%d, err=%v", userInfo.ID, logErr)
	}

	return &types.BaseResp{
		Code:    consts.SUCCESS,
		Message: "用户信息修改成功",
		Data:    nil,
		Total:   0,
	}, nil
}
