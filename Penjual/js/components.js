/**
 * components.js
 * Loader untuk komponen navbar & sidebar.
 * Mendukung akses via HTTP server (localhost) maupun file:// protocol.
 */

// Deteksi base URL untuk resolving path asset & CSS di dalam komponen
const COMPONENT_BASE = (() => {
    const loc = window.location;
    if (loc.protocol === 'file:') {
        // file:// — hitung path ke folder Penjual
        const parts = loc.pathname.replace(/\\/g, '/').split('/');
        const penjualIdx = parts.findIndex(p => p === 'Penjual');
        if (penjualIdx !== -1) {
            return parts.slice(0, penjualIdx + 1).join('/');
        }
        // fallback: satu level up dari Pages/
        return parts.slice(0, parts.length - 2).join('/');
    }
    // HTTP — pakai origin + path ke /Penjual
    return loc.origin + '/Penjual';
})();

async function loadComponent(targetId, path) {
    const target = document.getElementById(targetId);
    if (!target) {
        console.warn('Target element #' + targetId + ' tidak ditemukan');
        return false;
    }

    try {
        let html;

        if (window.location.protocol === 'file:') {
            // file:// tidak bisa fetch relative path — inject HTML langsung
            if (path.includes('sidebar')) {
                html = getSidebarHTML();
            } else if (path.includes('navbar')) {
                html = getNavbarHTML();
            } else {
                throw new Error('Komponen tidak dikenal: ' + path);
            }
        } else {
            const res = await fetch(path, { cache: 'no-cache' });
            if (!res.ok) throw new Error('Gagal memuat ' + path + ' (status ' + res.status + ')');
            html = await res.text();
            // Hapus tag <meta>, <link>, <head> dari HTML komponen
            // agar tidak duplikasi stylesheet yang sudah ada di halaman
            html = html.replace(/<meta[^>]*>/gi, '');
            html = html.replace(/<link[^>]*>/gi, '');
        }

        target.innerHTML = html;
        return true;
    } catch (err) {
        console.error(err);
        target.innerHTML = '<p style="color:red;padding:8px;font-size:12px;">Komponen gagal dimuat: ' + path + '</p>';
        return false;
    }
}

// ─── Sidebar HTML inline (fallback & file:// mode) ─────────────────
function getSidebarHTML() {
    return `
<div class="sidebar-menu card-light2">
    <div class="menu menu1">
        <button class="btn-light-a btn-light2 hover-dark" onclick="location.href='beranda-fix.html'">
            <div class="icon-ly-light-outline-home icon-ly-light1">
                <img src="../assets/icon-ly-light-outline-home/icon-ly-light-outline-home-home.png"
                     class="icon-ly-light-outline-home-home" alt="" />
            </div>
            <p class="label">Beranda</p>
        </button>

        <button class="btn-light-a btn-light3 hover-dark" onclick="location.href='produk-saya.html'">
            <div class="icon-ly-light-outline-home icon-ly-light1">
                <object data="../assets/row/row-streamline.svg"
                        class="row-iconly-light-outline-arrow-a row-vuesax-outline1"
                        type="image/svg+xml"></object>
            </div>
            <p class="label">Produk Saya</p>
        </button>

        <button class="btn-light-e btn-light3 hover-dark" onclick="location.href='pesanan-masuk.html'">
            <div class="icon-ly-light-outline-document icon-ly-light5">
                <img src="../assets/icon-ly-light-outline-document/icon-ly-light-outline-document-img.png"
                     class="icon-ly-light-outline-document-img" alt="" />
                <object data="../assets/icon-ly-light-outline-document/icon-ly-light-outline-document-fill.svg"
                        class="icon-ly-light-outline-document-fill icon-ly-light-outline-document-fill1"
                        type="image/svg+xml"></object>
                <object data="../assets/icon-ly-light-outline-document/icon-ly-light-outline-document-fill2.svg"
                        class="icon-ly-light-outline-document-fill icon-ly-light-outline-document-fill2"
                        type="image/svg+xml"></object>
                <object data="../assets/icon-ly-light-outline-document/icon-ly-light-outline-document-fill2.svg"
                        class="icon-ly-light-outline-document-fill icon-ly-light-outline-document-fill3"
                        type="image/svg+xml"></object>
            </div>
            <p class="text-b">Pesanan Masuk</p>
        </button>

        <button class="btn-light-a btn-light3 hover-dark" onclick="location.href='pengiriman.html'">
            <div class="icon-ly-light-outline-home icon-ly-light1">
                <object data="../assets/row/row-mdi-light.svg"
                        class="row-iconly-light-outline-arrow-a row-vuesax-outline1"
                        type="image/svg+xml"></object>
            </div>
            <p class="label">Pengiriman</p>
        </button>

        <button class="btn-light4 hover-dark" onclick="location.href='chat-komplain.html'">
            <div class="icon-ly-light-outline-chat icon-ly-light6">
                <div class="icon-ly-light-outline-chat-chat">
                    <object data="../assets/chat-komplain/icon-ly-light-outline-chat-chat/icon-ly-light-outline-chat-fill.svg"
                            class="icon-ly-light-outline-chat-fill" type="image/svg+xml"></object>
                    <object data="../assets/chat-komplain/icon-ly-light-outline-chat-chat/icon-ly-light-outline-chat-fill.svg"
                            class="icon-ly-light-outline-chat-fill" type="image/svg+xml"></object>
                    <object data="../assets/chat-komplain/icon-ly-light-outline-chat-chat/icon-ly-light-outline-chat-fill.svg"
                            class="icon-ly-light-outline-chat-fill" type="image/svg+xml"></object>
                </div>
            </div>
            <p class="text-b">Chat &amp; Komplain</p>
        </button>
    </div>

    <div class="line-a"></div>

    <div class="sidebar-menu-col-bottom">
        <div class="row-d row-top3">
            <object data="../assets/row/row-ant-design.svg"
                    class="row-iconly-light-outline-arrow-a row-vuesax-outline1"
                    type="image/svg+xml"></object>
            <p class="label">Profil Toko</p>
        </div>

        <div class="row-b row5">
            <object data="../assets/row/row-vuesax-outline.svg"
                    class="row-vuesax-outline-user-octagon row-streamline"
                    type="image/svg+xml"></object>
            <p class="text-a">Akun Saya</p>
        </div>

        <button class="btn-light-d btn-light5 hover-dark" onclick="location.href='keuangan.html'">
            <div class="icon-ly-light-outline-wallet icon-ly-light4">
                <div class="icon-ly-light-outline-wallet-group">
                    <object data="../assets/icon-ly-light-outline-wallet-group/icon-ly-light-outline-wallet-fill.svg"
                            class="icon-ly-light-outline-wallet-fill1" type="image/svg+xml"></object>
                    <object data="../assets/icon-ly-light-outline-wallet-group/icon-ly-light-outline-wallet-fill2.svg"
                            class="icon-ly-light-outline-wallet-fill2" type="image/svg+xml"></object>
                </div>
                <img src="../assets/icon-ly-light-outline-wallet/icon-ly-light-outline-wallet-img.png"
                     class="icon-ly-light-outline-wallet-img" alt="" />
                <object data="../assets/icon-ly-light-outline-wallet/icon-ly-light-outline-wallet-fill.svg"
                        class="icon-ly-light-outline-wallet-fill3" type="image/svg+xml"></object>
            </div>
            <p class="label">Keuangan</p>
        </button>

        <button class="btn-light-a hover-dark"
                onclick="localStorage.clear();sessionStorage.clear();location.href='/Auth/Login/log-in-user.html'">
            <div class="icon-ly-light-outline-home icon-ly-light1">
                <object data="../assets/row/row-iconly-light.svg"
                        class="row-iconly-light-outline-arrow-a row-vuesax-outline1"
                        type="image/svg+xml"></object>
            </div>
            <p class="label">Logout</p>
        </button>
    </div>
</div>`;
}

// ─── Navbar HTML inline (fallback & file:// mode) ──────────────────
function getNavbarHTML() {
    return `
<div class="navbar-wrapper">
    <div class="navbar-brand">
        <div class="logo-circle">
            <img src="../assets/row-column/row-img.png" alt="FLEURAHITA Logo" class="logo-img" />
        </div>
        <span class="brand-name">FLEURAHITA</span>
    </div>
    <button id="btn-sidebar-toggle" class="sidebar-toggle-btn" aria-label="Buka menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="#820805" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    </button>
</div>`;
}

// ─── Mark active menu item ──────────────────────────────────────────
function setActiveSidebarMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebar = document.querySelector('.sidebar-menu');
    if (!sidebar) return;

    sidebar.querySelectorAll('[onclick]').forEach(el => {
        const attr = el.getAttribute('onclick') || '';
        if (attr.includes(currentPage)) {
            // Remove opacity from btn-light classes and add active style
            el.classList.add('active');
            el.style.opacity = '1';
        }
    });
}

// ─── Sidebar toggle (mobile drawer) ────────────────────────────────
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar-container');
    if (!sidebar) return;

    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    // The toggle button is inside navbar-container (injected after load)
    // Use event delegation on document
    document.addEventListener('click', e => {
        const btn = e.target.closest('#btn-sidebar-toggle');
        if (btn) {
            e.stopPropagation();
            sidebar.classList.contains('mobile-active')
                ? closeSidebarDrawer()
                : openSidebarDrawer();
        }
    });

    backdrop.addEventListener('click', closeSidebarDrawer);

    sidebar.addEventListener('click', e => {
        if (window.innerWidth <= 1024 &&
            (e.target.closest('button') || e.target.closest('a'))) {
            closeSidebarDrawer();
        }
    });
}

function openSidebarDrawer() {
    const sidebar   = document.getElementById('sidebar-container');
    const backdrop  = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    if (sidebar)  sidebar.classList.add('mobile-active');
    if (backdrop) backdrop.classList.add('active');
    if (toggleBtn) toggleBtn.classList.add('hidden-when-drawer-open');
}

function closeSidebarDrawer() {
    const sidebar   = document.getElementById('sidebar-container');
    const backdrop  = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    if (sidebar)  sidebar.classList.remove('mobile-active');
    if (backdrop) backdrop.classList.remove('active');
    if (toggleBtn) toggleBtn.classList.remove('hidden-when-drawer-open');
}

// ─── Init ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [sidebarOk, navbarOk] = await Promise.all([
            loadComponent('sidebar-container', '../components/sidebar.html'),
            loadComponent('navbar-container',  '../components/navbar.html')
        ]);

        if (sidebarOk) setActiveSidebarMenu();
        initSidebarToggle();
    } catch (err) {
        console.error('Component init error:', err);
    }
});

