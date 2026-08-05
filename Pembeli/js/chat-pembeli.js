/**
 * chat-pembeli.js — Logika Chat untuk Pembeli
 *
 * Fitur:
 * 1. Auth guard — cek login pembeli
 * 2. Load riwayat pesan pembeli dengan penjual
 * 3. Kirim pesan baru ke penjual
 * 4. Polling pesan baru setiap 5 detik
 */

const API_BASE = window.location.origin.startsWith('http')
    ? `${window.location.origin}/api/chat`
    : 'http://localhost:3000/api/chat';

let pollingTimer = null;

// ─── Auth Guard ───────────────────────────────
function getUserPembeli() {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) {
        try { return JSON.parse(raw); } catch { return null; }
    }
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) {
        return {
            userId,
            namaLengkap: localStorage.getItem('namaLengkap') || 'Pembeli',
            email: localStorage.getItem('email') || ''
        };
    }
    return null;
}

// ─── Escape HTML ──────────────────────────────
function escHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Scroll ke bawah ──────────────────────────
function scrollChatToBottom(container) {
    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

// ─── Buat elemen bubble pesan ─────────────────
function createPembeliBubble(pesan) {
    const div = document.createElement('div');
    div.dataset.chatId = pesan.id_Chat;

    if (pesan.Pengirim === 'pembeli') {
        div.className = 'chat-bubble-pembeli';
        div.innerHTML = `<div class="bubble-text bubble-pembeli">${escHtml(pesan.Isi_Pesan)}</div>`;
    } else {
        div.className = 'chat-bubble-penjual';
        div.innerHTML = `
            <div class="bubble-avatar">
                <img src="../assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png"
                     alt="Penjual" onerror="this.src='../assets/img.png'" />
            </div>
            <div class="bubble-text bubble-penjual">${escHtml(pesan.Isi_Pesan)}</div>
        `;
    }
    return div;
}

// ─── Load Pesan ───────────────────────────────
async function loadPesanPembeli(userId, container) {
    const wasAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 60;

    try {
        const res = await fetch(`${API_BASE}/pesan/${userId}`);
        if (!res.ok) throw new Error('Gagal memuat pesan');
        const data = await res.json();

        const existing = container.querySelectorAll('[data-chat-id]');
        const lastId = existing.length > 0
            ? parseInt(existing[existing.length - 1].dataset.chatId)
            : -1;

        const newPesan = data.filter(p => p.id_Chat > lastId);

        if (existing.length === 0) {
            // Kosongkan loading state
            container.innerHTML = '';
            if (data.length === 0) {
                container.innerHTML = '<p class="chat-empty-msg">Belum ada pesan. Kirim pesan pertamamu!</p>';
                return;
            }
            data.forEach(p => container.appendChild(createPembeliBubble(p)));
        } else if (newPesan.length > 0) {
            // Hapus pesan kosong jika ada
            const emptyEl = container.querySelector('.chat-empty-msg');
            if (emptyEl) emptyEl.remove();
            newPesan.forEach(p => container.appendChild(createPembeliBubble(p)));
        }

        if (wasAtBottom || existing.length === 0) {
            scrollChatToBottom(container);
        }
    } catch (err) {
        console.error('loadPesanPembeli error:', err);
        container.innerHTML = '<p style="color:red;padding:12px;font-size:13px;">⚠️ Gagal memuat pesan.</p>';
    }
}

// ─── Kirim Pesan ──────────────────────────────
async function kirimPesanPembeli(userId, inputEl, container) {
    const teks = inputEl.value.trim();
    if (!teks) return;

    inputEl.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/pesan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_User: userId, pengirim: 'pembeli', isi_pesan: teks })
        });

        if (!res.ok) throw new Error((await res.json()).error || 'Gagal kirim');
        const newPesan = await res.json();

        const emptyEl = container.querySelector('.chat-empty-msg');
        if (emptyEl) emptyEl.remove();

        container.appendChild(createPembeliBubble(newPesan));
        scrollChatToBottom(container);
        inputEl.value = '';
    } catch (err) {
        console.error('kirimPesanPembeli error:', err);
        alert('Gagal mengirim pesan: ' + err.message);
    } finally {
        inputEl.disabled = false;
        inputEl.focus();
    }
}

// ─── Render UI Chat ke dalam container ────────
function renderChatUI(targetEl, userId) {
    targetEl.innerHTML = `
        <div class="chat-penjual-header">
            <img src="../assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png"
                 class="chat-penjual-avatar" alt="Penjual"
                 onerror="this.src='../assets/img.png'" />
            <div class="chat-penjual-info">
                <p class="chat-penjual-name">FLEURAHITA</p>
                <p class="chat-penjual-status">Penjual</p>
            </div>
        </div>
        <div class="chat-messages-container" id="chat-messages">
            <p class="chat-empty-msg">Memuat pesan...</p>
        </div>
        <div class="chat-input-bar">
            <input
                type="text"
                id="chat-input-pembeli"
                class="chat-input-field"
                placeholder="Ketik pesan..."
                autocomplete="off"
            />
            <button id="chat-send-btn" class="chat-send-btn" aria-label="Kirim">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    `;

    const messagesContainer = targetEl.querySelector('#chat-messages');
    const inputEl = targetEl.querySelector('#chat-input-pembeli');
    const sendBtn = targetEl.querySelector('#chat-send-btn');

    // Load pesan pertama kali
    loadPesanPembeli(userId, messagesContainer);

    // Polling setiap 5 detik
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = setInterval(() => loadPesanPembeli(userId, messagesContainer), 5000);

    // Event kirim
    sendBtn.addEventListener('click', () => kirimPesanPembeli(userId, inputEl, messagesContainer));
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            kirimPesanPembeli(userId, inputEl, messagesContainer);
        }
    });
}

// ─── Inject CSS inline (agar tidak perlu file CSS baru) ──
function injectChatStyles() {
    if (document.getElementById('chat-pembeli-styles')) return;
    const style = document.createElement('style');
    style.id = 'chat-pembeli-styles';
    style.textContent = `
        .chat-bot-ui {
            display: flex;
            flex-direction: column;
            border: 1px solid #e5e5e5;
            border-radius: 14px;
            overflow: hidden;
            background: #fff;
            min-height: 420px;
            max-height: 520px;
            font-family: 'Poppins', sans-serif;
        }
        .chat-penjual-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
            color: #fff;
            flex-shrink: 0;
        }
        .chat-penjual-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.5);
        }
        .chat-penjual-name {
            font-size: 14px;
            font-weight: 600;
            margin: 0;
        }
        .chat-penjual-status {
            font-size: 11px;
            opacity: 0.8;
            margin: 0;
        }
        .chat-messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #fafafa;
        }
        .chat-empty-msg {
            text-align: center;
            color: #aaa;
            font-size: 13px;
            margin: auto;
        }
        .chat-bubble-pembeli {
            display: flex;
            justify-content: flex-end;
        }
        .chat-bubble-penjual {
            display: flex;
            align-items: flex-end;
            gap: 8px;
        }
        .bubble-avatar img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
        }
        .bubble-text {
            max-width: 70%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 13px;
            line-height: 1.5;
            word-break: break-word;
        }
        .bubble-pembeli {
            background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
            color: #fff;
            border-radius: 14px 14px 4px 14px;
        }
        .bubble-penjual {
            background: #fff;
            color: #333;
            border: 1px solid #e9e9e9;
            border-radius: 14px 14px 14px 4px;
        }
        .chat-input-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            border-top: 1px solid #eee;
            background: #fff;
            flex-shrink: 0;
        }
        .chat-input-field {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 9px 16px;
            font-size: 13px;
            outline: none;
            font-family: 'Poppins', sans-serif;
        }
        .chat-input-field:focus {
            border-color: #820805;
        }
        .chat-send-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            border: none;
            transition: opacity 0.2s;
        }
        .chat-send-btn:hover { opacity: 0.85; }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const user = getUserPembeli();

    // Target: elemen .chat-bot-ui yang sudah ada di HTML
    const chatTarget = document.querySelector('.chat-bot-ui');
    if (!chatTarget) return;

    injectChatStyles();

    if (!user) {
        // Tampilkan pesan login jika belum login
        chatTarget.innerHTML = `
            <div style="padding:32px;text-align:center;font-family:'Poppins',sans-serif;">
                <p style="font-size:14px;color:#666;margin-bottom:16px;">
                    Kamu harus login dulu untuk bisa chat dengan penjual.
                </p>
                <a href="/Auth/Login/log-in-user.html"
                   style="background:linear-gradient(180deg,#820805,#ff5f5b);color:#fff;
                          padding:10px 24px;border-radius:8px;font-size:14px;text-decoration:none;">
                    Login Sekarang
                </a>
            </div>
        `;
        return;
    }

    renderChatUI(chatTarget, user.userId);
});
