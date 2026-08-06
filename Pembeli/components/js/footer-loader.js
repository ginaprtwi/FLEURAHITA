(function() {
    // Load footer HTML then initialize
    fetch('../components/footer.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const footer = doc.querySelector('footer');
            
            if (footer) {
                const container = document.getElementById('footer-container');
                if (container) {
                    container.innerHTML = footer.outerHTML;
                    initFooterEvents();
                }
            } else {
                console.error('Footer element not found in footer.html');
            }
        })
        .catch(error => {
            console.warn('Loading footer via fallback due to fetch restriction/CORS:', error);
            const fallbackHTML = `
                <footer class="fleurahita-footer-wrapper">
                    <div class="fleurahita-footer-container">
                        
                        <!-- Column 1: Brand & Contact -->
                        <div class="footer-col footer-col-brand">
                            <h2 class="footer-brand-title">FLEURAHITA</h2>
                            <p class="footer-subtitle">Buket bunga no 1 di Kota Bandung</p>

                            <!-- Contact Box -->
                            <div class="footer-contact-box">
                                <div class="contact-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>08956789000</span>
                                </div>
                                <div class="contact-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>fleurahita@gmail.com</span>
                                </div>
                                <div class="contact-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <span>Jalan Dago No.20</span>
                                </div>
                            </div>

                            <!-- Search Box -->
                            <div class="footer-search-box">
                                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input type="text" id="footer-search-input" placeholder="Cari">
                            </div>

                            <!-- Social Icons -->
                            <div class="footer-social-icons">
                                <a href="https://facebook.com" target="_blank" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="https://wa.me/6289567890000" target="_blank" aria-label="WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Column 2: Profil Saya -->
                        <div class="footer-col footer-col-links">
                            <h3 class="footer-heading">Profil Saya</h3>
                            <ul class="footer-link-list">
                                <li><a href="beranda.html">Dashboard</a></li>
                                <li><a href="detail_akun.html">Profil Saya</a></li>
                                <li><a href="histori_pesanan.html">Pesanan Saya</a></li>
                                <li><a href="histori_pesanan.html">Penilaian Saya</a></li>
                            </ul>
                        </div>

                        <!-- Column 3: Produk -->
                        <div class="footer-col footer-col-links">
                            <h3 class="footer-heading">Produk</h3>
                            <ul class="footer-link-list">
                                <li><a href="produk.html">Happy Wedding</a></li>
                                <li><a href="produk.html">Birthday Party</a></li>
                                <li><a href="produk.html">Personal Gifts</a></li>
                                <li><a href="produk.html">Congraduation!</a></li>
                            </ul>
                        </div>

                    </div>
                </footer>
            `;
            const container = document.getElementById('footer-container');
            if (container) {
                container.innerHTML = fallbackHTML;
                initFooterEvents();
            }
        });

    function initFooterEvents() {
        const footerSearch = document.querySelector('#footer-search-input, .footer-search-box input');
        if (footerSearch) {
            footerSearch.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query) {
                        window.location.href = `produk.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }
})();
