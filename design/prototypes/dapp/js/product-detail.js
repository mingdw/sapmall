/**
 * Product Detail Page Scripts
 * 
 * Contains all interactive features for product detail page
 * Dependencies: dapp-common.js
 * 
 * @author: Sapphire Mall Team
 * @version: 1.0.0
 */

// ==================== Global Variables ====================
let currentImageIndex = 0;
let selectedSpecs = {
    version: 'basic',
    language: 'chinese'
};
let isFavorited = false;
let isInitialized = false;

// ==================== Configuration Constants ====================
const CONFIG = {
    MAX_QUANTITY: 99,
    MIN_QUANTITY: 1,
    ZOOM_SCALE: 2.5,
    ANIMATION_DURATION: 300,
    PRICE_MAPPING: {
        basic: 299,
        pro: 499,
        ultimate: 799
    }
};

// ==================== Mock Data ====================
const mockReviews = [
    {
        id: 1,
        user: {
            name: 'CryptoLearner',
            avatar: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            verified: true
        },
        rating: 5,
        date: '2024-03-15',
        content: 'Course content is very detailed and easy to understand. Great for beginners!',
        specs: 'Basic Version · Chinese',
        helpful: 23,
        images: [
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
        ]
    },
    {
        id: 2,
        user: {
            name: 'BlockchainDev',
            avatar: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',
            verified: false
        },
        rating: 5,
        date: '2024-03-12',
        content: 'As a developer with programming background, this course helped me quickly master blockchain development.',
        specs: 'Pro Version · Chinese',
        helpful: 18,
        images: []
    },
    {
        id: 3,
        user: {
            name: 'Web3Explorer',
            avatar: '0x8d3B5AD5c4795c026514f8317c7a215E218DcCD6',
            verified: true
        },
        rating: 4,
        date: '2024-03-10',
        content: 'High quality course, but might be a bit challenging for complete beginners.',
        specs: 'Basic Version · English',
        helpful: 12,
        images: [
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop'
        ]
    }
];

// ==================== Core Functions ====================

/**
 * Breadcrumb navigation functionality
 */
function initBreadcrumb() {
    try {
        const params = getUrlParams();
        const breadcrumbs = generateBreadcrumbData(params);
        renderBreadcrumb(breadcrumbs);
        
        // Update product name
        if (params.name) {
            updateBreadcrumbProductName(decodeURIComponent(params.name));
        }
        
    } catch (error) {
        console.error('Breadcrumb initialization failed:', error);
    }
}

/**
 * Generate breadcrumb data
 */
function generateBreadcrumbData(params) {
    const breadcrumbs = [
        { text: 'Home', href: '../dapp.html', icon: 'fas fa-home' }
    ];
    
    // Add category based on parameters
    if (params.category) {
        const categoryName = decodeURIComponent(params.category);
        const category = detectCategoryFromProduct(categoryName);
        breadcrumbs.push({
            text: category.name,
            href: `marketplace.html?category=${params.category}`,
            icon: category.icon
        });
        
        // Add subcategory
        if (params.subcategory) {
            const subcategoryName = decodeURIComponent(params.subcategory);
            breadcrumbs.push({
                text: subcategoryName,
                href: `marketplace.html?category=${params.category}&subcategory=${params.subcategory}`
            });
        }
    }
    
    return breadcrumbs;
}

/**
 * Detect category from product name
 */
function detectCategoryFromProduct(productName) {
    const categories = {
        'online-courses': { name: 'Online Courses', icon: 'fas fa-graduation-cap' },
        'art-design': { name: 'Art & Design', icon: 'fas fa-palette' },
        'game-items': { name: 'Game Items', icon: 'fas fa-gamepad' },
        'vr-ar': { name: 'VR/AR', icon: 'fas fa-vr-cardboard' },
        'dev-tools': { name: 'Dev Tools', icon: 'fas fa-code' },
        'data-analysis': { name: 'Data Analysis', icon: 'fas fa-chart-bar' }
    };
    
    // Detect category based on product name keywords
    for (const [key, value] of Object.entries(categories)) {
        if (productName.includes(key) || productName.includes(value.name)) {
            return value;
        }
    }
    
    return categories['online-courses']; // Default category
}

/**
 * Render breadcrumb navigation
 */
function renderBreadcrumb(breadcrumbs) {
    const nav = document.getElementById('breadcrumbNav');
    if (!nav) return;
    
    nav.innerHTML = '';
    
    breadcrumbs.forEach((item, index) => {
        // Add link
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'breadcrumb-link';
        link.target = '_parent';
        
        if (item.icon) {
            link.innerHTML = `<i class="${item.icon} mr-1"></i>${item.text}`;
        } else {
            link.textContent = item.text;
        }
        
        nav.appendChild(link);
        
        // Add separator (except for last item)
        if (index < breadcrumbs.length - 1) {
            const separator = document.createElement('i');
            separator.className = 'fas fa-chevron-right text-gray-500';
            nav.appendChild(separator);
        }
    });
}

/**
 * Update product name in breadcrumb
 */
function updateBreadcrumbProductName(productName) {
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    if (productBreadcrumb) {
        productBreadcrumb.textContent = productName;
    }
}

/**
 * Get URL parameters
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        category: params.get('category'),
        subcategory: params.get('subcategory'),
        name: params.get('name')
    };
}

/**
 * Show message notification
 */
function showMessage(message, type = 'info') {
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Image zoom functionality
 */
function initImageZoom() {
    const mainImage = document.getElementById('mainProductImage');
    const zoomLens = document.getElementById('zoomLens');
    const zoomContainer = document.getElementById('zoomContainer');
    const zoomImage = document.getElementById('zoomImage');
    
    if (!mainImage || !zoomLens || !zoomContainer || !zoomImage) {
        console.warn('Zoom elements incomplete, skipping initialization');
        return;
    }
    
    // Position adjustment function
    function positionZoomContainer() {
        const imageRect = mainImage.getBoundingClientRect();
        const containerRect = mainImage.closest('.lg\\:col-span-3').getBoundingClientRect();
        
        // Set zoom container position
        zoomContainer.style.left = `${imageRect.width + 20}px`;
        zoomContainer.style.top = '0px';
        zoomContainer.style.width = `${Math.min(imageRect.width, containerRect.width - imageRect.width - 40)}px`;
        zoomContainer.style.height = `${imageRect.height}px`;
    }
    
    // Mouse enter event
    mainImage.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) { // Only enable on desktop
            positionZoomContainer();
            zoomLens.style.display = 'block';
            zoomContainer.style.display = 'block';
            zoomImage.style.backgroundImage = `url(${mainImage.src})`;
        }
    });
    
    // Mouse leave event
    mainImage.addEventListener('mouseleave', () => {
        zoomLens.style.display = 'none';
        zoomContainer.style.display = 'none';
    });
    
    // Mouse move event
    mainImage.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return; // Don't enable on mobile
        
        const rect = mainImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate zoom lens position
        const lensSize = 100;
        const lensX = Math.max(0, Math.min(x - lensSize/2, rect.width - lensSize));
        const lensY = Math.max(0, Math.min(y - lensSize/2, rect.height - lensSize));
        
        // Set zoom lens position
        zoomLens.style.left = `${lensX}px`;
        zoomLens.style.top = `${lensY}px`;
        
        // Calculate zoomed image background position
        const bgX = (lensX / rect.width) * 100;
        const bgY = (lensY / rect.height) * 100;
        
        zoomImage.style.backgroundPosition = `${bgX}% ${bgY}%`;
        zoomImage.style.backgroundSize = `${rect.width * CONFIG.ZOOM_SCALE}px ${rect.height * CONFIG.ZOOM_SCALE}px`;
    });
    
    // Reposition on window resize
    window.addEventListener('resize', debounce(positionZoomContainer, 100));
}

/**
 * Thumbnail functionality
 */
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailScroll = document.getElementById('thumbnailScroll');
    const prevBtn = document.getElementById('thumbnailPrev');
    const nextBtn = document.getElementById('thumbnailNext');
    
    if (!thumbnails.length || !mainImage) {
        console.warn('Thumbnail elements incomplete');
        return;
    }
    
    // Thumbnail click events
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove all active classes
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to current thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const largeImageSrc = thumbnail.getAttribute('data-large');
            if (largeImageSrc) {
                mainImage.src = largeImageSrc;
                currentImageIndex = index;
            }
            
            // Add transition animation
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
    
    // Thumbnail navigation functionality
    function switchThumbnail(direction) {
        const scrollAmount = 100;
        const currentScroll = thumbnailScroll.scrollLeft;
        
        if (direction === 'prev') {
            thumbnailScroll.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: 'smooth'
            });
        } else {
            thumbnailScroll.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Update button states
        setTimeout(() => {
            const maxScroll = thumbnailScroll.scrollWidth - thumbnailScroll.clientWidth;
            prevBtn.style.opacity = thumbnailScroll.scrollLeft > 0 ? '1' : '0.5';
            nextBtn.style.opacity = thumbnailScroll.scrollLeft < maxScroll ? '1' : '0.5';
        }, 300);
    }
    
    // Bind navigation button events
    if (prevBtn) {
        prevBtn.addEventListener('click', () => switchThumbnail('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => switchThumbnail('next'));
    }
    
    // Initialize button states
    if (thumbnailScroll) {
        const maxScroll = thumbnailScroll.scrollWidth - thumbnailScroll.clientWidth;
        prevBtn.style.opacity = '0.5';
        nextBtn.style.opacity = maxScroll > 0 ? '1' : '0.5';
    }
}

/**
 * Tab switching functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!tabButtons.length || !tabPanes.length) {
        console.warn('Tab elements incomplete');
        return;
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove all active classes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.classList.add('hidden');
            });
            
            // Activate current tab
            button.classList.add('active');
            const targetPane = document.getElementById(`${targetTab}-tab`);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                targetPane.classList.add('active');
            }
            
            // Load reviews if reviews tab
            if (targetTab === 'reviews') {
                loadReviews();
            }
            
            showMessage(`Switched to ${button.textContent.trim()}`, 'info');
        });
    });
}

/**
 * Specification selection functionality
 */
function initSpecs() {
    const specButtons = document.querySelectorAll('[data-spec]');
    
    if (!specButtons.length) {
        console.warn('Spec selection elements not found');
        return;
    }
    
    specButtons.forEach(button => {
        button.addEventListener('click', () => {
            const specType = button.getAttribute('data-spec');
            const specValue = button.getAttribute('data-value');
            
            // Remove active class from same type specs
            document.querySelectorAll(`[data-spec="${specType}"]`).forEach(btn => {
                btn.classList.remove('spec-btn-active');
            });
            
            // Add active class to current button
            button.classList.add('spec-btn-active');
            
            // Update selected specs
            selectedSpecs[specType] = specValue;
            
            // Update price
            updatePrice();
            
            // Show selection notification
            const specText = getSpecDisplayText(specType, specValue);
            showMessage(`Selected ${specText}`, 'info');
        });
    });
}

/**
 * Get spec display text
 */
function getSpecDisplayText(specType, specValue) {
    const specTexts = {
        version: {
            basic: 'Basic Version',
            pro: 'Pro Version',
            ultimate: 'Ultimate Version'
        },
        language: {
            chinese: 'Chinese',
            english: 'English'
        }
    };
    
    return specTexts[specType]?.[specValue] || specValue;
}

/**
 * Update price display
 */
function updatePrice() {
    const priceElement = document.getElementById('productPrice');
    if (!priceElement) return;
    
    const basePrice = CONFIG.PRICE_MAPPING[selectedSpecs.version] || CONFIG.PRICE_MAPPING.basic;
    const quantity = parseInt(document.getElementById('quantityInput')?.value || 1);
    const totalPrice = basePrice * quantity;
    
    // Add price change animation
    priceElement.style.transform = 'scale(1.1)';
    priceElement.style.color = '#ef4444';
    
    setTimeout(() => {
        priceElement.textContent = totalPrice;
        priceElement.style.transform = 'scale(1)';
    }, 150);
}

/**
 * Quantity control functionality
 */
function initQuantityControl() {
    const quantityInput = document.getElementById('quantityInput');
    const decreaseBtn = document.querySelector('.quantity-btn-compact:first-child');
    const increaseBtn = document.querySelector('.quantity-btn-compact:last-child');
    
    if (!quantityInput) {
        console.warn('Quantity input not found');
        return;
    }
    
    // Validate quantity function
    function validateQuantity() {
        let value = parseInt(quantityInput.value);
        
        if (isNaN(value) || value < CONFIG.MIN_QUANTITY) {
            value = CONFIG.MIN_QUANTITY;
        } else if (value > CONFIG.MAX_QUANTITY) {
            value = CONFIG.MAX_QUANTITY;
        }
        
        quantityInput.value = value;
        return value;
    }
    
    // Update button states
    function updateButtonStates() {
        const value = parseInt(quantityInput.value);
        
        if (decreaseBtn) {
            decreaseBtn.disabled = value <= CONFIG.MIN_QUANTITY;
            decreaseBtn.style.opacity = value <= CONFIG.MIN_QUANTITY ? '0.5' : '1';
        }
        
        if (increaseBtn) {
            increaseBtn.disabled = value >= CONFIG.MAX_QUANTITY;
            increaseBtn.style.opacity = value >= CONFIG.MAX_QUANTITY ? '0.5' : '1';
        }
    }
    
    // Trigger quantity change event
    function triggerQuantityChange() {
        validateQuantity();
        updateButtonStates();
        updatePrice();
    }
    
    // Input events
    quantityInput.addEventListener('input', triggerQuantityChange);
    quantityInput.addEventListener('blur', triggerQuantityChange);
    
    // Global functions for button calls
    window.decreaseQuantity = () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > CONFIG.MIN_QUANTITY) {
            quantityInput.value = currentValue - 1;
            triggerQuantityChange();
        }
    };
    
    window.increaseQuantity = () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < CONFIG.MAX_QUANTITY) {
            quantityInput.value = currentValue + 1;
            triggerQuantityChange();
        }
    };
    
    // Initialize state
    triggerQuantityChange();
}

/**
 * Load review data
 */
function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    // Clear existing content
    reviewsList.innerHTML = '';
    
    // Add review items
    mockReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsList.appendChild(reviewElement);
    });
}

/**
 * Create review element
 */
function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    
    // Generate star rating
    const stars = Array(5).fill().map((_, i) => 
        `<i class="fas fa-star${i < review.rating ? '' : ' text-gray-600'}"></i>`
    ).join('');
    
    // Generate images
    const images = review.images.map(img => 
        `<img src="${img}" alt="Review image" class="review-image">`
    ).join('');
    
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="reviewer-details">
                    <div class="reviewer-name">${review.user.name}</div>
                    <div class="review-stars">${stars}</div>
                </div>
            </div>
            <div class="review-date">${review.date}</div>
        </div>
        <div class="review-specs">
            <span class="spec-item">${review.specs}</span>
        </div>
        <div class="review-content">${review.content}</div>
        ${images ? `<div class="review-images">${images}</div>` : ''}
    `;
    
    return reviewDiv;
}

// ==================== Global Action Functions ====================

/**
 * Handle purchase action
 */
window.handlePurchase = () => {
    const specs = Object.entries(selectedSpecs).map(([key, value]) => 
        getSpecDisplayText(key, value)
    ).join(' · ');
    
    const quantity = document.getElementById('quantityInput')?.value || 1;
    
    showMessage(`Purchasing: ${specs}, Quantity: ${quantity}`, 'info');
    
    setTimeout(() => {
        showMessage('Purchase successful! Redirecting to payment...', 'success');
    }, 1500);
};

/**
 * Add to cart
 */
window.addToCart = () => {
    const specs = Object.entries(selectedSpecs).map(([key, value]) => 
        getSpecDisplayText(key, value)
    ).join(' · ');
    
    const quantity = document.getElementById('quantityInput')?.value || 1;
    
    showMessage(`Added to cart: ${specs}, Quantity: ${quantity}`, 'success');
};

/**
 * Toggle favorite status
 */
window.toggleFavorite = () => {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const icon = favoriteBtn?.querySelector('i');
    
    if (!icon) return;
    
    isFavorited = !isFavorited;
    
    if (isFavorited) {
        icon.className = 'fas fa-heart text-red-500';
        showMessage('Added to favorites', 'success');
    } else {
        icon.className = 'far fa-heart';
        showMessage('Removed from favorites', 'info');
    }
};

/**
 * Share product
 */
window.shareProduct = () => {
    const url = window.location.href;
    const title = document.getElementById('productTitle')?.textContent || 'Product Details';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            showMessage('Shared successfully', 'success');
        }).catch(() => {
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
};

/**
 * Fallback share method
 */
function fallbackShare(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showMessage('Link copied to clipboard', 'success');
        }).catch(() => {
            showMessage('Share failed, please copy link manually', 'error');
        });
    } else {
        showMessage('Share failed, please copy link manually', 'error');
    }
}

// ==================== Page Content Initialization ====================

/**
 * Initialize page content
 */
function initPageContent() {
    try {
        const params = getUrlParams();
        
        // Update page content based on URL parameters
        if (params.name) {
            const productName = decodeURIComponent(params.name);
            const titleElement = document.getElementById('productTitle');
            if (titleElement) {
                titleElement.textContent = productName;
            }
            
            // Update product images
            updateProductImages(productName);
        }
        
        // Initialize price display
        updatePrice();
        
        console.log('Page content initialization completed');
        
    } catch (error) {
        console.error('Page content initialization failed:', error);
    }
}

/**
 * Update product images
 */
function updateProductImages(productName) {
    try {
        // Here you can update images based on product name
        // For now, keep default images
        console.log(`Updating product images: ${productName}`);
        
    } catch (error) {
        console.error('Product image update failed:', error);
    }
}

// ==================== Main Initialization Function ====================

/**
 * Main initialization function
 */
function initPage() {
    if (isInitialized) {
        console.warn('Page already initialized');
        return;
    }
    
    try {
        console.log('Starting product detail page initialization...');
        
        // Initialize page content
        initPageContent();
        
        // Initialize various features
        initImageZoom();
        initThumbnails();
        initTabs();
        initSpecs();
        initQuantityControl();
        
        // Initialize breadcrumb navigation
        initBreadcrumb();
        
        // Initialize recommendations (using dapp-common.js functionality)
        if (typeof initRecommendations === 'function') {
            initRecommendations();
        }
        
        // Set initialization flag
        isInitialized = true;
        
        console.log('Product detail page initialization completed');
        
        // Trigger initialization complete event
        const event = new CustomEvent('pageInitialized');
        document.dispatchEvent(event);
        
    } catch (error) {
        console.error('Page initialization failed:', error);
        showMessage('Page loading failed, please refresh', 'error');
    }
}

// ==================== Event Listeners ====================

// Initialize after page load
document.addEventListener('DOMContentLoaded', initPage);

// Prevent duplicate initialization
window.addEventListener('beforeunload', () => {
    isInitialized = false;
});

// Export main functionality for other modules
window.ProductDetail = {
    init: initPage,
    getSelectedSpecs: () => selectedSpecs,
    getCurrentQuantity: () => document.getElementById('quantityInput')?.value || 1,
    isFavorited: () => isFavorited,
    updatePrice: updatePrice
}; 