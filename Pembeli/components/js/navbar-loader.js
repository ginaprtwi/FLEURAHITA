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
            if (page === currentPage || (currentPage === '' && page === 'beranda')) {
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
        const cartTotalElement = document.getElementById('cartTotal');
        if(cartTotalElement) {
            cartTotalElement.textContent = formatRupiah(amount);
        }
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
        updateCart(0);
        
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
            console.error('Error loading navbar:', error);
        });
})();