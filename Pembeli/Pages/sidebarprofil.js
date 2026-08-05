// sidebar.js
// Bikin menu sidebar kiri (Akun Saya, Alamat, Keranjang, Pesanan Saya, Chat & Ulasan, Keluar) fungsional:
// - Klik -> pindah ke halaman tujuan
// - Otomatis kasih warna merah + garis bawah ke menu yang sesuai halaman aktif
// - "Keluar" khusus: bukan pindah halaman biasa, tapi proses logout
//
// Elemen dicari berdasarkan TEKSNYA, bukan nama class, biar tetap jalan walau
// nama class beda-beda tiap halaman (khas hasil export Anima/Figma).
//
// PERBAIKAN dari versi sebelumnya:
// Beberapa label sidebar ("Keranjang", "Pesanan Saya") juga muncul di tempat lain
// di halaman yang sama (ikon keranjang di header, link di footer). Kalau scope
// pencarian gagal ketemu wrapper sidebar (misal class-nya beda tiap halaman) dan
// jatuh ke fallback document.body, klik malah ke-bind ke elemen yang SALAH
// (header/footer), bukan item sidebar -> makanya "Keranjang" & "Pesanan Saya"
// kelihatan gak jalan padahal yang lain jalan.
//
// Sekarang scope ditentukan lewat elemen "Akun Saya", yang dipastikan cuma
// ada SATU di seluruh halaman (di dalam sidebar), lalu dipakai parent-nya
// sebagai area pencarian menu lain. Jadi gak bergantung sama nama class sama sekali.
//
// Tempel <script src="sidebar.js"></script> sebelum </body> di halaman yang PUNYA sidebar ini
// (Akun Saya, Alamat, Keranjang, Pesanan Saya, Chat & Ulasan).

document.addEventListener('DOMContentLoaded', () => {
  // TODO: sesuaikan nama file kalau beda dari punya kamu
  //
  // CATATAN: setiap menu boleh punya beberapa "alias" teks, karena ternyata
  // beberapa halaman pakai istilah yang beda buat menu yang sama
  // (contoh: halaman Akun Saya pakai "Pesanan Saya", halaman Alamat Saya
  // pakai "Histori Pesanan"). Kalau nemu variasi teks lain di halaman lain,
  // tinggal tambahin ke array alias-nya.
  const SIDEBAR_PAGES = [
    { aliases: ['Akun Saya'], href: 'detail_akun.html' },
    { aliases: ['Alamat'], href: 'alamat_profil.html' },
    { aliases: ['Keranjang'], href: 'keranjang_di_profil.html' },
    { aliases: ['Histori Pesanan'], href: 'histori_pesanan.html' },
    { aliases: ['Chat & Ulasan'], href: 'chat&ulasan.html' },
    // 'Keluar' sengaja tidak dikasih href, karena logout beda proses (lihat di bawah)
    { aliases: ['Keluar'], href: null },
  ];

  // TODO: ganti ini kalau halaman setelah logout bukan 'beranda.html'
  const LOGOUT_REDIRECT = 'beranda.html';

  const ACTIVE_COLOR = 'var(--main-color)';

  function findByExactText(scope, label) {
    const candidates = Array.from(scope.querySelectorAll('p, a, span, div'));
    return candidates.find((el) => {
      const hasElementChildren = el.children.length > 0;
      const text = el.textContent.trim();
      return !hasElementChildren && text === label;
    }) || null;
  }

  // Cari scope sidebar lewat "Akun Saya" (teksnya dijamin unik di seluruh halaman,
  // beda sama "Keranjang"/"Pesanan Saya" yang bisa dobel di header/footer).

    
function getSidebarScope() {
  const scope = document.querySelector('.card-menu-col');
  if (scope) return scope;
  console.warn('[sidebar.js] .card-menu-col tidak ditemukan, fallback ke pencarian teks.');

  const anchor = findByExactText(document.body, 'Akun Saya');
  if (anchor && anchor.parentElement) {
    return anchor.parentElement;
  }

  // fallback terakhir kalau "Akun Saya" beneran gak ketemu
  console.warn('[sidebar.js] Elemen "Akun Saya" tidak ditemukan, fallback ke class selector.');
  return (
    document.querySelector('.card-menu-col') ||
    document.querySelector('.card-menu') ||
    document.body
  );
}

  const scope = getSidebarScope();

  console.info('[sidebar.js] Scope sidebar yang dipakai:', scope);

  function findByAnyAlias(scope, aliases) {
    for (const alias of aliases) {
      const found = findByExactText(scope, alias);
      if (found) return { el: found, matchedAlias: alias };
    }
    return { el: null, matchedAlias: null };
  }

  const MENU_ITEMS = SIDEBAR_PAGES.map(({ aliases, href }) => {
    const { el, matchedAlias } = findByAnyAlias(scope, aliases);
    return { label: aliases[0], aliases, href, el, matchedAlias };
  });

  MENU_ITEMS.forEach((item) => {
    if (!item.el) {
      console.warn(
        `[sidebar.js] Menu "${item.label}" TIDAK ditemukan. Sudah dicoba alias: [${item.aliases.join(', ')}]. ` +
        `Cek apakah teksnya persis sama (termasuk spasi/kapital) atau ada elemen anak (icon/span) di dalamnya.`
      );
    } else {
      console.info(`[sidebar.js] Menu "${item.label}" ditemukan via teks "${item.matchedAlias}" ->`, item.el);
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

    if (item.aliases.includes('Keluar')) {
      item.el.addEventListener('click', handleLogout);
    } else if (item.href) {
      item.el.addEventListener('click', () => {
        window.location.href = item.href;
      });
    }
  });

  setActiveState();
});