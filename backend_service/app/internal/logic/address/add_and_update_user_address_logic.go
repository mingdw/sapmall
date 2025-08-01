package address

import (
	"context"
	"gorm.io/gorm"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"time"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type AddAndUpdateUserAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 创建或者修改用户地址
func NewAddAndUpdateUserAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AddAndUpdateUserAddressLogic {
	return &AddAndUpdateUserAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *AddAndUpdateUserAddressLogic) AddAndUpdateUserAddress(req *types.UserAddressModifyRequest) (err error) {

	userAddressRepository := repository.NewUserAddressRepository(l.svcCtx.GormDB)

	userAddressModel := &model.UserAddress{
		Model:        gorm.Model{ID: uint(req.ID), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		UserID:       req.UserID,
		UserCode:     req.UserCode,
		ReciverName:  req.ReciverName,
		ReciverPhone: req.ReciverPhone,
		ProvinceCode: req.ProvinceCode,
		ProvinceName: req.ProvinceName,
		CityCode:     req.CityCode,
		CityName:     req.CityName,
		DistrictCode: req.DistrictCode,
		DistrictName: req.DistrictName,
		StreetCode:   req.StreetCode,
		StreetName:   req.StreetName,
		FullAddress:  req.FullAddress,
		HouseAddress: req.HouseAddress,
		IsDefault:    req.IsDefault,
		Longitude:    req.Longitude,
		Latitude:     req.Latitude,
	}

	if req.ID > 0 {
		return userAddressRepository.Update(l.ctx, userAddressModel)
	} else {
		return userAddressRepository.Create(l.ctx, userAddressModel)
	}
}
