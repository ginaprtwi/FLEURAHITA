/**
 * beranda-fix.js
 * Logic & Interaktivitas Halaman Beranda (Seller Dashboard)
 */

const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', () => {
    initGreeting();
    loadDashboardData();
    initSearchListener();
});

/**
 * Inisialisasi sapaan user berdasarkan data login
 */
function initGreeting() {
    const userLocal = localStorage.getItem('user');
    const userSession = sessionStorage.getItem('user');
    const rawUser = userLocal || userSession;

    const greetingElement = document.getElementById('greeting-title');
    if (!greetingElement) return;

    if (rawUser) {
        try {
            const userData = JSON.parse(rawUser);
            const fullName = userData.namaLengkap || userData.Nama || userData.nama || 'Aila';
            const firstName = fullName.trim().split(' ')[0];
            greetingElement.textContent = `Hi, ${firstName}!`;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

/**
 * Fetch dan render data dari API pesanan-masuk (jika backend aktif)
 */
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/pesanan-masuk`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            updateSummaryCounts(data);
            renderRecentOrders(data.slice(0, 5));
        }
    } catch (err) {
        console.warn('Backend server tidak merespon/menggunakan fallback mock data:', err);
    }
}

/**
 * Update angka statistik di ringkasan card
 */
function updateSummaryCounts(orders) {
    let countBelum = 0;
    let countProses = 0;
    let countSelesai = 0;

    orders.forEach(item => {
        const st = (item.status || '').toLowerCase();
        if (st.includes('belum') || st.includes('baru')) {
            countBelum++;
        } else if (st.includes('proses') || st.includes('pengerjaan')) {
            countProses++;
        } else if (st.includes('selesai')) {
            countSelesai++;
        }
    });

    const elBelum = document.getElementById('count-belum-diproses');
    const elProses = document.getElementById('count-sedang-diproses');
    const elSelesai = document.getElementById('count-selesai');

    if (elBelum && countBelum > 0) elBelum.textContent = `${countBelum} Pesanan`;
    if (elProses && countProses > 0) elProses.textContent = `${countProses} Pesanan`;
    if (elSelesai && countSelesai > 0) elSelesai.textContent = `${countSelesai} Pesanan`;
}

/**
 * Format angka ke IDR currency
 */
function formatRupiah(num) {
    if (typeof num === 'string') {
        num = parseFloat(num.replace(/[^0-9.-]+/g, '')) || 0;
    }
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0
    }).format(num);
}

/**
 * Render baris pesanan terbaru dari API
 */
function renderRecentOrders(orders) {
    const container = document.getElementById('pesanan-terbaru-list');
    if (!container) return;

    container.innerHTML = '';

    const defaultAvatars = [
        '../assets/beranda-fix/row-row/row-3d-avatars.png',
        '../assets/column/column-3d-avatars.png',
        '../assets/beranda-fix/card-transaction-3d-avatars.png',
        '../assets/column/column-3d-avatars2.png'
    ];

    orders.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'row-s row13';
        row.style.marginBottom = '12px';

        const avatarImg = defaultAvatars[index % defaultAvatars.length];
        const totalText = formatRupiah(item.total || item.Total_Bayar || 0);
        const statusText = item.status || 'Belum diproses';

        let btnClass = 'row-btn-right';
        let btnBg = '#fcecec';
        const stLower = statusText.toLowerCase();

        if (stLower.includes('selesai')) {
            btnBg = '#ecfdf3';
        } else if (stLower.includes('proses')) {
            btnBg = '#fff4e5';
        }

        row.innerHTML = `
            <div class="row-row-left">
                <img src="${avatarImg}" class="row-3d-avatars" alt="Avatar" />
                <p class="text-c row-text-reisya-seinanda3">${item.customer_name || 'Pembeli'}</p>
            </div>
            
            <p class="text-j row-text16">${item.product_name || 'Produk'}</p>
            <p class="text-j row-text17">${totalText}</p>
            <button class="btn-c ${btnClass} hover-dark" style="background-color: ${btnBg};">${statusText}</button>
        `;

        container.appendChild(row);
    });
}

/**
 * Inisialisasi event pencarian pesanan
 */
function initSearchListener() {
    const input = document.getElementById('input-cari-pesanan');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const container = document.getElementById('pesanan-terbaru-list');
        if (!container) return;

        const rows = container.querySelectorAll('.row-s, .card-transaction-row');
        rows.forEach(row => {
            const textContent = row.textContent.toLowerCase();
            if (textContent.includes(query)) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        });
    });
}
