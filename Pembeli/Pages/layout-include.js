// layout-include.js
// Otomatis masukin navbar.html & footer.html ke halaman ini pakai <iframe>,
// dan bikin tinggi iframe-nya nyesuain otomatis (gak ada scrollbar aneh di dalam iframe).
//
// CARA PAKAI:
// 1. Di HTML halaman kamu, kasih 2 elemen kosong ini:
//      <div id="navbar-container"></div>
//      ... isi konten halaman ...
//      <div id="footer-container"></div>
//
// 2. Tempel <script src="layout-include.js"></script> sebelum </body>
//
// 3. Sesuaikan NAVBAR_PATH & FOOTER_PATH di bawah kalau lokasi file
//    navbar.html / footer.html kamu beda folder dari halaman ini.

(function () {
  // Path ini relatif dari halaman yang MEMANGGIL script ini.
  // navbar.html & footer.html sekarang ada di folder yang SAMA (Pages/)
  // dengan halaman-halaman lain, jadi tinggal nama filenya aja.
  const NAVBAR_PATH = 'navbar.html';
  const FOOTER_PATH = 'footer.html';

  function createLayoutIframe(src, containerId, iframeId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[layout-include.js] Elemen #${containerId} tidak ditemukan di halaman ini.`);
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.id = iframeId;
    iframe.setAttribute('scrolling', 'no');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.overflow = 'hidden';

    container.appendChild(iframe);
    return iframe;
  }

  const navbarFrame = createLayoutIframe(NAVBAR_PATH, 'navbar-container', 'navbarFrame');
  const footerFrame = createLayoutIframe(FOOTER_PATH, 'footer-container', 'footerFrame');

  // Auto-resize: iframe ngirim tinggi kontennya lewat postMessage,
  // halaman ini nangkep dan nyesuain style.height iframe-nya.
  //
  // MAX_HEIGHT ini jaring pengaman: navbar/footer normal gak bakal setinggi ini,
  // jadi kalau ada angka aneh (misal gara-gara bug loop di masa depan), dia
  // gak akan diterapkan dan malah dibuang.
  const MAX_HEIGHT = { 'navbar-height': 300, 'footer-height': 1200 };

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.source !== 'fleurahita-layout') return;

    const cap = MAX_HEIGHT[data.type];
    if (cap && data.height > cap) {
      console.warn(`[layout-include.js] Tinggi "${data.type}" (${data.height}px) melebihi batas wajar (${cap}px), diabaikan.`);
      return;
    }

    if (data.type === 'navbar-height' && navbarFrame) {
      navbarFrame.style.height = data.height + 'px';
    }
    if (data.type === 'footer-height' && footerFrame) {
      footerFrame.style.height = data.height + 'px';
    }
  });
})();