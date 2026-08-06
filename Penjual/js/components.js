/**
 * components.js
 * Loader untuk komponen navbar & sidebar.
 */

async function loadComponent(targetId, path) {
    const target = document.getElementById(targetId);
    if (!target) {
        console.warn('Target element #' + targetId + ' tidak ditemukan');
        return false;
    }

    try {
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Gagal memuat ' + path + ' (status ' + res.status + ')');
        const html = await res.text();
        target.innerHTML = html;
        return true;
    } catch (err) {
        console.error(err);
        target.innerHTML = '<p style="color:red">Komponen gagal dimuat: ' + path + '</p>';
        return false;
    }
}

function setActiveSidebarMenu() {
    let currentPage = window.location.pathname.split('/').pop();
    
    if (!currentPage) {
        currentPage = 'index.html'; 
    }

    const sidebar = document.querySelector('.sidebar-menu');
    if (!sidebar) return;

    const menuItems = sidebar.querySelectorAll('[onclick]');
    menuItems.forEach(el => {
        const targetAttr = el.getAttribute('onclick') || el.getAttribute('href');
        if (targetAttr && currentPage && targetAttr.includes(currentPage)) {
            el.classList.add('active');
        }
    });
}

function initSidebarToggle() {
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    const sidebar = document.getElementById('sidebar-container');
    
    if (!sidebar) return;

    // Buat backdrop overlay untuk drawer jika belum ada
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    if (toggleBtn) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            const isOpen = sidebar.classList.contains('mobile-active');
            if (isOpen) {
                closeSidebarDrawer();
            } else {
                openSidebarDrawer();
            }
        };
    }

    backdrop.onclick = () => {
        closeSidebarDrawer();
    };

    // Tutup drawer jika menu item diklik pada layar HP/Tablet
    sidebar.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && (e.target.closest('.sidebar-item') || e.target.closest('button') || e.target.closest('a'))) {
            closeSidebarDrawer();
        }
    });
}

function openSidebarDrawer() {
    const sidebar = document.getElementById('sidebar-container');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    if (sidebar) sidebar.classList.add('mobile-active');
    if (backdrop) backdrop.classList.add('active');
    if (toggleBtn) toggleBtn.classList.add('hidden-when-drawer-open');
}

function closeSidebarDrawer() {
    const sidebar = document.getElementById('sidebar-container');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    if (sidebar) sidebar.classList.remove('mobile-active');
    if (backdrop) backdrop.classList.remove('active');
    if (toggleBtn) toggleBtn.classList.remove('hidden-when-drawer-open');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [sidebarLoaded, navbarLoaded] = await Promise.all([
            loadComponent('sidebar-container', '../components/sidebar.html'),
            loadComponent('navbar-container', '../components/navbar.html')
        ]);

        if (sidebarLoaded) {
            setActiveSidebarMenu();
        }
        initSidebarToggle();
    } catch (err) {
        console.error('Error during component initialization:', err);
    }
});

