package user

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/model"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

var (
	ErrUserNotLoggedIn = errors.New("用户未登录")
	ErrUserNotFound    = errors.New("获取用户信息失败")
)

// GetUserFromContext 从 context 中获取用户信息
// 优先从 context 的 "userInfo" 中获取，如果没有则从 ComerUinContextKey 获取 userId 并查询数据库
// 返回用户信息和错误，如果用户未登录或获取失败，返回相应的错误
func AuthUserInfo(ctx context.Context, db *gorm.DB) (*model.User, error) {
	// 优先从 context 的 "userInfo" 中获取
	userInfo, ok := ctx.Value("userInfo").(*model.User)
	if ok && userInfo != nil {
		return userInfo, nil
	}

	if userInfo == nil {
		logx.Errorf("用户不存在: userId: %d", userInfo.ID)
		return nil, ErrUserNotFound
	}

	return userInfo, nil
}
