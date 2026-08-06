// Navbar Loader with Authentication Check
// This script loads the navbar and checks user authentication status

(function() {
    // Check if user is logged in
    function checkLoginStatus() {
        const userLocal = localStorage.getItem('user');
        const userSession = sessionStorage.getItem('user');
        const user = userLocal || userSession;
        
        if (user) {
            try {
                const userData = JSON.parse(user);
                return { loggedIn: true, userData: userData };
            } catch (e) {
                console.error('Error parsing user data:', e);
                return { loggedIn: false, userData: null };
            }
        }
        return { loggedIn: false, userData: null };
    }

    // Show logged in navbar
    function showLoggedInNavbar(userData) {
        document.getElementById('cartButton').style.display = 'flex';
        document.getElementById('chatButton').style.display = 'flex';
        document.getElementById('profileButton').style.display = 'flex';
        document.getElementById('authButtons').style.display = 'none';
        
        const pesananLink = document.getElementById('pesananLink');
        if (pesananLink) pesananLink.style.display = 'block';
        
        // Set profile image - use user's photo or default avatar
        const profileImg = document.getElementById('profileImg');
        if (profileImg) {
            // Path from Pages/ folder perspective
            profileImg.src = userData.fotoProfil || '../assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png';
        }
        
        console.log('User logged in:', userData.namaLengkap || userData.email);
    }

    // Show logged out navbar
    function showLoggedOutNavbar() {
        document.getElementById('cartButton').style.display = 'none';
        document.getElementById('chatButton').style.display = 'none';
        document.getElementById('profileButton').style.display = 'none';
        document.getElementById('authButtons').style.display = 'flex';
        
        const pesananLink = document.getElementById('pesananLink');
        if (pesananLink) pesananLink.style.display = 'block';
    }

    // Navigation active state handler
    function setupNavigationLinks() {
        // Detect current page from URL
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        
        const navLinks = document.querySelectorAll('.fleurahita-nav-link');
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            
            // Set active class based on current page
            const isBeranda = (page === 'beranda' && (currentPage === 'beranda' || currentPage === '' || currentPage === 'index'));
            const isProduk = (page === 'produk' && currentPage === 'produk');
            const isPesanan = (page === 'pesanan' && (currentPage === 'histori_pesanan' || currentPage === 'detail_pesanan' || currentPage === 'pesanan'));

            if (isBeranda || isProduk || isPesanan) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
            
            // Handle pesanan page login check
            link.addEventListener('click', function(e) {
                if (page === 'pesanan') {
                    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
                    if (!user) {
                        e.preventDefault();
                        alert('Silakan login terlebih dahulu untuk melihat pesanan Anda.');
                        window.location.href = '../../Auth/Login/log-in-user.html';
                    }
                }
            });
        });
    }

    // Calculate total price from localStorage cart items
    function calculateCartTotalFromStorage() {
        try {
            const savedCart = localStorage.getItem('fleurahita_cart') || localStorage.getItem('cartItems');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                if (Array.isArray(items)) {
                    return items.reduce((sum, item) => {
                        const price = typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
                        const qty = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 1;
                        return sum + (price * qty);
                    }, 0);
                }
            }
        } catch (e) {
            console.error('Error calculating cart total in navbar:', e);
        }
        return 0;
    }

    // Format currency
    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Update cart total
    function updateCart(amount) {
        if (typeof amount !== 'number') {
            amount = calculateCartTotalFromStorage();
        }
        const cartTotalElements = document.querySelectorAll('#cartTotal, .fleurahita-cart-price, .header-text-rp, .frame-text-rp1');
        cartTotalElements.forEach(el => {
            el.textContent = formatRupiah(amount);
        });
    }

    // Action handlers
    window.handleCartClick = function() {
        window.location.href = 'keranjang.html';
    };

    window.handleChatClick = function() {
        window.location.href = 'chat.html';
    };

    // Toggle profile dropdown
    window.toggleProfileDropdown = function() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    };

    // Handle logout
    window.handleLogout = function(event) {
        event.preventDefault();
        const userConfirm = confirm('Yakin mau logout?');
        if (userConfirm) {
            logout();
        }
    };

    function logout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        alert('Anda telah logout');
        window.location.href = 'beranda.html';
    }

    // Listen for cart changes
    window.addEventListener('cartUpdated', function() {
        updateCart(calculateCartTotalFromStorage());
    });

    window.addEventListener('storage', function() {
        updateCart(calculateCartTotalFromStorage());
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const profileWrapper = document.querySelector('.fleurahita-profile-wrapper');
        const dropdown = document.getElementById('profileDropdown');
        
        if (profileWrapper && dropdown && !profileWrapper.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Initialize navbar
    function initNavbar() {
        const loginStatus = checkLoginStatus();
        
        if (loginStatus.loggedIn) {
            showLoggedInNavbar(loginStatus.userData);
        } else {
            showLoggedOutNavbar();
        }
        
        setupNavigationLinks();
        updateCart(calculateCartTotalFromStorage());
        
        // Show navbar actions after state is set (prevent FOUC)
        const navbarActions = document.querySelector('.fleurahita-navbar-actions');
        if (navbarActions) {
            navbarActions.classList.add('loaded');
        }
    }

    // Load navbar HTML then initialize
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(data => {
            // Extract only the header content (not the full HTML document)
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const header = doc.querySelector('header');
            
            if (header) {
                document.getElementById('navbar-container').innerHTML = header.outerHTML;
                // Initialize immediately - no delay needed
                initNavbar();
            } else {
                console.error('Header not found in navbar.html');
            }
        })
        .catch(error => {
            console.warn('Loading navbar via fallback due to fetch restriction/CORS:', error);
            const fallbackHTML = `
                <header class="fleurahita-navbar">
                    <a href="beranda.html" class="fleurahita-navbar-brand">
                        <div class="fleurahita-navbar-logo" title="Logo Fleurahita"></div>
                        <span class="fleurahita-navbar-title">FLEURAHITA</span>
                    </a>
                    <nav class="fleurahita-navbar-nav">
                        <a href="beranda.html" class="fleurahita-nav-link" data-page="beranda">Beranda</a>
                        <a href="produk.html" class="fleurahita-nav-link" data-page="produk">Produk</a>
                        <a href="histori_pesanan.html" class="fleurahita-nav-link" data-page="pesanan" id="pesananLink">Pesanan Saya</a>
                    </nav>
                    <div class="fleurahita-navbar-actions">
                        <div class="fleurahita-cart-wrapper" id="cartButton" style="display: none;" onclick="handleCartClick()">
                            <svg class="fleurahita-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <div class="fleurahita-cart-info">
                                <span class="fleurahita-cart-label">Keranjang</span>
                                <span class="fleurahita-cart-price" id="cartTotal">Rp 0,00</span>
                            </div>
                        </div>
                        <div class="fleurahita-chat-btn" id="chatButton" style="display: none;" onclick="handleChatClick()" title="Chat">
                            <svg class="fleurahita-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                <circle cx="8" cy="12" r="1.5"></circle>
                                <circle cx="12" cy="12" r="1.5"></circle>
                                <circle cx="16" cy="12" r="1.5"></circle>
                            </svg>
                        </div>
                        <div class="fleurahita-profile-wrapper" id="profileButton" style="display: none;">
                            <div class="fleurahita-profile-btn" onclick="toggleProfileDropdown()" title="Profil Saya">
                                <img src="../assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png" alt="Profile" id="profileImg">
                            </div>
                            <div class="fleurahita-profile-dropdown" id="profileDropdown">
                                <a href="detail_akun.html" class="fleurahita-dropdown-item">
                                    <svg class="fleurahita-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Akun Saya
                                </a>
                                <a href="#" onclick="handleLogout(event)" class="fleurahita-dropdown-item">
                                    <svg class="fleurahita-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </a>
                            </div>
                        </div>
                        <div class="fleurahita-auth-buttons" id="authButtons">
                            <a href="../../Auth/Login/log-in-user.html" class="fleurahita-btn-login">Masuk</a>
                            <a href="../../Auth/Register/register.html" class="fleurahita-btn-register">Daftar</a>
                        </div>
                    </div>
                </header>
            `;
            const container = document.getElementById('navbar-container');
            if (container) {
                container.innerHTML = fallbackHTML;
                initNavbar();
            }
        });
})();