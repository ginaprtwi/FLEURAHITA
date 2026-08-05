/**
 * chat.js — Logika halaman Chat & Komplain (Penjual)
 *
 * Fitur:
 * 1. Auth guard — redirect ke login kalau belum login
 * 2. Load daftar kontak (panel kiri)
 * 3. Load pesan per kontak (panel kanan)
 * 4. Kirim pesan sebagai penjual
 * 5. Auto-scroll ke pesan terbaru
 */

const API_BASE = window.location.origin.startsWith('http')
    ? `${window.location.origin}/api/chat`
    : 'http://localhost:3000/api/chat';

// ─── State ────────────────────────────────────
let activeUserId = null;       // id_User pembeli yang sedang dipilih
let pollingTimer = null;       // interval untuk polling pesan baru

// ─── Auth Guard ───────────────────────────────
function getUser() {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) {
        try { return JSON.parse(raw); } catch { return null; }
    }
    // Coba format lama (userId disimpan langsung)
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) {
        return {
            userId,
            namaLengkap: localStorage.getItem('namaLengkap') || 'Penjual',
            email: localStorage.getItem('email') || ''
        };
    }
    return null;
}

function authGuard() {
    const user = getUser();
    if (!user) {
        // Simpan halaman yang ingin dikunjungi, lalu redirect ke login
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '/Auth/Login/log-in-user.html';
        return false;
    }
    return true;
}

// ─── Format Waktu ─────────────────────────────
function formatWaktu(waktuStr) {
    if (!waktuStr) return '';
    // waktu_fmt sudah diformat di backend (HH.mm), langsung pakai
    return waktuStr;
}

// ─── Render: Panel Kiri (Daftar Kontak) ───────
function renderKontakList(kontakArr) {
    const panel = document.querySelector('.chat-panel-contacts');
    if (!panel) return;

    // Hapus kontak lama (bukan static placeholder)
    panel.querySelectorAll('.chat-contact[data-user-id]').forEach(el => el.remove());

    if (!kontakArr || kontakArr.length === 0) {
        panel.innerHTML = '<p style="padding:16px;color:#999;font-size:13px;">Belum ada percakapan.</p>';
        return;
    }

    // Jika belum ada kontak aktif, pilih yang pertama
    if (!activeUserId && kontakArr.length > 0) {
        activeUserId = kontakArr[0].id_User;
    }

    kontakArr.forEach(kontak => {
        const item = document.createElement('div');
        item.className = 'chat-contact' + (kontak.id_User == activeUserId ? ' chat-contact-active' : '');
        item.dataset.userId = kontak.id_User;

        // Foto profil: fallback ke avatar default kalau null / path tidak valid
        const foto = kontak.Foto_Profil && !kontak.Foto_Profil.startsWith('foto_profil_')
            ? kontak.Foto_Profil
            : '../assets/card-3d-avatars3.png';

        const preview = kontak.pesan_terakhir
            ? (kontak.pesan_terakhir.length > 35
                ? kontak.pesan_terakhir.substring(0, 35) + '...'
                : kontak.pesan_terakhir)
            : '';

        item.innerHTML = `
            <img src="${foto}" class="column-3d-avatars circle" alt="Avatar"
                 onerror="this.src='../assets/card-3d-avatars3.png'" />
            <div class="chat-contact-info">
                <span class="chat-contact-name">${escapeHtml(kontak.Nama)}</span>
                <span class="chat-contact-preview">${escapeHtml(preview)}</span>
            </div>
            <span class="chat-contact-time">${formatWaktu(kontak.waktu_terakhir ? kontak.waktu_terakhir.substring(11, 16).replace(':', '.') : '')}</span>
        `;

        item.addEventListener('click', () => selectKontak(kontak.id_User, item, kontak));
        panel.appendChild(item);
    });
}

// ─── Pilih Kontak ─────────────────────────────
function selectKontak(userId, itemEl, kontakData) {
    // Update active state di panel kiri
    document.querySelectorAll('.chat-contact').forEach(el => el.classList.remove('chat-contact-active'));
    if (itemEl) itemEl.classList.add('chat-contact-active');

    activeUserId = userId;

    // Update header chat kanan dengan nama & avatar pembeli yang dipilih
    if (kontakData) {
        const headerName   = document.querySelector('.chat-active-name');
        const headerAvatar = document.querySelector('.chat-active-avatar');
        if (headerName)   headerName.textContent = kontakData.Nama || 'Pembeli';
        if (headerAvatar) {
            const foto = kontakData.Foto_Profil && !kontakData.Foto_Profil.startsWith('foto_profil_')
                ? kontakData.Foto_Profil
                : '../assets/card-3d-avatars3.png';
            headerAvatar.src = foto;
            headerAvatar.onerror = function () { this.src = '../assets/card-3d-avatars3.png'; };
        }
    }

    // Kosongkan area pesan supaya render ulang dari awal
    const card2 = document.querySelector('.card2');
    if (card2) card2.innerHTML = '';

    // Stop polling lama, load pesan baru
    stopPolling();
    loadPesan(userId);
    startPolling(userId);
}

// ─── Render: Satu Bubble Pesan ────────────────
function createBubble(pesan) {
    const isPenjual = pesan.Pengirim === 'penjual';
    const div = document.createElement('div');
    div.className = isPenjual ? 'chat-bubble-right' : 'chat-bubble-left';
    div.dataset.chatId = pesan.id_Chat;

    if (isPenjual) {
        div.innerHTML = `<div class="card-light5">${escapeHtml(pesan.Isi_Pesan)}</div>`;
    } else {
        div.innerHTML = `
            <img src="../assets/card-3d-avatars.png" class="card-_3d-avatars" alt="Avatar"
                 onerror="this.src='../assets/card-3d-avatars.png'" />
            <div class="card-message">${escapeHtml(pesan.Isi_Pesan)}</div>
        `;
    }
    return div;
}

// ─── Load Pesan ───────────────────────────────
async function loadPesan(userId) {
    const card2 = document.querySelector('.card2');
    if (!card2) return;

    // Simpan scroll posisi sebelumnya untuk deteksi append vs full reload
    const wasAtBottom = card2.scrollHeight - card2.scrollTop <= card2.clientHeight + 60;

    try {
        const res = await fetch(`${API_BASE}/pesan/${userId}`);
        if (!res.ok) throw new Error('Gagal memuat pesan');
        const pesanArr = await res.json();

        // Cek apakah perlu full re-render (jumlah pesan berbeda)
        const existingBubbles = card2.querySelectorAll('[data-chat-id]');
        const lastExistingId = existingBubbles.length > 0
            ? parseInt(existingBubbles[existingBubbles.length - 1].dataset.chatId)
            : -1;

        // Hanya append pesan baru, jangan re-render semua (hindari flicker)
        const newPesan = pesanArr.filter(p => p.id_Chat > lastExistingId);

        if (existingBubbles.length === 0) {
            // Render ulang semua dari awal (kontak baru dipilih)
            // Hapus semua kecuali input bar
            const inputBar = card2.parentElement.querySelector('.card-row-bottom2');
            card2.innerHTML = '';

            if (pesanArr.length === 0) {
                card2.innerHTML = '<p style="padding:16px;color:#999;font-size:13px;text-align:center;">Belum ada pesan. Mulai percakapan!</p>';
            } else {
                pesanArr.forEach(p => card2.appendChild(createBubble(p)));
            }
        } else if (newPesan.length > 0) {
            // Append saja pesan baru
            newPesan.forEach(p => card2.appendChild(createBubble(p)));
        }

        // Auto-scroll ke bawah kalau sudah di bawah atau ini load pertama
        if (wasAtBottom || existingBubbles.length === 0) {
            scrollToBottom(card2);
        }

    } catch (err) {
        console.error('loadPesan error:', err);
        card2.innerHTML = `<p style="padding:16px;color:red;font-size:13px;">⚠️ Gagal memuat pesan. Pastikan backend berjalan.</p>`;
    }
}

// ─── Kirim Pesan ──────────────────────────────
async function kirimPesan() {
    if (!activeUserId) {
        alert('Pilih kontak terlebih dahulu.');
        return;
    }

    const input = document.querySelector('.card-input-message');
    if (!input) return;

    const teks = input.value.trim();
    if (!teks) return;

    // Disable input sementara
    input.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/pesan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_User: activeUserId,
                pengirim: 'penjual',
                isi_pesan: teks
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Gagal mengirim pesan');
        }

        const newPesan = await res.json();

        // Tambahkan bubble langsung tanpa tunggu polling
        const card2 = document.querySelector('.card2');
        if (card2) {
            // Hapus pesan "belum ada pesan" kalau ada
            const emptyMsg = card2.querySelector('p');
            if (emptyMsg) emptyMsg.remove();

            card2.appendChild(createBubble(newPesan));
            scrollToBottom(card2);
        }

        // Refresh daftar kontak supaya preview pesan terakhir terupdate
        loadKontak();

        input.value = '';
    } catch (err) {
        console.error('kirimPesan error:', err);
        alert('Gagal mengirim pesan: ' + err.message);
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// ─── Load Kontak ──────────────────────────────
async function loadKontak() {
    try {
        const res = await fetch(`${API_BASE}/kontak`);
        if (!res.ok) throw new Error('Gagal memuat kontak');
        const data = await res.json();
        renderKontakList(data);

        // Jika ini load pertama, langsung buka kontak pertama dan update header
        if (data.length > 0) {
            const firstKontak = data[0];
            if (!activeUserId) {
                activeUserId = firstKontak.id_User;
            }
            // Update header dengan kontak yang sedang aktif
            const activeKontak = data.find(k => k.id_User == activeUserId) || firstKontak;
            const headerName   = document.querySelector('.chat-active-name');
            const headerAvatar = document.querySelector('.chat-active-avatar');
            if (headerName)   headerName.textContent = activeKontak.Nama || 'Pembeli';
            if (headerAvatar) {
                const foto = activeKontak.Foto_Profil && !activeKontak.Foto_Profil.startsWith('foto_profil_')
                    ? activeKontak.Foto_Profil
                    : '../assets/card-3d-avatars3.png';
                headerAvatar.src = foto;
            }

            const firstItem = document.querySelector(`.chat-contact[data-user-id="${activeUserId}"]`);
            if (firstItem && !document.querySelector('.card2 [data-chat-id]')) {
                loadPesan(activeUserId);
                startPolling(activeUserId);
            }
        }
    } catch (err) {
        console.error('loadKontak error:', err);
        const panel = document.querySelector('.chat-panel-contacts');
        if (panel) {
            panel.innerHTML = '<p style="padding:16px;color:red;font-size:13px;">⚠️ Gagal memuat kontak. Pastikan backend berjalan.</p>';
        }
    }
}

// ─── Polling Pesan Baru ───────────────────────
function startPolling(userId) {
    stopPolling();
    pollingTimer = setInterval(() => {
        if (activeUserId === userId) loadPesan(userId);
    }, 5000); // setiap 5 detik
}

function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
}

// ─── Helper: scroll ke bawah ──────────────────
function scrollToBottom(el) {
    requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
    });
}

// ─── Helper: escape HTML ──────────────────────
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Event: Input Kirim ───────────────────────
function initInputEvents() {
    const input = document.querySelector('.card-input-message');
    // Tombol kirim adalah .chat-send-btn (button di HTML baru)
    const btnSend = document.querySelector('.chat-send-btn');

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                kirimPesan();
            }
        });
    }

    if (btnSend) {
        btnSend.addEventListener('click', () => kirimPesan());
    }
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek auth
    if (!authGuard()) return;

    // 2. Kosongkan konten static (placeholder HTML) di panel kiri & kanan
    //    supaya data dinamis yang mengisi
    const panel = document.querySelector('.chat-panel-contacts');
    if (panel) panel.innerHTML = '<p style="padding:16px;color:#aaa;font-size:13px;">Memuat kontak...</p>';

    const card2 = document.querySelector('.card2');
    if (card2) card2.innerHTML = '<p style="padding:16px;color:#aaa;font-size:13px;text-align:center;">Pilih percakapan untuk memulai.</p>';

    // 3. Pasang event input
    initInputEvents();

    // 4. Load daftar kontak
    loadKontak();
});
