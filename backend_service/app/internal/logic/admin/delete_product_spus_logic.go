// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"

	"sapphire-mall/app/internal/middleware"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
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
	// 1. 验证请求参数
	if len(req.Ids) == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "商品ID列表不能为空",
			Data: nil,
		}, nil
	}

	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	// 2. 从 context 获取用户信息
	userInfo, ok := l.ctx.Value("userInfo").(*model.User)
	if !ok || userInfo == nil {
		// 如果没有用户信息，尝试从 context 获取 userId
		userID, ok := l.ctx.Value(middleware.ComerUinContextKey).(int64)
		if !ok {
			logx.Errorf("无法获取用户信息")
			return &types.BaseResp{
				Code: 401,
				Msg:  "用户未登录",
				Data: nil,
			}, nil
		}
		userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
		userInfo, err = userRepository.GetByID(l.ctx, userID)
		if err != nil {
			logx.Errorf("获取用户信息失败: %v", err)
			return &types.BaseResp{
				Code: 401,
				Msg:  "获取用户信息失败",
				Data: nil,
			}, nil
		}
	}

	// 3. 查询要删除的商品，验证权限（只能删除自己创建的商品）
	products, err := productSpuRepository.GetProductSpusByUserCode(l.ctx, req.Ids, userInfo.UserCode)
	if err != nil {
		logx.Errorf("查询商品失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询商品失败",
			Data: nil,
		}, nil
	}

	if len(products) == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "未找到可删除的商品或无权删除",
			Data: nil,
		}, nil
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
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("删除商品失败: %v", err),
			Data: nil,
		}, nil
	}
	logx.Infof("成功删除 %d 个商品, 用户: %s, IDs: %v", deletedCount, userInfo.UserCode, validIds)

	return &types.BaseResp{
		Code: 0,
		Msg:  fmt.Sprintf("成功删除 %d 个商品", deletedCount),
		Data: map[string]interface{}{
			"deletedCount": deletedCount,
			"deletedIds":   validIds,
		},
	}, nil
}
