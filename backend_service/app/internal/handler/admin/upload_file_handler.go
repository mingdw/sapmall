// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"fmt"
	"net/http"

	"sapphire-mall/app/internal/logic/admin"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

// 上传单个文件（支持图片、文档等，通过multipart/form-data上传）
func UploadFileHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 解析 multipart/form-data（必须先解析才能访问文件）
		if err := r.ParseMultipartForm(32 << 20); err != nil { // 32MB max memory
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		var req types.UploadFileReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		// 检查文件是否存在
		if r.MultipartForm == nil || r.MultipartForm.File == nil {
			httpx.ErrorCtx(r.Context(), w, fmt.Errorf("未找到上传的文件"))
			return
		}

		files, ok := r.MultipartForm.File["file"]
		if !ok || len(files) == 0 {
			httpx.ErrorCtx(r.Context(), w, fmt.Errorf("未找到文件字段 'file'"))
			return
		}

		l := admin.NewUploadFileLogic(r.Context(), svcCtx)
		resp, err := l.UploadFile(&req, files[0])
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
