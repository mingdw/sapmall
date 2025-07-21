package svc

import (
	"fmt"
	"net/http"
	"net/url"
	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/middleware"

	"github.com/redis/go-redis/v9"
	"github.com/tencentyun/cos-go-sdk-v5"
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
	CosClient      *cos.Client
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", c.Redis.Host, c.Redis.Port),
		Password: c.Redis.Password,
		DB:       c.Redis.DB,
	})
	// 初始化 GORM
	db, err := gorm.Open(mysql.Open(c.DB.DataSource), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	secretID := c.Cos.SecretId
	secretKey := c.Cos.SecretKey
	bucketName := c.Cos.BucketName
	region := c.Cos.Region

	var cosClient *cos.Client

	if secretID != "" && secretKey != "" && bucketName != "" && region != "" {
		// 构建URL格式: https://<BucketName-APPID>.cos.<Region>.myqcloud.com
		bucketURL, err := url.Parse(fmt.Sprintf("https://%s.cos.%s.myqcloud.com", bucketName, region))
		if err != nil {
			panic("解析 COS URL 失败: " + err.Error())
		}

		cosClient = cos.NewClient(
			&cos.BaseURL{
				BucketURL: bucketURL,
			},
			&http.Client{
				Transport: &cos.AuthorizationTransport{
					SecretID:  secretID,
					SecretKey: secretKey,
				},
			},
		)
	}

	return &ServiceContext{
		Config:         c,
		Redis:          redis,
		GormDB:         db,
		AuthMiddleware: middleware.NewAuthMiddleware(db, &c).Handle,
		RespMiddleware: middleware.NewUnifiedResponseMiddleware().Handle,
		CosClient:      cosClient,
	}
}
