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

    const cached = sessionStorage.getItem('component:' + path);
    if (cached) {
        target.innerHTML = cached;
        return true;
    }

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Gagal memuat ' + path + ' (status ' + res.status + ')');
        const html = await res.text();
        target.innerHTML = html;
        sessionStorage.setItem('component:' + path, html);
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [sidebarLoaded, navbarLoaded] = await Promise.all([
            loadComponent('sidebar-container', '/components/sidebar.html'),
            loadComponent('navbar-container', '/components/navbar.html')
        ]);

        if (sidebarLoaded) {
            setActiveSidebarMenu();
        }
    } catch (err) {
        console.error('Error during component initialization:', err);
    }
});

