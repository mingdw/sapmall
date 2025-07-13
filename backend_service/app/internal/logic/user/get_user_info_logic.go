package user

import (
	"context"
	"encoding/json"

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
	userInfoJson, err := json.Marshal(user)
	if err != nil {
		return nil, err
	}
	return &types.GetUserInfoResp{
		Code: 0,
		Msg:  "success",
		Data: string(userInfoJson),
	}, nil
}
