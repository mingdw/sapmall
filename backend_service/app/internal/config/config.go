package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Version string `json:"version"`

	// DebugHTTPRequestLog 为 true 时打印每个 HTTP 请求的方法、路径、Query、Body（限长），便于 Apifox 联调；生产环境勿长期开启。
	DebugHTTPRequestLog bool `json:",optional"`

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
	MerchantDeposit struct {
		Amount           string
		TokenSymbol      string
		TokenAddress     string
		ChainID          int64
		ContractAddress  string
		IntentExpireMins int64
	}
	ChainMonitor struct {
		Enabled          bool
		RPCURL           string
		// ChainID 可选；>0 时链监听跳过 eth_chainId，仅用 RPC 拉块与日志（减轻 Infura 429）。须与 RPC 网络一致，如 Sepolia=11155111。
		ChainID          int64
		StartBlock       uint64
		PollIntervalSec  int64
		ConfirmationsReq int64
	}
	PlatformConfig struct {
		ContractAddress  string
		SignerPrivateKey string
	}
}
