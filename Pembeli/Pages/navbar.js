// navbar.js
// Bikin navbar (Beranda, Produk, Pesanan Saya) fungsional:
// - Klik -> pindah ke halaman tujuan (navigasi beneran, bisa bolak-balik pakai tombol back browser)
// - Otomatis kasih warna merah (var(--main-color)) ke menu yang sesuai dengan halaman yang lagi dibuka
// Plus: foto profil (avatar) di pojok kanan header bisa diklik -> redirect ke halaman Detail Akun.
//
// CATATAN: elemen navbar dicari berdasarkan TEKSNYA ("Beranda", "Produk", "Pesanan Saya"),
// bukan berdasarkan nama class. Ini sengaja, karena tools export (Anima/Figma-to-code) sering
// kasih nama class yang beda-beda di tiap halaman walau tampilannya sama persis.
// Avatar dicari lewat atribut `src` gambarnya (mengandung "avatar"), dengan alasan yang sama.
//
// Tempel <script src="navbar.js"></script> sebelum </body> di SEMUA halaman.

document.addEventListener('DOMContentLoaded', () => {
  // TODO: ganti 'beranda.html', 'produk.html', 'pesanan-saya.html'
  // sesuai nama file asli di project kamu
  const PAGES = {
    'Beranda': 'beranda.html',
    'Produk': 'produk.html',
    'Pesanan Saya': 'pilih_pengiriman.html',
  };

  // TODO: ganti kalau nama file halaman detail akun beda
  const DETAIL_AKUN_PAGE = 'detail_akun.html';

  const ACTIVE_COLOR = 'var(--main-color)';

  const headerScope = document.querySelector('header') || document.body;

  // Cari kandidat elemen navbar: prioritas di dalam <header>, kalau gak ada baru cari di seluruh dokumen
  function getCandidates() {
    return Array.from(headerScope.querySelectorAll('p, a, span, div'));
  }

  // Cari elemen yang teksnya PERSIS sama dengan label (bukan elemen pembungkus yang isinya banyak anak)
  function findByExactText(label) {
    const candidates = getCandidates();
    return candidates.find((el) => {
      // hindari elemen yang isinya banyak child element (misal wrapper besar)
      const hasElementChildren = el.children.length > 0;
      const text = el.textContent.trim();
      return !hasElementChildren && text === label;
    }) || null;
  }

  const NAV_ITEMS = Object.entries(PAGES).map(([label, href]) => ({
    label,
    href,
    el: findByExactText(label),
  }));

  // Kasih tau di console kalau ada menu yang gak ketemu, biar gampang di-debug
  NAV_ITEMS.forEach((item) => {
    if (!item.el) {
      console.warn(`[navbar.js] Menu "${item.label}" tidak ditemukan di halaman ini.`);
    }
  });

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

  // --- Avatar profil di pojok kanan header -> Detail Akun ---
  const avatarImg = headerScope.querySelector('img[src*="avatar" i]');

  if (!avatarImg) {
    console.warn('[navbar.js] Tidak menemukan gambar avatar di header (cek src-nya mengandung kata "avatar" atau tidak).');
  } else {
    avatarImg.style.cursor = 'pointer';
    avatarImg.addEventListener('click', () => {
      window.location.href = DETAIL_AKUN_PAGE;
    });
    console.info('[navbar.js] Avatar di header berhasil di-bind ke', DETAIL_AKUN_PAGE, avatarImg);
  }
});