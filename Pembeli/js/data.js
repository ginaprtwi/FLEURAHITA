/* ============================================================
   FLEURAHITA — Lapisan data bersama (shared data layer)
   ------------------------------------------------------------
   Semua akses data (profil, alamat, pesanan, keranjang)
   terpusat di sini sehingga mudah diganti backend:

   Mode demo  : CONFIG.API_ENABLED = false -> pakai localStorage.
   Mode SQL   : CONFIG.API_ENABLED = true  -> terapkan fetch di
                bagian Backend (di bawah) menuju API backend SQL.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Konfigurasi ---------- */
    var CONFIG = {
        API_ENABLED: true,             // Diaktifkan untuk komunikasi ke backend Express SQL
        API_URL: '/api/pembeli/'       // Base URL API pembeli
    };

    /* ---------- Kunci localStorage ---------- */
    var KEYS = {
        profile: 'fleurahita.profile',
        addresses: 'fleurahita.addresses',
        orders: 'fleurahita.orders',
        cart: 'fleurahita.cart'
    };

    /* ---------- Peta halaman navigasi ---------- */
    var NAV_PAGES = {
        'akun-saya': 'detail_akun.html',
        'alamat': 'alamat_profil.html',
        'pesanan-saya': 'histori_pesanan.html'
    };

    /* ---------- Data awal (dummy fallback) ---------- */
    var DEFAULT = {
        profile: {
            namaLengkap: 'Gibran Rakabuming',
            namaPengguna: 'gibran.rakabuming',
            noTelp: '088975028233',
            email: 'gibran.rakabuming@gmail.com'
        },
        addresses: [
            {
                id: 'addr-1',
                label: 'Alamat Kantor',
                nama: 'Gibran Rakabuming',
                telp: '+62 0889 7502 8233',
                kelurahan: 'Gambir',
                kecamatan: 'Gambir',
                kota: 'Kota Jakarta Pusat',
                provinsi: 'DKI Jakarta',
                kodePos: '10110',
                detail: 'Jl. Veteran Jl. Istana Merdeka No.17, RT.2/RW.3, Gambir, Kecamatan Gambir, Kota Jakarta Pusat'
            }
        ],
        orders: [
            {
                id: 'order-1',
                nama: 'Lush and Plush',
                variant: 'Warna : Ungu',
                harga: 135000,
                status: 'Diproses',
                img: '../assets/profil/content-img1.png'
            },
            {
                id: 'order-2',
                nama: 'Sweet Aurora Bloom',
                variant: 'Color: Pink',
                harga: 500000,
                status: 'Diterima',
                img: '../assets/profil/content-img2.png'
            }
        ],
        cart: []
    };

    /* ---------- HTTP (dipakai saat API_ENABLED) ---------- */
    function http(method, path, body) {
        var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
        if (body !== undefined) { opts.body = JSON.stringify(body); }
        return fetch(CONFIG.API_URL + path, opts).then(function (res) {
            if (!res.ok) { throw new Error('HTTP ' + res.status); }
            return res.json();
        });
    }

    function readJSON(key) {
        var v = null;
        try { v = JSON.parse(localStorage.getItem(key)); } catch (e) { v = null; }
        return v;
    }

    function writeJSON(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    }

    /* ---------- Sync backend ke localStorage Cache ---------- */
    function syncFromBackend() {
        if (!CONFIG.API_ENABLED) return;
        
        // Load profile dari backend
        http('GET', 'profil').then(function (res) {
            if (res && res.success && res.data) {
                writeJSON(KEYS.profile, res.data);
                var el = document.getElementById('namaSidebar');
                if (el && res.data.namaLengkap) { el.textContent = res.data.namaLengkap; }
            }
        }).catch(function (err) { console.warn('Fetch profile fallback:', err); });

        // Load alamat dari backend
        http('GET', 'alamat').then(function (res) {
            if (res && res.success && res.data) {
                writeJSON(KEYS.addresses, res.data);
            }
        }).catch(function (err) { console.warn('Fetch alamat fallback:', err); });

        // Load histori pesanan dari backend
        http('GET', 'histori-pesanan').then(function (res) {
            if (res && res.success && res.data) {
                writeJSON(KEYS.orders, res.data);
            }
        }).catch(function (err) { console.warn('Fetch histori fallback:', err); });
    }

    // Jalankan sync backend secara otomatis
    syncFromBackend();

    /* ---------- Backend Data Access Layer ---------- */
    var Backend = {
        get: function (resource, fallback) {
            var v = readJSON(resource);
            return v === null || v === undefined ? fallback : v;
        },
        set: function (resource, data) {
            writeJSON(resource, data);

            if (CONFIG.API_ENABLED) {
                if (resource === KEYS.profile) {
                    http('PUT', 'profil', data).catch(function(e) { console.error('Save profile error:', e); });
                } else if (resource === KEYS.addresses) {
                    // Update ke backend jika item baru / diedit
                    http('GET', 'alamat').then(function(res) {
                        if (res && res.data) writeJSON(KEYS.addresses, res.data);
                    });
                }
            }
            return true;
        }
    };

    /* ---------- Helper umum ---------- */
    function fallbackFor(resource) {
        var d = DEFAULT[resource];
        return Array.isArray(d) ? d.slice() : Object.assign({}, d);
    }

    var toastTimer = null;
    function toast(message, type) {
        var el = document.getElementById('toast');
        if (!el) { return; }
        var icon = type === 'error' ? '&#9888;' : '&#10003;';
        el.className = 'toast show' + (type ? ' toast-' + type : '');
        el.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
    }

    function formatRupiah(n) {
        return 'Rp' + Number(n || 0).toLocaleString('id-ID').replace(/,/g, '.');
    }

    function applySidebarName(el) {
        var p = api.load('profile');
        if (el && p && p.namaLengkap) { el.textContent = p.namaLengkap; }
    }

    function bindNavigation() {
        document.querySelectorAll('[data-nav]').forEach(function (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                var href = NAV_PAGES[el.getAttribute('data-nav')];
                if (href) { window.location.href = href; }
                else { toast('Halaman belum tersedia.', 'error'); }
            });
        });
    }

    /* ---------- API publik ---------- */
    var api = {
        CONFIG: CONFIG,
        KEYS: KEYS,
        NAV_PAGES: NAV_PAGES,
        Backend: Backend,
        syncFromBackend: syncFromBackend,
        load: function (resource) { return Backend.get(KEYS[resource], fallbackFor(resource)); },
        save: function (resource, data) { return Backend.set(KEYS[resource], data); },
        toast: toast,
        formatRupiah: formatRupiah,
        applySidebarName: applySidebarName,
        bindNavigation: bindNavigation
    };

    window.FleuraData = api;
})();
