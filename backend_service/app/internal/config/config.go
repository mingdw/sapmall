package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	DB struct {
		Driver     string
		DataSource string
	}
	Redis struct {
		Host     string
		Port     int
		Password string
		DB       int
	}
}
