// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strings"

	"sapphire-mall/app/internal/cos"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteProductSpusLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除商品（单条删除也使用此接口，传入单个ID的数组）
func NewDeleteProductSpusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteProductSpusLogic {
	return &DeleteProductSpusLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteProductSpusLogic) DeleteProductSpus(req *types.DeleteProductSpusReq) (resp *types.BaseResp, err error) {
	// 1. 验证请求参数
	if len(req.Ids) == 0 {
		return nil, errors.New("商品ID列表不能为空")
	}
	// 2. 获取当前用户信息
	currentUser, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return nil, errors.New("获取当前用户信息失败")
	}

	// 3. 查询商品的SPU集合，验证权限（只能删除自己创建的商品）
	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)
	products, err := productSpuRepository.GetProductSpusByUserCode(l.ctx, req.Ids, currentUser.UserCode)
	if err != nil {
		return nil, errors.New("查询商品失败")
	}

	if len(products) == 0 {
		return nil, errors.New("未找到可删除的商品或无权删除")
	}

	// 5. 按顺序删除关联数据
	// 5.1 删除SKU
	if err := l.deleteProductSkus(req.Ids, products); err != nil {
		l.Errorf("删除商品SKU失败: %v", err)
		return nil, errors.New("删除商品SKU失败")
	}

	// 5.2 删除SPU的属性参数
	if err := l.deleteProductSpuAttrParams(req.Ids, products); err != nil {
		l.Errorf("删除商品属性参数失败: %v", err)
		return nil, errors.New("删除商品属性参数失败")
	}

	// 5.3 删除SPU的详情
	if err := l.deleteProductSpuDetails(req.Ids); err != nil {
		l.Errorf("删除商品详情失败: %v", err)
		return nil, errors.New("删除商品详情失败")
	}

	// 5.4 删除files表中的文件
	if err := l.deleteProductFiles(products); err != nil {
		l.Errorf("删除商品关联文件失败: %v", err)
		// 文件删除失败不影响主流程，只记录日志
	}

	// 6. 删除SPU信息（最后删除主表）
	if err := l.deleteProductSpus(req.Ids, currentUser.UserCode); err != nil {
		l.Errorf("删除商品SPU失败: %v", err)
		return nil, errors.New("删除商品失败")
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "success",
	}, nil
}

// deleteProductSkus 根据SPU ID集合批量删除所有相关的SKU
func (l *DeleteProductSpusLogic) deleteProductSkus(spuIds []int64, products []*model.ProductSpu) error {
	productSkuRepository := repository.NewProductSkuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	// 先获取所有的sku详情（批量查询）
	skus, err := productSkuRepository.ListProductSkusBySpuIds(l.ctx, spuIds)
	if err != nil {
		return fmt.Errorf("查询SKU失败: %w", err)
	}

	// 获取所有sku中的所有image的url
	imageUrls := make([]string, 0)
	for _, sku := range skus {
		if sku.Images != "" {
			urls := l.parseImageUrls(sku.Images)
			imageUrls = append(imageUrls, urls...)
		}
	}
	// 批量删除SKU
	if err := productSkuRepository.BatchDeleteProductSkusBySpuIds(l.ctx, spuIds); err != nil {
		return fmt.Errorf("删除SKU失败: %w", err)
	}
	l.Infof("成功删除 %d 个SPU的所有SKU", len(spuIds))
	// 删除SKU关联的文件
	if len(imageUrls) > 0 {
		if err := l.deleteFilesByUrls(imageUrls); err != nil {
			l.Errorf("删除SKU关联文件失败: %v", err)
			// 文件删除失败不影响主流程，只记录日志
		}
	}

	return nil
}

// deleteProductSpuAttrParams 删除SPU的属性参数（sys_product_spu_attr_params表）
func (l *DeleteProductSpusLogic) deleteProductSpuAttrParams(spuIds []int64, products []*model.ProductSpu) error {
	productSpuAttrParamsRepository := repository.NewProductSpuAttrParamsRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	if err := productSpuAttrParamsRepository.BatchDeleteProductSpuAttrParamsBySpuIds(l.ctx, spuIds); err != nil {
		return fmt.Errorf("删除属性参数失败: %w", err)
	}
	l.Infof("成功删除 %d 个SPU的所有属性参数", len(spuIds))

	return nil
}

// deleteProductSpuDetails 删除SPU的详情（sys_product_spu_detail表）
func (l *DeleteProductSpusLogic) deleteProductSpuDetails(spuIds []int64) error {
	productSpuDetailRepository := repository.NewProductSpuDetailRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	if err := productSpuDetailRepository.BatchDeleteProductSpuDetailsBySpuIds(l.ctx, spuIds); err != nil {
		return fmt.Errorf("删除详情失败: %w", err)
	}
	l.Infof("成功删除 %d 个SPU的所有详情", len(spuIds))

	return nil
}

// deleteProductSpus 删除SPU信息（sys_product_spu表）
func (l *DeleteProductSpusLogic) deleteProductSpus(spuIds []int64, userCode string) error {
	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	deletedCount, err := productSpuRepository.BatchDeleteProductSpus(l.ctx, spuIds)
	if err != nil {
		return fmt.Errorf("删除商品SPU失败: %w", err)
	}
	l.Infof("成功删除 %d 个商品SPU, 用户: %s, IDs: %v", deletedCount, userCode, spuIds)
	return nil
}

// deleteProductFiles 删除files表中关联的商品文件
func (l *DeleteProductSpusLogic) deleteProductFiles(products []*model.ProductSpu) error {
	// 检查 COS 客户端是否初始化
	if l.svcCtx.CosClient == nil {
		l.Infof("COS客户端未初始化，跳过文件删除")
		return nil
	}

	// 收集所有商品的图片URL
	imageUrls := make([]string, 0)
	for _, product := range products {
		if product.Images != "" {
			urls := l.parseImageUrls(product.Images)
			imageUrls = append(imageUrls, urls...)
		}
	}

	if len(imageUrls) == 0 {
		l.Infof("没有找到需要删除的图片文件")
		return nil
	}

	// 调用通用方法删除文件
	return l.deleteFilesByUrls(imageUrls)
}

// deleteFilesByUrls 通用方法：根据URLs集合删除文件
// 入口：images中的urls集合
// 处理逻辑：根据urls获取hashs和keys的集合，然后file数据库根据hashs批量删除，cos根据keys批量删除
func (l *DeleteProductSpusLogic) deleteFilesByUrls(urls []string) error {
	if len(urls) == 0 {
		return nil
	}

	// 初始化hash和key的集合
	hashes := make([]string, 0)
	keys := make([]string, 0)
	hashSet := make(map[string]bool) // 用于去重
	keySet := make(map[string]bool)  // 用于去重

	// 从URLs中提取hash和key
	for _, urlStr := range urls {
		hash, key := l.extractKeyFromURL(urlStr)
		if hash != "" && !hashSet[hash] {
			hashes = append(hashes, hash)
			hashSet[hash] = true
		}
		if key != "" && !keySet[key] {
			keys = append(keys, key)
			keySet[key] = true
		}
	}

	if len(hashes) == 0 && len(keys) == 0 {
		l.Infof("未能从URLs中提取到有效的hash或key")
		return nil
	}

	// 批量删除数据库记录（根据hashs）
	if len(hashes) > 0 {
		fileRepo := repository.NewFileRepository(l.svcCtx.GormDB)
		if err := fileRepo.DeleteByHashes(l.ctx, hashes); err != nil {
			l.Errorf("批量删除数据库记录失败: %v", err)
			return fmt.Errorf("批量删除数据库记录失败: %w", err)
		}
		l.Infof("成功批量删除 %d 条数据库记录", len(hashes))
	}

	// 批量删除COS文件（根据keys）
	if len(keys) > 0 {
		deleteResult, err := cos.BatchDeleteFilesFromCOS(l.svcCtx.CosClient, keys)
		if err != nil {
			l.Errorf("批量删除COS文件失败: %v", err)
			return fmt.Errorf("批量删除COS文件失败: %w", err)
		}
		l.Infof("成功批量删除 %d 个COS文件，删除结果: %+v", len(keys), deleteResult)
	}

	return nil
}

// extractKeyFromURL 从URL中提取hash值和key（用于查询数据库和删除COS文件）
// 复用 delete_files_logic.go 中的逻辑
func (l *DeleteProductSpusLogic) extractKeyFromURL(urlStr string) (hash, key string) {
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

// parseImageUrls 解析图片URL字符串（支持JSON数组或逗号分隔）
func (l *DeleteProductSpusLogic) parseImageUrls(images string) []string {
	if images == "" {
		return []string{}
	}

	images = strings.TrimSpace(images)
	if images == "" {
		return []string{}
	}

	// 尝试解析JSON数组
	if strings.HasPrefix(images, "[") {
		var urls []string
		if err := json.Unmarshal([]byte(images), &urls); err == nil {
			result := make([]string, 0, len(urls))
			for _, u := range urls {
				if u = strings.TrimSpace(u); u != "" {
					result = append(result, u)
				}
			}
			return result
		}
	}

	// 按逗号分割
	parts := strings.Split(images, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if u := strings.TrimSpace(part); u != "" {
			result = append(result, u)
		}
	}
	return result
}
