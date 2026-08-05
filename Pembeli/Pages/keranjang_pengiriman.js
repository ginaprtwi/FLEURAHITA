// keranjang_pengiriman.js
// Ambil isi keranjang dari database dan render ke halaman.
// Taruh <script src="../components/js/keranjang_pengiriman.js"></script> di pesanan-saya4.html, SETELAH navbar-loader.js

const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!userRaw) {
        alert('Silakan login terlebih dahulu untuk melihat keranjang Anda.');
        window.location.href = '../../Auth/Login/log-in-user.html';
        return;
    }

    const user = JSON.parse(userRaw);
    loadCart(user.userId);
    initShippingOptions();
    initNavigationButtons(); 
});

// Tombol "Tambah Pesanan" -> balik ke halaman produk buat nambah item lain
// Tombol "Pesan sekarang" -> lanjut ke step 2 (detail pesanan)
function initNavigationButtons() {
    const btnTambah = document.getElementById('btn-tambah-pesanan');
    const btnPesan = document.getElementById('btn-pesan-sekarang');
 
    if (btnTambah) {
        btnTambah.addEventListener('click', () => {
            window.location.href = 'produk.html';
        });
    }
 
    if (btnPesan) {
        btnPesan.addEventListener('click', () => {
            window.location.href = 'detail_pesanan.html';
        });
    }
}

function formatRupiah(angka) {
    return 'Rp' + Number(angka).toLocaleString('id-ID');
}

function loadCart(userId) {
    fetch(`${API_BASE}/api/keranjang/${userId}`)
        .then((res) => res.json())
        .then((result) => {
            if (!result.success) throw new Error(result.message || 'Gagal memuat keranjang');
            renderCart(result.data);
        })
        .catch((err) => console.error('[keranjang_pengiriman.js] Gagal memuat keranjang:', err));
}

function renderCart(items) {
    const container = document.getElementById('cart-items-container');
    if (!container) {
        console.error('[keranjang_pengiriman.js] #cart-items-container tidak ditemukan.');
        return;
    }

    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `
            <p style="padding: 40px 0; text-align: center; color: var(--neutral-04-100); font-size: 16px;">
                Anda belum memesan apapun. Silahkan tambah pesanan.
            </p>
        `;
        updateSummary([]);
        return;
    }

    items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'cart-elements-row';
        row.dataset.idKeranjang = item.id_Keranjang;

        row.innerHTML = `
            <div class="cart-item">
                <img src="../assets/pesanan-saya/${item.Foto_Produk}" class="cart-img" alt="${item.Nama_Produk}" />
                <div class="cart-info1">
                    <p class="cart-text-top caption-1-semi">${item.Nama_Produk}</p>
                    <div class="cart-btn" data-action="hapus">
                        <object data="../assets/cart-icons-close.svg" class="cart-icons-close-line cart-icons-close" type="image/svg+xml"></object>
                        <p class="cart-text-get caption-1-semi">Hapus</p>
                    </div>
                </div>
            </div>

            <div class="cart-info2">
                <div class="btn-quantity2 btn2">
                    <button class="qty-btn" data-action="kurang">-</button>
                    <p class="btn-quantity-label2 text-12px-semibold">${item.Jumlah}</p>
                    <button class="qty-btn" data-action="tambah">+</button>
                </div>
                <p class="cart-text-rp text-18px-regular">${formatRupiah(item.Harga)}</p>
                <p class="cart-text-right text-18px-semibold">${formatRupiah(item.Subtotal)}</p>
            </div>
        `;

        row.querySelector('[data-action="hapus"]').addEventListener('click', () => {
            deleteItem(item.id_Keranjang, row);
        });
        row.querySelector('[data-action="tambah"]').addEventListener('click', () => {
            updateQty(item.id_Keranjang, item.Jumlah + 1);
        });
        row.querySelector('[data-action="kurang"]').addEventListener('click', () => {
            if (item.Jumlah <= 1) return;
            updateQty(item.id_Keranjang, item.Jumlah - 1);
        });

        container.appendChild(row);
    });

    updateSummary(items);
}

// Render satu baris subtotal PER PRODUK di card kanan, plus baris Total di bawahnya
function updateSummary(items) {
    const listEl = document.getElementById('subtotal-list');
    const totalEl = document.querySelector('.elements-cart-summary-text-value2');

    if (!listEl) return;

    listEl.innerHTML = '';

    let total = 0;

    items.forEach((item) => {
        total += Number(item.Subtotal);

        const row = document.createElement('div');
        row.className = 'subtotal-row';
        row.innerHTML = `
            <p class="subtotal-value">${formatRupiah(item.Subtotal)}</p>
        `;
        listEl.appendChild(row);
    });

    if (items.length === 0) {
        listEl.innerHTML = '<p class="subtotal-label">Belum ada produk</p>';
    }

    if (totalEl) totalEl.textContent = formatRupiah(total);
}

function updateQty(idKeranjang, jumlahBaru) {
    fetch(`${API_BASE}/api/keranjang/${idKeranjang}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Jumlah: jumlahBaru }),
    })
        .then((res) => res.json())
        .then((result) => {
            if (!result.success) throw new Error(result.message);
            const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            loadCart(user.userId);
        })
        .catch((err) => console.error('[keranjang_pengiriman.js] Gagal update jumlah:', err));
}

function deleteItem(idKeranjang, rowEl) {
    fetch(`${API_BASE}/api/keranjang/${idKeranjang}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((result) => {
            if (!result.success) throw new Error(result.message);
            rowEl.remove();
            const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            loadCart(user.userId);
        })
        .catch((err) => console.error('[keranjang_pengiriman.js] Gagal hapus item:', err));
}

// Toggle Pick Up / Drop off -- pilihan disimpan di sessionStorage buat dipakai di halaman berikutnya
function initShippingOptions() {
    const options = document.querySelectorAll('.shipping-option');
    if (options.length === 0) return;

    options.forEach((opt) => {
        opt.addEventListener('click', () => {
            options.forEach((o) => o.classList.remove('is-active'));
            opt.classList.add('is-active');
            sessionStorage.setItem('metodePengambilan', opt.dataset.value);
        });
    });

    // Pulihkan pilihan sebelumnya kalau user balik ke halaman ini
    const saved = sessionStorage.getItem('metodePengambilan');
    if (saved) {
        options.forEach((o) => o.classList.toggle('is-active', o.dataset.value === saved));
    }
}