package bussiness

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"

	"gorm.io/gorm"
)

// 业务类型常量定义
const (
	BusinessTypeProduct  = "product"  // 商品业务
	BusinessTypeAvatar   = "avatar"   // 头像业务
	BusinessTypeDocument = "document" // 文档业务
	BusinessTypeCategory = "category" // 分类业务
	BusinessTypeUser     = "user"     // 用户业务
)

// BusinessHandler 业务处理器接口
type BusinessHandler interface {
	// GetBusiness 根据业务类型和ID获取业务数据
	GetBusiness(ctx context.Context, businessType string, businessId string) (interface{}, error)
	// ValidateBusiness 验证业务是否存在
	ValidateBusiness(ctx context.Context, businessType string, businessId string) (bool, error)
	// DeleteBusinessFiles 删除业务关联的文件
	DeleteBusinessFiles(ctx context.Context, businessType string, businessId string, urls []string) error
	// GetBusinessOwner 获取业务所有者信息（用于权限验证）
	GetBusinessOwner(ctx context.Context, businessType string, businessId string) (int64, string, error) // 返回 userID, userCode
	// AssociateFile 关联文件到业务（上传文件时调用）
	AssociateFile(ctx context.Context, businessType string, businessId string, file *model.File) error
}

// BusinessHandlerImpl 业务处理器实现
type BusinessHandlerImpl struct {
	db *gorm.DB
}

// NewBusinessHandler 创建业务处理器
func NewBusinessHandler(db *gorm.DB) BusinessHandler {
	return &BusinessHandlerImpl{
		db: db,
	}
}

// parseBusinessId 将业务ID字符串解析为int64
func parseBusinessId(businessId string) (int64, error) {
	if businessId == "" {
		return 0, nil
	}
	id, err := strconv.ParseInt(businessId, 10, 64)
	if err != nil {
		return 0, nil
	}
	return id, nil
}

// GetBusiness 根据业务类型和ID获取业务数据
func (h *BusinessHandlerImpl) GetBusiness(ctx context.Context, businessType string, businessId string) (interface{}, error) {
	id, err := parseBusinessId(businessId)
	if err != nil {
		return nil, err
	}

	switch businessType {
	case BusinessTypeProduct:
		productRepo := repository.NewProductSpuRepository(repository.NewRepository(h.db))
		product, err := productRepo.GetProductSpu(ctx, id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("商品不存在: id=%s", businessId)
			}
			return nil, fmt.Errorf("获取商品失败: %w", err)
		}
		return product, nil

	case BusinessTypeUser:
		userRepo := repository.NewUserRepository(h.db)
		user, err := userRepo.GetByID(ctx, id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("用户不存在: id=%s", businessId)
			}
			return nil, fmt.Errorf("获取用户失败: %w", err)
		}
		return user, nil

	case BusinessTypeCategory:
		categoryRepo := repository.NewCategoryRepository(h.db)
		category, err := categoryRepo.GetCategory(ctx, id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("分类不存在: id=%s", businessId)
			}
			return nil, fmt.Errorf("获取分类失败: %w", err)
		}
		return category, nil

	case BusinessTypeAvatar, BusinessTypeDocument:
		// 头像和文档业务通常直接关联到用户，这里返回用户信息
		userRepo := repository.NewUserRepository(h.db)
		user, err := userRepo.GetByID(ctx, id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("用户不存在: id=%s", businessId)
			}
			return nil, fmt.Errorf("获取用户失败: %w", err)
		}
		return user, nil

	default:
		return nil, fmt.Errorf("不支持的业务类型: %s", businessType)
	}
}

// ValidateBusiness 验证业务是否存在
func (h *BusinessHandlerImpl) ValidateBusiness(ctx context.Context, businessType string, businessId string) (bool, error) {
	_, err := h.GetBusiness(ctx, businessType, businessId)
	if err != nil {
		// 如果是记录不存在的错误，返回 false, nil
		if errors.Is(err, gorm.ErrRecordNotFound) ||
			(err.Error() != "" && (strings.Contains(err.Error(), "不存在") || strings.Contains(err.Error(), "not found"))) {
			return false, nil
		}
		// 其他错误返回 false, error
		return false, err
	}
	return true, nil
}

// DeleteBusinessFiles 删除业务关联的文件
// 如果spu的images中包含urls中的url，则将其替换成空（删除）
func (h *BusinessHandlerImpl) DeleteBusinessFiles(ctx context.Context, businessType string, businessId string, urls []string) error {
	id, err := parseBusinessId(businessId)
	if err != nil {
		return err
	}

	switch businessType {
	case BusinessTypeProduct:
		if id > 0 && len(urls) > 0 {
			productSpuRepo := repository.NewProductSpuRepository(repository.NewRepository(h.db))
			// 根据businessId查询商品
			productSpu, err := productSpuRepo.GetProductSpu(ctx, id)
			if err != nil {
				return fmt.Errorf("查询商品失败: %w", err)
			}

			// 如果spu的images为空，不需要处理
			if productSpu.Images == "" {
				return nil
			}

			// 解析现有的图片URL列表
			imageParts := strings.Split(productSpu.Images, ",")
			remainingImages := []string{}

			// 遍历现有图片，如果不在urls中则保留
			for _, img := range imageParts {
				img = strings.TrimSpace(img)
				if img == "" {
					continue
				}
				// 检查该图片URL是否在要删除的urls列表中
				shouldDelete := false
				for _, deleteUrl := range urls {
					if img == strings.TrimSpace(deleteUrl) {
						shouldDelete = true
						break
					}
				}
				// 如果不在删除列表中，保留该图片
				if !shouldDelete {
					remainingImages = append(remainingImages, img)
				}
			}

			// 更新商品表的 Images 字段
			if len(remainingImages) > 0 {
				productSpu.Images = strings.Join(remainingImages, ",")
			} else {
				// 如果所有图片都被删除，设置为空字符串
				productSpu.Images = ""
			}

			err = productSpuRepo.UpdateProductSpu(ctx, productSpu)
			if err != nil {
				return fmt.Errorf("更新商品失败: %w", err)
			}
		}

	case BusinessTypeAvatar, BusinessTypeDocument:
		return nil
	case BusinessTypeCategory:
		return nil
	}
	return nil
}

// GetBusinessOwner 获取业务所有者信息（用于权限验证）
// 返回 userID 和 userCode
func (h *BusinessHandlerImpl) GetBusinessOwner(ctx context.Context, businessType string, businessId string) (int64, string, error) {
	id, err := parseBusinessId(businessId)
	if err != nil {
		return 0, "", err
	}

	switch businessType {
	case BusinessTypeProduct:
		productRepo := repository.NewProductSpuRepository(repository.NewRepository(h.db))
		product, err := productRepo.GetProductSpu(ctx, id)
		if err != nil {
			return 0, "", fmt.Errorf("获取商品失败: %w", err)
		}
		return product.UserID, product.UserCode, nil

	case BusinessTypeUser:
		// 用户业务的所有者就是用户自己
		userRepo := repository.NewUserRepository(h.db)
		user, err := userRepo.GetByID(ctx, id)
		if err != nil {
			return 0, "", fmt.Errorf("获取用户失败: %w", err)
		}
		return user.ID, user.UserCode, nil

	case BusinessTypeAvatar, BusinessTypeDocument:
		// 头像和文档业务的所有者通常是关联的用户
		userRepo := repository.NewUserRepository(h.db)
		user, err := userRepo.GetByID(ctx, id)
		if err != nil {
			return 0, "", fmt.Errorf("获取用户失败: %w", err)
		}
		return user.ID, user.UserCode, nil

	case BusinessTypeCategory:
		// 分类业务通常没有所有者，返回错误
		return 0, "", fmt.Errorf("分类业务没有所有者")

	default:
		return 0, "", fmt.Errorf("不支持的业务类型: %s", businessType)
	}
}

// ValidateBusinessOwner 验证业务所有者是否为指定用户
func ValidateBusinessOwner(ctx context.Context, handler BusinessHandler, businessType string, businessId string, userCode string) (bool, error) {
	_, ownerCode, err := handler.GetBusinessOwner(ctx, businessType, businessId)
	if err != nil {
		return false, err
	}

	// 如果业务没有所有者（如分类），返回 false
	if ownerCode == "" {
		return false, nil
	}

	return ownerCode == userCode, nil
}

// GetBusinessFiles 获取业务关联的文件列表
func GetBusinessFiles(ctx context.Context, db *gorm.DB, businessType string, businessId string) ([]*model.File, error) {
	id, err := parseBusinessId(businessId)
	if err != nil {
		return nil, err
	}

	var files []*model.File
	err = db.WithContext(ctx).
		Where("business_type = ? AND business_id = ? AND is_deleted = ?", businessType, id, false).
		Find(&files).Error
	if err != nil {
		return nil, fmt.Errorf("查询业务关联文件失败: %w", err)
	}
	return files, nil
}

// BatchGetBusinessFiles 批量获取多个业务关联的文件列表
func BatchGetBusinessFiles(ctx context.Context, db *gorm.DB, businessType string, businessIds []int64) ([]*model.File, error) {
	if len(businessIds) == 0 {
		return []*model.File{}, nil
	}

	var files []*model.File
	err := db.WithContext(ctx).
		Where("business_type = ? AND business_id IN ? AND is_deleted = ?", businessType, businessIds, false).
		Find(&files).Error
	if err != nil {
		return nil, fmt.Errorf("批量查询业务关联文件失败: %w", err)
	}
	return files, nil
}

// AssociateFile 关联文件到业务（上传文件时调用）
// 当上传文件时，如果提供了 businessType 和 businessId，调用此方法建立文件与业务的关联
func (h *BusinessHandlerImpl) AssociateFile(ctx context.Context, businessType string, businessId string, file *model.File) error {
	if file == nil {
		return fmt.Errorf("文件对象不能为空")
	}

	id, err := parseBusinessId(businessId)
	if err != nil {
		return err
	}

	if id <= 0 {
		// 业务ID无效，不需要关联
		return nil
	}

	switch businessType {
	case BusinessTypeProduct:
		// 商品业务：更新商品表的 Images 字段
		// SPU的images默认第一张图是主图，更新时将第一张图的位置替换成file的url
		productSpuRepo := repository.NewProductSpuRepository(repository.NewRepository(h.db))
		productSpu, err := productSpuRepo.GetProductSpu(ctx, id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// 商品不存在，不进行关联（可能是新增商品，还未保存）
				return nil
			}
			return fmt.Errorf("查询商品失败: %w", err)
		}

		// 如果spu的images为空，则直接存储file的url
		if productSpu.Images == "" {
			productSpu.Images = file.Url
		} else {
			// 如果不为空，则将images的第一张图的位置（逗号分隔的第一个位置）替换成file的url
			imageParts := strings.Split(productSpu.Images, ",")
			if len(imageParts) > 0 {
				// 替换第一张图
				imageParts[0] = file.Url
				// 重新组合（保持其他图片不变）
				productSpu.Images = strings.Join(imageParts, ",")
			} else {
				// 如果分割后为空数组，直接设置为file的url
				productSpu.Images = file.Url
			}
		}

		// 更新商品表的 Images 字段
		err = productSpuRepo.UpdateProductSpu(ctx, productSpu)
		if err != nil {
			return fmt.Errorf("更新商品图片关联失败: %w", err)
		}

	case BusinessTypeAvatar:
		// 头像业务：可以更新用户表的头像字段
		// 这里可以根据实际需求实现
		return nil

	case BusinessTypeDocument:
		// 文档业务：可以根据实际需求实现
		return nil

	case BusinessTypeCategory:
		// 分类业务：可以根据实际需求实现
		return nil

	default:
		// 其他业务类型，不处理
		return nil
	}

	return nil
}
