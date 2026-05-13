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
		ContractAddress  string
		IntentExpireMins int64
	}
	// ChainMonitor 仅保留管理端等场景写链所需的 JSON-RPC 地址（如同步平台配置到合约）。
	ChainMonitor struct {
		RPCURL string
	}
	// ChainListener 异步轮询 PlatformConfig 合约日志并回写 sys_config（与 HTTP 请求解耦）。
	ChainListener struct {
		Enable                   bool `json:",optional"`
		PollIntervalSec          int  `json:",optional"` // 默认 12
		MaxBlocksChunk           int  `json:",optional"` // 单次 FilterLogs 最大块跨度，默认 3000
		BootstrapLookbackBlocks  int  `json:",optional"` // 游标未配置/无效时首次回溯块数（含当前链头），避免只扫 latest 漏掉前一区块内的日志，默认 128
	}
	PlatformConfig struct {
		ContractAddress  string
		SignerPrivateKey string
	}
}
