/**
 * produk-saya.js — Logika halaman Produk Saya (Penjual)
 * CRUD produk via /api/produk
 */

const API = window.location.origin.startsWith('http')
    ? `${window.location.origin}/api/produk`
    : 'http://localhost:3000/api/produk';

// Foto produk: coba dari /Pembeli/assets/produk/ (bila ada), fallback ke card images
const IMG_BASE     = '/Pembeli/assets/produk/';
const IMG_FALLBACKS = [
    '/Pembeli/assets/card/card-img.png',
    '/Pembeli/assets/card/card-img1.png',
    '/Pembeli/assets/card/card-img2.png',
    '/Pembeli/assets/card/card-img3.png',
    '/Pembeli/assets/card/card-img4.png',
];

function getFallbackImg(index) {
    return IMG_FALLBACKS[index % IMG_FALLBACKS.length];
}

let allProduk  = [];
let deletingId = null;

// ─── Helpers ─────────────────────────────────
function esc(s) {
    return String(s || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function rupiah(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function stokBadge(stok) {
    if (stok <= 0)  return `<span class="ps-stok-badge ps-stok-badge--zero">Habis</span>`;
    if (stok <= 5)  return `<span class="ps-stok-badge ps-stok-badge--low">${stok}</span>`;
    return `<span class="ps-stok-badge ps-stok-badge--ok">${stok}</span>`;
}

// ─── Render rows ─────────────────────────────
function renderRows(list) {
    const body = document.getElementById('ps-table-body');
    if (!list || list.length === 0) {
        body.innerHTML = `
            <div class="ps-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#820805" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <p>Belum ada produk. Klik <strong>Tambah Produk</strong> untuk mulai.</p>
            </div>`;
        return;
    }

    body.innerHTML = list.map((p, idx) => {
        const fallback = getFallbackImg(idx);
        const imgSrc = p.Foto_Produk
            ? (p.Foto_Produk.startsWith('http') ? p.Foto_Produk : `${IMG_BASE}${p.Foto_Produk}`)
            : fallback;

        return `
        <div class="ps-row" data-id="${p.id}">
            <div class="ps-cell-produk">
                <img src="${imgSrc}" class="ps-produk-img"
                     alt="${esc(p.Nama_Produk)}"
                     onerror="this.src='${fallback}'" />
                <div class="ps-produk-info">
                    <span class="ps-produk-nama">${esc(p.Nama_Produk)}</span>
                    <span class="ps-produk-kategori">${esc(p.Kategori)}</span>
                </div>
            </div>
            <div class="ps-cell-harga">${rupiah(p.Harga)}</div>
            <div class="ps-cell-stok">${stokBadge(p.Stok)}</div>
            <div class="ps-cell-aksi">
                <button class="ps-btn-edit"      data-id="${p.id}">✏️ Edit</button>
                <button class="ps-btn-hapus-row" data-id="${p.id}" data-nama="${esc(p.Nama_Produk)}">🗑️ Hapus</button>
            </div>
        </div>`;
    }).join('');
}

// ─── Load produk ─────────────────────────────
async function loadProduk(search = '') {
    const body = document.getElementById('ps-table-body');
    body.innerHTML = '<div class="ps-loading">Memuat produk...</div>';
    try {
        const url = search ? `${API}?search=${encodeURIComponent(search)}` : API;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal memuat produk');
        allProduk = await res.json();
        renderRows(allProduk);
    } catch (err) {
        body.innerHTML = `<div class="ps-loading" style="color:#c0392b">⚠️ ${err.message}</div>`;
    }
}

// ─── Modal helpers ────────────────────────────
function openModal({ id = '', nama = '', kategori = '', harga = '', stok = '', deskripsi = '' } = {}) {
    const modal = document.getElementById('ps-modal');
    document.getElementById('ps-modal-title').textContent = id ? 'Edit Produk' : 'Tambah Produk';
    document.getElementById('ps-modal-id').value       = id;
    document.getElementById('ps-f-nama').value         = nama;
    document.getElementById('ps-f-harga').value        = harga;
    document.getElementById('ps-f-stok').value         = stok;
    document.getElementById('ps-f-kategori').value     = kategori;
    document.getElementById('ps-f-deskripsi').value    = deskripsi;
    document.getElementById('ps-modal-error').textContent = '';
    modal.style.display = 'flex';
    document.getElementById('ps-f-nama').focus();
}

function closeModal() {
    document.getElementById('ps-modal').style.display = 'none';
}

// ─── Submit (tambah / edit) ───────────────────
async function submitProduk() {
    const id       = document.getElementById('ps-modal-id').value;
    const nama     = document.getElementById('ps-f-nama').value.trim();
    const harga    = document.getElementById('ps-f-harga').value;
    const stok     = document.getElementById('ps-f-stok').value;
    const kategori = document.getElementById('ps-f-kategori').value;
    const deskripsi= document.getElementById('ps-f-deskripsi').value.trim();
    const errEl    = document.getElementById('ps-modal-error');
    const btnSave  = document.getElementById('ps-modal-submit');

    errEl.textContent = '';
    if (!nama)  { errEl.textContent = 'Nama produk wajib diisi.'; return; }
    if (!harga) { errEl.textContent = 'Harga wajib diisi.'; return; }

    btnSave.disabled = true;
    btnSave.textContent = 'Menyimpan...';

    try {
        const method = id ? 'PUT' : 'POST';
        const url    = id ? `${API}/${id}` : API;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama_produk: nama, kategori, harga: Number(harga), stok: Number(stok), deskripsi })
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Gagal menyimpan.');
        closeModal();
        loadProduk(document.getElementById('ps-search-input').value.trim());
    } catch (err) {
        errEl.textContent = err.message;
    } finally {
        btnSave.disabled = false;
        btnSave.textContent = 'Simpan';
    }
}

// ─── Hapus ────────────────────────────────────
function openConfirm(id, nama) {
    deletingId = id;
    document.getElementById('ps-confirm-nama').textContent = nama;
    document.getElementById('ps-confirm-modal').style.display = 'flex';
}

function closeConfirm() {
    deletingId = null;
    document.getElementById('ps-confirm-modal').style.display = 'none';
}

async function hapusProduk() {
    if (!deletingId) return;
    const btn = document.getElementById('ps-confirm-ok');
    btn.disabled = true;
    btn.textContent = 'Menghapus...';
    try {
        const res = await fetch(`${API}/${deletingId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus produk.');
        closeConfirm();
        loadProduk(document.getElementById('ps-search-input').value.trim());
    } catch (err) {
        alert(err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Ya, Hapus';
    }
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadProduk();

    // Search — debounce 300ms
    let searchTimer;
    document.getElementById('ps-search-input').addEventListener('input', e => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => loadProduk(e.target.value.trim()), 300);
    });

    // Tambah produk
    document.getElementById('btn-tambah-produk').addEventListener('click', () => openModal());

    // Modal close / cancel
    document.getElementById('ps-modal-close') .addEventListener('click', closeModal);
    document.getElementById('ps-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('ps-modal-backdrop').addEventListener('click', closeModal);

    // Submit
    document.getElementById('ps-modal-submit').addEventListener('click', submitProduk);

    // Konfirmasi hapus
    document.getElementById('ps-confirm-cancel')  .addEventListener('click', closeConfirm);
    document.getElementById('ps-confirm-backdrop').addEventListener('click', closeConfirm);
    document.getElementById('ps-confirm-ok')      .addEventListener('click', hapusProduk);

    // ESC tutup modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeModal(); closeConfirm(); }
    });

    // Event delegation — edit & hapus button di rows
    document.getElementById('ps-table-body').addEventListener('click', e => {
        const editBtn  = e.target.closest('.ps-btn-edit');
        const hapusBtn = e.target.closest('.ps-btn-hapus-row');

        if (editBtn) {
            const id = editBtn.dataset.id;
            const p  = allProduk.find(x => String(x.id) === String(id));
            if (p) openModal({ id: p.id, nama: p.Nama_Produk, kategori: p.Kategori, harga: p.Harga, stok: p.Stok, deskripsi: p.Deskripsi });
        }

        if (hapusBtn) {
            openConfirm(hapusBtn.dataset.id, hapusBtn.dataset.nama);
        }
    });
});
