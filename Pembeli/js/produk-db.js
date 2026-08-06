// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Global variables
let allProducts = [];
let currentPage = 1;
const productsPerPage = 8; // 8 produk per halaman
let selectedCategory = 'Semua Kategori';
let allCategories = []; // Store categories globally

// Load products dan kategori dari database saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();
    setupFilters();
});

// Function untuk load categories dari database
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories/list`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            allCategories = result.data;
            renderCategoryList();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Function untuk render category list di sidebar
function renderCategoryList() {
    // Find or create links container
    const filterSection = document.querySelector('.elements-filter1');
    if (!filterSection) return;
    
    // Check if links container already exists
    let linksContainer = filterSection.nextElementSibling;
    if (!linksContainer || !linksContainer.classList.contains('links')) {
        // Create new links container
        linksContainer = document.createElement('div');
        linksContainer.className = 'links';
        filterSection.parentNode.insertBefore(linksContainer, filterSection.nextSibling);
    }
    
    // Clear existing categories
    linksContainer.innerHTML = '';
    
    // Add "Semua Kategori" first
    const allCatLink = document.createElement('p');
    const isAllActive = selectedCategory === 'Semua Kategori';
    allCatLink.className = isAllActive ? 'links-text-btn1' : 'links-text-btn2';
    allCatLink.textContent = 'Semua Kategori';
    allCatLink.style.cssText = `
        cursor: pointer !important;
        color: ${isAllActive ? '#820805' : '#6c7275'} !important;
        font-weight: ${isAllActive ? '700' : '500'} !important;
        font-size: 15px !important;
        font-family: 'Poppins', sans-serif !important;
    `;
    
    allCatLink.onclick = () => selectCategory('Semua Kategori');
    linksContainer.appendChild(allCatLink);
    
    // Add categories from database
    allCategories.forEach(category => {
        const categoryLink = document.createElement('p');
        const isActive = selectedCategory === category;
        categoryLink.className = isActive ? 'links-text-btn1' : 'links-text-btn2';
        categoryLink.textContent = category;
        categoryLink.style.cssText = `
            cursor: pointer !important;
            color: ${isActive ? '#820805' : '#6c7275'} !important;
            font-weight: ${isActive ? '700' : '500'} !important;
            font-size: 15px !important;
            font-family: 'Poppins', sans-serif !important;
        `;
        
        categoryLink.onclick = () => selectCategory(category);
        linksContainer.appendChild(categoryLink);
    });
}

// Function untuk select category
async function selectCategory(category) {
    selectedCategory = category;
    renderCategoryList(); // Update UI
    await loadProducts(category === 'Semua Kategori' ? '' : category);
}

// Function untuk load products dari database
async function loadProducts(category = '', search = '') {
    try {
        let url = `${API_BASE_URL}/products?`;
        
        if (category && category !== 'Semua Kategori') {
            url += `kategori=${encodeURIComponent(category)}&`;
        }
        
        if (search) {
            url += `search=${encodeURIComponent(search)}&`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            allProducts = result.data;
            currentPage = 1;
            displayProducts();
        } else {
            allProducts = [];
            displayProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        allProducts = [];
        displayProducts();
    }
}

// Function untuk display products dengan pagination
function displayProducts() {
    const row3 = document.querySelector('.row3');
    if (!row3) return;
    
    // Remove no products message if exists
    const noProductsMsg = document.querySelector('.no-products-message');
    if (noProductsMsg) {
        noProductsMsg.remove();
    }
    
    if (allProducts.length === 0) {
        // Clear row3 dan tampilkan pesan kosong
        row3.innerHTML = '';
        showNoProductsMessage();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);
    
    // Clear existing cards
    row3.innerHTML = '';
    
    // Create cards dinamis sesuai jumlah data
    productsToShow.forEach((product, index) => {
        const card = createProductCard(product, index);
        row3.appendChild(card);
    });
    
    // Update pagination UI
    updatePaginationUI();
}

// Function untuk create product card element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = `card${(index % 4) + 1} card-white`;
    card.setAttribute('data-product-id', product.id_produk);
    
    const imagePath = product.Foto_Produk ? `../assets/products/${product.Foto_Produk}` : '../assets/card/card-img.png';
    const formattedPrice = Math.floor(parseFloat(product.Harga)).toLocaleString('id-ID');
    
    card.innerHTML = `
        <object data="../assets/card/card-iconly.svg" class="icons-check-line card-iconly${(index % 4) + 1}" type="image/svg+xml"></object>
        <img src="${imagePath}" class="img" onerror="this.src='../assets/card/card-img.png'" />
        <div class="column-a col${(index % 4) + 1}">
            <p class="column-text1">${product.Nama_Produk}</p>
            <p class="text">${formattedPrice}</p>
        </div>
        <div class="rect card-rect${(index % 4) + 1}"></div>
    `;
    
    // Setup tombol + untuk add to cart
    const addBtn = card.querySelector('.rect');
    if (addBtn) {
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = function(e) {
            e.stopPropagation();
            addToCart(product.id_produk);
        };
    }
    
    // Setup card click
    card.style.cursor = 'pointer';
    card.onclick = function(e) {
        if (!e.target.closest('.rect')) {
            console.log('Product clicked:', product.id_produk);
            // window.location.href = `produk-detail.html?id=${product.id_produk}`;
        }
    };
    
    return card;
}

// Function untuk update card dengan data produk
function updateCardWithProduct(card, product) {
    // Update image
    const img = card.querySelector('.img');
    if (img) {
        const imagePath = product.Foto_Produk ? `../assets/products/${product.Foto_Produk}` : '../assets/card/card-img.png';
        img.src = imagePath;
        img.onerror = function() { this.src = '../assets/card/card-img.png'; };
    }
    
    // Update nama produk
    const nameElement = card.querySelector('.column-text1');
    if (nameElement) {
        nameElement.textContent = product.Nama_Produk;
    }
    
    // Update harga
    const priceElement = card.querySelector('.text');
    if (priceElement) {
        const formattedPrice = Math.floor(parseFloat(product.Harga)).toLocaleString('id-ID');
        priceElement.textContent = formattedPrice;
    }
    
    // Set data attributes
    card.setAttribute('data-product-id', product.id_produk);
    
    // Setup tombol + untuk add to cart
    const addBtn = card.querySelector('.rect, .card-rect1, .card-rect2, .card-rect3, .card-rect4');
    if (addBtn) {
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = function(e) {
            e.stopPropagation();
            addToCart(product.id_produk);
        };
    }
    
    // Setup card click
    card.style.cursor = 'pointer';
    card.onclick = function(e) {
        if (!e.target.closest('.rect, .card-rect1, .card-rect2, .card-rect3, .card-rect4')) {
            console.log('Product clicked:', product.id_produk);
            // window.location.href = `produk-detail.html?id=${product.id_produk}`;
        }
    };
}

// Function untuk show no products message
function showNoProductsMessage() {
    const row3 = document.querySelector('.row3');
    if (!row3) return;
    
    const message = document.createElement('div');
    message.className = 'no-products-message';
    message.style.cssText = `
        width: 100%;
        text-align: center;
        padding: 60px 20px;
        color: #999;
        font-size: 16px;
        grid-column: 1 / -1;
    `;
    message.textContent = 'Tidak ada produk yang ditemukan';
    row3.appendChild(message);
}

// Function untuk update pagination UI
function updatePaginationUI() {
    let paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        paginationContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            margin: 40px auto 40px auto;
            padding: 0 16px;
            max-width: 1200px;
            width: 100%;
        `;
        
        const row1 = document.querySelector('.row1');
        if (row1 && row1.parentNode) {
            row1.parentNode.insertBefore(paginationContainer, row1.nextSibling);
        }
    }
    
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: ${currentPage === 1 ? '#f5f5f5' : '#fff'};
        color: ${currentPage === 1 ? '#999' : '#820805'};
        border-radius: 6px;
        cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
        font-size: 18px;
    `;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid ${i === currentPage ? '#820805' : '#ddd'};
            background: ${i === currentPage ? '#820805' : '#fff'};
            color: ${i === currentPage ? '#fff' : '#333'};
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            min-width: 36px;
        `;
        pageBtn.onclick = () => {
            currentPage = i;
            displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: ${currentPage === totalPages ? '#f5f5f5' : '#fff'};
        color: ${currentPage === totalPages ? '#999' : '#820805'};
        border-radius: 6px;
        cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
        font-size: 18px;
    `;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginationContainer.appendChild(nextBtn);
}

// Setup filters
function setupFilters() {
    // Category filter dengan event delegation
    const linksContainer = document.querySelector('.links');
    if (linksContainer) {
        linksContainer.onclick = async (e) => {
            if (e.target.tagName === 'P') {
                // Update selected category
                selectedCategory = e.target.textContent.trim();
                
                // Update UI - remove active dari semua
                linksContainer.querySelectorAll('p').forEach(l => {
                    l.classList.remove('links-text-btn1');
                    l.classList.add('links-text-btn2');
                });
                
                // Add active ke yang diklik
                e.target.classList.remove('links-text-btn2');
                e.target.classList.add('links-text-btn1');
                
                // Load products
                await loadProducts(selectedCategory);
            }
        };
    }
    
    // Price filter checkboxes
    const priceCheckboxes = document.querySelectorAll('.checkbox-a, .checkbox-b');
    priceCheckboxes.forEach((checkbox) => {
        const ratioBtn = checkbox.querySelector('.checkbox-ratio-btn1, .checkbox-ratio-btn2');
        
        checkbox.style.cursor = 'pointer';
        checkbox.onclick = () => {
            // Toggle checkbox
            if (ratioBtn.style.background === 'rgb(130, 8, 5)' || ratioBtn.style.background === '#820805') {
                ratioBtn.style.background = '#ffffff';
                ratioBtn.style.border = '2px solid #6c7275';
            } else {
                ratioBtn.style.background = '#820805';
                ratioBtn.style.border = '2px solid #820805';
            }
            
            filterByPrice();
        };
    });
    
    // Search
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.onclick = performSearch;
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        };
    }
}

// Filter by price
function filterByPrice() {
    const checkboxes = document.querySelectorAll('.checkbox-a, .checkbox-b');
    const selectedRanges = [];
    
    checkboxes.forEach((checkbox, index) => {
        const ratioBtn = checkbox.querySelector('.checkbox-ratio-btn1, .checkbox-ratio-btn2');
        const isChecked = ratioBtn.style.background === 'rgb(130, 8, 5)' || ratioBtn.style.background === '#820805';
        
        if (isChecked) {
            if (index === 0) {
                selectedRanges.push({ min: 0, max: Infinity });
            } else if (index === 1) {
                selectedRanges.push({ min: 50000, max: 99999 });
            } else if (index === 2) {
                selectedRanges.push({ min: 100000, max: 199999 });
            } else if (index === 3) {
                selectedRanges.push({ min: 200000, max: 299999 });
            } else if (index === 4) {
                selectedRanges.push({ min: 300000, max: 499999 });
            }
        }
    });
    
    if (selectedRanges.length === 0 || selectedRanges.some(r => r.max === Infinity)) {
        displayProducts();
        return;
    }
    
    allProducts = allProducts.filter(product => {
        const price = parseFloat(product.Harga);
        return selectedRanges.some(range => price >= range.min && price <= range.max);
    });
    
    currentPage = 1;
    displayProducts();
}

// Search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    loadProducts('', searchTerm);
}

// Add to cart
async function addToCart(productId) {
    // Check sessionStorage FIRST (priority), then localStorage
    let userDataStr = sessionStorage.getItem('user') || localStorage.getItem('userData');
    
    if (!userDataStr || userDataStr === 'null' || userDataStr === 'undefined') {
        showNotification('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang', 'error');
        setTimeout(() => {
            window.location.href = '/login/log-in-user.html';
        }, 2000);
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userDataStr);
        // Check id_user or userId (different storage formats)
        if (!user || (!user.id_user && !user.userId)) {
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        showNotification('Silakan login terlebih dahulu', 'error');
        setTimeout(() => {
            window.location.href = '/login/log-in-user.html';
        }, 2000);
        return;
    }
    
    try {
        // POST ke backend database
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
            // Get product details untuk update localStorage
            const product = allProducts.find(p => p.id_produk == productId);
            
            if (product) {
                // Update localStorage cart (untuk navbar & halaman keranjang)
                updateLocalStorageCart(product);
            }
            
            // Success feedback
            showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
            
            // Update cart badge & total di navbar
            updateNavbarCart();
        } else {
            throw new Error(result.message || 'Gagal menambahkan ke keranjang');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        const userFriendlyMessage = error.message.includes('localhost') || error.message.includes('Failed to fetch')
            ? 'Gagal menambahkan produk. Pastikan koneksi server aktif.'
            : error.message || 'Terjadi kesalahan saat menambahkan ke keranjang';
        showNotification(userFriendlyMessage, 'error');
    }
}

// Function untuk update localStorage cart (per user)
function updateLocalStorageCart(product) {
    // Get user ID - sessionStorage FIRST (priority)
    const userDataStr = sessionStorage.getItem('user') || localStorage.getItem('userData');
    if (!userDataStr) return;
    
    let userId;
    try {
        const user = JSON.parse(userDataStr);
        userId = user.id_user || user.userId;
    } catch (e) {
        return;
    }
    
    // Get existing cart untuk user ini
    const cartKey = `fleurahita_cart_${userId}`;
    let cartItems = [];
    const storedCart = localStorage.getItem(cartKey);
    
    if (storedCart) {
        try {
            cartItems = JSON.parse(storedCart);
        } catch (e) {
            cartItems = [];
        }
    }
    
    // Check if product already exists
    const existingIndex = cartItems.findIndex(item => item.id == product.id_produk);
    
    if (existingIndex >= 0) {
        // Increment quantity
        cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
    } else {
        // Add new item
        const imagePath = product.Foto_Produk ? `../assets/products/${product.Foto_Produk}` : '../assets/card/card-img.png';
        cartItems.push({
            id: product.id_produk,
            name: product.Nama_Produk,
            price: parseFloat(product.Harga),
            quantity: 1,
            image: imagePath
        });
    }
    
    // Save to localStorage dengan key per user
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    
    // Juga save ke key lama untuk backward compatibility
    localStorage.setItem('fleurahita_cart', JSON.stringify(cartItems));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch event untuk update navbar
    window.dispatchEvent(new Event('cartUpdated'));
}

// Function untuk update navbar cart (badge + total) - per user
function updateNavbarCart() {
    // Get user ID - sessionStorage FIRST (priority)
    const userDataStr = sessionStorage.getItem('user') || localStorage.getItem('userData');
    let cartKey = 'fleurahita_cart'; // default key
    
    if (userDataStr) {
        try {
            const user = JSON.parse(userDataStr);
            const userId = user.id_user || user.userId;
            if (userId) {
                cartKey = `fleurahita_cart_${userId}`;
            }
        } catch (e) {
            // Use default key if parsing fails
        }
    }
    
    // Update badge count
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const storedCart = localStorage.getItem(cartKey);
        if (storedCart) {
            try {
                const cartItems = JSON.parse(storedCart);
                const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
                cartBadge.textContent = totalItems;
                cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            } catch (e) {
                console.error('Error updating cart badge:', e);
            }
        }
    }
    
    // Update total price di navbar
    const totalElements = document.querySelectorAll('.header-text-rp, .frame-text-rp1, #cartTotal, .fleurahita-cart-price');
    const storedCart = localStorage.getItem(cartKey);
    
    if (storedCart && totalElements.length > 0) {
        try {
            const cartItems = JSON.parse(storedCart);
            const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const formatted = 'Rp.' + total.toLocaleString('id-ID');
            totalElements.forEach(el => {
                el.textContent = formatted;
            });
        } catch (e) {
            console.error('Error updating cart total:', e);
        }
    }
}

// Function untuk show notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.cart-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    if (type === 'error') {
        // Show modal-style error notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
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
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    } else {
        // Show success toast notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
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
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add animation keyframes
        if (!document.querySelector('#notif-animation')) {
            const style = document.createElement('style');
            style.id = 'notif-animation';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Function untuk update cart badge
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        cartBadge.style.display = 'flex';
    }
}
