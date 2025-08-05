package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type UserAddressRepository interface {
	GetUserAddress(ctx context.Context, userid int64, userCode string) ([]*model.UserAddress, error)
	Create(ctx context.Context, userAddress *model.UserAddress) error
	Update(ctx context.Context, userAddress *model.UserAddress) error
	Delete(ctx context.Context, id int64) error
	FindByUserID(ctx context.Context, userID int64) ([]*model.UserAddress, error)
	GetDefaultAddress(ctx context.Context, userID int64) (*model.UserAddress, error)
	SetDefault(ctx context.Context, userID, addressID int64) error
}

func NewUserAddressRepository(_db *gorm.DB) UserAddressRepository {
	return &userAddressRepository{
		db: _db,
	}
}

type userAddressRepository struct {
	db *gorm.DB
}

func (r *userAddressRepository) GetUserAddress(ctx context.Context, userId int64, userCode string) ([]*model.UserAddress, error) {
	var userAddress []*model.UserAddress
	sql := r.db.WithContext(ctx).Where("is_deleted = ?", 0)
	if userCode != "" {
		sql = sql.Where("user_code = ?", userCode)
	}
	if userId != -1 {
		sql = sql.Where("user_id = ?", userId)
	}
	if err := sql.Find(&userAddress).Error; err != nil {
		return nil, err
	}
	return userAddress, nil
}

func (r *userAddressRepository) Create(ctx context.Context, userAddress *model.UserAddress) error {
	if userAddress.IsDefault == 1 {
		_ = r.db.WithContext(ctx).Model(&model.UserAddress{}).Where("user_id = ? AND is_deleted = ?", userAddress.UserID, 0).Update("is_default", 0).Error
	}

	return r.db.WithContext(ctx).Create(userAddress).Error
}

func (r *userAddressRepository) Update(ctx context.Context, userAddress *model.UserAddress) error {
	if userAddress.IsDefault == 1 {
		_ = r.db.WithContext(ctx).Model(&model.UserAddress{}).Where("user_id = ? AND is_deleted = ?", userAddress.UserID, 0).Update("is_default", 0).Error
	}

	// 使用 map 确保零值也会被更新
	updateMap := map[string]interface{}{
		"province_code": userAddress.ProvinceCode,
		"province_name": userAddress.ProvinceName,
		"city_code":     userAddress.CityCode,
		"city_name":     userAddress.CityName,
		"district_code": userAddress.DistrictCode,
		"district_name": userAddress.DistrictName,
		"street_code":   userAddress.StreetCode,
		"street_name":   userAddress.StreetName,
		"house_address": userAddress.HouseAddress,
		"full_address":  userAddress.FullAddress,
		"is_default":    userAddress.IsDefault,
		"reciver_name":  userAddress.ReciverName,
		"reciver_phone": userAddress.ReciverPhone,
	}

	return r.db.WithContext(ctx).Model(&model.UserAddress{}).Where("id = ? AND is_deleted = ?", userAddress.Model.ID, 0).Updates(updateMap).Error
}

func (r *userAddressRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Model(&model.UserAddress{}).Where("id = ?", id).Delete(&model.UserAddress{}).Error
}

func (r *userAddressRepository) FindByUserID(ctx context.Context, userID int64) ([]*model.UserAddress, error) {
	var addresses []*model.UserAddress
	if err := r.db.WithContext(ctx).Where("user_id = ? AND is_deleted = ?", userID, 0).Find(&addresses).Error; err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *userAddressRepository) GetDefaultAddress(ctx context.Context, userID int64) (*model.UserAddress, error) {
	var address model.UserAddress
	if err := r.db.WithContext(ctx).Where("user_id = ? AND is_default = ? AND is_deleted = ?", userID, 1, 0).First(&address).Error; err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *userAddressRepository) SetDefault(ctx context.Context, userID, addressID int64) error {
	// 开启事务
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 先将该用户的所有地址设为非默认
		if err := tx.Model(&model.UserAddress{}).Where("user_id = ? AND is_deleted = ?", userID, 0).Update("is_default", 0).Error; err != nil {
			return err
		}
		// 将指定地址设为默认
		return tx.Model(&model.UserAddress{}).Where("id = ? AND user_id = ? AND is_deleted = ?", addressID, userID, 0).Update("is_default", 1).Error
	})
}
