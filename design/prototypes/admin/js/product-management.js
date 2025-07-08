/* 商品管理页面专用JavaScript - 优化版 */

// 页面数据状态管理
const ProductManagementPage = {
    // 数据状态
    data: {
        products: [
            // 生成20条不同的测试商品数据，包含不同类目、状态、链上状态、合约地址、TokenID等
            {
                id: 1,
                name: '稀有数字艺术品 #001',
                description: '限量版NFT收藏品，具有独特的艺术价值',
                shortDescription: '限量版NFT收藏品',
                price: 2.5,
                originalPrice: 3.0,
                stock: 5,
                lowStockThreshold: 3,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                images: [
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center'
                ],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 12,
                rating: 4.8,
                sku: 'NFT001',
                brand: 'CryptoArt Studio',
                tags: ['稀有', '艺术', '收藏'],
                createdAt: '2024-01-15 10:30:00',
                attributes: {
                    brand: 'CryptoArt Studio',
                    rarity: '史诗级',
                    edition: '1/100'
                },
                contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
                tokenId: '1001',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-15 10:35:00',
                chainError: ''
            },
            {
                id: 2,
                name: '传奇武器包',
                description: '游戏内稀有装备集合，提升角色战斗力',
                shortDescription: '游戏内稀有装备',
                price: 0.8,
                originalPrice: 1.0,
                stock: 25,
                lowStockThreshold: 10,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
                images: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center'
                ],
                category: 'gaming',
                categoryName: '游戏道具',
                sales: 45,
                rating: 4.6,
                sku: 'GAME002',
                brand: 'GameStudio',
                tags: ['游戏', '装备', '传奇'],
                createdAt: '2024-01-16 14:20:00',
                attributes: {
                    brand: 'GameStudio',
                    level: '传奇',
                    game: 'Fantasy World'
                },
                contractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
                tokenId: '2002',
                chainStatus: '同步中',
                chainSyncTime: '2024-01-16 14:25:00',
                chainError: ''
            },
            {
                id: 3,
                name: '虚拟土地证书',
                description: '元宇宙土地所有权证明，可用于建设虚拟建筑',
                shortDescription: '元宇宙土地所有权',
                price: 5.0,
                originalPrice: 6.0,
                stock: 0,
                lowStockThreshold: 5,
                status: 'inactive',
                image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=300&fit=crop&crop=center',
                images: [
                    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=300&fit=crop&crop=center'
                ],
                category: 'metaverse',
                categoryName: '元宇宙资产',
                sales: 8,
                rating: 4.9,
                sku: 'META003',
                brand: 'MetaWorld Inc',
                tags: ['元宇宙', '土地', '投资'],
                createdAt: '2024-01-17 09:15:00',
                attributes: {
                    brand: 'MetaWorld Inc',
                    size: '100x100',
                    location: '中心区域'
                },
                contractAddress: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                tokenId: '3003',
                chainStatus: '同步失败',
                chainSyncTime: '2024-01-17 09:20:00',
                chainError: 'Gas不足'
            },
            // ... 继续生成17条不同的商品，覆盖不同状态、类目、链上状态、合约地址、TokenID等
            {
                id: 4,
                name: '数字藏品-加密猫',
                description: '区块链数字宠物，独一无二',
                shortDescription: '区块链数字宠物',
                price: 1.2,
                originalPrice: 1.5,
                stock: 10,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 30,
                rating: 4.7,
                sku: 'NFT004',
                brand: 'CryptoKitties',
                tags: ['宠物', '区块链'],
                createdAt: '2024-01-18 11:00:00',
                attributes: {},
                contractAddress: '0x1111111111111111111111111111111111111111',
                tokenId: '4004',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-18 11:05:00',
                chainError: ''
            },
            {
                id: 5,
                name: '限量版数字门票',
                description: '演唱会专属数字门票，唯一编号',
                shortDescription: '演唱会数字门票',
                price: 0.5,
                originalPrice: 0.8,
                stock: 2,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'ticket',
                categoryName: '数字票务',
                sales: 18,
                rating: 4.5,
                sku: 'TICKET005',
                brand: 'EventChain',
                tags: ['门票', '限量'],
                createdAt: '2024-01-19 09:00:00',
                attributes: {},
                contractAddress: '0x2222222222222222222222222222222222222222',
                tokenId: '5005',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-19 09:05:00',
                chainError: ''
            },
            {
                id: 6,
                name: '游戏皮肤-龙之战甲',
                description: '稀有游戏皮肤，提升角色外观',
                shortDescription: '稀有游戏皮肤',
                price: 0.9,
                originalPrice: 1.2,
                stock: 0,
                lowStockThreshold: 1,
                status: 'inactive',
                image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'gaming',
                categoryName: '游戏道具',
                sales: 50,
                rating: 4.9,
                sku: 'GAME006',
                brand: 'EpicGames',
                tags: ['皮肤', '稀有'],
                createdAt: '2024-01-20 13:00:00',
                attributes: {},
                contractAddress: '0x3333333333333333333333333333333333333333',
                tokenId: '6006',
                chainStatus: '同步失败',
                chainSyncTime: '2024-01-20 13:05:00',
                chainError: '合约异常'
            },
            {
                id: 7,
                name: '元宇宙虚拟服饰',
                description: '可穿戴虚拟服饰，适配多平台',
                shortDescription: '虚拟服饰',
                price: 0.7,
                originalPrice: 1.0,
                stock: 8,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'metaverse',
                categoryName: '元宇宙资产',
                sales: 22,
                rating: 4.3,
                sku: 'META007',
                brand: 'MetaWear',
                tags: ['服饰', '虚拟'],
                createdAt: '2024-01-21 15:00:00',
                attributes: {},
                contractAddress: '0x4444444444444444444444444444444444444444',
                tokenId: '7007',
                chainStatus: '同步中',
                chainSyncTime: '2024-01-21 15:05:00',
                chainError: ''
            },
            {
                id: 8,
                name: '数字艺术头像',
                description: '独特风格数字头像，适合社交平台',
                shortDescription: '数字头像',
                price: 0.3,
                originalPrice: 0.5,
                stock: 15,
                lowStockThreshold: 3,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 60,
                rating: 4.2,
                sku: 'NFT008',
                brand: 'AvatarLab',
                tags: ['头像', '艺术'],
                createdAt: '2024-01-22 10:00:00',
                attributes: {},
                contractAddress: '0x5555555555555555555555555555555555555555',
                tokenId: '8008',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-22 10:05:00',
                chainError: ''
            },
            {
                id: 9,
                name: '数字课程-区块链入门',
                description: '系统讲解区块链基础知识',
                shortDescription: '区块链课程',
                price: 1.5,
                originalPrice: 2.0,
                stock: 100,
                lowStockThreshold: 10,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'education',
                categoryName: '在线教育',
                sales: 80,
                rating: 4.8,
                sku: 'EDU009',
                brand: 'EduChain',
                tags: ['课程', '区块链'],
                createdAt: '2024-01-23 08:00:00',
                attributes: {},
                contractAddress: '0x6666666666666666666666666666666666666666',
                tokenId: '9009',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-23 08:05:00',
                chainError: ''
            },
            {
                id: 10,
                name: '软件工具-钱包助手',
                description: '一站式数字钱包管理工具',
                shortDescription: '数字钱包工具',
                price: 0.6,
                originalPrice: 0.9,
                stock: 50,
                lowStockThreshold: 5,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'software',
                categoryName: '软件工具',
                sales: 40,
                rating: 4.4,
                sku: 'SOFT010',
                brand: 'WalletPro',
                tags: ['工具', '钱包'],
                createdAt: '2024-01-24 12:00:00',
                attributes: {},
                contractAddress: '0x7777777777777777777777777777777777777777',
                tokenId: '1010',
                chainStatus: '同步中',
                chainSyncTime: '2024-01-24 12:05:00',
                chainError: ''
            },
            {
                id: 11,
                name: '数字徽章-贡献者',
                description: '社区贡献者专属数字徽章',
                shortDescription: '社区徽章',
                price: 0.2,
                originalPrice: 0.3,
                stock: 5,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 10,
                rating: 4.1,
                sku: 'NFT011',
                brand: 'BadgeDAO',
                tags: ['徽章', '社区'],
                createdAt: '2024-01-25 14:00:00',
                attributes: {},
                contractAddress: '0x8888888888888888888888888888888888888888',
                tokenId: '1111',
                chainStatus: '同步失败',
                chainSyncTime: '2024-01-25 14:05:00',
                chainError: '链上网络异常'
            },
            {
                id: 12,
                name: '数字门票-区块链大会',
                description: '区块链大会专属数字门票',
                shortDescription: '大会门票',
                price: 0.4,
                originalPrice: 0.6,
                stock: 3,
                lowStockThreshold: 1,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'ticket',
                categoryName: '数字票务',
                sales: 5,
                rating: 4.0,
                sku: 'TICKET012',
                brand: 'ChainEvent',
                tags: ['门票', '大会'],
                createdAt: '2024-01-26 16:00:00',
                attributes: {},
                contractAddress: '0x9999999999999999999999999999999999999999',
                tokenId: '1212',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-26 16:05:00',
                chainError: ''
            },
            {
                id: 13,
                name: '数字藏品-限量画作',
                description: '限量发行数字画作，艺术家签名',
                shortDescription: '限量画作',
                price: 3.0,
                originalPrice: 4.0,
                stock: 1,
                lowStockThreshold: 1,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 2,
                rating: 4.9,
                sku: 'NFT013',
                brand: 'ArtMaster',
                tags: ['画作', '限量'],
                createdAt: '2024-01-27 18:00:00',
                attributes: {},
                contractAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                tokenId: '1313',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-27 18:05:00',
                chainError: ''
            },
            {
                id: 14,
                name: '虚拟地产-沙盒地块',
                description: '沙盒游戏虚拟地产，稀缺地块',
                shortDescription: '沙盒地块',
                price: 4.5,
                originalPrice: 5.0,
                stock: 0,
                lowStockThreshold: 1,
                status: 'inactive',
                image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'metaverse',
                categoryName: '元宇宙资产',
                sales: 1,
                rating: 4.6,
                sku: 'META014',
                brand: 'Sandbox',
                tags: ['地产', '沙盒'],
                createdAt: '2024-01-28 20:00:00',
                attributes: {},
                contractAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                tokenId: '1414',
                chainStatus: '同步失败',
                chainSyncTime: '2024-01-28 20:05:00',
                chainError: '合约超时'
            },
            {
                id: 15,
                name: '数字徽章-早期用户',
                description: '平台早期用户专属数字徽章',
                shortDescription: '早期用户徽章',
                price: 0.1,
                originalPrice: 0.2,
                stock: 20,
                lowStockThreshold: 5,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 15,
                rating: 4.0,
                sku: 'NFT015',
                brand: 'BadgeDAO',
                tags: ['徽章', '早期'],
                createdAt: '2024-01-29 10:00:00',
                attributes: {},
                contractAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
                tokenId: '1515',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-29 10:05:00',
                chainError: ''
            },
            {
                id: 16,
                name: '数字课程-智能合约开发',
                description: '深入讲解智能合约开发与安全',
                shortDescription: '智能合约课程',
                price: 2.0,
                originalPrice: 2.5,
                stock: 60,
                lowStockThreshold: 10,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'education',
                categoryName: '在线教育',
                sales: 35,
                rating: 4.7,
                sku: 'EDU016',
                brand: 'EduChain',
                tags: ['课程', '智能合约'],
                createdAt: '2024-01-30 09:00:00',
                attributes: {},
                contractAddress: '0xdddddddddddddddddddddddddddddddddddddddd',
                tokenId: '1616',
                chainStatus: '同步中',
                chainSyncTime: '2024-01-30 09:05:00',
                chainError: ''
            },
            {
                id: 17,
                name: '软件工具-合约审计助手',
                description: '一站式智能合约审计工具',
                shortDescription: '合约审计工具',
                price: 1.8,
                originalPrice: 2.2,
                stock: 12,
                lowStockThreshold: 3,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'software',
                categoryName: '软件工具',
                sales: 8,
                rating: 4.5,
                sku: 'SOFT017',
                brand: 'AuditPro',
                tags: ['工具', '审计'],
                createdAt: '2024-01-31 11:00:00',
                attributes: {},
                contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                tokenId: '1717',
                chainStatus: '已上链',
                chainSyncTime: '2024-01-31 11:05:00',
                chainError: ''
            },
            {
                id: 18,
                name: '数字门票-音乐节',
                description: '音乐节专属数字门票',
                shortDescription: '音乐节门票',
                price: 0.7,
                originalPrice: 1.0,
                stock: 7,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'ticket',
                categoryName: '数字票务',
                sales: 12,
                rating: 4.3,
                sku: 'TICKET018',
                brand: 'MusicFest',
                tags: ['门票', '音乐节'],
                createdAt: '2024-02-01 13:00:00',
                attributes: {},
                contractAddress: '0xffffffffffffffffffffffffffffffffffffffff',
                tokenId: '1818',
                chainStatus: '同步失败',
                chainSyncTime: '2024-02-01 13:05:00',
                chainError: '链上Gas不足'
            },
            {
                id: 19,
                name: '数字藏品-像素头像',
                description: '像素风格数字头像，限量发行',
                shortDescription: '像素头像',
                price: 0.4,
                originalPrice: 0.6,
                stock: 9,
                lowStockThreshold: 2,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'nft',
                categoryName: 'NFT数字艺术',
                sales: 20,
                rating: 4.2,
                sku: 'NFT019',
                brand: 'PixelArt',
                tags: ['头像', '像素'],
                createdAt: '2024-02-02 15:00:00',
                attributes: {},
                contractAddress: '0x1111222233334444555566667777888899990000',
                tokenId: '1919',
                chainStatus: '已上链',
                chainSyncTime: '2024-02-02 15:05:00',
                chainError: ''
            },
            {
                id: 20,
                name: '元宇宙虚拟道具',
                description: '元宇宙专属虚拟道具，限量发售',
                shortDescription: '虚拟道具',
                price: 1.1,
                originalPrice: 1.5,
                stock: 4,
                lowStockThreshold: 1,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
                images: [],
                category: 'metaverse',
                categoryName: '元宇宙资产',
                sales: 6,
                rating: 4.4,
                sku: 'META020',
                brand: 'MetaProps',
                tags: ['道具', '元宇宙'],
                createdAt: '2024-02-03 17:00:00',
                attributes: {},
                contractAddress: '0x0000111122223333444455556666777788889999',
                tokenId: '2020',
                chainStatus: '同步中',
                chainSyncTime: '2024-02-03 17:05:00',
                chainError: ''
            },
        ],
        currentPage: 1,
        itemsPerPage: 10,
        searchTerm: '',
        sortColumn: null,
        sortDirection: 'asc',
        selectedProducts: new Set(),
        currentView: 'table',
        currentPeriod: 'month',
        filters: {
            status: '',
            chainStatus: '',
            timeRange: ''
        }
    },

    // 页面初始化
    init: function() {
        console.log('ProductManagementPage: 初始化开始...');
        this.loadStats();
        this.loadProducts();
        this.bindEvents();
        this.initializePagination();
        this.initializeModals();
        
        // 确保批量操作按钮初始状态正确
        this.updateSelectionBar();
        
        console.log('ProductManagementPage: 初始化完成');
    },

    // 绑定事件监听器
    bindEvents: function() {
        // 时间选择器事件
        const timeBtns = document.querySelectorAll('.time-btn');
        timeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.getAttribute('data-period');
                this.switchPeriod(period);
            });
        });

        // 搜索框事件
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.data.searchTerm = e.target.value;
                this.debounce(() => this.loadProducts(), 300)();
            });
        }

        // 视图切换事件
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // 表格排序事件
        const sortableThs = document.querySelectorAll('.sortable');
        sortableThs.forEach(th => {
            th.addEventListener('click', (e) => {
                const column = e.currentTarget.getAttribute('data-sort');
                this.sortProducts(column);
            });
        });

        // 全选事件
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    // ==================== 时间选择器功能 ====================

    // 切换时间周期
    switchPeriod: function(period) {
        this.data.currentPeriod = period;
        
        // 更新按钮状态
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-period') === period) {
                btn.classList.add('active');
            }
        });

        // 重新加载统计数据
        this.loadStats();
        this.showToast(`已切换到${this.getPeriodName(period)}数据`, 'info');
    },

    // 获取周期名称
    getPeriodName: function(period) {
        const names = {
            today: '今日',
            week: '本周',
            month: '本月',
            year: '本年'
        };
        return names[period] || period;
    },

    // ==================== 数据加载和渲染 ====================

    // 加载统计数据
    loadStats: function() {
        const stats = this.calculateStats();
        this.renderStats(stats);
    },

    // 计算统计数据
    calculateStats: function() {
        const products = this.data.products;
        const activeProducts = products.filter(p => p.status === 'active');
        const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
        const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
        const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
        const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

        return {
            totalProducts: products.length,
            activeProducts: activeProducts.length,
            lowStockProducts: lowStockProducts.length,
            totalRevenue: totalRevenue.toFixed(2),
            totalSales,
            avgRating: avgRating.toFixed(1)
        };
    },

    // 渲染统计数据
    renderStats: function(stats) {
        // 更新统计卡片数据
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            const valueElement = card.querySelector('.metric-value');
            const labelElement = card.querySelector('.metric-label');
            
            if (valueElement && labelElement) {
                const label = labelElement.textContent;
                switch(label) {
                    case '商品总数':
                        valueElement.textContent = stats.totalProducts;
                        break;
                    case '上架商品':
                        valueElement.textContent = stats.activeProducts;
                        break;
                    case '总收入':
                        valueElement.textContent = stats.totalRevenue + ' ETH';
                        break;
                    case '总销量':
                        valueElement.textContent = stats.totalSales;
                        break;
                    case '低库存':
                        valueElement.textContent = stats.lowStockProducts;
                        break;
                    case '平均评分':
                        valueElement.textContent = stats.avgRating;
                        break;
                }
            }
        });
    },

    // 加载商品列表
    loadProducts: function() {
        const filteredProducts = this.filterProducts();
        const sortedProducts = this.sortProductsData(filteredProducts);
        const paginatedProducts = this.paginateProducts(sortedProducts);
        
        this.renderProducts(paginatedProducts);
        this.updatePagination(filteredProducts.length);
        this.updateSelectionBar();
    },

    // 过滤商品
    filterProducts: function() {
        let products = this.data.products;
        
        // 搜索过滤
        if (this.data.searchTerm) {
            const term = this.data.searchTerm.toLowerCase();
            products = products.filter(product => 
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.categoryName.toLowerCase().includes(term) ||
                product.sku.toLowerCase().includes(term)
            );
        }
        
        // 状态筛选
        if (this.data.filters.status) {
            products = products.filter(product => product.status === this.data.filters.status);
        }
        
        // 链上状态筛选
        if (this.data.filters.chainStatus) {
            products = products.filter(product => product.chainStatus === this.data.filters.chainStatus);
        }
        
        // 时间范围筛选
        if (this.data.filters.timeRange) {
            const now = new Date();
            const timeRanges = {
                today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
                week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            };
            
            const filterDate = timeRanges[this.data.filters.timeRange];
            if (filterDate) {
                products = products.filter(product => {
                    const productDate = new Date(product.createdAt);
                    return productDate >= filterDate;
                });
            }
        }
        
        return products;
    },

    // 排序商品数据
    sortProductsData: function(products) {
        if (!this.data.sortColumn) return products;
        
        return products.sort((a, b) => {
            let aVal = a[this.data.sortColumn];
            let bVal = b[this.data.sortColumn];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return this.data.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.data.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // 分页商品
    paginateProducts: function(products) {
        const start = (this.data.currentPage - 1) * this.data.itemsPerPage + 1;
        const end = start + this.data.itemsPerPage;
        return products.slice(start, end);
    },

    // 渲染商品列表
    renderProducts: function(products) {
        if (this.data.currentView === 'table') {
            this.renderTableView(products);
        } else {
            this.renderGridView(products);
        }
    },

    // 渲染表格视图
    renderTableView: function(products) {
        const tbody = document.querySelector('.data-table tbody');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td class="checkbox-col">
                    <input type="checkbox" class="product-checkbox" value="${product.id}" 
                           ${this.data.selectedProducts.has(product.id) ? 'checked' : ''}
                           onchange="ProductManagementPage.toggleProductSelection(${product.id})">
                </td>
                <td>
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=60&h=60&fit=crop'">
                    </div>
                </td>
                <td>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.shortDescription}</p>
                    </div>
                </td>
                <td>${product.categoryName}</td>
                <td class="price">${product.price} ETH</td>
                <td class="stock ${product.stock <= product.lowStockThreshold ? 'low' : ''} ${product.stock === 0 ? 'out' : ''}">${product.stock}</td>
                <td>${product.sales}</td>
                <td>
                    <span class="badge badge-${product.status === 'active' ? 'success' : 'secondary'}">
                        <i class="fas fa-${product.status === 'active' ? 'check' : 'pause'}"></i>
                        ${product.status === 'active' ? '上架' : '下架'}
                    </span>
                </td>
                <td>
                    <span class="badge badge-${product.chainStatus === '已上链' ? 'success' : (product.chainStatus === '同步失败' ? 'danger' : 'warning')}">
                        ${product.chainStatus || '-'}
                    </span>
                </td>
                <td>
                    <a href="https://etherscan.io/address/${product.contractAddress}" target="_blank" title="区块浏览器" style="color:#60a5fa;text-decoration:underline;">
                        ${product.contractAddress ? product.contractAddress.slice(0, 6) + '...' + product.contractAddress.slice(-4) : '-'}
                    </a>
                </td>
                <td>${product.tokenId || '-'}</td>
                <td>${this.formatDate(product.createdAt)}</td>
                <td class="actions-col">
                    <div class="action-buttons">
                        <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.editProduct(${product.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.viewProduct(${product.id})" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.copyProduct(${product.id})" title="复制">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="ProductManagementPage.deleteProduct(${product.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // 渲染网格视图
    renderGridView: function(products) {
        const gridContainer = document.querySelector('.products-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-card-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop'">
                    <input type="checkbox" class="product-card-checkbox" value="${product.id}"
                           ${this.data.selectedProducts.has(product.id) ? 'checked' : ''}
                           onchange="ProductManagementPage.toggleProductSelection(${product.id})">
                    <span class="product-card-status badge badge-${product.status === 'active' ? 'success' : 'secondary'}">
                        ${product.status === 'active' ? '上架' : '下架'}
                    </span>
                </div>
                <div class="product-card-body">
                    <h4 class="product-card-title">${product.name}</h4>
                    <p class="product-card-description">${product.shortDescription}</p>
                    <div class="product-card-footer">
                        <div class="product-card-price">${product.price} ETH</div>
                        <div class="product-card-chain">
                            <span class="badge badge-${product.chainStatus === '已上链' ? 'success' : (product.chainStatus === '同步失败' ? 'danger' : 'warning')}">
                                ${product.chainStatus || '-'}
                            </span>
                            <a href="https://etherscan.io/address/${product.contractAddress}" target="_blank" title="区块浏览器" style="color:#60a5fa;text-decoration:underline;font-size:12px;">
                                ${product.contractAddress ? product.contractAddress.slice(0, 6) + '...' + product.contractAddress.slice(-4) : '-'}
                            </a>
                            <span style="font-size:12px;">TokenID: ${product.tokenId || '-'}</span>
                        </div>
                        <div class="product-card-actions">
                            <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.editProduct(${product.id})" title="编辑">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.viewProduct(${product.id})" title="查看">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon btn-icon-primary" onclick="ProductManagementPage.copyProduct(${product.id})" title="复制">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn-icon btn-icon-danger" onclick="ProductManagementPage.deleteProduct(${product.id})" title="删除">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // ==================== 视图切换功能 ====================

    // 切换视图
    switchView: function(view) {
        this.data.currentView = view;
        
        // 更新按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });

        // 切换视图显示
        const tableView = document.getElementById('tableView');
        const gridView = document.getElementById('gridView');
        
        if (view === 'table') {
            tableView.style.display = 'block';
            gridView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            gridView.style.display = 'block';
        }

        // 重新加载商品列表
        this.loadProducts();
        this.showToast(`已切换到${view === 'table' ? '表格' : '网格'}视图`, 'info');
    },

    // ==================== 排序功能 ====================

    // 排序商品
    sortProducts: function(column) {
        if (this.data.sortColumn === column) {
            this.data.sortDirection = this.data.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.data.sortColumn = column;
            this.data.sortDirection = 'asc';
        }

        // 更新排序图标
        document.querySelectorAll('.sortable i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });

        const currentTh = document.querySelector(`[data-sort="${column}"]`);
        if (currentTh) {
            const icon = currentTh.querySelector('i');
            if (icon) {
                icon.className = `fas fa-sort-${this.data.sortDirection === 'asc' ? 'up' : 'down'}`;
            }
        }

        this.loadProducts();
    },

    // ==================== 选择功能 ====================

    // 切换商品选择
    toggleProductSelection: function(productId) {
        if (this.data.selectedProducts.has(productId)) {
            this.data.selectedProducts.delete(productId);
        } else {
            this.data.selectedProducts.add(productId);
        }
        
        this.updateSelectionBar();
        this.updateSelectAllCheckbox();
    },

    // 切换全选
    toggleSelectAll: function(checked) {
        const checkboxes = document.querySelectorAll('.product-checkbox, .product-card-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const productId = parseInt(checkbox.value);
            if (checked) {
                this.data.selectedProducts.add(productId);
            } else {
                this.data.selectedProducts.delete(productId);
            }
        });
        
        this.updateSelectionBar();
    },

    // 更新选择栏
    updateSelectionBar: function() {
        const selectionBar = document.getElementById('selectionBar');
        const selectedCount = document.getElementById('selectedCount');
        const batchDeleteBtn = document.getElementById('batchDeleteBtn');
        const batchDeactivateBtn = document.getElementById('batchDeactivateBtn');
        
        if (this.data.selectedProducts.size > 0) {
            selectionBar.style.display = 'flex';
            selectedCount.textContent = this.data.selectedProducts.size;
            
            // 启用批量操作按钮
            if (batchDeleteBtn) batchDeleteBtn.disabled = false;
            if (batchDeactivateBtn) batchDeactivateBtn.disabled = false;
        } else {
            selectionBar.style.display = 'none';
            
            // 禁用批量操作按钮
            if (batchDeleteBtn) batchDeleteBtn.disabled = true;
            if (batchDeactivateBtn) batchDeactivateBtn.disabled = true;
        }
    },

    // 更新全选复选框
    updateSelectAllCheckbox: function() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.product-checkbox, .product-card-checkbox');
        
        if (checkboxes.length === 0) return;
        
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        selectAllCheckbox.checked = checkedCount === checkboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    },

    // 全选
    selectAll: function() {
        this.toggleSelectAll(true);
    },

    // 清除选择
    clearSelection: function() {
        this.toggleSelectAll(false);
    },

    // ==================== 分页功能 ====================

    // 初始化分页
    initializePagination: function() {
        this.updatePagination(this.data.products.length);
    },

    // 更新分页
    updatePagination: function(totalItems) {
        const totalPages = Math.ceil(totalItems / this.data.itemsPerPage);
        const startIndex = (this.data.currentPage - 1) * this.data.itemsPerPage + 1;
        const endIndex = Math.min(this.data.currentPage * this.data.itemsPerPage, totalItems);

        // 更新分页信息
        document.getElementById('startIndex').textContent = startIndex;
        document.getElementById('endIndex').textContent = endIndex;
        document.getElementById('totalItems').textContent = totalItems;

        // 更新页码
        this.renderPageNumbers(totalPages);
    },

    // 渲染页码
    renderPageNumbers: function(totalPages) {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        if (!pageNumbersContainer) return;

        let pageNumbers = '';
        const currentPage = this.data.currentPage;
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers += this.createPageNumber(i, i === currentPage);
            }
        } else {
            // 显示当前页附近的页码
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (start > 1) {
                pageNumbers += this.createPageNumber(1, false);
                if (start > 2) pageNumbers += '<span class="page-ellipsis">...</span>';
            }

            for (let i = start; i <= end; i++) {
                pageNumbers += this.createPageNumber(i, i === currentPage);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pageNumbers += '<span class="page-ellipsis">...</span>';
                pageNumbers += this.createPageNumber(totalPages, false);
            }
        }

        pageNumbersContainer.innerHTML = pageNumbers;
    },

    // 创建页码按钮
    createPageNumber: function(page, isActive) {
        return `<button class="page-number ${isActive ? 'active' : ''}" onclick="ProductManagementPage.goToPage(${page})">${page}</button>`;
    },

    // 跳转到指定页
    goToPage: function(page) {
        if (page === 'prev') {
            page = Math.max(1, this.data.currentPage - 1);
        } else if (page === 'next') {
            const totalPages = Math.ceil(this.filterProducts().length / this.data.itemsPerPage);
            page = Math.min(totalPages, this.data.currentPage + 1);
        } else if (page === 'last') {
            const totalPages = Math.ceil(this.filterProducts().length / this.data.itemsPerPage);
            page = totalPages;
        }

        this.data.currentPage = page;
        this.loadProducts();
    },

    // 改变每页显示数量
    changePageSize: function() {
        const pageSizeSelect = document.getElementById('pageSize');
        this.data.itemsPerPage = parseInt(pageSizeSelect.value);
        this.data.currentPage = 1;
        this.loadProducts();
    },

    // ==================== 批量操作功能 ====================

    // 批量操作
    batchOperation: function(operation) {
        if (this.data.selectedProducts.size === 0) {
            this.showToast('请先选择要操作的商品', 'warning');
            return;
        }

        const operationNames = {
            activate: '上架',
            deactivate: '下架',
            delete: '删除'
        };

        const operationName = operationNames[operation];
        const confirmMessage = `确定要${operationName}选中的 ${this.data.selectedProducts.size} 个商品吗？`;

        if (confirm(confirmMessage)) {
            let affectedCount = 0;
            
            this.data.products = this.data.products.map(product => {
                if (this.data.selectedProducts.has(product.id)) {
                    switch (operation) {
                        case 'activate':
                            if (product.status !== 'active') {
                                product.status = 'active';
                                affectedCount++;
                            }
                            break;
                        case 'deactivate':
                            if (product.status !== 'inactive') {
                                product.status = 'inactive';
                                affectedCount++;
                            }
                            break;
                        case 'delete':
                            return null; // 标记为删除
                    }
                }
                return product;
            }).filter(product => product !== null); // 移除删除的商品

            this.data.selectedProducts.clear();
            this.loadProducts();
            this.loadStats();
            this.showToast(`已${operationName} ${affectedCount} 个商品`, 'success');
        }
    },

    // ==================== 模态框功能 ====================

    // 初始化模态框
    initializeModals: function() {
        // 模态框遮罩点击关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
    },

    // 显示添加商品模态框
    showAddModal: function() {
        if (typeof ProductModal !== 'undefined') {
            ProductModal.showAdd();
        } else {
            // 备用方案：使用简单的模态框显示
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
        this.showToast('正在打开添加商品表单...', 'info');
    },

    // 编辑商品
    editProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('商品不存在', 'error');
            return;
        }

        if (typeof ProductModal !== 'undefined') {
            ProductModal.showEdit(productId);
        } else {
            // 备用方案：使用简单的模态框显示
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
        
        this.showToast(`正在编辑商品：${product.name}`, 'info');
    },

    // 查看商品
    viewProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('商品不存在', 'error');
            return;
        }

        this.showToast(`正在查看商品：${product.name}`, 'info');
    },

    // 删除商品
    deleteProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('商品不存在', 'error');
            return;
        }

        if (confirm(`确定要删除商品"${product.name}"吗？此操作不可恢复。`)) {
            this.data.products = this.data.products.filter(p => p.id !== productId);
            this.data.selectedProducts.delete(productId);
            this.loadProducts();
            this.loadStats();
            this.showToast(`已删除商品：${product.name}`, 'success');
        }
    },

    // 关闭模态框
    closeModal: function() {
        if (typeof ProductModal !== 'undefined') {
            ProductModal.hide();
        } else {
            // 备用方案：使用简单的模态框隐藏
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    },

    // 隐藏模态框（兼容ProductModal）
    hideModal: function() {
        this.closeModal();
    },

    // 保存商品
    saveProduct: function() {
        if (typeof ProductModal !== 'undefined') {
            ProductModal.saveProduct();
        } else {
            this.showToast('保存功能需要ProductModal支持', 'warning');
        }
    },

    // 保存草稿
    saveDraft: function() {
        if (typeof ProductModal !== 'undefined') {
            ProductModal.saveDraft();
        } else {
            this.showToast('草稿功能需要ProductModal支持', 'warning');
        }
    },

    // 隐藏预览模态框
    hidePreviewModal: function() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.classList.remove('show');
        }
    },

    // ==================== 其他功能 ====================

    // 搜索功能
    search: function() {
        this.loadProducts();
        this.showToast(`搜索完成，找到 ${this.filterProducts().length} 个商品`, 'info');
    },

    // 导出数据
    exportData: function() {
        const products = this.data.selectedProducts.size > 0 
            ? this.data.products.filter(p => this.data.selectedProducts.has(p.id))
            : this.data.products;
        
        const csvContent = this.convertToCSV(products);
        this.downloadCSV(csvContent, `商品数据_${new Date().toISOString().split('T')[0]}.csv`);
        
        this.showToast(`已导出 ${products.length} 个商品数据`, 'success');
    },

    // 导入数据
    importData: function() {
        this.showToast('导入功能正在开发中', 'info');
    },

    // 管理分类
    manageCategories: function() {
        this.showToast('分类管理功能正在开发中', 'info');
    },

    // 转换为CSV
    convertToCSV: function(products) {
        const headers = ['ID', '商品名称', '描述', '价格', '库存', '状态', '分类', '销量', '评分', '创建时间'];
        const rows = products.map(p => [
            p.id, p.name, p.description, p.price, p.stock, p.status, p.categoryName, p.sales, p.rating, p.createdAt
        ]);
        
        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    },

    // 下载CSV
    downloadCSV: function(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    // 格式化日期
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 显示提示消息
    showToast: function(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    // 获取toast图标
    getToastIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 复制商品功能
    copyProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('商品不存在', 'error');
            return;
        }
        // 生成新ID
        const newId = Math.max(...this.data.products.map(p => p.id)) + 1;
        // 深拷贝商品并重置部分字段
        const newProduct = JSON.parse(JSON.stringify(product));
        newProduct.id = newId;
        newProduct.name = product.name + '（复制）';
        newProduct.sku = product.sku + '_COPY';
        newProduct.status = 'draft';
        newProduct.createdAt = new Date().toISOString();
        // 可根据需要重置更多字段
        this.data.products.unshift(newProduct);
        this.showToast('已复制商品为草稿，请编辑后上架', 'success');
        this.loadProducts();
        // 可选：自动弹出编辑模态框
        this.editProduct(newId);
    },

    // 应用筛选
    applyFilters: function() {
        // 获取筛选值
        const statusFilter = document.getElementById('statusFilter');
        const chainStatusFilter = document.getElementById('chainStatusFilter');
        const timeFilter = document.getElementById('timeFilter');
        
        this.data.filters.status = statusFilter ? statusFilter.value : '';
        this.data.filters.chainStatus = chainStatusFilter ? chainStatusFilter.value : '';
        this.data.filters.timeRange = timeFilter ? timeFilter.value : '';
        
        // 重置到第一页
        this.data.currentPage = 1;
        
        // 重新加载商品列表
        this.loadProducts();
        
        // 显示筛选结果
        const filteredCount = this.filterProducts().length;
        this.showToast(`筛选完成，找到 ${filteredCount} 个商品`, 'info');
    },

    // 清除筛选
    clearFilters: function() {
        // 重置筛选值
        this.data.filters = {
            status: '',
            chainStatus: '',
            timeRange: ''
        };
        
        // 重置筛选器UI
        const statusFilter = document.getElementById('statusFilter');
        const chainStatusFilter = document.getElementById('chainStatusFilter');
        const timeFilter = document.getElementById('timeFilter');
        
        if (statusFilter) statusFilter.value = '';
        if (chainStatusFilter) chainStatusFilter.value = '';
        if (timeFilter) timeFilter.value = '';
        
        // 重置到第一页
        this.data.currentPage = 1;
        
        // 重新加载商品列表
        this.loadProducts();
        
        this.showToast('已清除所有筛选条件', 'info');
    },

    // ==================== 快速操作功能 ====================

    // 库存预警功能
    showStockWarning: function() {
        // 获取低库存商品
        const lowStockProducts = this.data.products.filter(p => 
            p.stock <= p.lowStockThreshold && p.status === 'active'
        );
        
        // 创建库存预警模态框
        const modalHtml = `
            <div class="modal-overlay" id="stockWarningModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                            库存预警管理
                        </h3>
                        <button class="modal-close" onclick="ProductManagementPage.hideStockWarning()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="warning-summary">
                            <div class="warning-card">
                                <div class="warning-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="warning-info">
                                    <div class="warning-title">低库存商品</div>
                                    <div class="warning-count">${lowStockProducts.length} 个商品</div>
                                </div>
                            </div>
                            <div class="warning-card">
                                <div class="warning-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                    <i class="fas fa-times-circle"></i>
                                </div>
                                <div class="warning-info">
                                    <div class="warning-title">缺货商品</div>
                                    <div class="warning-count">${this.data.products.filter(p => p.stock === 0 && p.status === 'active').length} 个商品</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="warning-actions">
                            <button class="btn btn-primary" onclick="ProductManagementPage.batchRestock()">
                                <i class="fas fa-plus"></i>
                                批量补货
                            </button>
                            <button class="btn btn-outline" onclick="ProductManagementPage.exportStockReport()">
                                <i class="fas fa-download"></i>
                                导出库存报告
                            </button>
                        </div>

                        <div class="warning-table">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>商品图片</th>
                                        <th>商品名称</th>
                                        <th>当前库存</th>
                                        <th>预警阈值</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lowStockProducts.map(product => `
                                        <tr>
                                            <td>
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                            </td>
                                            <td>${product.name}</td>
                                            <td>
                                                <span class="stock-count ${product.stock === 0 ? 'out-of-stock' : 'low-stock'}">
                                                    ${product.stock}
                                                </span>
                                            </td>
                                            <td>${product.lowStockThreshold}</td>
                                            <td>
                                                <span class="status-badge status-${product.stock === 0 ? 'status-danger' : 'status-warning'}">
                                                    ${product.stock === 0 ? '缺货' : '低库存'}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-primary" onclick="ProductManagementPage.quickRestock(${product.id})">
                                                    快速补货
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 显示模态框
        setTimeout(() => {
            const modal = document.getElementById('stockWarningModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏库存预警模态框
    hideStockWarning: function() {
        const modal = document.getElementById('stockWarningModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 快速补货
    quickRestock: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) return;
        
        const newStock = prompt(`请输入 ${product.name} 的补货数量:`, '10');
        if (newStock && !isNaN(newStock)) {
            product.stock = parseInt(newStock);
            this.showToast(`已为 ${product.name} 补货 ${newStock} 件`, 'success');
            this.hideStockWarning();
            this.showStockWarning(); // 刷新预警页面
        }
    },

    // 批量补货
    batchRestock: function() {
        this.showToast('批量补货功能正在开发中', 'info');
    },

    // 导出库存报告
    exportStockReport: function() {
        const lowStockProducts = this.data.products.filter(p => 
            p.stock <= p.lowStockThreshold && p.status === 'active'
        );
        
        const csvContent = this.convertToCSV(lowStockProducts);
        this.downloadCSV(csvContent, `库存预警报告_${new Date().toISOString().split('T')[0]}.csv`);
        
        this.showToast(`已导出库存预警报告，包含 ${lowStockProducts.length} 个商品`, 'success');
    },

    // 待办事项功能
    showTodoList: function() {
        // 获取待办事项
        const pendingProducts = this.data.products.filter(p => p.status === 'pending');
        const syncFailedProducts = this.data.products.filter(p => p.chainStatus === '同步失败');
        const draftProducts = this.data.products.filter(p => p.status === 'draft');
        
        const modalHtml = `
            <div class="modal-overlay" id="todoModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-clipboard-list" style="color: #3b82f6;"></i>
                            待办事项管理
                        </h3>
                        <button class="modal-close" onclick="ProductManagementPage.hideTodoList()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="todo-summary">
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">待审核商品</div>
                                    <div class="todo-count">${pendingProducts.length} 个</div>
                                </div>
                            </div>
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                    <i class="fas fa-exclamation-circle"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">同步失败</div>
                                    <div class="todo-count">${syncFailedProducts.length} 个</div>
                                </div>
                            </div>
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #6b7280, #4b5563);">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">草稿商品</div>
                                    <div class="todo-count">${draftProducts.length} 个</div>
                                </div>
                            </div>
                        </div>

                        <div class="todo-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="pending">待审核 (${pendingProducts.length})</button>
                                <button class="tab-btn" data-tab="sync-failed">同步失败 (${syncFailedProducts.length})</button>
                                <button class="tab-btn" data-tab="draft">草稿 (${draftProducts.length})</button>
                            </div>
                            
                            <div class="tab-content active" id="pendingTab">
                                <div class="todo-list">
                                    ${pendingProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">创建时间: ${this.formatDate(product.createdAt)}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-success" onclick="ProductManagementPage.approveProduct(${product.id})">
                                                    审核通过
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="ProductManagementPage.rejectProduct(${product.id})">
                                                    拒绝
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="tab-content" id="syncFailedTab">
                                <div class="todo-list">
                                    ${syncFailedProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">错误: ${product.chainError}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-primary" onclick="ProductManagementPage.retrySync(${product.id})">
                                                    重试同步
                                                </button>
                                                <button class="btn btn-sm btn-outline" onclick="ProductManagementPage.viewSyncDetails(${product.id})">
                                                    查看详情
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="tab-content" id="draftTab">
                                <div class="todo-list">
                                    ${draftProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">创建时间: ${this.formatDate(product.createdAt)}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-primary" onclick="ProductManagementPage.editProduct(${product.id})">
                                                    继续编辑
                                                </button>
                                                <button class="btn btn-sm btn-success" onclick="ProductManagementPage.publishDraft(${product.id})">
                                                    发布
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 添加标签切换功能
        setTimeout(() => {
            const modal = document.getElementById('todoModal');
            modal.classList.add('show');
            
            // 绑定标签切换事件
            const tabBtns = modal.querySelectorAll('.tab-btn');
            const tabContents = modal.querySelectorAll('.tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabName = btn.dataset.tab;
                    
                    // 更新按钮状态
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // 更新内容显示
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabName + 'Tab') {
                            content.classList.add('active');
                        }
                    });
                });
            });
        }, 100);
    },

    // 隐藏待办事项模态框
    hideTodoList: function() {
        const modal = document.getElementById('todoModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 审核通过商品
    approveProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'active';
            this.showToast(`已审核通过: ${product.name}`, 'success');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 拒绝商品
    rejectProduct: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'inactive';
            this.showToast(`已拒绝: ${product.name}`, 'warning');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 重试同步
    retrySync: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (product) {
            product.chainStatus = '同步中';
            this.showToast(`正在重试同步: ${product.name}`, 'info');
            // 模拟同步过程
            setTimeout(() => {
                product.chainStatus = '已上链';
                product.chainError = '';
                this.showToast(`同步成功: ${product.name}`, 'success');
                this.hideTodoList();
                this.showTodoList();
            }, 2000);
        }
    },

    // 查看同步详情
    viewSyncDetails: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (product) {
            alert(`同步详情:\n商品: ${product.name}\n错误信息: ${product.chainError}\n合约地址: ${product.contractAddress}\nTokenID: ${product.tokenId}`);
        }
    },

    // 发布草稿
    publishDraft: function(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'pending';
            this.showToast(`已提交审核: ${product.name}`, 'success');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 创建优惠活动功能
    showPromotionCreator: function() {
        const modalHtml = `
            <div class="modal-overlay" id="promotionModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-percent" style="color: #ec4899;"></i>
                            创建优惠活动
                        </h3>
                        <button class="modal-close" onclick="ProductManagementPage.hidePromotionCreator()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="promotion-types">
                            <div class="promotion-type-card" onclick="ProductManagementPage.selectPromotionType('discount')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                                    <i class="fas fa-percent"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">商品折扣</div>
                                    <div class="promotion-desc">设置商品价格折扣</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="ProductManagementPage.selectPromotionType('coupon')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                    <i class="fas fa-ticket-alt"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">优惠券</div>
                                    <div class="promotion-desc">发放优惠券码</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="ProductManagementPage.selectPromotionType('flash')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-bolt"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">限时抢购</div>
                                    <div class="promotion-desc">设置限时特价</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="ProductManagementPage.selectPromotionType('bundle')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">捆绑销售</div>
                                    <div class="promotion-desc">多商品组合优惠</div>
                                </div>
                            </div>
                        </div>

                        <div class="promotion-form" id="promotionForm" style="display: none;">
                            <div class="form-section">
                                <h4>活动基本信息</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>活动名称</label>
                                        <input type="text" class="form-input" id="promotionName" placeholder="请输入活动名称">
                                    </div>
                                    <div class="form-group">
                                        <label>活动类型</label>
                                        <select class="form-select" id="promotionType">
                                            <option value="discount">商品折扣</option>
                                            <option value="coupon">优惠券</option>
                                            <option value="flash">限时抢购</option>
                                            <option value="bundle">捆绑销售</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>开始时间</label>
                                        <input type="datetime-local" class="form-input" id="promotionStart">
                                    </div>
                                    <div class="form-group">
                                        <label>结束时间</label>
                                        <input type="datetime-local" class="form-input" id="promotionEnd">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>优惠设置</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>折扣比例 (%)</label>
                                        <input type="number" class="form-input" id="discountRate" min="1" max="99" placeholder="例如: 20">
                                    </div>
                                    <div class="form-group">
                                        <label>优惠金额 (ETH)</label>
                                        <input type="number" class="form-input" id="discountAmount" step="0.001" placeholder="例如: 0.1">
                                    </div>
                                    <div class="form-group">
                                        <label>使用条件</label>
                                        <input type="number" class="form-input" id="minAmount" step="0.001" placeholder="最低消费金额">
                                    </div>
                                    <div class="form-group">
                                        <label>发放数量</label>
                                        <input type="number" class="form-input" id="couponCount" min="1" placeholder="优惠券数量">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>适用商品</h4>
                                <div class="product-selector">
                                    <div class="selector-toolbar">
                                        <button type="button" class="btn btn-outline btn-sm" onclick="ProductManagementPage.selectAllProducts()">
                                            全选
                                        </button>
                                        <button type="button" class="btn btn-outline btn-sm" onclick="ProductManagementPage.clearProductSelection()">
                                            清空
                                        </button>
                                    </div>
                                    <div class="product-list" id="promotionProductList">
                                        ${this.data.products.map(product => `
                                            <div class="product-item">
                                                <label class="checkbox-label">
                                                    <input type="checkbox" value="${product.id}">
                                                    <span class="checkmark"></span>
                                                </label>
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="product-info">
                                                    <div class="product-name">${product.name}</div>
                                                    <div class="product-price">${product.price} ETH</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" onclick="ProductManagementPage.hidePromotionCreator()">取消</button>
                        <button type="button" class="btn btn-primary" onclick="ProductManagementPage.createPromotion()" id="createPromotionBtn" style="display: none;">
                            创建活动
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        setTimeout(() => {
            const modal = document.getElementById('promotionModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏优惠活动创建器
    hidePromotionCreator: function() {
        const modal = document.getElementById('promotionModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 选择优惠活动类型
    selectPromotionType: function(type) {
        const form = document.getElementById('promotionForm');
        const createBtn = document.getElementById('createPromotionBtn');
        const typeSelect = document.getElementById('promotionType');
        
        if (form && createBtn && typeSelect) {
            form.style.display = 'block';
            createBtn.style.display = 'block';
            typeSelect.value = type;
            
            // 滚动到表单
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // 全选商品
    selectAllProducts: function() {
        const checkboxes = document.querySelectorAll('#promotionProductList input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    },

    // 清空商品选择
    clearProductSelection: function() {
        const checkboxes = document.querySelectorAll('#promotionProductList input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    },

    // 创建优惠活动
    createPromotion: function() {
        const name = document.getElementById('promotionName')?.value;
        const type = document.getElementById('promotionType')?.value;
        const startTime = document.getElementById('promotionStart')?.value;
        const endTime = document.getElementById('promotionEnd')?.value;
        
        if (!name || !startTime || !endTime) {
            this.showToast('请填写完整的活动信息', 'warning');
            return;
        }
        
        const selectedProducts = Array.from(document.querySelectorAll('#promotionProductList input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selectedProducts.length === 0) {
            this.showToast('请选择至少一个商品', 'warning');
            return;
        }
        
        this.showToast(`优惠活动"${name}"创建成功！`, 'success');
        this.hidePromotionCreator();
    },

    // 客户评论管理功能
    showCommentManagement: function() {
        // 模拟评论数据
        const comments = [
            {
                id: 1,
                productId: 1,
                productName: '稀有数字艺术品 #001',
                productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                userName: 'CryptoArt_Lover',
                rating: 5,
                content: '非常精美的数字艺术品，质量超出预期！',
                status: 'pending',
                createdAt: '2024-01-20 14:30:00'
            },
            {
                id: 2,
                productId: 2,
                productName: '传奇武器包',
                productImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
                userName: 'GameMaster_2024',
                rating: 4,
                content: '游戏道具很实用，但价格稍贵',
                status: 'approved',
                createdAt: '2024-01-19 16:45:00'
            },
            {
                id: 3,
                productId: 1,
                productName: '稀有数字艺术品 #001',
                productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                userName: 'ArtCollector',
                rating: 3,
                content: '艺术品不错，但发货有点慢',
                status: 'rejected',
                createdAt: '2024-01-18 09:15:00'
            }
        ];
        
        const pendingCount = comments.filter(c => c.status === 'pending').length;
        const approvedCount = comments.filter(c => c.status === 'approved').length;
        const rejectedCount = comments.filter(c => c.status === 'rejected').length;
        
        const modalHtml = `
            <div class="modal-overlay" id="commentModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-comments" style="color: #14b8a6;"></i>
                            客户评论管理
                        </h3>
                        <button class="modal-close" onclick="ProductManagementPage.hideCommentManagement()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="comment-summary">
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">待审核</div>
                                    <div class="comment-count">${pendingCount}</div>
                                </div>
                            </div>
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">已通过</div>
                                    <div class="comment-count">${approvedCount}</div>
                                </div>
                            </div>
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">已拒绝</div>
                                    <div class="comment-count">${rejectedCount}</div>
                                </div>
                            </div>
                        </div>

                        <div class="comment-filters">
                            <select class="form-select" id="commentStatusFilter" onchange="ProductManagementPage.filterComments()">
                                <option value="">全部状态</option>
                                <option value="pending">待审核</option>
                                <option value="approved">已通过</option>
                                <option value="rejected">已拒绝</option>
                            </select>
                            <select class="form-select" id="commentRatingFilter" onchange="ProductManagementPage.filterComments()">
                                <option value="">全部评分</option>
                                <option value="5">5星</option>
                                <option value="4">4星</option>
                                <option value="3">3星</option>
                                <option value="2">2星</option>
                                <option value="1">1星</option>
                            </select>
                        </div>

                        <div class="comment-list" id="commentList">
                            ${comments.map(comment => `
                                <div class="comment-item" data-status="${comment.status}" data-rating="${comment.rating}">
                                    <div class="comment-header">
                                        <div class="comment-product">
                                            <img src="${comment.productImage}" alt="${comment.productName}" class="product-thumb">
                                            <div class="product-info">
                                                <div class="product-name">${comment.productName}</div>
                                                <div class="comment-meta">
                                                    <span class="user-name">${comment.userName}</span>
                                                    <span class="comment-time">${this.formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="comment-rating">
                                            ${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}
                                        </div>
                                    </div>
                                    <div class="comment-content">
                                        ${comment.content}
                                    </div>
                                    <div class="comment-actions">
                                        <span class="status-badge status-${comment.status}">
                                            ${comment.status === 'pending' ? '待审核' : 
                                              comment.status === 'approved' ? '已通过' : '已拒绝'}
                                        </span>
                                        ${comment.status === 'pending' ? `
                                            <button class="btn btn-sm btn-success" onclick="ProductManagementPage.approveComment(${comment.id})">
                                                通过
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="ProductManagementPage.rejectComment(${comment.id})">
                                                拒绝
                                            </button>
                                        ` : `
                                            <button class="btn btn-sm btn-outline" onclick="ProductManagementPage.replyComment(${comment.id})">
                                                回复
                                            </button>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        setTimeout(() => {
            const modal = document.getElementById('commentModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏评论管理模态框
    hideCommentManagement: function() {
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 筛选评论
    filterComments: function() {
        const statusFilter = document.getElementById('commentStatusFilter')?.value;
        const ratingFilter = document.getElementById('commentRatingFilter')?.value;
        const commentItems = document.querySelectorAll('.comment-item');
        
        commentItems.forEach(item => {
            const status = item.dataset.status;
            const rating = item.dataset.rating;
            
            let show = true;
            
            if (statusFilter && status !== statusFilter) {
                show = false;
            }
            
            if (ratingFilter && rating !== ratingFilter) {
                show = false;
            }
            
            item.style.display = show ? 'block' : 'none';
        });
    },

    // 审核通过评论
    approveComment: function(commentId) {
        const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentItem) {
            commentItem.dataset.status = 'approved';
            this.showToast('评论已审核通过', 'success');
            this.filterComments();
        }
    },

    // 拒绝评论
    rejectComment: function(commentId) {
        const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentItem) {
            commentItem.dataset.status = 'rejected';
            this.showToast('评论已拒绝', 'warning');
            this.filterComments();
        }
    },

    // 回复评论
    replyComment: function(commentId) {
        const reply = prompt('请输入回复内容:');
        if (reply) {
            this.showToast('回复已发送', 'success');
        }
    },
}; 