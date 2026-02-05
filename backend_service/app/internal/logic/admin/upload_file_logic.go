// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"sapphire-mall/app/internal/cos"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type UploadFileLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 上传单个文件（支持图片、文档等，通过multipart/form-data上传）
func NewUploadFileLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UploadFileLogic {
	return &UploadFileLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UploadFileLogic) UploadFile(req *types.UploadFileReq, fileHeader *multipart.FileHeader) (resp *types.UploadFileResp, err error) {
	// 获取当前用户信息（用于记录创建人）
	currentUser, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		l.Errorf("获取当前用户信息失败: %v", err)
		return nil, fmt.Errorf("获取当前用户信息失败: %w", err)
	}
	creator := ""
	if currentUser != nil {
		creator = currentUser.UserCode
	}
	// 检查 COS 客户端是否初始化
	if l.svcCtx.CosClient == nil {
		l.Errorf("COS客户端未初始化")
		return nil, fmt.Errorf("文件存储服务未配置")
	}

	// 打开上传的文件
	file, err := fileHeader.Open()
	if err != nil {
		l.Errorf("打开上传文件失败: %v", err)
		return nil, fmt.Errorf("打开文件失败: %w", err)
	}
	defer file.Close()

	// 获取文件信息
	fileName := fileHeader.Filename
	fileSize := fileHeader.Size
	contentType := fileHeader.Header.Get("Content-Type")

	// 验证文件大小（建议不超过10MB，图片建议不超过5MB）
	maxSize := int64(10 * 1024 * 1024) // 10MB
	if fileSize > maxSize {
		l.Errorf("文件大小超过限制: %d bytes", fileSize)
		return nil, fmt.Errorf("文件大小不能超过10MB")
	}

	// 计算文件 hash（用于去重）
	fileHash, err := l.calculateFileHash(file)
	if err != nil {
		l.Errorf("计算文件hash失败: %v", err)
		return nil, fmt.Errorf("计算文件hash失败: %w", err)
	}

	// 重新打开文件（因为读取hash后文件指针已移动）
	file, err = fileHeader.Open()
	if err != nil {
		l.Errorf("重新打开上传文件失败: %v", err)
		return nil, fmt.Errorf("打开文件失败: %w", err)
	}
	defer file.Close()

	// 如果没有指定 Content-Type，根据文件扩展名推断
	if contentType == "" {
		contentType = cos.GetContentType(fileName)
	}

	// 确定文件分类
	category := req.Category
	if category == "" {
		category = l.detectFileCategory(contentType, fileName)
	}

	// 确定存储文件夹
	folder := req.Folder
	if folder == "" {
		folder = "uploads" // 默认文件夹
	}

	// 检查文件是否已存在（通过 hash）
	fileRepo := repository.NewFileRepository(l.svcCtx.GormDB)
	existingFile, err := fileRepo.GetByHash(l.ctx, fileHash)
	if err != nil {
		// Repository 层已经处理了文件不存在的情况（返回 nil, nil）
		// 这里只处理真正的错误（如超时、连接失败等）
		l.Errorf("查询文件记录失败: %v", err)
		return nil, fmt.Errorf("查询文件记录失败: %w", err)
	}

	// 如果文件已存在，返回已有记录（不重复上传）
	if existingFile != nil {
		l.Infof("文件已存在，返回已有记录: hash=%s, id=%d", fileHash, existingFile.ID)
		accessExpireStr := ""
		if existingFile.AccessUrlExpire != nil {
			accessExpireStr = existingFile.AccessUrlExpire.Format("2006-01-02 15:04:05")
		}
		fileInfo := types.FileInfo{
			Id:              existingFile.ID,
			Hash:            existingFile.Hash,
			StorageUrl:      existingFile.StorageUrl,
			Url:             existingFile.Url,
			OriginalName:    existingFile.OriginalName,
			Name:            existingFile.Name,
			Extension:       existingFile.Extension,
			Type:            existingFile.Type,
			Size:            existingFile.Size,
			StorageType:     existingFile.StorageType,
			BusinessType:    existingFile.BusinessType,
			BusinessId:      existingFile.BusinessId,
			Tags:            existingFile.Tags,
			Description:     existingFile.Description,
			Metadata:        existingFile.Metadata,
			AccessType:      existingFile.AccessType,
			AccessUrlExpire: accessExpireStr,
			ViewCount:       existingFile.ViewCount,
			DownloadCount:   existingFile.DownloadCount,
			Status:          existingFile.Status,
			StatusDesc:      existingFile.StatusDesc,
			CreatedAt:       existingFile.CreateAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:       existingFile.UpdateAt.Format("2006-01-02 15:04:05"),
			Creator:         existingFile.Creator,
			Updator:         existingFile.Updator,
			ContentType:     l.getContentTypeFromExtension(existingFile.Extension),
		}
		return &types.UploadFileResp{
			FileInfo: fileInfo,
		}, nil
	}

	// 生成文件在COS中的key（路径）
	// 格式: folder/category/timestamp_filename
	filePath := l.generateFileKey(folder, category, fileName)

	// 上传文件到COS
	// 设置文件有效期为1年
	expireDuration := 365 * 24 * time.Hour
	uploadResp, err := cos.UploadStreamToCOS(l.svcCtx.CosClient, filePath, file, contentType, &expireDuration)
	if err != nil {
		l.Errorf("上传文件到COS失败: %v", err)
		return nil, fmt.Errorf("文件上传失败: %w", err)
	}
	bodyBytes, _ := io.ReadAll(uploadResp.Body)
	l.Infof("上传文件到COS成功: key=%s, 响应信息: StatusCode=%d, Status=%s, Body=%s", filePath, uploadResp.StatusCode, uploadResp.Status, string(bodyBytes))
	// 读取响应体（注意：读取后需要重新设置，因为Body是io.ReadCloser）
	var storageURL string = uploadResp.Header.Get("Location")
	// 从上传响应中获取文件存储URL（COS存储路径）

	// 需要重新调用cos生成预签名的接口获取图片的长期预览链接地址
	// 接口地址: https://cloud.tencent.com/document/product/436/57421
	presignedURL, err := cos.GetFileURLFromCOS(l.svcCtx.CosClient, l.svcCtx.Config.Cos.SecretId, l.svcCtx.Config.Cos.SecretKey, filePath, expireDuration)
	if err != nil {
		l.Errorf("生成预签名URL失败: %v，使用存储URL作为预览URL", err)
		// 如果生成预签名URL失败，使用存储URL作为预览URL
	}

	// 提取文件扩展名（不含点号）
	extension := strings.TrimPrefix(strings.ToLower(filepath.Ext(fileName)), ".")
	if extension == "" {
		extension = "unknown"
	}

	// 提取文件名（不含路径）
	cleanFileName := filepath.Base(fileName)

	accessExpireAt := time.Now().Add(expireDuration)

	// 构建文件记录
	fileRecord := &model.File{
		Hash:            fileHash,
		StorageUrl:      storageURL,   // COS存储路径，存储真实的存储位置
		Url:             presignedURL, // 存储访问URL，即预签名预览URL
		OriginalName:    fileName,
		Name:            cleanFileName,
		Extension:       extension,
		Type:            category,
		Size:            fileSize,
		AccessUrlExpire: &accessExpireAt, // 与上传到COS时的expireDuration保持一致
		StorageType:     "cos",
		BusinessType:    folder, // 使用 folder 作为业务类型
		BusinessId:      0,      // 如果需要关联业务ID，可以从请求参数中获取
		AccessType:      1,      // 默认公开访问
		Status:          1,      // 默认正常状态
		IsDeleted:       false,  // 显式设置软删除标记为 false
		Creator:         creator,
		Updator:         creator,
	}

	// 保存文件记录到数据库
	err = fileRepo.Create(l.ctx, fileRecord)
	if err != nil {
		l.Errorf("保存文件记录到数据库失败: %v", err)
		// 文件已上传到COS成功，但数据库记录保存失败
		// 返回错误，让调用方知道虽然文件上传成功，但记录保存失败
		return nil, fmt.Errorf("文件已上传成功，但保存数据库记录失败: %w", err)
	}

	l.Infof("文件记录已保存到数据库: id=%d, hash=%s", fileRecord.ID, fileHash)

	// 构建返回的 FileInfo
	accessExpireStr := ""
	if fileRecord.AccessUrlExpire != nil {
		accessExpireStr = fileRecord.AccessUrlExpire.Format("2006-01-02 15:04:05")
	}
	fileInfo := types.FileInfo{
		Id:              fileRecord.ID,
		Hash:            fileRecord.Hash,
		StorageUrl:      fileRecord.StorageUrl,
		Url:             fileRecord.Url,
		OriginalName:    fileRecord.OriginalName,
		Name:            fileRecord.Name,
		Extension:       fileRecord.Extension,
		Type:            fileRecord.Type,
		Size:            fileRecord.Size,
		StorageType:     fileRecord.StorageType,
		BusinessType:    fileRecord.BusinessType,
		BusinessId:      fileRecord.BusinessId,
		Tags:            fileRecord.Tags,
		Description:     fileRecord.Description,
		Metadata:        fileRecord.Metadata,
		AccessType:      fileRecord.AccessType,
		AccessUrlExpire: accessExpireStr,
		ViewCount:       fileRecord.ViewCount,
		DownloadCount:   fileRecord.DownloadCount,
		Status:          fileRecord.Status,
		StatusDesc:      fileRecord.StatusDesc,
		CreatedAt:       fileRecord.CreateAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:       fileRecord.UpdateAt.Format("2006-01-02 15:04:05"),
		Creator:         fileRecord.Creator,
		Updator:         fileRecord.Updator,
		ContentType:     contentType,
	}

	resp = &types.UploadFileResp{
		FileInfo: fileInfo,
	}

	l.Infof("文件上传成功: key=%s, name=%s, size=%d, hash=%s", filePath, fileName, fileSize, fileHash)
	return resp, nil
}

// detectFileCategory 根据文件类型检测文件分类
func (l *UploadFileLogic) detectFileCategory(contentType, fileName string) string {
	// 根据 Content-Type 判断
	if strings.HasPrefix(contentType, "image/") {
		return "image"
	}
	if strings.HasPrefix(contentType, "video/") {
		return "video"
	}
	if strings.HasPrefix(contentType, "audio/") {
		return "audio"
	}
	if strings.HasPrefix(contentType, "application/pdf") ||
		strings.HasPrefix(contentType, "application/msword") ||
		strings.HasPrefix(contentType, "application/vnd.openxmlformats") ||
		strings.HasPrefix(contentType, "text/") {
		return "document"
	}
	if strings.Contains(contentType, "zip") ||
		strings.Contains(contentType, "rar") ||
		strings.Contains(contentType, "tar") ||
		strings.Contains(contentType, "gz") {
		return "archive"
	}

	// 根据文件扩展名判断
	ext := strings.ToLower(filepath.Ext(fileName))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".bmp":
		return "image"
	case ".mp4", ".avi", ".mov", ".wmv", ".webm", ".flv":
		return "video"
	case ".mp3", ".wav", ".ogg", ".flac", ".aac":
		return "audio"
	case ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt":
		return "document"
	case ".zip", ".rar", ".7z", ".tar", ".gz":
		return "archive"
	}

	return "other"
}

// generateFileKey 生成文件在COS中的key
func (l *UploadFileLogic) generateFileKey(folder, category, fileName string) string {
	// 清理文件名，移除特殊字符
	cleanFileName := l.sanitizeFileName(fileName)

	// 生成时间戳前缀，避免文件名冲突
	timestamp := time.Now().Format("20060102150405")

	// 如果文件夹或分类为空，使用默认值
	if folder == "" {
		folder = "uploads"
	}
	if category == "" {
		category = "other"
	}

	// 构建key: folder/category/timestamp_filename
	key := fmt.Sprintf("%s/%s/%s_%s", folder, category, timestamp, cleanFileName)

	return key
}

// sanitizeFileName 清理文件名，移除特殊字符
func (l *UploadFileLogic) sanitizeFileName(fileName string) string {
	// 移除路径分隔符
	fileName = strings.ReplaceAll(fileName, "/", "_")
	fileName = strings.ReplaceAll(fileName, "\\", "_")

	// 移除其他特殊字符
	fileName = strings.ReplaceAll(fileName, "..", "_")

	return fileName
}

// calculateFileHash 计算文件的 SHA256 hash
func (l *UploadFileLogic) calculateFileHash(file io.Reader) (string, error) {
	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", fmt.Errorf("读取文件内容失败: %w", err)
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}

// getContentTypeFromExtension 根据扩展名获取 Content-Type
func (l *UploadFileLogic) getContentTypeFromExtension(extension string) string {
	// 简单的扩展名到 Content-Type 映射
	mimeTypes := map[string]string{
		"jpg":  "image/jpeg",
		"jpeg": "image/jpeg",
		"png":  "image/png",
		"gif":  "image/gif",
		"webp": "image/webp",
		"svg":  "image/svg+xml",
		"pdf":  "application/pdf",
		"doc":  "application/msword",
		"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"xls":  "application/vnd.ms-excel",
		"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"mp4":  "video/mp4",
		"mp3":  "audio/mpeg",
		"txt":  "text/plain",
	}
	if mime, ok := mimeTypes[strings.ToLower(extension)]; ok {
		return mime
	}
	return "application/octet-stream"
}

// extractFolderFromKey 从 key 中提取 folder（第一个路径段）
func (l *UploadFileLogic) extractFolderFromKey(key string) string {
	parts := strings.Split(key, "/")
	if len(parts) > 0 {
		return parts[0]
	}
	return "uploads"
}
