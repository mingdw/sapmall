package cctp

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	cctplogic "sapphire-mall/app/internal/logic/cctp"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
)

func CreateCctpIntentHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.CreateCctpIntentReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		l := cctplogic.NewCreateCctpIntentLogic(r.Context(), svcCtx)
		resp, err := l.CreateCctpIntent(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

func SubmitCctpBurnHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SubmitCctpBurnReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		l := cctplogic.NewSubmitCctpBurnLogic(r.Context(), svcCtx)
		resp, err := l.SubmitCctpBurn(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

func GetCctpIntentHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.GetCctpIntentReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		l := cctplogic.NewGetCctpIntentLogic(r.Context(), svcCtx)
		resp, err := l.GetCctpIntent(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

func SubmitCctpSwapHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SubmitCctpSwapReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		l := cctplogic.NewSubmitCctpSwapLogic(r.Context(), svcCtx)
		resp, err := l.SubmitCctpSwap(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
