package address

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"sapphire-mall/app/internal/logic/address"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
)

// 创建或者修改用户地址
func AddAndUpdateUserAddressHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserAddressModifyRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := address.NewAddAndUpdateUserAddressLogic(r.Context(), svcCtx)
		err := l.AddAndUpdateUserAddress(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
