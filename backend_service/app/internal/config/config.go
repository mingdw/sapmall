package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Version string `json:"version"`
	DB      struct {
		Driver     string
		DataSource string
	}
	Redis struct {
		Host     string
		Port     int
		Password string
		DB       int
	}
	Cos struct {
		SecretId   string
		SecretKey  string
		BucketName string
		Region     string
	}
	Auth struct {
		AccessSecret string
		AccessExpire int64
	}
}
