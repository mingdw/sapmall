// Code generated by goctl. DO NOT EDIT.
// goctl 1.8.3

package types

type GetNonceByAddressReq struct {
	WalletAddress string `path:"wallet_address"`
}

type GetNonceByAddressResp struct {
	Nonce string `json:"nonce"`
}

type HealthCheckReq struct {
	Service string `json:"service"`
}

type HealthCheckResp struct {
	Status string `json:"status"`
	Time   int64  `json:"time"`
}

type LoginReq struct {
	WalletAddress string `json:"wallet_address"`
	Signature     string `json:"signature"`
}

type LoginResp struct {
	Token string `json:"token"`
}

type VersionResp struct {
	Version   string `json:"version"`
	BuildTime string `json:"build_time"`
	GitCommit string `json:"git_commit"`
	GoVersion string `json:"go_version"`
}
