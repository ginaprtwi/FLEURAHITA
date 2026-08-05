// Footer Loader
// Fetch footer.html, suntikkan ke #footer-container, lalu pasang event klik.
// Catatan: <script> di dalam footer.html TIDAK ikut jalan waktu di-suntik lewat
// innerHTML (browser sengaja nggak eksekusi script yang masuk lewat cara itu),
// makanya semua logic klik link dipindah & ditulis ulang di sini.

(function () {
    function setupFooterLinks() {
        const currentPage = window.location.pathname.split('/').pop();

        const footerLinks = document.querySelectorAll('#footer-container [data-nav-link]');
        footerLinks.forEach((link) => {
            const page = link.getAttribute('data-page');

            if (page === currentPage) {
                link.classList.add('active');
            }

            link.addEventListener('click', function (e) {
                if (!page) return; // link "#" (sosmed) dibiarkan default
                e.preventDefault();
                window.location.href = page;
            });
        });
    }

    function initFooter() {
        fetch('../components/footer.html')
            .then((response) => response.text())
            .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const footer = doc.querySelector('footer');

                if (footer) {
                    document.getElementById('footer-container').innerHTML = footer.outerHTML;
                    setupFooterLinks();
                } else {
                    console.error('[footer-loader.js] Elemen <footer> tidak ditemukan di footer.html');
                }
            })
            .catch((error) => {
                console.error('[footer-loader.js] Gagal memuat footer:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', initFooter);
})();