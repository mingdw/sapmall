/* 活动记录功能 */

// 活动记录对象
const ActivityLog = {
    // 初始化
    init: function() {
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
        // 活动类型筛选按钮
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', this.handleFilterClick);
        });
        
        // 活动搜索框
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch);
        }
        
        // 分页按钮
        const paginationButtons = document.querySelectorAll('.pagination-btn');
        paginationButtons.forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', this.handlePagination);
            }
        });
    },
    
    // 处理筛选点击
    handleFilterClick: function() {
        // 移除所有筛选按钮的活跃状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加当前按钮的活跃状态
        this.classList.add('active');
        
        // 获取筛选类型
        const filterType = this.getAttribute('data-filter');
        
        // 筛选活动项
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            if (filterType === 'all') {
                item.style.display = 'flex';
            } else {
                if (item.classList.contains(filterType)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
        
        // 更新分页信息
        ActivityLog.updatePaginationInfo();
    },
    
    // 处理搜索
    handleSearch: function() {
        const searchTerm = this.value.toLowerCase().trim();
        const activityItems = document.querySelectorAll('.activity-item');
        
        activityItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const details = item.querySelector('p').textContent.toLowerCase();
            const matchesSearch = title.includes(searchTerm) || details.includes(searchTerm);
            
            // 检查当前活跃的筛选器
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const matchesFilter = activeFilter === 'all' || item.classList.contains(activeFilter);
            
            // 同时满足搜索和筛选条件才显示
            if (matchesSearch && matchesFilter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // 更新分页信息
        ActivityLog.updatePaginationInfo();
    },
    
    // 处理分页
    handlePagination: function() {
        // 这里可以实现分页逻辑
        // 简单模拟分页效果
        const isNext = this.querySelector('.fa-chevron-right');
        const paginationInfo = document.querySelector('.pagination-info');
        
        if (isNext) {
            paginationInfo.textContent = '显示 7-12 / 24';
            document.querySelector('.pagination-btn:first-child').disabled = false;
        } else {
            paginationInfo.textContent = '显示 1-6 / 24';
            this.disabled = true;
        }
    },
    
    // 更新分页信息
    updatePaginationInfo: function() {
        const visibleItems = document.querySelectorAll('.activity-item[style="display: flex;"]').length;
        const paginationInfo = document.querySelector('.pagination-info');
        
        if (paginationInfo) {
            if (visibleItems === 0) {
                paginationInfo.textContent = '没有匹配的活动记录';
            } else {
                paginationInfo.textContent = `显示 1-${visibleItems} / ${visibleItems}`;
            }
        }
        
        // 如果筛选/搜索后只有一页内容，禁用分页按钮
        const paginationButtons = document.querySelectorAll('.pagination-btn');
        if (visibleItems <= 6) {
            paginationButtons.forEach(btn => {
                btn.disabled = true;
            });
        } else {
            // 启用下一页按钮
            paginationButtons[1].disabled = false;
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    ActivityLog.init();
}); 