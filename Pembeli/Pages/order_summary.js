// order_summary.js
// Ambil isi keranjang yang sama dari database dan render ke Order Summary di detail_pesanan.html
// Taruh SETELAH navbar-loader.js, SEBELUM alamat.js / pembayaran.js

const API_BASE = 'http://localhost:3000';

let cartItemsGlobal = []; // dipakai juga sama pembayaran.js buat isi pesan WhatsApp

document.addEventListener('DOMContentLoaded', () => {
    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!userRaw) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = '../../Auth/Login/log-in-user.html';
        return;
    }

    const user = JSON.parse(userRaw);
    loadOrderSummary(user.userId);
});

function formatRupiah(angka) {
    return 'Rp' + Number(angka).toLocaleString('id-ID');
}

function loadOrderSummary(userId) {
    fetch(`${API_BASE}/api/keranjang/${userId}`)
        .then((res) => res.json())
        .then((result) => {
            if (!result.success) throw new Error(result.message || 'Gagal memuat keranjang');
            cartItemsGlobal = result.data;
            renderOrderSummary(result.data);
        })
        .catch((err) => console.error('[order_summary.js] Gagal memuat order summary:', err));
}

function renderOrderSummary(items) {
    const container = document.getElementById('order-summary-products');
    if (!container) {
        console.error('[order_summary.js] #order-summary-products tidak ditemukan.');
        return;
    }

    // hapus semua blok produk lama, tapi PERTAHANKAN blok coupon di paling bawah
    const couponBlock = container.querySelector('.order-summary-coupon');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<p style="padding:20px 0;text-align:center;color:var(--neutral-04-100);">Keranjang kosong</p>`;
        if (couponBlock) container.appendChild(couponBlock);
        updateTotals([]);
        return;
    }

    items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'elements-checkout-order-cart-product';

        row.innerHTML = `
            <img src="../assets/pesanan-saya/${item.Foto_Produk}" class="elements-checkout-order-img" alt="${item.Nama_Produk}" />

            <div class="elements-checkout-order-info">
                <div class="elements-checkout-order-product">
                    <p class="elements-checkout-order-text-top body-xl">${item.Nama_Produk}</p>
                    <p class="text-c">Jumlah: ${item.Jumlah}</p>
                </div>

                <div class="elements-checkout-order-price">
                    <p class="elements-checkout-order-text1 caption-1-semi">${formatRupiah(item.Subtotal)}</p>
                </div>
            </div>
        `;

        container.appendChild(row);
    });

    if (couponBlock) container.appendChild(couponBlock);

    updateTotals(items);
}

const BATAS_GRATIS_ONGKIR = 200000;
const FLAT_ONGKIR = 15000;

function hitungOngkir(metode, subtotal) {
    if (metode === 'pickup') return 0;
    return subtotal >= BATAS_GRATIS_ONGKIR ? 0 : FLAT_ONGKIR;
}

function updateTotals(items) {
    const subtotalEl = document.getElementById('subtotalText');
    const totalEl = document.getElementById('totalText');
    const ongkosKirimEl = document.getElementById('ongkosKirimText');

    const subtotal = items.reduce((sum, item) => sum + Number(item.Subtotal), 0);

    const metode = sessionStorage.getItem('metodePengambilan') || 'pickup';
    const ongkir = hitungOngkir(metode, subtotal);

    const diskon = window.diskonAktif || 0;
    const potongan = subtotal * diskon;
    const total = subtotal - potongan + ongkir;

    if (ongkosKirimEl) ongkosKirimEl.textContent = ongkir === 0 ? 'Gratis' : formatRupiah(ongkir);
    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
    if (totalEl) totalEl.textContent = formatRupiah(total);
}