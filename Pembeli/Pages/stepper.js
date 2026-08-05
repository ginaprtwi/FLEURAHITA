// stepper.js
// Script generik buat stepper "Keranjang belanja / Detail pesanan / Pesanan selesai".
// Otomatis deteksi step aktif dari nama file halaman, highlight step yang sudah
// dilewati + step aktif (merah), dan bikin SEMUA step bisa diklik buat pindah
// halaman (maju atau mundur bebas).
//
// CARA PAKAI:
// 1. Di HTML, kasih setiap tombol step atribut data-step-page berisi nama file
//    halamannya, contoh:
//
//      <div class="process-b process1" id="order-stepper">
//          <div class="process-process4">
//              <button class="btn-a process-btn4 hover-bright" data-step-page="pilih_pengiriman.html">1</button>
//              <p class="text-d">Keranjang belanja</p>
//          </div>
//          <div class="process-process5">
//              <button class="btn-a process-btn5 hover-bright" data-step-page="pesanan-saya3.html">2</button>
//              <p class="text-e">Detail pesanan</p>
//          </div>
//          <div class="process-process6">
//              <button class="process-btn6 body-2-semi btn1 hover-bright" data-step-page="pesanan-saya4.html">3</button>
//              <p class="text-d process-text-order-complete2">Pesanan selesai</p>
//          </div>
//      </div>
//
// 2. Tempel <script src="stepper.js"></script> sebelum </body> di KETIGA halaman
//    (pilih_pengiriman.html, pesanan-saya3.html, pesanan-saya4.html).
//
// 3. Kalau nama file halaman kamu beda, tinggal ganti value data-step-page di HTML,
//    gak perlu ubah script ini.

(function () {
    function initStepper() {
        const stepper = document.getElementById('order-stepper');
        if (!stepper) {
            console.warn('[stepper.js] Elemen #order-stepper tidak ditemukan.');
            return;
        }

        const buttons = Array.from(stepper.querySelectorAll('[data-step-page]'));
        if (buttons.length === 0) {
            console.warn('[stepper.js] Tidak ada tombol dengan data-step-page di dalam #order-stepper.');
            return;
        }

        // Nama file halaman saat ini, misal "pesanan-saya3.html"
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Cari index step yang lagi aktif berdasarkan nama file
        let currentIndex = buttons.findIndex(
            (btn) => btn.getAttribute('data-step-page') === currentPage
        );
        if (currentIndex === -1) currentIndex = 0; // fallback: anggap step 1 kalau gak ketemu

        buttons.forEach((btn, index) => {
            const wrapper = btn.closest('[class*="process-process"]');
            const label = wrapper ? wrapper.querySelector('p') : null;

            // Reset kelas status sebelumnya (biar gak numpuk kalau initStepper dipanggil ulang)
            btn.classList.remove('step-completed', 'step-active', 'step-upcoming');
            if (label) label.classList.remove('step-completed', 'step-active', 'step-upcoming');

            if (index < currentIndex) {
                btn.classList.add('step-completed');
                if (label) label.classList.add('step-completed');
            } else if (index === currentIndex) {
                btn.classList.add('step-active');
                if (label) label.classList.add('step-active');
            } else {
                btn.classList.add('step-upcoming');
                if (label) label.classList.add('step-upcoming');
            }

            // Semua step bisa diklik, bebas maju/mundur
            btn.style.cursor = 'pointer';
            btn.onclick = () => {
                const targetPage = btn.getAttribute('data-step-page');
                if (targetPage && targetPage !== currentPage) {
                    window.location.href = targetPage;
                }
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStepper);
    } else {
        initStepper();
    }
})();