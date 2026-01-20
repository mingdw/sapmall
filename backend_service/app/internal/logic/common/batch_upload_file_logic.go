// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package common

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchUploadFileLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量上传文件（支持图片、文档等，通过multipart/form-data上传多个文件）
func NewBatchUploadFileLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchUploadFileLogic {
	return &BatchUploadFileLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchUploadFileLogic) BatchUploadFile(req *types.UploadFileReq) (resp *types.BatchUploadFileResp, err error) {
	// todo: add your logic here and delete this line

	return
}
