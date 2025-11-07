package middleware

import (
	"context"
	"net/http"
	"sapphire-mall/pkg/jwt"

	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/repository"

	"gorm.io/gorm"
)

type AuthMiddleware struct {
	db     *gorm.DB
	config *config.Config
}

func NewAuthMiddleware(db *gorm.DB, config *config.Config) *AuthMiddleware {
	return &AuthMiddleware{
		db:     db,
		config: config,
	}
}

const (
	AuthorizationHeader = "Authorization"

	ComerUinContextKey = "COMUNIONCOMERUIN"
	ComerRoleCode      = "R0001" // 如果不开启权限校验，默认使用管理员角色
	ComerAddress       = "0x67003e9d9B26Ed30B8AfeA6da762279D7c83abC2"
	ComerUserId        = 1
)

func (m *AuthMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !m.config.Auth.StartAuth {
			// 如果不开启权限校验，默认使用管理员角色
			ctx := context.WithValue(r.Context(), ComerUinContextKey, ComerUserId)
			// 需要根据默认的userId获取用户信息
			userRepository := repository.NewUserRepository(m.db)
			userInfo, err := userRepository.GetByID(r.Context(), int64(ComerUserId))
			if err != nil {
				http.Error(w, "User not found", http.StatusUnauthorized)
				return
			}
			ctx = context.WithValue(ctx, "userInfo", userInfo)
			// 传递用户信息到上下文
			ctx = context.WithValue(r.Context(), ComerUinContextKey, ComerUserId)
			ctx = context.WithValue(ctx, "userInfo", userInfo)
			next(w, r.WithContext(ctx))
			return
		}

		authHeader := r.Header.Get(AuthorizationHeader)
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// 处理Bearer token格式
		token := authHeader
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			token = authHeader[7:]
		}

		userID, err := jwt.Verify(token, m.config.Auth.AccessSecret)
		if err != nil {
			http.Error(w, "Verify token failed", http.StatusUnauthorized)
			return
		}

		userRepository := repository.NewUserRepository(m.db)
		userInfo, err := userRepository.GetByID(r.Context(), int64(userID))
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		// 传递用户信息到上下文
		ctx := context.WithValue(r.Context(), ComerUinContextKey, userID)
		ctx = context.WithValue(ctx, "userInfo", userInfo)
		// Passthrough to next handler if need
		next(w, r.WithContext(ctx))
	}
}
