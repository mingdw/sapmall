package cos

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/tencentyun/cos-go-sdk-v5"
)

// UploadFileToCOS 上传文件到COS
func UploadFileToCOS(client *cos.Client, key, filePath string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("打开文件失败: %w", err)
	}
	defer file.Close()

	// 获取文件的MIME类型
	contentType := getContentType(filePath)

	// 上传对象
	resp, err := client.Object.Put(context.Background(), key, file, &cos.ObjectPutOptions{
		ObjectPutHeaderOptions: &cos.ObjectPutHeaderOptions{
			ContentType: contentType,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("上传文件失败: %w", err)
	}

	return resp, nil
}

// UploadStreamToCOS 上传二进制流到COS
func UploadStreamToCOS(client *cos.Client, key string, reader io.Reader, contentType string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// 上传对象
	resp, err := client.Object.Put(context.Background(), key, reader, &cos.ObjectPutOptions{
		ObjectPutHeaderOptions: &cos.ObjectPutHeaderOptions{
			ContentType: contentType,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("上传流失败: %w", err)
	}

	return resp, nil
}

// DownloadFileFromCOS 下载文件从COS
func DownloadFileFromCOS(client *cos.Client, key, filePath string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	// 确保目标目录存在
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, fmt.Errorf("创建目录失败: %w", err)
	}

	// 创建文件
	file, err := os.Create(filePath)
	if err != nil {
		return nil, fmt.Errorf("创建文件失败: %w", err)
	}
	defer file.Close()

	// 下载对象
	resp, err := client.Object.Get(context.Background(), key, nil)
	if err != nil {
		return nil, fmt.Errorf("下载文件失败: %w", err)
	}
	defer resp.Body.Close()

	// 将响应体写入文件
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return nil, fmt.Errorf("写入文件失败: %w", err)
	}

	return resp, nil
}

// DeleteFileFromCOS 删除文件从COS
func DeleteFileFromCOS(client *cos.Client, key string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	// 删除对象
	resp, err := client.Object.Delete(context.Background(), key)
	if err != nil {
		return nil, fmt.Errorf("删除文件失败: %w", err)
	}

	return resp, nil
}

// GetFileListFromCOS 获取文件列表
func GetFileListFromCOS(client *cos.Client, prefix string, maxKeys int) (*cos.BucketGetResult, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	if maxKeys <= 0 {
		maxKeys = 1000 // 默认最大获取1000个
	}

	// 列出对象
	opt := &cos.BucketGetOptions{
		Prefix:  prefix,
		MaxKeys: maxKeys,
	}
	result, _, err := client.Bucket.Get(context.Background(), opt)
	if err != nil {
		return nil, fmt.Errorf("获取文件列表失败: %w", err)
	}

	return result, nil
}

// GetFileInfoFromCOS 获取文件信息
func GetFileInfoFromCOS(client *cos.Client, key string) (*cos.Object, *cos.Response, error) {
	if client == nil {
		return nil, nil, errors.New("COS客户端未初始化")
	}

	// 获取对象元数据
	headResp, err := client.Object.Head(context.Background(), key, nil)
	if err != nil {
		// 处理文件不存在的情况
		if cos.IsNotFoundError(err) {
			return nil, nil, nil
		}
		return nil, nil, fmt.Errorf("获取文件信息失败: %w", err)
	}

	// 创建一个包含元数据的Object返回
	object := &cos.Object{
		Key:          key,
		LastModified: headResp.Header.Get("Last-Modified"),
		Size:         headResp.ContentLength,
		ETag:         strings.Trim(headResp.Header.Get("ETag"), "\""),
		StorageClass: headResp.Header.Get("x-cos-storage-class"),
	}

	return object, headResp, nil
}

// GetFileURLFromCOS 获取文件临时URL
func GetFileURLFromCOS(client *cos.Client, secretID, secretKey, key string, expire time.Duration) (string, error) {
	if client == nil {
		return "", errors.New("COS客户端未初始化")
	}
	// 获取预签名URL
	presignedURL, err := client.Object.GetPresignedURL(
		context.Background(),
		http.MethodGet,
		key,
		secretID,
		secretKey,
		expire,
		nil,
	)
	if err != nil {
		return "", fmt.Errorf("获取文件URL失败: %w", err)
	}

	return presignedURL.String(), nil
}

// GetPermanentURL 获取文件永久URL (不含签名)
func GetPermanentURL(client *cos.Client, bucketName, region, key string) (string, error) {
	if client == nil {
		return "", errors.New("COS客户端未初始化")
	}

	// 构建对象的永久URL
	permanentURL := fmt.Sprintf("https://%s.cos.%s.myqcloud.com/%s",
		bucketName, region, strings.TrimPrefix(key, "/"))

	return permanentURL, nil
}

// BatchDeleteFilesFromCOS 批量删除文件
func BatchDeleteFilesFromCOS(client *cos.Client, keys []string) (*cos.ObjectDeleteMultiResult, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	if len(keys) == 0 {
		return nil, nil
	}

	// 构建删除对象列表
	objects := make([]cos.Object, len(keys))
	for i, key := range keys {
		objects[i] = cos.Object{Key: key}
	}

	// 批量删除对象
	result, _, err := client.Object.DeleteMulti(context.Background(), &cos.ObjectDeleteMultiOptions{
		Objects: objects,
		Quiet:   true, // 设置为 true，只返回失败的结果
	})
	if err != nil {
		return nil, fmt.Errorf("批量删除文件失败: %w", err)
	}

	return result, nil
}

// CopyFileInCOS 在COS中复制文件
func CopyFileInCOS(client *cos.Client, bucketName, region, sourceKey, destKey string) (*cos.ObjectCopyResult, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	// 构建源对象URL
	sourceURL := fmt.Sprintf("%s.cos.%s.myqcloud.com/%s",
		bucketName, region, strings.TrimPrefix(sourceKey, "/"))

	// 复制对象
	result, _, err := client.Object.Copy(context.Background(), destKey, sourceURL, nil)
	if err != nil {
		return nil, fmt.Errorf("复制文件失败: %w", err)
	}

	return result, nil
}

// CheckFileExistsInCOS 检查文件是否存在
func CheckFileExistsInCOS(client *cos.Client, key string) (bool, *cos.Response, error) {
	if client == nil {
		return false, nil, errors.New("COS客户端未初始化")
	}

	// 检查对象是否存在
	resp, err := client.Object.Head(context.Background(), key, nil)
	if err != nil {
		// 处理 404 错误 (文件不存在)
		if cos.IsNotFoundError(err) {
			return false, nil, nil
		}
		return false, nil, fmt.Errorf("检查文件存在失败: %w", err)
	}

	return true, resp, nil
}

// UploadFileWithMetadata 上传文件并设置元数据
func UploadFileWithMetadata(client *cos.Client, key, filePath string, metadata map[string]string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("打开文件失败: %w", err)
	}
	defer file.Close()

	// 获取文件的MIME类型
	contentType := getContentType(filePath)

	// 准备头部选项
	headerOptions := &cos.ObjectPutHeaderOptions{
		ContentType: contentType,
	}

	// 添加元数据
	for k, v := range metadata {
		if !strings.HasPrefix(k, "x-cos-meta-") {
			k = "x-cos-meta-" + k
		}
		headerOptions.XCosMetaXXX = &http.Header{}
		headerOptions.XCosMetaXXX.Add(k, v)
	}

	// 上传对象
	resp, err := client.Object.Put(context.Background(), key, file, &cos.ObjectPutOptions{
		ObjectPutHeaderOptions: headerOptions,
	})
	if err != nil {
		return nil, fmt.Errorf("上传文件失败: %w", err)
	}

	return resp, nil
}

// CreateFolder 在COS中创建文件夹
func CreateFolder(client *cos.Client, folderPath string) (*cos.Response, error) {
	if client == nil {
		return nil, errors.New("COS客户端未初始化")
	}

	// 确保路径以"/"结尾
	if !strings.HasSuffix(folderPath, "/") {
		folderPath += "/"
	}

	// 创建一个空对象表示文件夹
	resp, err := client.Object.Put(context.Background(), folderPath, strings.NewReader(""), nil)
	if err != nil {
		return nil, fmt.Errorf("创建文件夹失败: %w", err)
	}

	return resp, nil
}

// getContentType 根据文件扩展名获取MIME类型
func getContentType(filename string) string {
	// 处理路径为空的情况
	if filename == "" {
		return "application/octet-stream"
	}

	// 确保有扩展名
	ext := filepath.Ext(filename)
	if ext == "" {
		return "application/octet-stream"
	}

	// 去掉扩展名前面的点，并转为小写
	ext = strings.ToLower(ext[1:])

	mimeTypes := map[string]string{
		"jpg":   "image/jpeg",
		"jpeg":  "image/jpeg",
		"png":   "image/png",
		"gif":   "image/gif",
		"webp":  "image/webp",
		"svg":   "image/svg+xml",
		"ico":   "image/x-icon",
		"pdf":   "application/pdf",
		"doc":   "application/msword",
		"docx":  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"xls":   "application/vnd.ms-excel",
		"xlsx":  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"ppt":   "application/vnd.ms-powerpoint",
		"pptx":  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		"txt":   "text/plain",
		"html":  "text/html",
		"htm":   "text/html",
		"css":   "text/css",
		"js":    "application/javascript",
		"json":  "application/json",
		"xml":   "application/xml",
		"zip":   "application/zip",
		"rar":   "application/x-rar-compressed",
		"7z":    "application/x-7z-compressed",
		"tar":   "application/x-tar",
		"gz":    "application/gzip",
		"mp3":   "audio/mpeg",
		"wav":   "audio/wav",
		"ogg":   "audio/ogg",
		"mp4":   "video/mp4",
		"avi":   "video/x-msvideo",
		"mov":   "video/quicktime",
		"wmv":   "video/x-ms-wmv",
		"webm":  "video/webm",
		"csv":   "text/csv",
		"ttf":   "font/ttf",
		"woff":  "font/woff",
		"woff2": "font/woff2",
	}

	if mime, ok := mimeTypes[ext]; ok {
		return mime
	}

	return "application/octet-stream" // 默认二进制类型
}
