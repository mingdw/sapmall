package common

import (
	"net/http"

	"sapphire-mall/app/internal/logic/common"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/rest/httpx"
)

// 获取随机数
func GetNonceByAddressHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.GetNonceByAddressReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		logx.Infof("GetNonceByAddressHandler req: %v", req.WalletAddress)
		l := common.NewGetNonceByAddressLogic(r.Context(), svcCtx)
		resp, err := l.GetNonceByAddress(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
