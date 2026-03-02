// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"strings"

	"sapphire-mall/app/internal/bussiness"
	"sapphire-mall/app/internal/cos"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteFilesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量删除文件
func NewDeleteFilesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteFilesLogic {
	return &DeleteFilesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteFilesLogic) DeleteFiles(req *types.DeleteFilesReq) (resp *types.BaseResp, err error) {
	// 检查 COS 客户端是否初始化
	if l.svcCtx.CosClient == nil {
		return customererrors.FailData(nil), errors.New("COS客户端未初始化")
	}

	fileRepo := repository.NewFileRepository(l.svcCtx.GormDB)

	// 如果没有提供业务信息，则使用原有的删除逻辑（通过 keys 或 urls）
	// 检查是否提供了删除参数
	if len(req.Keys) == 0 && len(req.Urls) == 0 {
		return nil, errors.New("请提供要删除的文件keys（hash）或urls列表，或提供businessType和businessId")
	}

	//初始化hash值的数组
	hashs := make([]string, 0)
	//初始化key值的数组
	keys := make([]string, 0)
	//当前url为cos的预览url，需要从文件名之中解析出文件的hash值和key
	for _, urlStr := range req.Urls {
		hash, key := l.extractKeyFromURL(urlStr)
		l.Infof("从URL中提取的hash值: %s, key: %s", hash, key)
		if hash != "" {
			hashs = append(hashs, hash)
		}
		if key != "" {
			keys = append(keys, key)
		}
	}
	// 使用相同的数据库 context
	err = fileRepo.DeleteByHashes(l.ctx, hashs)
	if err != nil {
		l.Errorf("批量删除数据库记录失败: %v", err)
	}

	// 批量删除cos中的文件
	l.Infof("开始批量删除COS文件，keys数量: %d", len(keys))
	deleteResult, err := cos.BatchDeleteFilesFromCOS(l.svcCtx.CosClient, keys)
	if err != nil {
		l.Errorf("批量删除COS文件失败: %v", err)
	}
	l.Infof("cos 删除文件结果: %+v", deleteResult)
	// 如果提供了 BusinessType 和 BusinessId，直接调用业务处理器的删除方法
	if req.BusinessType != "" && req.BusinessId != "" {
		businessHandler := bussiness.NewBusinessHandler(l.svcCtx.GormDB)
		err = businessHandler.DeleteBusinessFiles(l.ctx, req.BusinessType, req.BusinessId, req.Urls)
		if err != nil {
			l.Errorf("删除业务关联文件失败: %v", err)
			return nil, fmt.Errorf("删除业务关联文件失败: %w", err)
		}
	}
	return customererrors.SuccessMsg("删除成功"), nil
}

/*
  - 从URL中提取hash值和key（用于查询数据库和删除COS文件）
  - @param urlStr 完整的URL字符串（可能是预签名URL或普通URL）
  - @return hash 提取的hash值
  - @return key 提取的文件key（完整路径）
  - 示例:
  - urlStr: https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products/image/adb997af4de347b4a885962ccd407e7f41d9f5ca8d89a438f4348a724eb1c2f1_20260205195820_%E6%88%B7%E5%8F%A3%E9%A1%B5.jpg?q-sign-algorithm=sha1&q-ak=AKIDEXAMPLE&q-sign-time=1770292701%3B1801828701&q-key-time=1770292701%3B1801828701&q-header-list=host&q-url-param-list=&q-signature=1acda901ac800c3e902583c0e9dc5637986ab208
  - return: hash = adb997af4de347b4a885962ccd407e7f41d9f5ca8d89a438f4348a724eb1c2f1
    key = products/image/adb997af4de347b4a885962ccd407e7f41d9f5ca8d89a438f4348a724eb1c2f1_20260205195820_%E6%88%B7%E5%8F%A3%E9%A1%B5.jpg

*
*/
func (l *DeleteFilesLogic) extractKeyFromURL(urlStr string) (hash, key string) {
	// 解析URL（去除查询参数）
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		l.Errorf("解析URL失败: %v, url=%s", err, urlStr)
		return "", ""
	}

	// 提取path部分（去掉开头的/）
	path := strings.TrimPrefix(parsedURL.Path, "/")
	if path == "" {
		l.Errorf("URL路径为空: %s", urlStr)
		return "", ""
	}

	// key就是完整的path
	key = path

	// 分割路径: folder/category/hash_timestamp_filename
	pathParts := strings.Split(path, "/")
	if len(pathParts) < 3 {
		l.Errorf("URL路径格式不正确，至少需要3段: %s, path=%s", urlStr, path)
		return "", key
	}

	// 第三段是 hash_timestamp_filename，需要提取hash部分
	// hash是64位的SHA256值（32字节，64个十六进制字符）
	hashPart := pathParts[2]

	// 从 hash_timestamp_filename 中提取hash（hash是64个字符，后面跟着下划线和时间戳）
	// 查找第一个下划线的位置，hash在下划线之前
	underscoreIndex := strings.Index(hashPart, "_")
	if underscoreIndex == -1 {
		// 如果没有下划线，可能是旧格式或其他格式，尝试直接使用
		l.Infof("URL路径中hash部分格式异常，未找到下划线: %s", hashPart)
		// 如果hashPart长度正好是64，可能是纯hash
		if len(hashPart) == 64 {
			return hashPart, key
		}
		return "", key
	}

	// 提取hash部分（下划线之前的部分）
	hash = hashPart[:underscoreIndex]

	// 验证hash长度（SHA256 hash应该是64个字符）
	if len(hash) != 64 {
		l.Errorf("提取的hash长度不正确: %d, 期望64, hash=%s, url=%s", len(hash), hash, urlStr)
		return "", key
	}

	return hash, key
}
