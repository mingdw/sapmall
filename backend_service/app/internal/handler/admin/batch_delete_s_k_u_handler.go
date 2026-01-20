// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"sapphire-mall/app/internal/logic/admin"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
)

// 批量删除SKU
func BatchDeleteSKUHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.BatchDeleteSKUReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := admin.NewBatchDeleteSKULogic(r.Context(), svcCtx)
		resp, err := l.BatchDeleteSKU(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
