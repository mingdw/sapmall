/**
 * DApp 通用 JavaScript 功能模块
 */

// 全局变量
let currentLang = 'zh';
window.currentLang = currentLang;

/**
 * 语言切换功能
 */
function updateLanguage(lang) {
    currentLang = lang;
    window.currentLang = lang; // 设置全局变量
    
    // 更新所有带语言属性的元素
    document.querySelectorAll('[data-zh], [data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });

    // 更新占位符
    document.querySelectorAll('[data-placeholder-zh], [data-placeholder-en]').forEach(element => {
        const placeholder = element.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    console.log(`Language switched to: ${lang}`);
}

/**
 * Toast 提示功能
 */
function showToast(message, type = 'info', duration = 3000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 隐藏动画
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

/**
 * 获取类别显示名称
 */
function getCategoryDisplayName(categoryName) {
    const nameMap = {
        'Price': '价格',
        'Rating': '评分', 
        'Sales': '销量',
        'Time': '时间'
    };
    return nameMap[categoryName] || categoryName;
}

/**
 * 搜索功能
 */
function initSearchFeature() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length > 0) {
                this.style.borderColor = '#3b82f6';
                this.style.backgroundColor = '#374151';
            } else {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchQuery = searchInput ? searchInput.value : '';
            const message = currentLang === 'zh' 
                ? `正在筛选: ${searchQuery || '所有商品'}` 
                : `Filtering: ${searchQuery || 'All products'}`;
            showToast(message, 'info');
        });
    }
}

/**
 * 监听来自父窗口的语言变更消息
 */
function initLanguageListener() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'LANGUAGE_CHANGE') {
            updateLanguage(event.data.language);
        }
    });
}

/**
 * 初始化所有功能
 */
function initDAppCommon() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DApp common functions initializing...');
        
        // 初始化各个功能模块
        initLanguageListener();
        
        console.log('DApp common functions initialized');
    });
}

// 自动初始化
initDAppCommon();

// 导出主要函数供其他模块使用
window.DAppCommon = {
    updateLanguage,
    showToast,
    getCategoryDisplayName
};

// ==================== 推荐商品功能 ====================

// 推荐商品相关变量
let recommendationData = [];
let currentRecommendationPage = 0;
const recommendationItemsPerPage = 10;

// 初始化推荐商品
function initRecommendations() {
    generateRecommendationData();
    renderRecommendations();
    setupRecommendationNavigation();
}

// 生成推荐商品数据
function generateRecommendationData() {
    const categories = ['区块链开发', 'Web3技术', '智能合约', 'DeFi协议', 'NFT创作', '加密货币', '去中心化应用', '元宇宙开发'];
    const titles = [
        'Solidity智能合约开发实战',
        'Web3前端开发完整指南', 
        'DeFi协议设计与实现',
        'NFT市场开发教程',
        'Ethereum开发者指南',
        'React DApp开发实战',
        '加密钱包开发教程',
        '去中心化交易所开发',
        'Layer2扩容解决方案',
        'DAO治理机制设计',
        'MetaMask集成开发',
        '跨链桥技术实现',
        'Polygon开发实战',
        'Chainlink预言机集成',
        'IPFS分布式存储',
        'Web3游戏开发指南',
        'DeFi流动性挖矿',
        'NFT艺术创作平台',
        'DAO投票系统开发',
        '区块链安全审计'
    ];
    
    const images = [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=300&h=200&fit=crop'
    ];
    
    const badges = ['hot', 'new', 'sale', null];
    const badgeTexts = { hot: '热门', new: '新品', sale: '特价' };
    
    recommendationData = [];
    for (let i = 0; i < 20; i++) {
        const originalPrice = Math.floor(Math.random() * 400) + 200;
        const currentPrice = Math.floor(originalPrice * (0.6 + Math.random() * 0.3));
        const discount = Math.floor((1 - currentPrice / originalPrice) * 100);
        const rating = (4.0 + Math.random() * 1.0).toFixed(1);
        const sales = Math.floor(Math.random() * 2000) + 100;
        const badge = badges[Math.floor(Math.random() * badges.length)];
        
        recommendationData.push({
            id: i + 1,
            title: titles[i % titles.length],
            category: categories[Math.floor(Math.random() * categories.length)],
            image: images[i % images.length],
            currentPrice: currentPrice,
            originalPrice: originalPrice,
            discount: discount,
            rating: parseFloat(rating),
            sales: sales,
            badge: badge,
            badgeText: badge ? badgeTexts[badge] : null
        });
    }
}

// 渲染推荐商品
function renderRecommendations() {
    const container = document.getElementById('recommendationGrid');
    if (!container) return;
    
    const startIndex = currentRecommendationPage * recommendationItemsPerPage;
    const endIndex = startIndex + recommendationItemsPerPage;
    const currentItems = recommendationData.slice(startIndex, endIndex);
    
    // 显示骨架屏
    showSkeletonScreen();
    
    // 模拟加载延迟
    setTimeout(() => {
        container.innerHTML = '';
        
        currentItems.forEach((item, index) => {
            const itemElement = createRecommendationItem(item, index);
            container.appendChild(itemElement);
        });
        
        // 确保动画正确触发
        setTimeout(() => {
            const items = container.querySelectorAll('.recommendation-item');
            items.forEach((item, index) => {
                // 重置动画状态
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                // 设置动画延迟并触发动画
                setTimeout(() => {
                    item.style.transition = 'all 0.6s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, (index + 1) * 100);
            });
        }, 50);
        
        updateRecommendationNavigationButtons();
    }, 800);
}

// 创建推荐商品项目
function createRecommendationItem(item, index = 0) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'recommendation-item';
    itemDiv.onclick = () => viewRecommendationDetail(item);
    
    // 设置初始状态（用于动画）
    itemDiv.style.opacity = '0';
    itemDiv.style.transform = 'translateY(30px)';
    
    const stars = generateStars(item.rating);
    const badgeHtml = item.badge ? `<div class="recommendation-badge ${item.badge}">${item.badgeText}</div>` : '';
    
    itemDiv.innerHTML = `
        <div class="recommendation-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            ${badgeHtml}
        </div>
        <div class="recommendation-content">
            <h3 class="recommendation-title">${item.title}</h3>
            <div class="recommendation-category">${item.category}</div>
            <div class="recommendation-meta">
                <div class="recommendation-price">${item.currentPrice}</div>
                <div class="recommendation-rating">
                    <div class="recommendation-stars">${stars}</div>
                    <span class="recommendation-rating-text">${item.rating}</span>
                </div>
            </div>
            <button class="recommendation-buy-btn" onclick="event.stopPropagation(); addRecommendationToCart(${item.id})">
                立即购买
            </button>
        </div>
    `;
    
    return itemDiv;
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // 满星
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // 半星
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 空星
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// 显示骨架屏
function showSkeletonScreen() {
    const container = document.getElementById('recommendationGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < recommendationItemsPerPage; i++) {
        const skeletonDiv = document.createElement('div');
        skeletonDiv.className = 'recommendation-skeleton';
        skeletonDiv.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-price"></div>
                <div class="skeleton-rating"></div>
            </div>
        `;
        container.appendChild(skeletonDiv);
    }
}

// 设置导航按钮事件
function setupRecommendationNavigation() {
    const prevBtn = document.getElementById('recommendationPrevBtn');
    const nextBtn = document.getElementById('recommendationNextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentRecommendationPage > 0) {
                currentRecommendationPage--;
                renderRecommendations();
                updateRecommendationPagination();
                showToast('已切换到上一页推荐', 'info');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(recommendationData.length / recommendationItemsPerPage) - 1;
            if (currentRecommendationPage < maxPage) {
                currentRecommendationPage++;
                renderRecommendations();
                updateRecommendationPagination();
                showToast('已切换到下一页推荐', 'info');
            }
        });
    }
    
    // 初始化分页信息
    updateRecommendationPagination();
}

// 更新推荐商品分页信息
function updateRecommendationPagination() {
    const totalItems = recommendationData.length; // 使用实际数据长度
    const startIndex = currentRecommendationPage * recommendationItemsPerPage + 1;
    const endIndex = Math.min((currentRecommendationPage + 1) * recommendationItemsPerPage, totalItems);
    
    // 更新分页信息显示
    const currentRangeElement = document.getElementById('recommendationCurrentRange');
    const totalCountElement = document.getElementById('recommendationTotalCount');
    
    if (currentRangeElement) {
        currentRangeElement.textContent = `${startIndex}-${endIndex}`;
    }
    
    if (totalCountElement) {
        totalCountElement.textContent = totalItems;
    }
    
    // 更新页码按钮
    updateRecommendationPageNumbers();
}

// 更新页码按钮
function updateRecommendationPageNumbers() {
    const totalPages = Math.ceil(recommendationData.length / recommendationItemsPerPage);
    const numbersContainer = document.getElementById('recommendationPageNumbers');
    
    if (!numbersContainer) return;
    
    numbersContainer.innerHTML = '';
    
    // 计算显示的页码范围
    let startPage = Math.max(0, currentRecommendationPage - 1);
    let endPage = Math.min(totalPages - 1, currentRecommendationPage + 1);
    
    // 确保显示3个页码（如果可能）
    if (endPage - startPage < 2) {
        if (startPage === 0) {
            endPage = Math.min(totalPages - 1, startPage + 2);
        } else {
            startPage = Math.max(0, endPage - 2);
        }
    }
    
    // 添加页码按钮
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-number ${i === currentRecommendationPage ? 'active' : ''}`;
        btn.textContent = i + 1;
        btn.addEventListener('click', () => {
            if (i !== currentRecommendationPage) {
                currentRecommendationPage = i;
                renderRecommendations();
                updateRecommendationPagination();
                showToast(`已切换到第${i + 1}页推荐`, 'info');
            }
        });
        numbersContainer.appendChild(btn);
    }
    
    // 添加省略号和最后一页（如果需要）
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            numbersContainer.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'pagination-number';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentRecommendationPage = totalPages - 1;
            renderRecommendations();
            updateRecommendationPagination();
            showToast(`已切换到第${totalPages}页推荐`, 'info');
        });
        numbersContainer.appendChild(lastBtn);
    }
}

// 更新导航按钮状态
function updateRecommendationNavigationButtons() {
    const prevBtn = document.getElementById('recommendationPrevBtn');
    const nextBtn = document.getElementById('recommendationNextBtn');
    const maxPage = Math.ceil(recommendationData.length / recommendationItemsPerPage) - 1;
    
    if (prevBtn) {
        prevBtn.disabled = currentRecommendationPage === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentRecommendationPage === maxPage;
    }
}

// 查看推荐商品详情
function viewRecommendationDetail(item) {
    showToast(`正在查看《${item.title}》详情...`, 'info');
    setTimeout(() => {
        window.location.href = `product-detail.html?id=${item.id}`;
    }, 1000);
}

// 推荐商品操作函数
function addRecommendationToCart(itemId) {
    const item = recommendationData.find(item => item.id === itemId);
    if (item) {
        showToast(`《${item.title}》已加入购物车`, 'success');
    }
}

function toggleRecommendationFavorite(itemId) {
    const item = recommendationData.find(item => item.id === itemId);
    if (item) {
        showToast(`《${item.title}》已加入收藏`, 'success');
    }
} 