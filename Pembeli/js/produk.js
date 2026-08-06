// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Global variables
let allProducts = [];
let currentCategory = '';
let currentSearch = '';

// Load products saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentSearch = urlParams.get('search') || '';
    currentCategory = urlParams.get('kategori') || '';
    
    // Set search input if exists
    if (currentSearch) {
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.value = currentSearch;
        }
    }
    
    await loadCategories();
    await loadProducts();
    setupEventListeners();
});

// Function untuk load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories/list`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            displayCategories(result.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Function untuk display categories
function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category-filter');
    
    if (!categoryContainer) return;
    
    // Clear existing categories
    categoryContainer.innerHTML = '<button class="category-btn active" data-category="">Semua</button>';
    
    // Add categories
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.dataset.category = category;
        
        if (category === currentCategory) {
            btn.classList.add('active');
            categoryContainer.querySelector('[data-category=""]').classList.remove('active');
        }
        
        btn.addEventListener('click', () => filterByCategory(category));
        categoryContainer.appendChild(btn);
    });
}

// Function untuk load products
async function loadProducts() {
    try {
        let url = `${API_BASE_URL}/products?`;
        
        if (currentCategory) {
            url += `kategori=${encodeURIComponent(currentCategory)}&`;
        }
        
        if (currentSearch) {
            url += `search=${encodeURIComponent(currentSearch)}&`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            allProducts = result.data;
            displayProducts(allProducts);
        } else {
            displayNoProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displayNoProducts();
    }
}

// Function untuk display products
function displayProducts(products) {
    const productContainer = document.querySelector('.product-grid');
    
    if (!productContainer) return;
    
    if (products.length === 0) {
        displayNoProducts();
        return;
    }
    
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
    });
}

// Function untuk create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    
    // Format harga
    const formattedPrice = formatPrice(product.Harga);
    
    // Get image path
    const imagePath = product.Foto_Produk ? `../assets/products/${product.Foto_Produk}` : '../assets/card/card-img.png';
    
    // Tentukan badge berdasarkan stok dan rating
    let badge = '';
    if (product.Stok === 0) {
        badge = '<span class="badge badge-soldout">Sold Out</span>';
    } else if (parseFloat(product.Rating) >= 4.5) {
        badge = '<span class="badge badge-popular">Popular</span>';
    } else if (product.Stok < 5) {
        badge = '<span class="badge badge-limited">Stock Terbatas</span>';
    }
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${imagePath}" alt="${product.Nama_Produk}" class="product-image" onerror="this.src='../assets/card/card-img.png'" />
            ${badge}
            <button class="favorite-btn" onclick="toggleFavorite(${product.id_produk}, event)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                </svg>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.Nama_Produk}</h3>
            <p class="product-category">${product.Kategori}</p>
            <div class="product-rating">
                ${generateStars(product.Rating)}
                <span class="rating-value">(${product.Rating || '0.0'})</span>
            </div>
            <div class="product-footer">
                <p class="product-price">${formattedPrice}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id_produk}, event)" ${product.Stok === 0 ? 'disabled' : ''}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add click handler untuk detail produk (kecuali pada button)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            window.location.href = `produk-detail.html?id=${product.id_produk}`;
        }
    });
    
    return card;
}

// Function untuk generate stars
function generateStars(rating) {
    const ratingValue = parseFloat(rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<span class="star star-full">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<span class="star star-half">★</span>';
        } else {
            stars += '<span class="star star-empty">★</span>';
        }
    }
    
    return stars;
}

// Function untuk format harga
function formatPrice(price) {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Function untuk display no products
function displayNoProducts() {
    const productContainer = document.querySelector('.product-grid');
    if (!productContainer) return;
    
    productContainer.innerHTML = `
        <div class="no-products">
            <p>Tidak ada produk yang ditemukan</p>
        </div>
    `;
}

// Function untuk filter by category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update URL
    const url = new URL(window.location);
    if (category) {
        url.searchParams.set('kategori', category);
    } else {
        url.searchParams.delete('kategori');
    }
    window.history.pushState({}, '', url);
    
    // Reload products
    loadProducts();
}

// Function untuk perform search
function performSearch() {
    const searchInput = document.getElementById('product-search-input');
    currentSearch = searchInput.value.trim();
    
    // Update URL
    const url = new URL(window.location);
    if (currentSearch) {
        url.searchParams.set('search', currentSearch);
    } else {
        url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
    
    // Reload products
    loadProducts();
}

// Function untuk setup event listeners
function setupEventListeners() {
    // Search button
    const searchButton = document.getElementById('product-search-button');
    const searchInput = document.getElementById('product-search-input');
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

// Function untuk sort products
function sortProducts(sortBy) {
    let sorted = [...allProducts];
    
    switch(sortBy) {
        case 'price-asc':
            sorted.sort((a, b) => parseFloat(a.Harga) - parseFloat(b.Harga));
            break;
        case 'price-desc':
            sorted.sort((a, b) => parseFloat(b.Harga) - parseFloat(a.Harga));
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.Nama_Produk.localeCompare(b.Nama_Produk));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.Nama_Produk.localeCompare(a.Nama_Produk));
            break;
        case 'rating':
            sorted.sort((a, b) => parseFloat(b.Rating || 0) - parseFloat(a.Rating || 0));
            break;
        default:
            break;
    }
    
    displayProducts(sorted);
}

// Function untuk add to cart
async function addToCart(productId, event) {
    event.stopPropagation();
    
    // Check if user is logged in - sessionStorage FIRST (priority), then localStorage
    const userDataStr = sessionStorage.getItem('user') || localStorage.getItem('userData');
    if (!userDataStr || userDataStr === 'null' || userDataStr === 'undefined') {
        showErrorModal('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang');
        setTimeout(() => {
            window.location.href = '/login/log-in-user.html';
        }, 2000);
        return;
    }
    
    const user = JSON.parse(userDataStr);
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_User: user.id_user,
                id_Produk: productId,
                Jumlah: 1
            })
        });
        
        const result = await response.json();
    } catch (error) {
        console.error('Error adding to cart:', error);
        const userFriendlyMessage = error.message && (error.message.includes('localhost') || error.message.includes('Failed to fetch'))
            ? 'Gagal menambahkan produk. Pastikan koneksi server aktif.'
            : 'Terjadi kesalahan saat menambahkan ke keranjang';
        showErrorModal(userFriendlyMessage);
    }
}

// Function untuk show error modal
function showErrorModal(message) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.error-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 32px 40px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        text-align: center;
        min-width: 320px;
        max-width: 400px;
    `;
    
    modal.innerHTML = `
        <div style="color: #820805; font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <div style="color: #333; font-size: 16px; font-weight: 500; margin-bottom: 8px;">Terjadi Kesalahan</div>
        <div style="color: #666; font-size: 14px; margin-bottom: 20px;">${message}</div>
        <button onclick="this.parentElement.remove()" style="
            background: #820805;
            color: white;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
        ">OK</button>
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 5000);
}

// Function untuk toggle favorite
function toggleFavorite(productId, event) {
    event.stopPropagation();
    
    // Get current favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        event.currentTarget.classList.remove('active');
        showNotification('Dihapus dari favorit');
    } else {
        favorites.push(productId);
        event.currentTarget.classList.add('active');
        showNotification('Ditambahkan ke favorit');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function untuk show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Function untuk update cart count
async function updateCartCount() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${user.id_user}`);
        const result = await response.json();
        
        if (result.success) {
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.textContent = result.data.count;
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}