package svc

import (
	"github.com/zeromicro/go-zero/rest"
	"sapphire-mall/internal/config"
	"sapphire-mall/internal/middleware"
)

type ServiceContext struct {
	Config         config.Config
	RespMiddleware rest.Middleware
	AuthMiddleware rest.Middleware
}

func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		Config:         c,
		RespMiddleware: middleware.NewRespMiddleware().Handle,
		AuthMiddleware: middleware.NewAuthMiddleware().Handle,
	}
}
