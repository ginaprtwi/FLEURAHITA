// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Load featured products saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedProducts();
    setupSearchButton();
});

// Function untuk load featured products
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products?featured=true&limit=10`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            displayFeaturedProducts(result.data);
        } else {
            console.log('Tidak ada featured products');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Function untuk display featured products (replace existing cards)
function displayFeaturedProducts(products) {
    // Split products: 5 untuk "Produk Terbaru", 5 untuk "Rekomendasi"
    const featuredProducts = products.slice(0, 5);
    const recommendedProducts = products.slice(5, 10);
    
    // Display Produk Terbaru
    const featuredContainer = document.querySelector('.row3');
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        featuredProducts.forEach((product, index) => {
            featuredContainer.appendChild(createProductCard(product, index));
        });
    }
    
    // Display Rekomendasi
    const recommendedContainer = document.querySelector('.row4');
    if (recommendedContainer) {
        recommendedContainer.innerHTML = '';
        recommendedProducts.forEach((product, index) => {
            recommendedContainer.appendChild(createProductCard(product, index));
        });
    }
}

// Function untuk update existing cards dengan data dari database
function displayFeaturedProducts(products) {
    const featuredProducts = products.slice(0, 5);
    const recommendedProducts = products.slice(5, 10);
    
    // Update Produk Terbaru cards
    const featuredCards = document.querySelectorAll('.row3 > div');
    featuredCards.forEach((card, index) => {
        if (index < featuredProducts.length) {
            updateCardData(card, featuredProducts[index]);
        }
    });
    
    // Update Rekomendasi cards
    const recommendedCards = document.querySelectorAll('.row4 > div');
    recommendedCards.forEach((card, index) => {
        if (index < recommendedProducts.length) {
            updateCardData(card, recommendedProducts[index]);
        }
    });
}

// Function untuk update card data tanpa mengubah struktur
function updateCardData(card, product) {
    // Update image
    const img = card.querySelector('.img');
    if (img) {
        const imagePath = product.Foto_Produk ? `../assets/products/${product.Foto_Produk}` : '../assets/card/card-img.png';
        img.src = imagePath;
        img.onerror = function() { this.src = '../assets/card/card-img.png'; };
    }
    
    // Update nama produk
    const nameElement = card.querySelector('.column-text1, .column-text3');
    if (nameElement) {
        nameElement.textContent = product.Nama_Produk;
    }
    
    // Update harga
    const priceElement = card.querySelector('.column-text2, .column-text4, .text');
    if (priceElement) {
        const formattedPrice = Math.floor(parseFloat(product.Harga)).toLocaleString('id-ID');
        priceElement.textContent = formattedPrice;
    }
    
    // Add click handler untuk card
    card.style.cursor = 'pointer';
    card.onclick = () => {
        window.location.href = `produk.html`;
    };
    
    // Add handler untuk tombol + (add to cart)
    const addBtn = card.querySelector('.rect-b, .rect-a, [class*="card-rect"]');
    if (addBtn) {
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = function(e) {
            e.stopPropagation();
            handleAddToCart(product.id_produk);
        };
    }
}

// Function untuk handle add to cart dengan validasi login
async function handleAddToCart(productId) {
    // Check login - sessionStorage FIRST (priority), then localStorage
    const userDataStr = sessionStorage.getItem('user') || localStorage.getItem('userData');
    
    if (!userDataStr || userDataStr === 'null' || userDataStr === 'undefined') {
        showErrorNotification('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang');
        setTimeout(() => {
            window.location.href = '/login/log-in-user.html';
        }, 2000);
        return;
    }
    
    // Validate user data
    let user;
    try {
        user = JSON.parse(userDataStr);
        if (!user || (!user.id_user && !user.userId)) {
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        showErrorNotification('Silakan login terlebih dahulu');
        setTimeout(() => {
            window.location.href = '/login/log-in-user.html';
        }, 2000);
        return;
    }
    
    // User is logged in, add to cart via API
    try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_User: user.id_user || user.userId,
                id_Produk: productId,
                Jumlah: 1
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success - show notification and stay on page
            showSuccessNotification('Produk berhasil ditambahkan ke keranjang!');
            
            // Update navbar cart badge
            updateNavbarCart();
        } else {
            throw new Error(result.message || 'Gagal menambahkan ke keranjang');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        const userFriendlyMessage = error.message && (error.message.includes('localhost') || error.message.includes('Failed to fetch'))
            ? 'Gagal menambahkan produk. Pastikan koneksi server aktif.'
            : error.message || 'Terjadi kesalahan saat menambahkan ke keranjang';
        showErrorNotification(userFriendlyMessage);
    }
}

// Function untuk show error notification
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
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
    
    notification.innerHTML = `
        <div style="color: #820805; font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <div style="color: #333; font-size: 16px; font-weight: 500; margin-bottom: 8px;">Akses Ditolak</div>
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
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Function untuk show success notification
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 2000);
}

// Setup search button
function setupSearchButton() {
    const searchButton = document.getElementById('home-search-button');
    const searchInput = document.getElementById('home-search-input');
    
    if (searchButton && searchInput) {
        // Handle button click
        searchButton.addEventListener('click', () => {
            performSearch();
        });
        
        // Handle Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Function untuk perform search
function performSearch() {
    const searchInput = document.getElementById('home-search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Redirect ke halaman produk dengan search query
        window.location.href = `produk.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Function untuk update navbar cart badge
function updateNavbarCart() {
    // Dispatch event untuk trigger navbar update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Also manually update cart badge if exists
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        cartBadge.style.display = 'flex';
    }
}

// Setup "Lihat Selengkapnya" button
document.addEventListener('DOMContentLoaded', () => {
    const lihatSelengkapnya = document.querySelector('.row2');
    if (lihatSelengkapnya) {
        lihatSelengkapnya.style.cursor = 'pointer';
        lihatSelengkapnya.addEventListener('click', () => {
            window.location.href = 'produk.html';
        });
    }
});
