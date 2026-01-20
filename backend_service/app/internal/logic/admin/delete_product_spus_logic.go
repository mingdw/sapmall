// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteProductSpusLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除商品（单条删除也使用此接口，传入单个ID的数组）
func NewDeleteProductSpusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteProductSpusLogic {
	return &DeleteProductSpusLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteProductSpusLogic) DeleteProductSpus(req *types.DeleteProductSpusReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
