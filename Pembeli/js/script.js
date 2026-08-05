let cartItems = [];

// Helper function to resolve product image
function getProductImage(item) {
    let raw = (item && item.image) ? item.image : '';
    if (raw.includes('assets/')) {
        let file = raw.split('assets/').pop();
        if (file.includes('/')) file = file.split('/').pop();
        if (file && file !== 'card-img5.png' && file !== 'card-img6.png' && !file.includes('wishlist')) {
            if (file === 'card-img1.png' || file === 'card-img.png') return '../assets/card/card-img.png';
            return '../assets/card/' + file;
        }
    }
    
    const nameLower = (item && item.name ? item.name : '').toLowerCase();
    if (nameLower.includes('medium')) return '../assets/card/card-img4.png';
    if (nameLower.includes('aurora')) return '../assets/card/card-img3.png';
    if (nameLower.includes('charm')) return '../assets/card/card-img2.png';
    if (nameLower.includes('lush')) return '../assets/card/card-img.png';
    
    return '../assets/card/card-img2.png';
}

// Format currency to IDR
function formatCurrency(amount) {
    return 'Rp.' + (amount || 0).toLocaleString('id-ID');
}

// Calculate cart total
function calculateTotal() {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

// Update cart total in header
function updateCartTotal() {
    const totalElements = document.querySelectorAll('.header-text-rp, .frame-text-rp1, #cartTotal, .fleurahita-cart-price');
    const total = calculateTotal();
    const formatted = formatCurrency(total);
    totalElements.forEach(el => {
        el.textContent = formatted;
    });
}

// Load cart from localStorage
function loadCartFromStorage() {
    const stored = localStorage.getItem('fleurahita_cart');
    if (stored) {
        try {
            cartItems = JSON.parse(stored);
            let updated = false;
            cartItems.forEach(item => {
                const validImg = getProductImage(item);
                if (item.image !== validImg) {
                    item.image = validImg;
                    updated = true;
                }
                if (item.name && (item.name.includes('CharmÃƒÂ©') || item.name.includes('CharmÃƒÆ’Ã‚Â©'))) {
                    item.name = item.name.replace(/CharmÃƒÂ©/g, 'CharmÃ©').replace(/CharmÃƒÆ’Ã‚Â©/g, 'CharmÃ©');
                    updated = true;
                }
                if (!item.quantity || item.quantity < 1) {
                    item.quantity = 1;
                    updated = true;
                }
            });
            if (updated) {
                saveCartToStorage();
            }
        } catch (e) {
            console.error('Error loading cart:', e);
            cartItems = [];
        }
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('fleurahita_cart', JSON.stringify(cartItems));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
}

// Update quantity of an item (+ and - buttons)
function updateQuantity(itemId, change) {
    const item = cartItems.find(i => i.id == itemId);
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity <= 0) {
            removeItem(itemId);
            return;
        }
        saveCartToStorage();
        renderCartItems();
        updateCartTotal();
    }
}

// Render cart items dynamically
function renderCartItems() {
    const wishlist = document.querySelector('.wishlist');
    if (!wishlist) return;

    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }

    wishlist.style.alignItems = 'flex-start';

    // Build the cart HTML matching 4-column layout (Produk, Harga, Jumlah, Action)
    let cartHTML = `
        <div class="wishlist-content1" style="width: 100%;">
            <div class="wishlist-caption" style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1.5fr; gap: 16px; align-items: center; width: 100%; padding: 0 0 12px 0; border-bottom: 1px solid #e0e0e0; margin-bottom: 8px;">
                <p class="wishlist-text wishlist-text1" style="font-weight: 600; color: #6c7275; margin: 0; padding-left: 32px;">Produk</p>
                <p class="wishlist-text wishlist-text-harga" style="text-align: center; font-weight: 600; color: #6c7275; margin: 0;">Harga</p>
                <p class="wishlist-text wishlist-text-qty" style="text-align: center; font-weight: 600; color: #6c7275; margin: 0;">Jumlah</p>
                <p class="wishlist-text wishlist-text-action" style="text-align: right; font-weight: 600; color: #6c7275; margin: 0; padding-right: 12px;">Action</p>
            </div>
            <div class="wishlist-items-list" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
    `;

    cartItems.forEach((item) => {
        let imagePath = getProductImage(item);
        const itemTotal = item.price * (item.quantity || 1);
        const cleanName = (item.name || '').replace(/CharmÃƒÂ©/g, 'CharmÃ©').replace(/CharmÃƒÆ’Ã‚Â©/g, 'CharmÃ©');
        
        cartHTML += `
            <div class="wishlist-item" data-id="${item.id}" style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1.5fr; gap: 16px; align-items: center; width: 100%; padding: 16px 0; border-bottom: 1px solid #e0e0e0;">
                <div class="wishlist-elements1" style="display: flex; align-items: center; gap: 16px;">
                    <img src="../assets/cart-icons-close.svg" class="wishlist-icons-close-line delete-btn" data-id="${item.id}" alt="Hapus" style="cursor: pointer; width: 24px; height: 24px; flex-shrink: 0;" />
                    
                    <div class="wishlist-content2" style="display: flex; align-items: center; gap: 16px;">
                        <img src="${imagePath}" onerror="this.onerror=null; this.src='../assets/card/card-img3.png';" class="wishlist-img1" alt="${cleanName}" style="width: 70px; height: 70px; object-fit: contain; background: #fafafa; border-radius: 8px; flex-shrink: 0; display: block;" />
                        
                        <div class="info info1" style="display: flex; flex-direction: column; gap: 4px;">
                            <div class="info-info-lush-and-plush" style="font-weight: 600; font-size: 15px; color: #333;">${cleanName}</div>
                            <p class="info-text caption1" style="font-size: 13px; color: #666; margin: 0;">Warna : ${item.color || 'Ungu'}</p>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <p class="wishlist-text-rp caption2" style="font-size: 15px; font-weight: 600; color: #333; margin: 0;">${formatCurrency(itemTotal)}</p>
                </div>
                
                <div class="quantity-controls" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn" style="width: 32px; height: 32px; border: 1px solid #820805; background: white; color: #820805; border-radius: 6px; cursor: pointer; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">-</button>
                    <span style="font-size: 16px; font-weight: 600; min-width: 24px; text-align: center; color: #333;">${item.quantity || 1}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn" style="width: 32px; height: 32px; border: 1px solid #820805; background: #820805; color: white; border-radius: 6px; cursor: pointer; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">+</button>
                </div>
                
                <div style="text-align: right;">
                    <button class="wishlist-btn hover-bright" onclick="handleBuyNow('${item.id}')" style="background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; display: inline-block;">Beli Sekarang</button>
                </div>
            </div>
        `;
    });

    cartHTML += `
            </div>
        </div>
        <button class="wishlist-btn wishlist-btn3 hover-bright" onclick="handleAddOrder()" style="margin-top: 24px; background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%); color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;">Tambah Pesanan</button>
    `;

    wishlist.innerHTML = cartHTML;

    attachDeleteListeners();
}

function attachDeleteListeners() {
    const removeButtons = document.querySelectorAll('.delete-btn');
    removeButtons.forEach(button => {
        button.style.cursor = 'pointer';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = button.getAttribute('data-id');
            if (itemId) {
                removeItem(itemId);
            }
        });
    });
}

// Remove item from cart
function removeItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id == itemId);
    
    if (itemIndex > -1) {
        const itemElement = document.querySelector(`[data-id="${itemId}"]`);
        
        if (itemElement) {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                cartItems.splice(itemIndex, 1);
                saveCartToStorage();
                renderCartItems();
                updateCartTotal();
                showNotification('Produk berhasil dihapus dari keranjang');
            }, 300);
        } else {
            cartItems.splice(itemIndex, 1);
            saveCartToStorage();
            renderCartItems();
            updateCartTotal();
            showNotification('Produk berhasil dihapus dari keranjang');
        }
    }
}

// Show notification message
function showNotification(message) {
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
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show empty cart message
function showEmptyCart() {
    const wishlist = document.querySelector('.wishlist');
    if (wishlist) {
        wishlist.style.alignItems = 'center';
        wishlist.style.width = '100%';
        wishlist.innerHTML = `
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px 60px 20px; margin: 0 auto;">
                <h2 style="font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 700; color: #333; margin-bottom: 12px; text-align: center; width: 100%;">
                    Keranjang Kosong
                </h2>
                <p style="font-family: 'Inter', sans-serif; font-size: 16px; color: #666; margin-bottom: 24px; text-align: center; width: 100%;">
                    Belum ada produk di keranjang Anda
                </p>
                <button class="wishlist-btn hover-bright" onclick="window.location.href='produk.html'" style="margin: 0 auto; display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px; background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(130, 8, 5, 0.2);">
                    Belanja Sekarang
                </button>
            </div>
        `;
    }
}

// Handle "Beli Sekarang" button click
function handleBuyNow(itemId) {
    const item = cartItems.find(i => i.id == itemId);
    if (item) {
        showNotification(`Melanjutkan pembelian ${item.name}`);
        setTimeout(() => {
            console.log('Redirect to checkout with item:', itemId);
        }, 1000);
    }
}

// Handle "Tambah Pesanan" button click
function handleAddOrder() {
    window.location.href = 'produk.html';
}

// Setup navigation
function setupNavigation() {
    // Product page navigation
    const productLinks = document.querySelectorAll('.header-text1, .auto-layout-horizontal-text, .nav-produk');
    productLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            window.location.href = 'produk.html';
        });
    });

    // Home navigation
    const homeLinks = document.querySelectorAll('.header-text-left, .auto-layout-horizontal-text-left, .header-row-left, .row-left5, .nav-home');
    homeLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            window.location.href = 'beranda.html';
        });
    });

    // Cart icon navigation
    const cartFrames = document.querySelectorAll('.header-frame, .frame-a, .nav-keranjang');
    cartFrames.forEach(frame => {
        frame.style.cursor = 'pointer';
        frame.addEventListener('click', function() {
            window.location.href = 'keranjang.html';
        });
    });

    // Pesanan Saya navigation
    const pesananLinks = document.querySelectorAll('.header-text-pesanan-saya, .auto-layout-horizontal-text-pesanan-saya, .nav-pesanan');
    pesananLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            window.location.href = 'histori_pesanan.html';
        });
    });

    // Chat icon
    const chatIcons = document.querySelectorAll('.iconly-light-outline-chat, .iconly-light-outline-chat-a');
    chatIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', function() {
            window.open('https://wa.me/6289567890000', '_blank');
        });
    });

    // "Lihat Selengkapnya" click -> goes to produk.html
    const lihatButtons = document.querySelectorAll('.lihat, .row2');
    lihatButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function() {
            window.location.href = 'produk.html';
        });
    });
}

// Handle voucher submission
function handleVoucherSubmit() {
    const voucherInput = document.querySelector('.elements-cart-coupon-text-your');
    if (voucherInput) {
        const voucherCode = voucherInput.textContent || voucherInput.value || '';
        
        if (voucherCode && voucherCode !== 'Voucher') {
            showNotification('Kode voucher berhasil diterapkan!');
            console.log('Voucher code:', voucherCode);
        } else {
            showNotification('Masukkan kode voucher terlebih dahulu');
        }
    }
}

// Initialize cart functionality
function initCart() {
    loadCartFromStorage();
    renderCartItems();
    updateCartTotal();
    setupNavigation();
    applyAllFilters(); // Initial filter
    
    // Add click handler for voucher submit button
    const voucherButton = document.querySelector('.elements-cart-coupon-text-btn');
    if (voucherButton) {
        voucherButton.style.cursor = 'pointer';
        voucherButton.addEventListener('click', handleVoucherSubmit);
    }
    
    // Make voucher input editable
    const voucherInput = document.querySelector('.elements-cart-coupon-text-your');
    if (voucherInput) {
        voucherInput.contentEditable = true;
        voucherInput.style.cursor = 'text';
        voucherInput.addEventListener('focus', function() {
            if (this.textContent === 'Voucher') {
                this.textContent = '';
            }
        });
        voucherInput.addEventListener('blur', function() {
            if (this.textContent === '') {
                this.textContent = 'Voucher';
            }
        });
    }
}

// Add CSS animations
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .wishlist-icons-close-line:hover {
            opacity: 0.7;
            transform: scale(1.1);
            transition: all 0.2s ease;
        }
        
        .elements-cart-coupon-text-btn:hover {
            opacity: 0.8;
            transform: scale(1.05);
            transition: all 0.2s ease;
        }
        
        .qty-btn:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }

        /* Prevent SVG objects inside card plus buttons from swallowing click events */
        object[data*="card-graphic"], 
        object[class*="card-graphic"], 
        .card-graphic, 
        .card-graphic1, 
        .card-graphic2, 
        .card-graphic3, 
        .card-graphic4, 
        .card-graphic5, 
        .card-graphic6 {
            display: none !important;
        }

        .rect, .rect-a, .rect-b, [class*="card-rect"] {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 28px !important;
            height: 22px !important;
            background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%) !important;
            border-radius: 8px !important;
            color: #ffffff !important;
            cursor: pointer !important;
            box-shadow: 0 2px 6px rgba(130, 8, 5, 0.3) !important;
            z-index: 99 !important;
            text-align: center !important;
        }

        .rect::after, .rect-a::after, .rect-b::after, [class*="card-rect"]::after {
            content: '+' !important;
            color: #ffffff !important;
            font-family: 'Poppins', sans-serif !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            display: block !important;
        }

        .col-left, .row2, .links, .links p, [class*="links-text-btn"] {
            position: relative !important;
            z-index: 100 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
        }

        .links p:hover, [class*="links-text-btn"]:hover {
            color: #820805 !important;
            font-weight: 600 !important;
        }

        .links p.active-cat, [class*="links-text-btn"].active-cat {
            color: #820805 !important;
            font-weight: 700 !important;
        }

        .filter-hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Setup Product Page & Beranda Add-to-Cart handlers
function setupProductPageEvents() {
    const cards = document.querySelectorAll('.card-white, .card-white4, .card1, .card2, .card3, .card4, .card5, .card6, .card7, .card8, .card9, .card10, .card11, .card12, .card13, .card-a, .card-b, .card-c, .card-d');
    if (!cards || cards.length === 0) return;

    cards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        const handleCardClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Read title from card
            const titleElem = card.querySelector('.column-text1, .card-text1, .column-text3');
            let name = titleElem ? titleElem.innerText.replace(/\n/g, ' ').trim() : '';
            name = name.replace(/CharmÃƒÂ©/g, 'Charmé').replace(/CharmÃƒÆ’Ã‚Â©/g, 'Charmé');

            // Fallback product list mapping
            const fallbackProducts = [
                { name: 'Lush and Plush', price: 135000, image: '../assets/card/card-img.png' },
                { name: 'Charmé Bouquet', price: 60000, image: '../assets/card/card-img2.png' },
                { name: 'Sweet Aurora Bloom', price: 250000, image: '../assets/card/card-img3.png' },
                { name: 'Lush and Plush (medium)', price: 135000, image: '../assets/card/card-img4.png' }
            ];

            const fallback = fallbackProducts[index % fallbackProducts.length];
            if (!name) name = fallback.name;

            // Read price
            const priceElem = card.querySelector('.text, .column-text2, .column-text4');
            let priceText = priceElem ? priceElem.innerText.replace(/[^0-9]/g, '') : '';
            let price = parseInt(priceText, 10) || fallback.price;

            // Read image
            let image = fallback.image;
            const imgElem = card.querySelector('img.img, img[class*="card-img"]');
            if (imgElem) {
                let src = imgElem.getAttribute('src');
                if (src) {
                    let file = src.split('/').pop();
                    if (file === 'card-img1.png' || file === 'card-img.png') file = 'card-img.png';
                    image = '../assets/card/' + file;
                }
            }

            loadCartFromStorage();
            
            const existingItem = cartItems.find(i => i.name.toLowerCase().trim() === name.toLowerCase().trim());
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
                existingItem.image = getProductImage(existingItem);
            } else {
                const newItem = {
                    id: Date.now() + '_' + Math.floor(Math.random() * 1000),
                    name: name,
                    price: price,
                    image: image,
                    color: 'Ungu',
                    quantity: 1
                };
                newItem.image = getProductImage(newItem);
                cartItems.push(newItem);
            }
            
            saveCartToStorage();
            showNotification(`${name} ditambahkan ke keranjang!`);
            updateCartTotal();
            
            setTimeout(() => {
                window.location.href = 'keranjang.html';
            }, 300);
        };

        card.addEventListener('click', handleCardClick);
        
        // Also attach to red plus buttons inside cards
        const plusBtns = card.querySelectorAll('.rect, .rect-a, .rect-b, [class*="card-rect"], [class*="card-graphic"]');
        plusBtns.forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', handleCardClick);
        });
    });
}

// Unified filter state
let currentCategory = 'Semua Kategori';
let currentPriceFilter = { range: 'All Price', min: 0, max: 9999999 };
let currentSearchQuery = '';

// Tentukan kategori produk berdasarkan nama bunga
function getCardCategoriesByName(name) {
    const lower = (name || '').toLowerCase();
    if (lower.includes('charm')) {
        return ['wedding flower', 'birthday party'];
    }
    if (lower.includes('aurora')) {
        return ['graduation', 'parents'];
    }
    if (lower.includes('medium')) {
        return ['personal gifts', 'birthday party', 'children'];
    }
    if (lower.includes('lush')) {
        return ['personal gifts', 'parents'];
    }
    return ['personal gifts'];
}

function applyAllFilters() {
    const cards = document.querySelectorAll(".card1, .card2, .card3, .card4, .card-white");
    if (!cards || cards.length === 0) return;

    let visibleCount = 0;
    cards.forEach((card) => {
        const titleElem = card.querySelector(".column-text1, .card-text1");
        const name = titleElem ? titleElem.innerText.replace(/\n/g, " ").trim() : "";
        
        const dataCatString = (card.getAttribute("data-category") || "").toLowerCase();
        const dataCats = dataCatString.split(',').map(s => s.trim()).filter(Boolean);
        const nameCats = getCardCategoriesByName(name);
        const allCats = Array.from(new Set([...dataCats, ...nameCats]));

        // Ambil harga dari atribut data atau teks
        const priceAttr = card.getAttribute("data-price");
        let price = parseInt(priceAttr, 10);
        if (!price || isNaN(price)) {
            const priceElem = card.querySelector(".text, .column-text2, .column-text4");
            const priceText = priceElem ? priceElem.innerText.replace(/[^0-9]/g, "") : "";
            price = parseInt(priceText, 10) || 0;
        }

        // Check category match
        let matchesCategory = false;
        if (currentCategory === "Semua Kategori") {
            matchesCategory = true;
        } else {
            const targetCat = currentCategory.toLowerCase().trim();
            matchesCategory = allCats.some(cat => cat.includes(targetCat) || targetCat.includes(cat));
        }

        // Check price match
        let matchesPrice = false;
        if (currentPriceFilter.range === "All Price") {
            matchesPrice = true;
        } else {
            matchesPrice = (price >= currentPriceFilter.min && price <= currentPriceFilter.max);
        }

        // Check search query match
        let matchesSearch = true;
        if (currentSearchQuery) {
            matchesSearch = name.toLowerCase().includes(currentSearchQuery.toLowerCase());
        }

        if (matchesCategory && matchesPrice && matchesSearch) {
            card.classList.remove("filter-hidden");
            card.style.display = "";
            visibleCount++;
        } else {
            card.classList.add("filter-hidden");
            card.style.display = "none";
        }
    });

    let row3 = document.querySelector(".row3");
    let emptyMsg = document.querySelector(".no-products-msg");
    if (visibleCount === 0) {
        if (!emptyMsg && row3) {
            emptyMsg = document.createElement("div");
            emptyMsg.className = "no-products-msg";
            emptyMsg.style.cssText = "width: 100%; padding: 40px 20px; text-align: center; color: #820805; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 600; background: #fff5f5; border-radius: 12px; border: 1px dashed #ffa2a2; margin: 10px 0;";
            emptyMsg.textContent = "Tidak ada produk yang sesuai dengan kriteria filter Anda.";
            row3.appendChild(emptyMsg);
        } else if (emptyMsg) {
            emptyMsg.textContent = "Tidak ada produk yang sesuai dengan kriteria filter Anda.";
            emptyMsg.style.display = "block";
        }
    } else if (emptyMsg) {
        emptyMsg.style.display = "none";
    }
}

function setupSearchInput() {
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchQuery = this.value.trim();
            applyAllFilters();
        });
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                currentSearchQuery = this.value.trim();
                applyAllFilters();
            }
        });
    }
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            if (searchInput) {
                currentSearchQuery = searchInput.value.trim();
                applyAllFilters();
            }
        });
    }
}

function setupCategoryFilters() {
    function updateCategoryUI(activeName) {
        const links = document.querySelectorAll('.links p, [class*="links-text-btn"]');
        links.forEach(link => {
            const text = link.innerText.trim();
            if (text.toLowerCase() === activeName.toLowerCase()) {
                link.classList.add('active-cat');
                link.style.setProperty('color', '#820805', 'important');
                link.style.setProperty('font-weight', '700', 'important');
            } else {
                link.classList.remove('active-cat');
                link.style.setProperty('color', '#6c7275', 'important');
                link.style.setProperty('font-weight', '400', 'important');
            }
        });
    }

    // Set Semua Kategori as default active category UI
    updateCategoryUI('Semua Kategori');

    const links = document.querySelectorAll('.links p, [class*="links-text-btn"]');
    links.forEach((link) => {
        link.style.cursor = 'pointer';
        link.style.pointerEvents = 'auto';

        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const catName = this.innerText.trim();
            if (catName) {
                currentCategory = catName;
                updateCategoryUI(catName);
                applyAllFilters();
            }
        });
    });
}

function setupPriceFilters() {
    const priceFilters = [
        { selector: '.checkbox1', range: 'All Price', min: 0, max: 9999999 },
        { selector: '.checkbox2', range: 'Rp50.000 - Rp99.999', min: 50000, max: 99999 },
        { selector: '.checkbox3', range: 'Rp100.000 - Rp199.999', min: 100000, max: 199999 },
        { selector: '.checkbox4', range: 'Rp200.000 - Rp299.999', min: 200000, max: 299999 },
        { selector: '.checkbox5', range: 'Rp300.000 - 499.999', min: 300000, max: 499999 }
    ];

    function updateCheckboxUI(activeSelector) {
        priceFilters.forEach(pf => {
            const container = document.querySelector(pf.selector);
            if (!container) return;
            const btn = container.querySelector('.checkbox-ratio-btn1, .checkbox-ratio-btn2');
            const text = container.querySelector('p');
            
            if (pf.selector === activeSelector) {
                if (btn) {
                    btn.style.background = '#820805';
                    btn.style.backgroundColor = '#820805';
                    btn.style.border = '2px solid #820805';
                    btn.style.borderRadius = '5px';
                    btn.style.display = 'flex';
                    btn.style.alignItems = 'center';
                    btn.style.justifyContent = 'center';
                    btn.innerHTML = '<span style="color: #ffffff; font-weight: bold; font-size: 13px; line-height: 1;">&#10003;</span>';
                }
                if (text) {
                    text.style.fontWeight = '700';
                    text.style.color = '#555555';
                }
            } else {
                if (btn) {
                    btn.style.background = '#ffffff';
                    btn.style.backgroundColor = '#ffffff';
                    btn.style.border = '2px solid #6c7275';
                    btn.style.borderRadius = '5px';
                    btn.innerHTML = '';
                }
                if (text) {
                    text.style.fontWeight = '600';
                    text.style.color = '#6c7275';
                }
            }
        });
    }

    // Default: set All Price active on load
    updateCheckboxUI('.checkbox1');

    priceFilters.forEach(pf => {
        const container = document.querySelector(pf.selector);
        if (container) {
            container.style.cursor = 'pointer';
            
            const handleFilterClick = function(e) {
                e.stopPropagation();
                updateCheckboxUI(pf.selector);
                currentPriceFilter = pf;
                applyAllFilters();
            };

            container.addEventListener('click', handleFilterClick);
            const childElements = container.querySelectorAll('p, .checkbox-ratio-btn1, .checkbox-ratio-btn2');
            childElements.forEach(child => {
                child.addEventListener('click', handleFilterClick);
            });
        }
    });
}

// Setup Beranda hotspot click events
function setupBerandaEvents() {
    const hotspots = document.querySelectorAll(".product-hotspot");
    if (!hotspots || hotspots.length === 0) return;

    let isAddingToCart = false;
    window.addEventListener("pageshow", function() {
        isAddingToCart = false;
    });

    hotspots.forEach(function(spot) {
        spot.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isAddingToCart) return;
            isAddingToCart = true;
            setTimeout(() => { isAddingToCart = false; }, 500);

            const name = spot.getAttribute("data-name") || "Produk";
            const price = parseInt(spot.getAttribute("data-price"), 10) || 0;
            const img = spot.getAttribute("data-img") || "assets/card-img3.png";
            const color = spot.getAttribute("data-color") || "Ungu";

            loadCartFromStorage();
            const cleanName = name.trim();
            const existing = cartItems.find(i => i.name.toLowerCase().trim() === cleanName.toLowerCase());
            
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
                if (img) existing.image = img;
            } else {
                cartItems.push({
                    id: Date.now() + '_' + Math.floor(Math.random() * 1000),
                    name: cleanName,
                    price: price,
                    quantity: 1,
                    image: img,
                    color: color
                });
            }
            
            saveCartToStorage();
            window.location.href = "keranjang.html";
        });
    });
}

// Setup Beranda search input & filtering (stays on Beranda)
function setupHomeSearch() {
    const homeInput = document.querySelector('#home-search-input');
    const homeBtn = document.querySelector('#home-search-button');
    
    if (!homeInput) return;

    function filterBerandaProducts(query) {
        const q = (query || '').toLowerCase().trim();
        // Target all product cards on Beranda (row3: Produk Terbaru, row4: Rekomendasi)
        const cards = document.querySelectorAll('.row3 > div, .row4 > div');
        let visibleCount = 0;

        cards.forEach(card => {
            const titleElem = card.querySelector('.column-text1, .column-text3, .column-text');
            const name = titleElem ? titleElem.innerText.toLowerCase() : '';
            if (!q || name.includes(q)) {
                card.style.setProperty('display', '', '');
                card.classList.remove('filter-hidden');
                visibleCount++;
            } else {
                card.style.setProperty('display', 'none', 'important');
                card.classList.add('filter-hidden');
            }
        });

        // Toggle empty search message if no products match query
        let row3 = document.querySelector('.row3');
        let emptyMsg = document.querySelector('.no-beranda-search-msg');
        if (visibleCount === 0 && q !== '') {
            if (!emptyMsg && row3) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = 'no-beranda-search-msg';
                emptyMsg.style.cssText = 'width: 100%; padding: 30px 20px; text-align: center; color: #820805; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 600; background: #fff5f5; border-radius: 12px; border: 1px dashed #ffa2a2; margin: 15px 0; grid-column: 1 / -1;';
                emptyMsg.textContent = `Bunga "${query}" tidak ditemukan di Beranda.`;
                row3.appendChild(emptyMsg);
            } else if (emptyMsg) {
                emptyMsg.textContent = `Bunga "${query}" tidak ditemukan di Beranda.`;
                emptyMsg.style.display = 'block';
            }
        } else if (emptyMsg) {
            emptyMsg.style.display = 'none';
        }
    }

    homeInput.addEventListener('input', function() {
        filterBerandaProducts(this.value);
    });

    homeInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterBerandaProducts(this.value);
        }
    });

    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            filterBerandaProducts(homeInput.value);
        });
    }
}

// Check URL search params when opening produk.html from Beranda
function checkUrlSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.value = searchParam;
            currentSearchQuery = searchParam.trim();
            applyAllFilters();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    setupBerandaEvents();
    setupProductPageEvents();
    applyAllFilters();
    setupSearchInput();
    setupHomeSearch();
    checkUrlSearchQuery();
    setupCategoryFilters();
    setupPriceFilters();
    addAnimations();
    console.log('Fleurahita script initialized with', cartItems.length, 'items');
});
