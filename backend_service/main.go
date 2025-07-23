package main

import (
	"flag"
	_ "github.com/dgrijalva/jwt-go"
	_ "github.com/ethereum/go-ethereum/accounts"
	_ "github.com/go-playground/validator/v10"
	_ "github.com/google/uuid"
	_ "github.com/minio/minio-go/v7"
	_ "github.com/mitchellh/go-homedir"
	_ "github.com/redis/go-redis/v9"
	_ "github.com/robfig/cron/v3"
	_ "github.com/sony/sonyflake"
	_ "github.com/spf13/cobra"
	_ "github.com/spf13/viper"
	_ "github.com/zeromicro/go-zero/core/logx"
	_ "github.com/zeromicro/go-zero/rest"
	_ "github.com/zeromicro/go-zero/zrpc"
	_ "go.uber.org/zap"
	_ "golang.org/x/oauth2"
	_ "google.golang.org/grpc"
	_ "google.golang.org/protobuf/proto"
	_ "gorm.io/datatypes"
	_ "gorm.io/driver/mysql"
	_ "gorm.io/gorm"
)

var configFile = flag.String("f", "etc/product.yaml", "the config file")

func main() {}
