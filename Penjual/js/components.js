/**
 * components.js
 * Loader untuk komponen navbar & sidebar yang dipakai berulang di banyak halaman.
 * Path komponen relatif terhadap file HTML yang memanggilnya (biasanya dari /Pages/).
 */

async function loadComponent(targetId, path) {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Gagal memuat ${path} (status ${res.status})`);
        target.innerHTML = await res.text();
    } catch (err) {
        console.error(err);
        target.innerHTML = `<p style="color:red">Komponen gagal dimuat: ${path}</p>`;
    }
}

// Highlight menu sidebar sesuai halaman aktif.
// Dipanggil setelah sidebar selesai di-load.
function setActiveSidebarMenu() {
    const currentPage = window.location.pathname.split('/').pop();

    // Cari semua elemen di sidebar yang punya onclick navigasi
    const sidebar = document.querySelector('.sidebar-menu');
    if (!sidebar) return;

    const menuItems = sidebar.querySelectorAll('[onclick]');
    menuItems.forEach(el => {
        const href = el.getAttribute('onclick');
        // Cocokkan dengan halaman saat ini
        if (href && href.includes(currentPage)) {
            el.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('sidebar-container', '../components/sidebar.html');
    await loadComponent('navbar-container', '../components/navbar.html');
    setActiveSidebarMenu();
});
