package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
	"sort"
)

type AddressRepository interface {
	// Create 创建地址
	Create(ctx context.Context, address *model.Address) error
	// Update 更新地址
	Update(ctx context.Context, address *model.Address) error
	// Delete 删除地址
	Delete(ctx context.Context, id int64) error
	// FindByID 根据ID查询地址
	FindByID(ctx context.Context, id int64) (*model.Address, error)
	// FindByCode 根据编码查询地址
	FindByCode(ctx context.Context, code string) (*model.Address, error)
	// FindByParentCode 根据父级编码查询地址列表
	FindByParentCode(ctx context.Context, parentCode string) ([]*model.Address, error)
	// FindByLevel 根据级别查询地址列表
	FindByLevel(ctx context.Context, level int) ([]*model.Address, error)
	// FindAll 查询所有地址
	FindAll(ctx context.Context, level int64, parentCode string) ([]*model.Address, error)
	// GetAddress 根据ID查询地址
	GetAddress(ctx context.Context, id int64) (*model.Address, error)
	// GetAddresses 根据编码查询地址列表
	GetAddresses(ctx context.Context, addressCodes []string) ([]*model.Address, error)
	// GetAddressesByParams 根据参数查询地址列表
	GetAddressesByParams(ctx context.Context, params *model.Address) ([]*model.Address, error)
}

type addressRepository struct {
	*Repository
}

func NewAddressRepository(r *Repository) AddressRepository {
	return &addressRepository{
		Repository: r,
	}
}

func (r *addressRepository) Create(ctx context.Context, address *model.Address) error {
	return r.db.WithContext(ctx).Create(address).Error
}

func (r *addressRepository) Update(ctx context.Context, address *model.Address) error {
	return r.db.WithContext(ctx).Model(address).Updates(map[string]interface{}{
		"name":          address.Name,
		"parent_code":   address.ParentCode,
		"level":         address.Level,
		"province_code": address.ProvinceCode,
		"province_name": address.ProvinceName,
		"city_code":     address.CityCode,
		"city_name":     address.CityName,
		"district_code": address.DistrictCode,
		"district_name": address.DistrictName,
		"street_code":   address.StreetCode,
		"street_name":   address.StreetName,
		"full_address":  address.FullAddress,
		"postcode":      address.Postcode,
		"sort":          address.Sort,
		"updated_at":    address.UpdatedAt,
		"updator":       address.Updator,
	}).Error
}

func (r *addressRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Model(&model.Address{}).Where("id = ?", id).Update("is_deleted", 1).Error
}

func (r *addressRepository) FindByID(ctx context.Context, id int64) (*model.Address, error) {
	var address model.Address
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = 0", id).First(&address).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *addressRepository) FindByCode(ctx context.Context, code string) (*model.Address, error) {
	var address model.Address
	err := r.db.WithContext(ctx).Where("code = ? AND is_deleted = 0", code).First(&address).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *addressRepository) FindByParentCode(ctx context.Context, parentCode string) ([]*model.Address, error) {
	var addresses []*model.Address
	err := r.db.WithContext(ctx).
		Where("parent_code = ? AND is_deleted = 0", parentCode).
		Order("sort ASC").
		Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *addressRepository) FindByLevel(ctx context.Context, level int) ([]*model.Address, error) {
	var addresses []*model.Address
	err := r.db.WithContext(ctx).
		Where("level = ? AND is_deleted = 0", level).
		Order("sort ASC").
		Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *addressRepository) FindAll(ctx context.Context, level int64, parentCode string) ([]*model.Address, error) {
	var addresses []*model.Address
	sql := r.db.WithContext(ctx).Where("is_deleted = ?", 0)
	if level != -1 {
		sql = sql.Where("level = ?", level)
	}
	if parentCode != "" {
		sql = sql.Where("parent_code = ?", parentCode)
	}
	if err := sql.Order("sort ASC").Find(&addresses).Error; err != nil {
		return nil, err
	}
	return addresses, nil
}

// 以下是一些扩展方法

// FindByKeyword 根据关键字模糊查询地址
func (r *addressRepository) FindByKeyword(ctx context.Context, keyword string) ([]*model.Address, error) {
	var addresses []*model.Address
	err := r.db.WithContext(ctx).
		Where("(name LIKE ? OR full_address LIKE ?) AND is_deleted = 0", "%"+keyword+"%", "%"+keyword+"%").
		Order("sort ASC").
		Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

// FindByLevels 根据多个级别查询地址
func (r *addressRepository) FindByLevels(ctx context.Context, levels []int) ([]*model.Address, error) {
	var addresses []*model.Address
	err := r.db.WithContext(ctx).
		Where("level IN ? AND is_deleted = 0", levels).
		Order("sort ASC").
		Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

// BatchCreate 批量创建地址
func (r *addressRepository) BatchCreate(ctx context.Context, addresses []*model.Address) error {
	return r.db.WithContext(ctx).Create(addresses).Error
}

// BatchDelete 批量删除地址
func (r *addressRepository) BatchDelete(ctx context.Context, ids []int64) error {
	return r.db.WithContext(ctx).
		Model(&model.Address{}).
		Where("id IN ?", ids).
		Update("is_deleted", 1).Error
}

// CountByParentCode 统计子地址数量
func (r *addressRepository) CountByParentCode(ctx context.Context, parentCode string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.Address{}).
		Where("parent_code = ? AND is_deleted = 0", parentCode).
		Count(&count).Error
	return count, err
}

// AddressTree 地址树形结构
type AddressTree struct {
	*model.Address
	Children []*AddressTree `json:"children"`
}

// FindAddressTree 查询地址树
func (r *addressRepository) FindAddressTree(ctx context.Context) ([]*AddressTree, error) {
	// 1. 查询所有地址
	addresses, err := r.FindAll(ctx, -1, "")
	if err != nil {
		return nil, err
	}

	// 2. 构建地址映射
	addressMap := make(map[string]*AddressTree)
	var roots []*AddressTree

	// 3. 将地址转换为树节点并建立映射
	for _, addr := range addresses {
		node := &AddressTree{
			Address:  addr,
			Children: make([]*AddressTree, 0),
		}
		addressMap[addr.Code] = node

		// 如果是根节点（省级），直接加入roots
		if addr.Level == 1 {
			roots = append(roots, node)
		}
	}

	// 4. 建立父子关系
	for _, addr := range addresses {
		if addr.Level > 1 {
			if parent, exists := addressMap[addr.ParentCode]; exists {
				parent.Children = append(parent.Children, addressMap[addr.Code])
			}
		}
	}

	// 5. 对每一层级的子节点按sort字段排序
	sortAddressTree(roots)

	return roots, nil
}

// sortAddressTree 递归排序地址树
func sortAddressTree(nodes []*AddressTree) {
	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Sort < nodes[j].Sort
	})

	// 递归排序子节点
	for _, node := range nodes {
		if len(node.Children) > 0 {
			sortAddressTree(node.Children)
		}
	}
}

// FindAddressByLevelAndParent 根据层级和父级编码查询地址
func (r *addressRepository) FindAddressByLevelAndParent(ctx context.Context, level int, parentCode string) ([]*model.Address, error) {
	var addresses []*model.Address
	query := r.db.WithContext(ctx).Where("is_deleted = 0")

	if level > 0 {
		query = query.Where("level = ?", level)
	}
	if parentCode != "" {
		query = query.Where("parent_code = ?", parentCode)
	}

	err := query.Order("sort ASC").Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

// FindAddressPath 查询指定地址的完整路径
func (r *addressRepository) FindAddressPath(ctx context.Context, code string) ([]*model.Address, error) {
	var path []*model.Address

	// 查询当前地址
	current, err := r.FindByCode(ctx, code)
	if err != nil {
		return nil, err
	}

	path = append(path, current)

	// 循环查询父级地址
	parentCode := current.ParentCode
	for parentCode != "" {
		parent, err := r.FindByCode(ctx, parentCode)
		if err != nil {
			break
		}
		path = append([]*model.Address{parent}, path...)
		parentCode = parent.ParentCode
	}

	return path, nil
}

// FindAddressByRange 根据地理位置范围查询地址
func (r *addressRepository) FindAddressByRange(ctx context.Context, minLng, minLat, maxLng, maxLat float64) ([]*model.Address, error) {
	var addresses []*model.Address
	err := r.db.WithContext(ctx).
		Where("is_deleted = 0").
		Where("CAST(longitude AS DECIMAL(10,6)) BETWEEN ? AND ?", minLng, maxLng).
		Where("CAST(latitude AS DECIMAL(10,6)) BETWEEN ? AND ?", minLat, maxLat).
		Order("sort ASC").
		Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *addressRepository) GetAddress(ctx context.Context, id int64) (*model.Address, error) {
	var address model.Address
	if err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&address).Error; err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *addressRepository) GetAddresses(ctx context.Context, addressCodes []string) ([]*model.Address, error) {
	var addresses []*model.Address
	if err := r.db.WithContext(ctx).Where("is_deleted = ?", 0).Where("code IN ?", addressCodes).Find(&addresses).Error; err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *addressRepository) GetAddressesByParams(ctx context.Context, params *model.Address) ([]*model.Address, error) {
	var addresses []*model.Address
	if err := r.db.WithContext(ctx).Where("is_deleted = ?", 0).Where(params).Find(&addresses).Error; err != nil {
		return nil, err
	}
	return addresses, nil
}
