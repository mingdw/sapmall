package address

import (
	"context"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteUserAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除用户
func NewDeleteUserAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteUserAddressLogic {
	return &DeleteUserAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteUserAddressLogic) DeleteUserAddress(req *types.DeleteUserRequest) error {
	userAddressRepository := repository.NewUserAddressRepository(l.svcCtx.GormDB)
	return userAddressRepository.Delete(l.ctx, req.ID)
}
