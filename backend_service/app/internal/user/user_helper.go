package user

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

var (
	ErrUserNotLoggedIn = errors.New("用户未登录")
	ErrUserNotFound    = errors.New("获取用户信息失败")
)

// AuthUserInfo 从 context 中获取用户信息
// 优先从 context 的 "userInfo" 中获取，如果没有则从 ComerUinContextKey 获取 userId 并查询数据库
// 返回用户信息和错误，如果用户未登录或获取失败，返回 nil 和错误（不 panic）
func AuthUserInfo(ctx context.Context, db *gorm.DB) (*model.User, error) {
	// 优先从 context 的 "userInfo" 中获取
	userInfo, ok := ctx.Value("userInfo").(*model.User)
	if ok && userInfo != nil {
		return userInfo, nil
	}

	// 如果 context 中没有 userInfo，返回 nil 和错误（不 panic）
	// 注意：某些接口可能不需要认证，这是正常情况
	return nil, ErrUserNotLoggedIn
}
