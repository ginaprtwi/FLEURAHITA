// navbar.js
// Bikin navbar (Beranda, Produk, Pesanan Saya) fungsional:
// - Klik -> pindah ke halaman tujuan (navigasi beneran, bisa bolak-balik pakai tombol back browser)
// - Otomatis kasih warna merah (var(--main-color)) ke menu yang sesuai dengan halaman yang lagi dibuka
//
// PENTING: sesuaikan value "href" di bawah dengan nama file halaman kamu yang sebenarnya.
// Tempel <script src="navbar.js"></script> sebelum </body> di SEMUA halaman
// (Beranda, Produk, Pesanan Saya, Akun Saya, dst) supaya statusnya konsisten di mana-mana.

document.addEventListener('DOMContentLoaded', () => {
  // TODO: ganti 'beranda.html', 'produk.html', 'pesanan-saya.html'
  // sesuai nama file asli di project kamu
  const NAV_ITEMS = [
    { el: document.querySelector('.auto-layout-horizontal-text-left'), href: 'beranda.html' },
    { el: document.querySelector('.auto-layout-horizontal-text'), href: 'produk.html' },
    { el: document.querySelector('.auto-layout-horizontal-text-pesanan-saya'), href: 'pesanan-saya4.html' },
  ];

  const ACTIVE_COLOR = 'var(--main-color)';

  function currentFileName() {
    const path = window.location.pathname;
    const name = path.substring(path.lastIndexOf('/') + 1);
    return name || 'index.html';
  }

  function setActiveState() {
    const current = currentFileName();
    NAV_ITEMS.forEach((item) => {
      if (!item.el) return;
      const isActive = item.href === current;
      if (isActive) {
        item.el.style.color = ACTIVE_COLOR;
        item.el.style.borderBottom = `1px solid ${ACTIVE_COLOR}`;
        item.el.style.paddingBottom = '2px';
      } else {
        item.el.style.color = '';
        item.el.style.borderBottom = '';
        item.el.style.paddingBottom = '';
      }
    });
  }

  NAV_ITEMS.forEach((item) => {
    if (!item.el) return;
    item.el.style.cursor = 'pointer';
    item.el.addEventListener('click', () => {
      window.location.href = item.href;
    });
  });

  setActiveState();
});
