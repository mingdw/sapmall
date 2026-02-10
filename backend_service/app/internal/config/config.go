package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Version string `json:"version"`

	DB struct {
		Host     string
		Port     int
		Username string
		Password string
		Dbname   string
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
		StartAuth    bool
	}
}
