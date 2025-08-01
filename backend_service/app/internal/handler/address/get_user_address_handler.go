package address

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"sapphire-mall/app/internal/logic/address"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
)

// 获取用户地址
func GetUserAddressHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserAddressListRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := address.NewGetUserAddressLogic(r.Context(), svcCtx)
		resp, err := l.GetUserAddress(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
