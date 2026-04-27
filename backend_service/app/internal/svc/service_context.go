package svc

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/url"
	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/middleware"
	"strings"
	"time"

	mysqlDriver "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
	"github.com/tencentyun/cos-go-sdk-v5"
	"github.com/zeromicro/go-zero/rest"
	gormmysql "gorm.io/driver/mysql"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
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
	// 注意：go-sql-driver/mysql 的 DSN 解析是用第一个 ':' 来分隔 user/password（不会对 user/pass 做 URL 解码）。
	// 当用户名形如 "实例ID:用户名" 时，直接用 DSN 字符串会被拆错，导致 1045。
	// 解决方案：用 Config + NewConnector 绕过 DSN 解析，再把现有 *sql.DB 交给 GORM。

	if strings.TrimSpace(c.DB.Host) == "" || strings.TrimSpace(c.DB.Username) == "" || strings.TrimSpace(c.DB.Dbname) == "" {
		panic("数据库配置不完整：必须设置 DB.Host / DB.Username / DB.Dbname")
	}
	port := c.DB.Port
	if port == 0 {
		port = 3306
	}

	// 用 ParseDSN 生成基础配置（为了让 driver 正确设置 charset/loc/parseTime 等），再覆盖真实的用户名/密码
	baseDSN := fmt.Sprintf(
		"u:p@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=true&loc=Local&allowNativePasswords=true",
		c.DB.Host,
		port,
		url.PathEscape(c.DB.Dbname),
	)
	cfg, err := mysqlDriver.ParseDSN(baseDSN)
	if err != nil {
		panic(fmt.Sprintf("failed to parse base dsn: %v", err))
	}
	cfg.User = c.DB.Username
	cfg.Passwd = c.DB.Password

	connector, err := mysqlDriver.NewConnector(cfg)
	if err != nil {
		panic(fmt.Sprintf("failed to create mysql connector: %v", err))
	}
	sqlDB := sql.OpenDB(connector)

	gormCfg := &gorm.Config{}
	// dev 环境打印全部 SQL，方便联调排查
	if strings.EqualFold(strings.TrimSpace(c.Mode), "dev") {
		gormCfg.Logger = gormlogger.Default.LogMode(gormlogger.Info)
	}

	db, err := gorm.Open(gormmysql.New(gormmysql.Config{Conn: sqlDB}), gormCfg)
	if err != nil {
		// 提供更详细的错误信息，帮助排查问题
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	// 配置数据库连接池和超时设置
	// 设置连接池参数
	sqlDB.SetMaxIdleConns(10)           // 设置空闲连接池中连接的最大数量
	sqlDB.SetMaxOpenConns(100)          // 设置打开数据库连接的最大数量
	sqlDB.SetConnMaxLifetime(time.Hour) // 设置连接可复用的最大时间（1小时）

	return buildServiceContext(c, redis, db, sqlDB)
}

func buildServiceContext(c config.Config, redisClient *redis.Client, db *gorm.DB, sqlDB *sql.DB) *ServiceContext {
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
		Redis:          redisClient,
		GormDB:         db,
		AuthMiddleware: middleware.NewAuthMiddleware(db, &c).Handle,
		RespMiddleware: middleware.NewUnifiedResponseMiddleware().Handle,
		CosClient:      cosClient,
	}
}
