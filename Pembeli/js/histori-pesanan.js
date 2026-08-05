/* ============================================================
   FLEURAHITA — Histori Pesanan
   Fungsionalitas: render riwayat pesanan, tombol "Beli Lagi"
   (hanya status Diterima) menambah produk ke keranjang,
   sinkronisasi nama di sidebar, total keranjang, dan navigasi.
   Data diakses lewat FleuraData (js/data.js).
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Elemen halaman ---------- */
    var ordersList = document.getElementById('ordersList');
    var cartTotalEl = document.getElementById('cartTotal');
    var namaSidebar = document.getElementById('namaSidebar');

    /* ---------- Akses data (via data layer) ---------- */
    function loadOrders() { return FleuraData.load('orders'); }
    function loadCart() { return FleuraData.load('cart'); }
    function saveCart(cart) { return FleuraData.save('cart', cart); }

    function canRebuy(item) {
        return String(item.status || '').trim().toLowerCase() === 'diterima';
    }

    /* ---------- Update total keranjang di header ---------- */
    function updateCartTotal() {
        if (!cartTotalEl) { return; }
        var total = loadCart().reduce(function (sum, item) {
            return sum + (Number(item.harga) || 0) * (Number(item.qty) || 1);
        }, 0);
        cartTotalEl.textContent = FleuraData.formatRupiah(total);
    }

    /* ---------- Render daftar pesanan ---------- */
    function renderOrders() {
        var orders = loadOrders();

        if (!orders.length) {
            ordersList.innerHTML = '<div class="orders-empty">Belum ada pesanan. Yuk, belanja di FLEURAHITA!</div>';
            return;
        }

        ordersList.innerHTML = orders.map(function (item) {
            return '' +
                '<div class="order-item" data-id="' + item.id + '">' +
                    '<div class="order-product">' +
                        '<img class="order-img" alt="' + (item.nama || 'Produk') + '" />' +
                        '<div class="order-info">' +
                            '<p class="order-name"></p>' +
                            '<p class="order-variant"></p>' +
                        '</div>' +
                    '</div>' +
                    '<p class="order-price"></p>' +
                    '<p class="order-status"></p>' +
                    '<div class="order-action">' +
                        (canRebuy(item) ? '<button type="button" class="btn-beli-lagi" data-action="beli-lagi">Beli Lagi</button>' : '') +
                    '</div>' +
                '</div>';
        }).join('');

        var items = ordersList.querySelectorAll('.order-item');
        orders.forEach(function (item, index) {
            var el = items[index];
            var img = el.querySelector('.order-img');
            img.src = item.img || '/pembeli/assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png';
            el.querySelector('.order-name').textContent = item.nama || '-';
            el.querySelector('.order-variant').textContent = item.variant || '';
            el.querySelector('.order-price').textContent = FleuraData.formatRupiah(Number(item.harga) || 0);

            var statusEl = el.querySelector('.order-status');
            statusEl.textContent = item.status || '-';
            statusEl.className = 'order-status status-' + String(item.status || '').toLowerCase().replace(/\s+/g, '-');
        });
    }

    /* ---------- Beli lagi: tambah produk ke keranjang ---------- */
    function onBeliLagi(id) {
        var item = loadOrders().filter(function (o) { return o.id === id; })[0];
        if (!item) { return; }

        var cart = loadCart();
        var existing = cart.filter(function (c) { return c.id === item.id; })[0];

        if (existing) {
            existing.qty = (Number(existing.qty) || 1) + 1;
        } else {
            cart.push({
                id: item.id,
                nama: item.nama,
                harga: item.harga,
                img: item.img,
                qty: 1
            });
        }

        if (!saveCart(cart)) {
            FleuraData.toast('Gagal menambahkan ke keranjang. Coba lagi.', 'error');
            return;
        }

        updateCartTotal();
        FleuraData.toast('"' + (item.nama || 'Produk') + '" ditambahkan ke keranjang.', 'success');
    }

    /* ---------- Inisialisasi ---------- */
    function init() {
        FleuraData.applySidebarName(namaSidebar);
        updateCartTotal();
        renderOrders();

        ordersList.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-action]');
            if (!btn) { return; }
            var item = btn.closest('.order-item');
            if (!item) { return; }
            if (btn.getAttribute('data-action') === 'beli-lagi') {
                onBeliLagi(item.getAttribute('data-id'));
            }
        });

        FleuraData.bindNavigation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
