package user

import (
	"context"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

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
	userInfo, ok := l.ctx.Value("userInfo").(*model.User)
	if !ok {
		logx.Error("无法从上下文中获取用户信息")
		return &types.BaseResp{
			Code: 401,
			Msg:  "用户未登录",
		}, nil
	}

	logx.Infof("获取用户菜单，用户ID: %d, 用户昵称: %s", userInfo.ID, userInfo.Nickname)

	// 2. 获取用户角色信息
	roleRepository := repository.NewRoleRepository(l.svcCtx.GormDB)
	userWithRoles, err := roleRepository.GetByID(l.ctx, userInfo.ID)
	if err != nil {
		logx.Errorf("获取用户角色信息失败: %v", err)
		return &types.BaseResp{
			Code: 500,
			Msg:  "获取用户角色信息失败",
		}, nil
	}

	var allMenus []model.Category

	for _, userRole := range userWithRoles {
		// 获取角色对应的菜单权限
		roleMenus, err := roleRepository.GetRoleCategorys(l.ctx, userRole.ID)
		if err != nil {
			logx.Errorf("获取角色 %d 菜单权限失败: %v", userRole.ID, err)
			continue
		}
		allMenus = append(allMenus, roleMenus...)
	}

	// 4. 构建菜单树结构
	menuTree := l.buildMenuTree(allMenus)

	// 5. 返回菜单数据
	return &types.BaseResp{
		Code: 0,
		Msg:  "获取菜单成功",
		Data: menuTree,
	}, nil
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

// buildMenuTree 构建菜单树结构
func (l *GetRoleMenuLogic) buildMenuTree(menus []model.Category) []*MenuTreeNode {
	// 创建菜单映射
	menuMap := make(map[int64]*MenuTreeNode)
	var rootMenus []*MenuTreeNode

	// 第一遍遍历：创建所有菜单节点
	for _, menu := range menus {
		if menu.Status != 1 { // 只处理启用状态的菜单
			continue
		}

		node := &MenuTreeNode{
			ID:          int64(menu.ID),
			Name:        menu.Name,
			Title:       menu.Name,
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
	for _, menu := range menus {
		if menu.Status != 1 {
			continue
		}

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
