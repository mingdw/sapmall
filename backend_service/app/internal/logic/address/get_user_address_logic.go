package address

import (
	"context"
	"database/sql"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取用户地址
func NewGetUserAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserAddressLogic {
	return &GetUserAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserAddressLogic) GetUserAddress(req *types.UserAddressListRequest) (resp *types.UserAddressListResponse, err error) {

	userAddressRepository := repository.NewUserAddressRepository(l.svcCtx.GormDB)
	//userAddresslist := make([]*model.UserAddress, 0)
	userAddresslist, err := userAddressRepository.GetUserAddress(l.ctx, req.UserID, req.UserCode)
	if err != nil {
		return nil, err
	}
	//userAddresslistJson, jsonErr := json.Marshal(userAddresslist)
	//if jsonErr != nil {
	//	return nil, jsonErr
	//}
	resp = &types.UserAddressListResponse{
		UserAddresses: make([]*types.UserAddress, 0),
	}

	for _, _userAddress := range userAddresslist {
		_userAddress := &types.UserAddress{
			ID:           _userAddress.ID,
			UserID:       _userAddress.UserID,
			UserCode:     _userAddress.UserCode,
			ReciverName:  _userAddress.ReciverName,
			ReciverPhone: _userAddress.ReciverPhone,
			ProvinceCode: _userAddress.ProvinceCode,
			ProvinceName: _userAddress.ProvinceName,
			CityCode:     _userAddress.CityCode,
			CityName:     _userAddress.CityName,
			DistrictCode: _userAddress.DistrictCode,
			DistrictName: _userAddress.DistrictName,
			StreetCode:   _userAddress.StreetCode,
			StreetName:   _userAddress.StreetName,
			HouseAddress: _userAddress.HouseAddress,
			FullAddress:  _userAddress.FullAddress,
			IsDefault:    _userAddress.IsDefault,
			Longitude:    _userAddress.Longitude,
			Latitude:     _userAddress.Latitude,
			CreatedAt:    _userAddress.CreatedAt,
			UpdatedAt:    _userAddress.UpdatedAt,
			DeletedAt: sql.NullTime{
				Time:  _userAddress.DeletedAt.Time,
				Valid: _userAddress.DeletedAt.Valid,
			},
		}
		resp.UserAddresses = append(resp.UserAddresses, _userAddress)
	}

	return resp, nil
}
