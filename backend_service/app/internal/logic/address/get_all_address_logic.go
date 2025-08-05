package address

import (
	"context"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sort"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetAllAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetAllAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetAllAddressLogic {
	return &GetAllAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetAllAddressLogic) GetAllAddress(req *types.AddressListRequest) (resp *types.AddressListResponse, err error) {

	addressRepository := repository.NewAddressRepository(l.svcCtx.GormDB)

	// 初始化响应对象
	response := &types.AddressListResponse{
		Addresses: make([]*types.AddressNode, 0),
	}

	// 获取所有地址
	addresses, err := addressRepository.FindAll(l.ctx, int64(req.Level), req.ParentCode)
	if err != nil {
		return nil, err
	}

	// 构建地址映射，用于快速查找
	addressMap := make(map[string]*types.AddressNode)

	// 第一步：转换所有地址为并建立映射
	for _, addr := range addresses {
		addressMap[addr.Code] = &types.AddressNode{
			Address:  ModelToTypesAddress(addr),
			Children: make([]*types.AddressNode, 0),
		}
	}

	// 第二步：构建树形结构
	for _, addr := range addresses {
		if addr.Level == 1 { // 省级节点作为根节点
			response.Addresses = append(response.Addresses, addressMap[addr.Code])
		} else {
			// 找到父节点，将当前节点添加到父节点的子节点中
			if parent, exists := addressMap[addr.ParentCode]; exists {
				parent.Children = append(parent.Children, addressMap[addr.Code])
			}
		}
	}

	// 第三步：递归排序
	sortAddressTree(response.Addresses)

	return response, nil

	return
}

// 结构体转换 model -> types
func ModelToTypesAddress(a *model.Address) *types.Address {
	if a == nil {
		return nil
	}
	return &types.Address{
		ID:           a.ID,
		Code:         a.Code,
		Name:         a.Name,
		ParentCode:   a.ParentCode,
		Level:        a.Level,
		ProvinceCode: a.ProvinceCode,
		ProvinceName: a.ProvinceName,
		CityCode:     a.CityCode,
		CityName:     a.CityName,
		DistrictCode: a.DistrictCode,
		DistrictName: a.DistrictName,
		StreetCode:   a.StreetCode,
		StreetName:   a.StreetName,
		FullAddress:  a.FullAddress,
		Postcode:     a.Postcode,
		Sort:         a.Sort,
		BaseModel: types.BaseModel{
			CreatedAt: int64(a.CreatedAt.Unix()),
			UpdatedAt: int64(a.UpdatedAt.Unix()),
			IsDeleted: int(a.IsDeleted),
			Creator:   a.Creator,
			Updator:   a.Updator,
		},
	}
}

// sortAddressTree 递归对地址树进行排序
func sortAddressTree(addresses []*types.AddressNode) {
	// 按Sort字段排序当前层级
	sort.Slice(addresses, func(i, j int) bool {
		return addresses[i].Address.Sort < addresses[j].Address.Sort
	})

	// 递归排序子节点
	for _, addr := range addresses {
		if len(addr.Children) > 0 {
			sortAddressTree(addr.Children)
		}
	}
}
