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
	AuthorizationHeader = "AUTHORIZATION"

	ComerUinContextKey  = "COMUNIONCOMERUIN"
	ComerRoleContextKey = "COMUNIONROLE"
	ComerGuestRole      = "Guest"
	ComerLoginedRole    = "Comer"
)

func (m *AuthMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !m.config.Auth.StartAuth {
			next(w, r)
			return
		}

		token := r.Header.Get(AuthorizationHeader)
		if token == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
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
		ctx = context.WithValue(ctx, ComerRoleContextKey, ComerLoginedRole)
		ctx = context.WithValue(ctx, "userInfo", userInfo)
		// Passthrough to next handler if need
		next(w, r.WithContext(ctx))
	}
}
