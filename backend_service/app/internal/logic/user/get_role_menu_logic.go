package user

import (
	"context"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"
	"sapphire-mall/pkg/i18n"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRoleMenuLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取用户后台菜单
func NewGetRoleMenuLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRoleMenuLogic {
	return &GetRoleMenuLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRoleMenuLogic) GetRoleMenu() (resp *types.BaseResp, err error) {
	// 1. 从上下文中获取用户信息
	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		logx.Errorf("获取用户信息失败: %v", err)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}
	logx.Infof("获取用户菜单，用户ID: %d, 用户昵称: %s, locale: %s",
		userInfo.ID, userInfo.Nickname, i18n.LocaleFrom(l.ctx))

	// 2. 获取用户角色信息
	userRoleRepository := repository.NewUserRoleRepository(l.svcCtx.GormDB)
	userWithRoles, err := userRoleRepository.GetByUserID(l.ctx, userInfo.ID)
	if err != nil {
		logx.Errorf("获取用户角色信息失败: %v", err)
		return customererrors.FailMsg("获取用户角色信息失败"), nil
	}

	var allMenus []model.Category
	roleRepository := repository.NewRoleRepository(l.svcCtx.GormDB)
	for _, userRole := range userWithRoles {
		// 获取角色对应的菜单权限
		roleMenus, err := roleRepository.GetRoleCategorys(l.ctx, userRole.RoleID)
		if err != nil {
			continue
		}
		allMenus = append(allMenus, roleMenus...)
	}

	// 3. 非默认语言时加载 sys_category 翻译（与商品类目树同源）
	categoryNames, err := l.loadCategoryNameTranslations()
	if err != nil {
		logx.Errorf("加载菜单翻译失败: %v", err)
		return customererrors.FailMsg("加载菜单翻译失败"), nil
	}

	// 4. 构建菜单树结构
	menuTree := l.buildMenuTree(allMenus, categoryNames)

	// 5. 返回菜单数据
	return customererrors.SuccessData(menuTree), nil
}

// loadCategoryNameTranslations 按当前 locale 批量读取 sys_category 名称翻译。
// zh-CN 为默认语言，直接使用表内 name，不查翻译表。
func (l *GetRoleMenuLogic) loadCategoryNameTranslations() (i18n.FieldsMap, error) {
	locale := i18n.LocaleFrom(l.ctx)
	if locale == i18n.DefaultLocale {
		return nil, nil
	}
	transRepo := repository.NewTranslationRepository(l.svcCtx.GormDB)
	return transRepo.BatchGetFields(l.ctx, i18n.TableSysCategory, locale)
}

// MenuTreeNode 菜单树节点结构
type MenuTreeNode struct {
	ID          int64           `json:"id"`
	Name        string          `json:"name"`
	Title       string          `json:"title"`
	Icon        string          `json:"icon"`
	URL         string          `json:"url"`
	Sort        int             `json:"sort"`
	Level       int             `json:"level"`
	ParentID    int64           `json:"parent_id"`
	Status      int             `json:"status"`
	IsExternal  bool            `json:"is_external"`
	ExternalURL string          `json:"external_url"`
	Path        string          `json:"path"`
	Component   string          `json:"component"`
	Children    []*MenuTreeNode `json:"children,omitempty"`
}

// buildMenuTree 构建菜单树结构；有翻译时覆盖 name/title。
func (l *GetRoleMenuLogic) buildMenuTree(menus []model.Category, categoryNames i18n.FieldsMap) []*MenuTreeNode {
	// 先按菜单ID去重，避免用户拥有多个角色时同一菜单重复挂载
	uniqueMenus := make([]model.Category, 0, len(menus))
	seenMenuIDs := make(map[int64]struct{}, len(menus))
	for _, menu := range menus {
		if menu.Status != 1 { // 只处理启用状态的菜单
			continue
		}

		menuID := int64(menu.ID)
		if _, exists := seenMenuIDs[menuID]; exists {
			continue
		}
		seenMenuIDs[menuID] = struct{}{}
		uniqueMenus = append(uniqueMenus, menu)
	}

	// 创建菜单映射
	menuMap := make(map[int64]*MenuTreeNode, len(uniqueMenus))
	var rootMenus []*MenuTreeNode

	// 第一遍遍历：创建所有菜单节点
	for _, menu := range uniqueMenus {
		name := categoryNames.Name(int64(menu.ID), menu.Name)
		node := &MenuTreeNode{
			ID:          int64(menu.ID),
			Name:        name,
			Title:       name,
			Icon:        menu.Icon,
			URL:         menu.Code,
			Sort:        menu.Sort,
			Level:       menu.Level,
			ParentID:    int64(menu.ParentID),
			Status:      menu.Status,
			IsExternal:  menu.IsExternal,
			ExternalURL: menu.ExternalURL,
			Path:        menu.Path,
			Component:   menu.Component,
			Children:    make([]*MenuTreeNode, 0),
		}
		menuMap[int64(menu.ID)] = node
	}

	// 第二遍遍历：构建父子关系
	for _, menu := range uniqueMenus {
		node := menuMap[int64(menu.ID)]
		if node == nil {
			continue
		}

		if menu.ParentID == 0 {
			// 根菜单
			rootMenus = append(rootMenus, node)
		} else {
			// 子菜单
			if parent, exists := menuMap[int64(menu.ParentID)]; exists {
				parent.Children = append(parent.Children, node)
			}
		}
	}

	// 对菜单进行排序
	l.sortMenus(rootMenus)

	return rootMenus
}

// sortMenus 递归排序菜单
func (l *GetRoleMenuLogic) sortMenus(menus []*MenuTreeNode) {
	// 这里可以实现排序逻辑，比如按Sort字段排序
	// 为了简化，这里暂时不实现排序
	for _, menu := range menus {
		if len(menu.Children) > 0 {
			l.sortMenus(menu.Children)
		}
	}
}
