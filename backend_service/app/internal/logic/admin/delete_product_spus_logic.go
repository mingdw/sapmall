// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

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
	// 1. 验证请求参数
	if len(req.Ids) == 0 {
		return customererrors.FailMsg("商品ID列表不能为空"), nil
	}

	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	// 3. 查询要删除的商品，验证权限（只能删除自己创建的商品）
	products, err := productSpuRepository.GetProductSpusByUserCode(l.ctx, req.Ids, userInfo.UserCode)
	if err != nil {
		logx.Errorf("查询商品失败: %v", err)
		return customererrors.FailMsg("查询商品失败"), nil
	}

	if len(products) == 0 {
		return customererrors.FailMsg("未找到可删除的商品或无权删除"), nil
	}

	// 4. 提取实际存在的商品ID
	validIds := make([]int64, 0, len(products))
	for _, product := range products {
		validIds = append(validIds, product.ID)
	}

	// 5. 执行物理删除
	deletedCount, err := productSpuRepository.BatchDeleteProductSpus(l.ctx, validIds)
	if err != nil {
		logx.Errorf("删除商品失败: %v", err)
		return customererrors.FailMsg(fmt.Sprintf("删除商品失败: %v", err)), nil
	}
	logx.Infof("成功删除 %d 个商品, 用户: %s, IDs: %v", deletedCount, userInfo.UserCode, validIds)
	return customererrors.SuccessMsg(fmt.Sprintf("成功删除 %d 个商品", deletedCount)), nil
}
