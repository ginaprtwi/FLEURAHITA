/**
 * ulasan.js — Ulasan Pembeli
 * Fitur:
 *  - Load ulasan milik user dari API
 *  - Modal tulis ulasan baru: dropdown produk yg sudah dipesan & belum diulas
 *  - Modal edit ulasan: isi form dari data yang ada
 *  - Submit POST / PUT ke /api/ulasan
 */

const ULASAN_API = window.location.origin.startsWith('http')
    ? `${window.location.origin}/api/ulasan`
    : 'http://localhost:3000/api/ulasan';

// ─── Ambil user login ─────────────────────────
function getUserUlasan() {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) { try { return JSON.parse(raw); } catch { /* fall through */ } }
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) {
        return {
            userId,
            namaLengkap: localStorage.getItem('namaLengkap') || 'Pembeli',
            fotoProfil:  localStorage.getItem('fotoProfil')  || ''
        };
    }
    return null;
}

// ─── Render ★ statis ──────────────────────────
function renderBintang(rating) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="star${i < rating ? ' star-aktif' : ''}">★</span>`
    ).join('');
}

// ─── Render satu kartu ulasan ─────────────────
function renderCardUlasan(u, kontainer, user) {
    const foto = u.Foto_Produk
        ? `/Pembeli/assets/produk/${u.Foto_Produk}`
        : '../assets/profil/card-img.png';

    const card = document.createElement('article');
    card.className = 'ulasan-card';
    card.innerHTML = `
        <img src="${foto}" class="ulasan-card-img"
             alt="${escU(u.Nama_Produk)}"
             onerror="this.src='../assets/profil/card-img.png'" />
        <div class="ulasan-card-body">
            <h3 class="ulasan-card-nama">${escU(u.Nama_Produk)}</h3>
            <p class="ulasan-card-tanggal">${u.tanggal_fmt || ''}</p>
            <div class="ulasan-card-review">
                <div class="ulasan-card-review-top">
                    <img src="${escU(user.fotoProfil || '../assets/profil/card-avatars-3d.png')}"
                         class="ulasan-card-avatar" alt="Avatar"
                         onerror="this.src='../assets/profil/card-avatars-3d.png'" />
                    <span class="ulasan-card-username">${escU(user.namaLengkap)}</span>
                    <button class="ulasan-edit-btn"
                            data-id="${u.id_Ulasan}"
                            data-id-produk="${u.id_Produk}"
                            data-produk="${escU(u.Nama_Produk)}"
                            data-rating="${u.Rating}"
                            data-komentar="${escU(u.Komentar || '')}"
                            title="Edit ulasan">✏️</button>
                </div>
                <div class="ulasan-card-stars">${renderBintang(u.Rating)}</div>
                <p class="ulasan-card-komentar">${u.Komentar ? escU(u.Komentar) : '<em>Belum ada komentar</em>'}</p>
            </div>
        </div>`;
    kontainer.appendChild(card);
}

// ─── Load ulasan milik user ───────────────────
async function loadUlasanSaya(user, kontainer) {
    kontainer.innerHTML = '<p class="ulasan-loading">Memuat ulasan...</p>';
    try {
        const res = await fetch(`${ULASAN_API}/saya/${user.userId}`);
        if (!res.ok) throw new Error('Gagal memuat ulasan');
        const data = await res.json();
        kontainer.innerHTML = '';
        if (data.length === 0) {
            kontainer.innerHTML = '<p class="ulasan-empty">Kamu belum punya ulasan. Yuk berikan ulasan untuk produk yang sudah kamu beli!</p>';
            return;
        }
        data.forEach(u => renderCardUlasan(u, kontainer, user));
    } catch (err) {
        kontainer.innerHTML = '<p class="ulasan-error">⚠️ Gagal memuat ulasan. Pastikan kamu sudah login dan backend berjalan.</p>';
    }
}

// ─── Fetch produk yang bisa diulas ────────────
async function fetchProdukBisaDiulas(userId) {
    const res = await fetch(`${ULASAN_API}/produk-bisa-diulas/${userId}`);
    if (!res.ok) throw new Error('Gagal memuat daftar produk');
    return await res.json();
}

// ─── Set rating bintang di modal ─────────────
function setRating(nilai) {
    const modal = document.getElementById('ulasan-modal');
    modal.dataset.rating = nilai;
    modal.querySelectorAll('.modal-star').forEach(s =>
        s.classList.toggle('star-aktif', parseInt(s.dataset.val) <= nilai));
}

// ─── Buka modal BARU (dengan dropdown produk) ─
async function bukaModalBaru(user) {
    const modal = document.getElementById('ulasan-modal');
    const errEl = modal.querySelector('#modal-error');
    const wrap  = modal.querySelector('#modal-produk-wrap');

    // Reset form
    modal.querySelector('#modal-title').textContent = 'Tulis Ulasan';
    modal.querySelector('#modal-id-ulasan').value   = '';
    modal.querySelector('#modal-id-produk').value   = '';
    modal.querySelector('#modal-komentar').value    = '';
    errEl.textContent = '';
    setRating(0);

    // Tampilkan dropdown, sembunyikan nama statis
    wrap.style.display = 'block';
    modal.querySelector('#modal-nama-produk').textContent = '';

    // Isi dropdown
    const sel = modal.querySelector('#modal-produk-select');
    sel.innerHTML = '<option value="">-- Memuat produk... --</option>';
    sel.disabled = true;

    modal.classList.add('modal-aktif');

    try {
        const produkList = await fetchProdukBisaDiulas(user.userId);
        sel.innerHTML = '<option value="">-- Pilih produk yang ingin diulas --</option>';
        if (produkList.length === 0) {
            sel.innerHTML = '<option value="">Semua produk pesananmu sudah diulas</option>';
        } else {
            produkList.forEach(p => {
                const opt = document.createElement('option');
                opt.value       = p.id_Produk;
                opt.textContent = p.Nama_Produk;
                sel.appendChild(opt);
            });
            sel.disabled = false;
        }
    } catch {
        sel.innerHTML = '<option value="">⚠️ Gagal memuat produk</option>';
    }

    modal.querySelector('#modal-komentar').focus();
}

// ─── Buka modal EDIT (produk sudah diketahui) ─
function bukaModalEdit({ idUlasan, idProduk, namaProduk, rating, komentar }) {
    const modal = document.getElementById('ulasan-modal');
    const wrap  = modal.querySelector('#modal-produk-wrap');

    modal.querySelector('#modal-title').textContent         = 'Edit Ulasan';
    modal.querySelector('#modal-id-ulasan').value           = idUlasan;
    modal.querySelector('#modal-id-produk').value           = idProduk;
    modal.querySelector('#modal-nama-produk').textContent   = namaProduk;
    modal.querySelector('#modal-komentar').value            = komentar;
    modal.querySelector('#modal-error').textContent         = '';

    // Sembunyikan dropdown, tampilkan nama statis
    wrap.style.display = 'none';
    setRating(rating);

    modal.classList.add('modal-aktif');
    modal.querySelector('#modal-komentar').focus();
}

function tutupModal() {
    document.getElementById('ulasan-modal').classList.remove('modal-aktif');
}

// ─── Sync hidden input saat dropdown berubah ─
function onProdukSelectChange(e) {
    const modal = document.getElementById('ulasan-modal');
    modal.querySelector('#modal-id-produk').value = e.target.value;
}

// ─── Submit (POST atau PUT) ───────────────────
async function submitUlasan(user, kontainer) {
    const modal    = document.getElementById('ulasan-modal');
    const idUlasan = modal.querySelector('#modal-id-ulasan').value.trim();
    const idProduk = modal.querySelector('#modal-id-produk').value.trim();
    const rating   = parseInt(modal.dataset.rating || '0');
    const komentar = modal.querySelector('#modal-komentar').value.trim();
    const errEl    = modal.querySelector('#modal-error');
    const btnSave  = modal.querySelector('#modal-submit');

    errEl.textContent = '';

    if (!idProduk) { errEl.textContent = 'Pilih produk yang ingin diulas terlebih dahulu.'; return; }
    if (!rating)   { errEl.textContent = 'Pilih rating bintang terlebih dahulu.'; return; }
    if (!komentar) { errEl.textContent = 'Tulis komentar ulasanmu.'; return; }

    btnSave.disabled    = true;
    btnSave.textContent = 'Menyimpan...';

    try {
        let res;
        if (idUlasan) {
            res = await fetch(`${ULASAN_API}/${idUlasan}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_User: user.userId, rating, komentar })
            });
        } else {
            res = await fetch(`${ULASAN_API}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_User: user.userId, id_Produk: idProduk, rating, komentar })
            });
        }

        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Gagal menyimpan ulasan.');

        tutupModal();
        await loadUlasanSaya(user, kontainer);
    } catch (err) {
        errEl.textContent = err.message;
    } finally {
        btnSave.disabled    = false;
        btnSave.textContent = 'Simpan Ulasan';
    }
}

// ─── Escape helper ────────────────────────────
function escU(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Inject modal HTML ────────────────────────
function injectModal() {
    if (document.getElementById('ulasan-modal')) return;
    const el = document.createElement('div');
    el.id = 'ulasan-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'modal-title');
    el.innerHTML = `
        <div class="modal-backdrop" id="modal-backdrop"></div>
        <div class="modal-box">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">Tulis Ulasan</h2>
                <button class="modal-close" id="modal-close" aria-label="Tutup">✕</button>
            </div>

            <!-- Dropdown produk (hanya tampil saat tulis baru) -->
            <div id="modal-produk-wrap">
                <label class="modal-label" for="modal-produk-select">Pilih Produk</label>
                <select id="modal-produk-select" class="modal-select">
                    <option value="">-- Pilih produk yang ingin diulas --</option>
                </select>
            </div>

            <!-- Nama produk statis (hanya tampil saat edit) -->
            <p class="modal-produk-nama" id="modal-nama-produk"></p>

            <input type="hidden" id="modal-id-ulasan" />
            <input type="hidden" id="modal-id-produk" />

            <div>
                <label class="modal-label">Rating</label>
                <div class="modal-stars" role="group" aria-label="Pilih rating">
                    <span class="modal-star" data-val="1">★</span>
                    <span class="modal-star" data-val="2">★</span>
                    <span class="modal-star" data-val="3">★</span>
                    <span class="modal-star" data-val="4">★</span>
                    <span class="modal-star" data-val="5">★</span>
                </div>
            </div>

            <div>
                <label class="modal-label" for="modal-komentar">Ulasan</label>
                <textarea id="modal-komentar" class="modal-textarea"
                          placeholder="Ceritakan pengalamanmu dengan produk ini..."
                          rows="4" maxlength="500"></textarea>
            </div>

            <p id="modal-error" class="modal-error" role="alert"></p>

            <div class="modal-actions">
                <button id="modal-cancel"  class="modal-btn-cancel">Batal</button>
                <button id="modal-submit"  class="modal-btn-submit">Simpan Ulasan</button>
            </div>
        </div>`;
    document.body.appendChild(el);
}

// ─── Inject CSS ───────────────────────────────
function injectUlasanStyles() {
    if (document.getElementById('ulasan-styles')) return;
    const s = document.createElement('style');
    s.id = 'ulasan-styles';
    s.textContent = `
        #ulasan-list { display:flex; flex-direction:column; gap:20px; }
        .ulasan-loading,.ulasan-empty { font-size:14px; color:#888; padding:16px 0; text-align:center; }
        .ulasan-error { font-size:14px; color:#c0392b; padding:16px 0; text-align:center; }

        .ulasan-card { display:flex; gap:24px; align-items:flex-start; font-family:'Poppins',sans-serif; }
        .ulasan-card-img { width:160px; height:160px; object-fit:cover; border-radius:14px; border:1px solid #820805; flex-shrink:0; }
        .ulasan-card-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:6px; }
        .ulasan-card-nama { font-size:22px; font-weight:700; line-height:1.1;
            background:linear-gradient(180deg,#820805,#ff5f5b);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .ulasan-card-tanggal { font-size:12px; color:#888; }
        .ulasan-card-review { margin-top:10px; padding:14px 16px 20px; border:1px solid #820805; border-radius:10px; display:flex; flex-direction:column; gap:8px; }
        .ulasan-card-review-top { display:flex; align-items:center; gap:8px; }
        .ulasan-card-avatar { width:32px; height:32px; border-radius:50%; object-fit:cover; }
        .ulasan-card-username { font-size:13px; font-weight:600; flex:1; }
        .ulasan-edit-btn { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 6px; border-radius:6px; transition:background .15s; }
        .ulasan-edit-btn:hover { background:#fde8e8; }
        .ulasan-card-stars { display:flex; gap:2px; }
        .ulasan-card-stars .star { color:#ddd; font-size:18px; }
        .ulasan-card-stars .star-aktif { color:#f5a623; }
        .ulasan-card-komentar { font-size:14px; line-height:1.65; color:#333; }

        /* Modal */
        #ulasan-modal { display:none; position:fixed; inset:0; z-index:9000; align-items:center; justify-content:center; }
        #ulasan-modal.modal-aktif { display:flex; }
        .modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,.48); }
        .modal-box { position:relative; z-index:1; background:#fff; border-radius:16px; padding:28px 32px; width:100%; max-width:500px; margin:16px; display:flex; flex-direction:column; gap:14px; box-shadow:0 8px 32px rgba(0,0,0,.2); font-family:'Poppins',sans-serif; max-height:90vh; overflow-y:auto; }
        .modal-header { display:flex; align-items:center; justify-content:space-between; }
        .modal-title { font-size:18px; font-weight:700; color:#820805; margin:0; }
        .modal-close { background:none; border:none; font-size:18px; cursor:pointer; color:#888; padding:2px 6px; border-radius:6px; }
        .modal-close:hover { background:#f5f5f5; }
        .modal-label { display:block; font-size:12px; font-weight:600; color:#555; margin-bottom:6px; }
        .modal-produk-nama { font-size:14px; font-weight:600; color:#333; margin:0; }
        .modal-select { width:100%; padding:10px 14px; border:1px solid #ddd; border-radius:8px; font-size:13px; font-family:'Poppins',sans-serif; outline:none; cursor:pointer; background:#fff; transition:border-color .15s; }
        .modal-select:focus { border-color:#820805; }
        .modal-stars { display:flex; gap:6px; }
        .modal-star { font-size:32px; cursor:pointer; color:#ddd; transition:color .1s; line-height:1; }
        .modal-star.star-aktif { color:#f5a623; }
        .modal-textarea { width:100%; border:1px solid #ddd; border-radius:8px; padding:10px 14px; font-size:13px; font-family:'Poppins',sans-serif; resize:vertical; outline:none; box-sizing:border-box; transition:border-color .15s; }
        .modal-textarea:focus { border-color:#820805; }
        .modal-error { font-size:12px; color:#c0392b; min-height:16px; margin:0; }
        .modal-actions { display:flex; gap:10px; justify-content:flex-end; }
        .modal-btn-cancel { padding:9px 20px; border-radius:8px; font-size:13px; font-weight:500; background:#f0f0f0; color:#555; border:none; cursor:pointer; }
        .modal-btn-cancel:hover { background:#e5e5e5; }
        .modal-btn-submit { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:600; background:linear-gradient(180deg,#820805,#ff5f5b); color:#fff; border:none; cursor:pointer; transition:opacity .15s; }
        .modal-btn-submit:hover { opacity:.88; }
        .modal-btn-submit:disabled { opacity:.5; cursor:not-allowed; }

        @media (max-width:600px) {
            .ulasan-card { flex-direction:column; }
            .ulasan-card-img { width:100%; height:200px; }
            .modal-box { padding:20px 18px; }
        }
    `;
    document.head.appendChild(s);
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    injectUlasanStyles();
    injectModal();

    const user = getUserUlasan();

    // Update nama sidebar dari localStorage
    const sidebarNama = document.getElementById('sidebar-nama');
    if (sidebarNama && user) sidebarNama.textContent = user.namaLengkap;

    // Bangun section ulasan dinamis
    const card4 = document.querySelector('.card4');
    if (!card4) return;

    // Simpan judul, rebuild card4
    const judulEl = card4.querySelector('.card-ulasan-anda');
    card4.innerHTML = '';

    const judul = judulEl || Object.assign(document.createElement('h2'), { className: 'card-ulasan-anda', textContent: 'Ulasan Anda' });
    card4.appendChild(judul);

    // Tombol tulis ulasan baru
    const btnTulis = document.createElement('button');
    btnTulis.textContent = '+ Tulis Ulasan';
    btnTulis.style.cssText = 'align-self:flex-start;padding:9px 22px;border-radius:8px;font-size:13px;font-weight:600;background:linear-gradient(180deg,#820805,#ff5f5b);color:#fff;border:none;cursor:pointer;font-family:\'Poppins\',sans-serif;margin-bottom:4px;';
    card4.appendChild(btnTulis);

    // List container
    const list = document.createElement('div');
    list.id = 'ulasan-list';
    card4.appendChild(list);

    if (!user) {
        btnTulis.style.display = 'none';
        list.innerHTML = '<p class="ulasan-empty">Login untuk melihat dan menulis ulasan.</p>';
        return;
    }

    // Load ulasan yang sudah ada
    loadUlasanSaya(user, list);

    // Klik tulis baru → buka modal dengan dropdown produk
    btnTulis.addEventListener('click', () => bukaModalBaru(user));

    // ── Modal events ──────────────────────────
    const modal = document.getElementById('ulasan-modal');

    // Dropdown produk → sync hidden input
    modal.querySelector('#modal-produk-select')
         .addEventListener('change', onProdukSelectChange);

    // Bintang interaktif
    modal.querySelectorAll('.modal-star').forEach(star => {
        star.addEventListener('mouseenter', () => {
            const v = parseInt(star.dataset.val);
            modal.querySelectorAll('.modal-star').forEach(s =>
                s.classList.toggle('star-aktif', parseInt(s.dataset.val) <= v));
        });
        star.addEventListener('mouseleave', () =>
            setRating(parseInt(modal.dataset.rating || '0')));
        star.addEventListener('click', () =>
            setRating(parseInt(star.dataset.val)));
    });

    // Tutup modal
    document.getElementById('modal-close')   .addEventListener('click', tutupModal);
    document.getElementById('modal-cancel')  .addEventListener('click', tutupModal);
    document.getElementById('modal-backdrop').addEventListener('click', tutupModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') tutupModal(); });

    // Submit
    document.getElementById('modal-submit').addEventListener('click', () =>
        submitUlasan(user, list));

    // Edit button (event delegation — kartu dirender dinamis)
    document.addEventListener('click', e => {
        const btn = e.target.closest('.ulasan-edit-btn');
        if (!btn) return;
        bukaModalEdit({
            idUlasan:   btn.dataset.id,
            idProduk:   btn.dataset.idProduk,
            namaProduk: btn.dataset.produk,
            rating:     parseInt(btn.dataset.rating || '0'),
            komentar:   btn.dataset.komentar
        });
    });
});
