// sidebar.js
// Bikin menu sidebar kiri (Akun Saya, Alamat, Keranjang, Pesanan Saya, Chat & Ulasan, Keluar) fungsional:
// - Klik -> pindah ke halaman tujuan
// - Otomatis kasih warna merah + garis bawah ke menu yang sesuai halaman aktif
// - "Keluar" khusus: bukan pindah halaman biasa, tapi proses logout
//
// Sama seperti navbar.js, elemen dicari berdasarkan TEKSNYA, bukan nama class,
// biar tetap jalan walau nama class beda-beda tiap halaman (khas hasil export Anima/Figma).
//
// Tempel <script src="sidebar.js"></script> sebelum </body> di halaman yang PUNYA sidebar ini
// (Akun Saya, Alamat, Keranjang, Pesanan Saya, Chat & Ulasan).

document.addEventListener('DOMContentLoaded', () => {
  // TODO: sesuaikan nama file kalau beda dari punya kamu
  const SIDEBAR_PAGES = {
    'Akun Saya': 'detail_akun.html',
    'Alamat': 'alamat_profil.html',
    'Keranjang': 'keranjang_di_profil.html',
    'Pesanan Saya': 'pesanan-saya4.html',
    'Chat & Ulasan': 'chat&ulasan.html',
    // 'Keluar' sengaja tidak dikasih href, karena logout beda proses (lihat di bawah)
  };

  // TODO: ganti ini kalau halaman setelah logout bukan 'beranda.html'
  const LOGOUT_REDIRECT = 'beranda.html';

  const ACTIVE_COLOR = 'var(--main-color)';

  // Cari kandidat elemen menu di dalam sidebar saja (bukan di seluruh halaman),
  // supaya gak ketuker sama teks yang sama persis di footer (misal "Pesanan Saya" juga ada di footer)
  function getSidebarScope() {
    return (
      document.querySelector('.card-menu-col') ||
      document.querySelector('.card-menu') ||
      document.body
    );
  }

  function findByExactText(scope, label) {
    const candidates = Array.from(scope.querySelectorAll('p, a, span, div'));
    return candidates.find((el) => {
      const hasElementChildren = el.children.length > 0;
      const text = el.textContent.trim();
      return !hasElementChildren && text === label;
    }) || null;
  }

  const scope = getSidebarScope();

  const menuLabels = [...Object.keys(SIDEBAR_PAGES), 'Keluar'];
  const MENU_ITEMS = menuLabels.map((label) => ({
    label,
    href: SIDEBAR_PAGES[label] || null,
    el: findByExactText(scope, label),
  }));

  MENU_ITEMS.forEach((item) => {
    if (!item.el) {
      console.warn(`[sidebar.js] Menu "${item.label}" tidak ditemukan di halaman ini.`);
    }
  });

  function currentFileName() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function setActiveState() {
    const current = currentFileName();
    MENU_ITEMS.forEach((item) => {
      if (!item.el || !item.href) return; // "Keluar" dilewati, dia gak pernah "aktif"
      const isActive = item.href === current;
      if (isActive) {
        item.el.style.color = ACTIVE_COLOR;
        item.el.style.borderBottom = `1px solid ${ACTIVE_COLOR}`;
      } else {
        item.el.style.color = '';
        item.el.style.borderBottom = '';
      }
    });
  }

  function handleLogout() {
    const confirmLogout = window.confirm('Yakin ingin keluar dari akun?');
    if (!confirmLogout) return;

    // TODO: ganti dengan proses logout asli, misal:
    // await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('fleurahita_account');
    // hapus juga token/session lain di sini kalau ada, misal:
    // localStorage.removeItem('fleurahita_token');

    window.location.href = LOGOUT_REDIRECT;
  }

  MENU_ITEMS.forEach((item) => {
    if (!item.el) return;
    item.el.style.cursor = 'pointer';

    if (item.label === 'Keluar') {
      item.el.addEventListener('click', handleLogout);
    } else if (item.href) {
      item.el.addEventListener('click', () => {
        window.location.href = item.href;
      });
    }
  });

  setActiveState();
});