package address

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"sapphire-mall/app/internal/logic/address"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
)

// 删除用户
func DeleteUserAddressHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DeleteUserRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := address.NewDeleteUserAddressLogic(r.Context(), svcCtx)
		err := l.DeleteUserAddress(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
