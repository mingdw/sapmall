package svc

import (
	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/middleware"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/rest"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type ServiceContext struct {
	Config         config.Config
	Redis          *redis.Client
	GormDB         *gorm.DB
	AuthMiddleware rest.Middleware
	RespMiddleware rest.Middleware
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis := redis.NewClient(&redis.Options{
		Addr:     c.Redis.Host,
		Password: c.Redis.Password,
		DB:       c.Redis.DB,
	})
	// 初始化 GORM
	db, err := gorm.Open(mysql.Open(c.DB.DataSource), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	return &ServiceContext{
		Config:         c,
		Redis:          redis,
		GormDB:         db,
		AuthMiddleware: middleware.NewAuthMiddleware().Handle,
		RespMiddleware: middleware.NewUnifiedResponseMiddleware().Handle,
	}
}
