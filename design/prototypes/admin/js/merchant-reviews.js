/**
 * 商家评价管理系统
 * 基于Sapphire Mall区块链电商平台
 */
class MerchantReviewsManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 5;
        this.totalPages = 0;
        this.currentFilters = {
            rating: '',
            content: '',
            reply: '',
            search: ''
        };
        this.replyingReviewId = null;

        this.mockReviews = this.generateMockReviews();
        this.filteredReviews = [...this.mockReviews];

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderAll();
        
        setTimeout(() => {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            this.reportHeight();
        }, 1000);
    }

    bindEvents() {
        document.getElementById('searchInput').addEventListener('input', this.debounce(() => {
            this.currentFilters.search = document.getElementById('searchInput').value;
            this.applyFilters();
        }, 300));

        ['ratingFilter', 'contentFilter', 'replyFilter'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                const filterType = id.replace('Filter', '');
                this.currentFilters[filterType] = e.target.value;
                this.applyFilters();
            });
        });

        document.getElementById('clearFiltersBtn').addEventListener('click', () => this.clearFilters());
    }
    
    generateMockReviews() {
        const reviews = [];
        const users = [
            { name: 'CryptoExplorer', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=128&h=128&facepad=2' },
            { name: 'NFTCollector123', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=128&h=128&facepad=2' },
            { name: 'DigitalDreamer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=128&h=128&facepad=2' },
            { name: '区块链爱好者', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=128&h=128&facepad=2' },
            { name: '元宇宙漫游者', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=128&h=128&facepad=2' },
        ];
        const products = [
            { name: 'NFT艺术作品 #001', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80' },
            { name: '在线设计课程', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=100&q=80' },
            { name: '游戏道具包', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=100&q=80' },
        ];
        const reviewContents = [
            { text: '这件NFT作品的细节真是太棒了，完全超出了我的预期！艺术家的创造力令人惊叹。', hasContent: true, hasImage: true, images: [
                'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=80',
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'
            ] },
            { text: '课程内容非常实用，干货满满，讲师的讲解也非常清晰易懂，推荐给所有想学习设计的朋友。', hasContent: true, hasImage: false, images: [] },
            { text: '游戏道具发货速度很快，客服服务态度也很好，在游戏里用起来效果拔群！', hasContent: true, hasImage: false, images: [] },
            { text: '好评！', hasContent: true, hasImage: false, images: [] },
            { text: '', hasContent: false, hasImage: false, images: [] },
        ];

        for (let i = 1; i <= 28; i++) {
            const user = users[i % users.length];
            const product = products[i % products.length];
            const content = reviewContents[i % reviewContents.length];
            const rating = content.hasContent ? Math.floor(Math.random() * 2) + 4 : 5; // 4-5 stars for content reviews, 5 for default
            const replied = Math.random() > 0.5;
            const daysAgo = Math.floor(Math.random() * 60);
            const reviewDate = new Date();
            reviewDate.setDate(reviewDate.getDate() - daysAgo);

            reviews.push({
                id: `REV${String(i).padStart(4, '0')}`,
                user,
                product,
                rating,
                ...content,
                createdAt: reviewDate,
                replied,
                replyText: replied ? '感谢您的支持！您的满意是我们最大的动力，期待您的再次光临！' : '',
                replyAt: replied ? new Date(reviewDate.getTime() + 24 * 60 * 60 * 1000) : null,
                featured: false
            });
        }
        return reviews.sort((a, b) => b.createdAt - a.createdAt);
    }

    applyFilters() {
        const { rating, content, reply, search } = this.currentFilters;
        const searchTerm = search.toLowerCase();

        this.filteredReviews = this.mockReviews.filter(review => {
            const ratingMatch = !rating || review.rating == rating;
            
            const contentMatch = !content || 
                (content === 'with_content' && review.hasContent) ||
                (content === 'with_image' && review.hasImage) ||
                (content === 'default' && !review.hasContent);
            
            const replyMatch = !reply || 
                (reply === 'replied' && review.replied) ||
                (reply === 'not_replied' && !review.replied);

            const searchMatch = !searchTerm ||
                review.user.name.toLowerCase().includes(searchTerm) ||
                review.product.name.toLowerCase().includes(searchTerm) ||
                review.text.toLowerCase().includes(searchTerm);

            return ratingMatch && contentMatch && replyMatch && searchMatch;
        });

        this.currentPage = 1;
        this.renderAll();
    }

    renderAll() {
        this.renderStatistics();
        this.renderReviews();
        this.renderPagination();
        this.reportHeight();
    }

    renderStatistics() {
        const total = this.mockReviews.length;
        const avgRating = (this.mockReviews.reduce((sum, r) => sum + r.rating, 0) / total || 0).toFixed(1);
        const reviewsWithContent = Math.round(this.mockReviews.filter(r => r.hasContent).length / total * 100);
        const responseRate = Math.round(this.mockReviews.filter(r => r.replied).length / total * 100);

        document.getElementById('avgRating').textContent = avgRating;
        document.getElementById('totalReviews').textContent = total;
        document.getElementById('reviewsWithContent').textContent = `${reviewsWithContent}%`;
        document.getElementById('responseRate').textContent = `${responseRate}%`;
    }

    renderReviews() {
        const container = document.getElementById('reviewsList');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');

        this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const pageReviews = this.filteredReviews.slice(startIndex, startIndex + this.pageSize);

        if (pageReviews.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'flex';
            pagination.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        pagination.style.display = 'flex';

        container.innerHTML = pageReviews.map(review => this.createReviewItemHTML(review)).join('');
    }
    
    createReviewItemHTML(review) {
        const ratingHTML = Array(5).fill(0).map((_, i) => 
            `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
        // 精选角标
        const featuredMark = review.featured ? `<div class="featured-badge-sm"><i class="fas fa-gem"></i> 精选</div>` : '';
        // 顶部信息
        const topInfo = `
            <div class="review-top-row">
                <img src="${review.user.avatar}" alt="${review.user.name}" class="user-avatar-sm" onerror="this.style.display='none'">
                <span class="user-name-sm">${review.user.name}</span>
                <span class="review-rating-sm">${ratingHTML}</span>
                <span class="review-time-sm">${this.formatDate(review.createdAt)}</span>
            </div>`;
        // 内容区
        let content = `<div class="review-content-sm">${review.text || '用户未填写评价内容'}</div>`;
        // 图片
        const imagesHTML = review.hasImage ? `
            <div class="review-images-sm">
                ${review.images.slice(0,4).map(src => `<img src="${src}" alt="Review image" class="review-image-item-sm" onclick="ReviewsManager.showImagePreview('${src}')" onerror="this.style.display='none'">`).join('')}
            </div>` : '';
        // 商品信息区
        const productType = review.product.name.includes('NFT') ? '艺术' : (review.product.name.includes('课程') ? '教育' : '游戏');
        const badge = `<span class="product-badge-sm">${productType}</span>`;
        const productCard = `<div class="review-product-sm"><img src="${review.product.image}" alt="${review.product.name}" class="product-image-sm" onerror="this.style.display='none'"><span class="product-name-sm">${review.product.name}</span>${badge}</div>`;
        // 商家回复
        const replyHTML = review.replied ? `
            <div class="merchant-reply-sm">
                <span class="merchant-reply-label"><i class="fas fa-store"></i> 商家回复：</span>
                <span class="merchant-reply-body-sm">${review.replyText}</span>
            </div>` : '';
        // 内嵌回复框
        let replyBox = '';
        if (this.replyingReviewId === review.id && !review.replied) {
            replyBox = `<div class="reply-box-sm">
                <div class="reply-original-sm"><span>${review.user.name}：</span>${review.text || '用户未填写评价内容'}</div>
                <textarea class="reply-textarea-sm" id="replyTextarea-${review.id}" placeholder="请输入您的回复..."></textarea>
                <div class="reply-btns-sm">
                    <button class="admin-btn admin-btn-outline admin-btn-xs" onclick="ReviewsManager.cancelReply()">取消</button>
                    <button class="admin-btn admin-btn-primary admin-btn-xs" onclick="ReviewsManager.submitReply('${review.id}')">提交回复</button>
                </div>
            </div>`;
        }
        // 操作按钮
        const ops = `<div class="review-ops-sm">
            <button class="admin-btn admin-btn-outline admin-btn-xs featured-btn${review.featured ? ' active' : ''}" onclick="ReviewsManager.toggleFeature('${review.id}')"><i class="far fa-gem"></i> ${review.featured ? '取消精选' : '精选'}</button>
            ${!review.replied ? `<button class="admin-btn admin-btn-primary admin-btn-xs" onclick="ReviewsManager.handleReply('${review.id}')"><i class="fas fa-reply"></i> 回复</button>` : ''}
        </div>`;
        // 底部一行
        const bottomRow = `<div class="review-bottom-row">${ops}</div>`;
        return `<div class="review-item-sm${review.featured ? ' featured' : ''}" id="review-${review.id}">${featuredMark}${topInfo}${content}${imagesHTML}${productCard}${replyHTML}${replyBox}${bottomRow}</div>`;
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let pages = '';
        for (let i = 1; i <= this.totalPages; i++) {
            pages += `<button class="pagination-page ${i === this.currentPage ? 'active' : ''}" onclick="ReviewsManager.goToPage(${i})">${i}</button>`;
        }

        container.innerHTML = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="ReviewsManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="pagination-pages">${pages}</div>
            <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} onclick="ReviewsManager.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderReviews();
        this.renderPagination();
        this.reportHeight();
    }

    handleReply(reviewId) {
        this.replyingReviewId = reviewId;
        this.renderReviews();
        this.renderPagination();
        this.reportHeight();
        setTimeout(()=>{
            const ta = document.getElementById('replyTextarea-' + reviewId);
            if(ta) ta.focus();
        }, 100);
    }

    cancelReply() {
        this.replyingReviewId = null;
        this.renderReviews();
        this.renderPagination();
        this.reportHeight();
    }

    submitReply(reviewId) {
        const ta = document.getElementById('replyTextarea-' + reviewId);
        if (!ta || !ta.value.trim()) return;
        const review = this.mockReviews.find(r => r.id === reviewId);
        if (review) {
            review.replied = true;
            review.replyText = ta.value.trim();
            review.replyAt = new Date();
        }
        this.replyingReviewId = null;
        this.applyFilters();
        setTimeout(() => {
            const el = document.getElementById('review-' + reviewId);
            if (el) {
                el.classList.add('highlighted');
                el.scrollIntoView({behavior:'smooth',block:'center'});
                setTimeout(()=>el.classList.remove('highlighted'), 1800);
            }
        }, 200);
    }
    
    clearFilters() {
        this.currentFilters = { rating: '', content: '', reply: '', search: '' };
        document.getElementById('searchInput').value = '';
        document.getElementById('ratingFilter').value = '';
        document.getElementById('contentFilter').value = '';
        document.getElementById('replyFilter').value = '';
        this.applyFilters();
    }

    // 辅助方法
    debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    }
    
    reportHeight() {
        if (window.parent.reportHeight) {
            setTimeout(() => window.parent.reportHeight(), 200);
        }
    }
    
    // 图片点击放大预览
    showImagePreview(src) {
        if (!document.getElementById('imagePreviewModal')) {
            const modal = document.createElement('div');
            modal.id = 'imagePreviewModal';
            modal.className = 'modal active';
            modal.innerHTML = `<div class='modal-content' style='max-width:520px;'><span class='close-modal' onclick='ReviewsManager.hideImagePreview()'>&times;</span><img id='previewImg' src='' style='width:100%;border-radius:12px;box-shadow:0 2px 16px #0008;'/></div>`;
            document.body.appendChild(modal);
        }
        document.getElementById('previewImg').src = src;
        document.getElementById('imagePreviewModal').classList.add('active');
    }
    static hideImagePreview() {
        const modal = document.getElementById('imagePreviewModal');
        if (modal) modal.classList.remove('active');
    }

    // 评价内容折叠/展开
    handleExpandToggle(reviewId) {
        const el = document.getElementById('review-' + reviewId);
        if (el) el.classList.toggle('expanded');
    }

    toggleFeature(reviewId) {
        const review = this.mockReviews.find(r => r.id === reviewId);
        if (review) {
            review.featured = !review.featured;
        }
        const el = document.getElementById('review-' + reviewId);
        if (el) {
            el.classList.add('feature-anim');
            setTimeout(()=>el.classList.remove('feature-anim'), 700);
        }
        this.renderReviews();
        this.renderPagination();
        this.reportHeight();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.reviewsManagerInstance = new MerchantReviewsManager();
});

// 全局可访问的静态代理
const ReviewsManager = {
    handleReply: function(id){window.reviewsManagerInstance?.handleReply(id)},
    cancelReply: function(){window.reviewsManagerInstance?.cancelReply()},
    submitReply: function(id){window.reviewsManagerInstance?.submitReply(id)},
    showImagePreview: function(src){window.reviewsManagerInstance?.showImagePreview(src)},
    hideImagePreview: MerchantReviewsManager.hideImagePreview,
    handleExpandToggle: function(id){window.reviewsManagerInstance?.handleExpandToggle(id)},
    toggleFeature: function(id){window.reviewsManagerInstance?.toggleFeature(id)}
}; 