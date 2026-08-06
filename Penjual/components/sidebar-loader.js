// Sidebar Component Loader for Penjual
document.addEventListener('DOMContentLoaded', function() {
    // Load Sidebar
    fetch('../components/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            
            // Set active menu based on current page
            setActiveMenu();
            
            // Setup hamburger menu for mobile
            setupHamburgerMenu();
        })
        .catch(error => console.error('Error loading sidebar:', error));
    
    // Load Navbar (if navbar-container exists)
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        fetch('../components/navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarContainer.innerHTML = html;
                loadUserInfo();
            })
            .catch(error => console.error('Error loading navbar:', error));
    }
});

function setActiveMenu() {
    // Wait for sidebar HTML to be fully loaded
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Map page names to button selectors
        const pageButtonMap = {
            'beranda-fix.html': '.sidebar-menu .menu1 .btn-light2',
            'produk-saya.html': '.sidebar-menu .menu1 .btn-light3:nth-of-type(2)',
            'pesanan-masuk.html': '.sidebar-menu .menu1 .btn-light-e',
            'pengiriman.html': '.sidebar-menu .menu1 .btn-light3:nth-of-type(4)',
            'chat-komplain.html': '.sidebar-menu .menu1 .btn-light4',
            'akun-saya.html': '.sidebar-menu-col-bottom .btn-light4',
            'keuangan.html': '.sidebar-menu-col-bottom .btn-light-d'
        };
        
        // Get the button selector for current page
        const selector = pageButtonMap[currentPage];
        
        if (selector) {
            const activeButton = document.querySelector(selector);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
        
        // Fallback: try matching by onclick href
        const allButtons = document.querySelectorAll('.sidebar-menu button, .sidebar-menu-col-bottom button');
        allButtons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick && onclick.includes(currentPage)) {
                button.classList.add('active');
            }
        });
    }, 100);
}

function setupHamburgerMenu() {
    // Wait for both sidebar and navbar to be loaded
    setTimeout(() => {
        const hamburger = document.getElementById('btn-sidebar-toggle');
        const sidebar = document.querySelector('.card-light2');
        
        if (hamburger && sidebar) {
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                sidebar.classList.toggle('mobile-active');
            });
            
            // Close sidebar when menu item is clicked (mobile)
            const menuButtons = document.querySelectorAll('.sidebar-menu button, .sidebar-menu-col-bottom button');
            menuButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('mobile-active');
                    }
                });
            });
        }
    }, 200);
}

function loadUserInfo() {
    // Get user data from session/local storage
    const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
    
    if (user.namaLengkap) {
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = user.namaLengkap;
        }
    }
    
    if (user.fotoProfil) {
        const userAvatarElement = document.querySelector('.user-avatar img');
        if (userAvatarElement) {
            userAvatarElement.src = user.fotoProfil;
        }
    }
}

// Listen for storage changes (when profile is updated)
window.addEventListener('storage', function(e) {
    if (e.key === 'user' || e.key === null) {
        loadUserInfo();
    }
});

// Custom event for same-window storage updates
window.addEventListener('userUpdated', function() {
    loadUserInfo();
});