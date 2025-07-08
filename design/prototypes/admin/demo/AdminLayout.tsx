import React, { useEffect, useState } from 'react';
import { Layout, Spin, message } from 'antd';
import { UserOutlined, DatabaseOutlined, MoneyCollectOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import { authManager } from '../utils/authManager';
import { UserInfoResponse } from '../api/apiService';

const { Sider, Content } = Layout;

// 定义菜单项的 props 类型
interface MenuItemProps {
    to: string; // 链接的路径
    children: React.ReactNode; // 子元素的类型
    name: string;
}
// 定义链接项的类型
interface LinkItem {
    path: string;
    label: string;
}

// 定义卡片组件的 props 类型
interface CardComponentProps {
    icon: React.ReactNode; // 图标的类型
    title: string;         // 标题的类型
    links: LinkItem[];    // 链接项的数组
}

// 将菜单数据移到组件外部
const ALL_MENU_DATA = [
    {
        key: "profile",
        title: "个人中心",
        icon: <UserOutlined />,
        links: [
            { path: "/admin/profile/info", label: "个人信息" },
            { path: "/admin/profile/security", label: "安全设置" },
            { path: "/admin/profile/notifications", label: "通知设置" },
        ]
    },
    {
        key: "assets",
        title: "我的资产",
        icon: <DatabaseOutlined />,
        links: [
            { path: "/admin/assets/balance", label: "账户余额" },
            { path: "/admin/assets/staking", label: "质押管理" },
            { path: "/admin/assets/tradelist", label: "交易记录" },
        ]
    },
    {
        key: "order",
        title: "交易管理",
        icon: <MoneyCollectOutlined />,
        links: [
            { path: "/admin/order/address", label: "收货地址管理"},
            { path: "/admin/order/pending", label: "待付款" },
            { path: "/admin/order/list", label: "订单列表" },
            { path: "/admin/order/aftersale", label: "退款/售后" },
        ]
    },
    {
        key: "mall",
        title: "商城管理",
        icon: <FileTextOutlined />,
        adminOnly: true, // 标记该菜单仅管理员可见
        links: [
            { path: "/admin/mall/categories", label: "目录分类" },
            { path: "/admin/mall/products", label: "商品管理" },
            { path: "/admin/mall/orders", label: "订单管理" },
            { path: "/admin/mall/comments", label: "评价管理" }
        ]
    },

    {
        key: "contract",
        title: "合约管理",
        icon: <FileTextOutlined />,
        adminOnly: true, // 标记该菜单仅管理员可见
        links: [
            { path: "/admin/contract/role-management", label: "权限管理"},
            { path: "/admin/contract/staking-pools", label: "质押池管理"},
            { path: "/admin/contract/properties", label: "参数设置" },
            { path: "/admin/contract/emergency-control", label: "紧急控制"},
            { path: "/admin/contract/user-management", label: "用户管理"},
            { path: "/admin/contract/contract-upgrade", label: "合约升级"},
            { path: "/admin/contract/account-monitoring", label: "财务监控"},
        ]
    }
];

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState("个人信息");
    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState(ALL_MENU_DATA);
    
    // 初始化用户信息
    useEffect(() => {
        const initUserData = async () => {
            setLoading(true);
            try {
                const userInfo = authManager.userInfo;
                if (userInfo) {
                    const isAdmin = userInfo.isAdmin || false;
                    
                    if(isAdmin){
                        // 根据用户角色过滤菜单
                        const filteredMenu = ALL_MENU_DATA.filter(menu => 
                            menu.adminOnly
                        );
                        setMenuData(filteredMenu);
                    }else{
                        setMenuData(ALL_MENU_DATA.filter(menu => !menu.adminOnly));
                    }
                }else{
                    setMenuData(ALL_MENU_DATA.filter(menu => !menu.adminOnly));
                }
            } catch (error) {
                console.error("初始化用户数据失败:", error);
                message.error('获取用户信息失败');
            } finally {
                setLoading(false);
            }
        };
        
        initUserData();
    }, [authManager.userInfo]); // 直接依赖userInfo的变化
    
    useEffect(() => {
        navigate("/admin/profile/info");
    }, [navigate]);

    useEffect(() => {
        const menu = menuData.find(item => 
            item.links.some(link => link.path === location.pathname)
        );
    
        const currentLink = menu?.links.find(link => link.path === location.pathname);
        if (currentLink) {
            setSelectedItem(currentLink.label);
        }
    }, [location, menuData]);

    // 菜单项组件
    const MenuItem: React.FC<MenuItemProps> = ({ to, children, name }) => (
        <div className={styles.menuItem}>
            <Link 
                onClick={() => setSelectedItem(name)} 
                className={`${styles.menuLink} ${selectedItem === name ? styles.menuLinkActive : styles.menuLinkInactive}`}
                to={to}
            >
                {children}
            </Link>
        </div>
    );
    
    // 卡片组件
    const CardComponent: React.FC<CardComponentProps> = ({ icon, title, links }) => (
        <div className={styles.card}>
            <div className={styles.title}>
                <span className={styles.titleText}>{icon} {title}</span>
            </div>
            <div className={styles.cardContent}>
                {links.map((link, index) => (
                    <MenuItem key={index} to={link.path} name={link.label}>
                        {link.label}
                    </MenuItem>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    return (
        <Layout className={styles.layout}>
            <Sider width={250} className={styles.left}>
                {menuData.map((menu) => (
                    <CardComponent
                        key={menu.key}
                        icon={menu.icon}
                        title={menu.title}
                        links={menu.links}
                    />
                ))}
            </Sider>

            <Layout className={styles.right}>
                <Content className={styles.content}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;