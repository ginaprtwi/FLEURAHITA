/**
 * keuangan.js
 * Handler untuk halaman Keuangan - Fetch & Render Data Dinamis
 */

// API Configuration (Sesuaikan dengan backend Anda)
const API_BASE_URL = '/api';
const API_ENDPOINTS = {
    summary: `${API_BASE_URL}/keuangan/summary`,
    transaksi: `${API_BASE_URL}/keuangan/transaksi`
};

/**
 * Fetch summary keuangan dari API
 */
async function fetchKeuanganSummary() {
    try {
        const response = await fetch(API_ENDPOINTS.summary);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching summary:', error);
        return null;
    }
}

/**
 * Update cards summary dengan data dari API
 */
function updateSummaryCards(summary) {
    const elTotalSaldo = document.getElementById('nilai-total-saldo');
    const elJumlahTransaksi = document.getElementById('nilai-jumlah-transaksi');
    const elPendapatan = document.getElementById('nilai-pendapatan-bulan');
    
    if (elTotalSaldo) {
        elTotalSaldo.textContent = `Rp. ${formatNumber(summary.total_saldo)}`;
    }
    
    if (elJumlahTransaksi) {
        elJumlahTransaksi.textContent = `${summary.jumlah_transaksi} Transaksi`;
    }
    
    if (elPendapatan) {
        elPendapatan.textContent = `Rp. ${formatNumber(summary.pendapatan_bulan)}`;
    }
}

/**
 * Fetch daftar transaksi dari API
 */
async function fetchTransaksi(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_ENDPOINTS.transaksi}?${queryParams}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transaksi:', error);
        return null;
    }
}

/**
 * Render satu baris transaksi
 */
function renderTransaksiRow(item) {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.dataset.transactionId = item.id;
    
    row.innerHTML = `
        <div>${item.order_number}</div>
        <div>${item.customer_name}</div>
        <div>${item.product_name}</div>
        <div>${formatCurrency(item.total)}</div>
        <div>${item.date}</div>
    `;
    
    return row;
}

/**
 * Render semua transaksi ke tabel
 */
function renderAllTransaksi(dataArray) {
    const tableBody = document.getElementById('table-body');
    
    if (!tableBody) {
        console.error('Element #table-body tidak ditemukan');
        return;
    }
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1;">Tidak ada data transaksi</div>';
        return;
    }
    
    // Render each row
    dataArray.forEach(item => {
        const row = renderTransaksiRow(item);
        tableBody.appendChild(row);
    });
}

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp. ');
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.input-cari-produk');
    const searchIcon = document.querySelector('.row-vuesax-outline3');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            const keyword = searchInput.value;
            initKeuangan({ search: keyword });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = searchInput.value;
                initKeuangan({ search: keyword });
            }
        });
    }
}

/**
 * Initialize filter/urutkan functionality
 */
function initFilter() {
    const filterBtn = document.querySelector('.row-right .iconly-light2');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // TODO: Implement dropdown sort
            alert('Filter/Urutkan - Implementasikan dropdown sesuai kebutuhan');
        });
    }
}

/**
 * Initialize & Load Data
 */
async function initKeuangan(filters = {}) {
    // Load and update summary cards
    const summary = await fetchKeuanganSummary();
    if (summary) {
        updateSummaryCards(summary);
    } else {
        // Fallback dummy data jika API belum tersedia
        console.warn('API summary belum tersedia, menggunakan data dummy');
        updateSummaryCards({
            total_saldo: 1000000,
            jumlah_transaksi: 10,
            pendapatan_bulan: 500000
        });
    }
    
    // Load and render transaksi table
    const transaksi = await fetchTransaksi(filters);
    if (transaksi) {
        renderAllTransaksi(transaksi);
    } else {
        console.warn('API transaksi belum tersedia, menggunakan data dummy');
        const dummyTransaksi = [
            { id: 1, order_number: 'P0001', customer_name: 'Reisya Seinanda', product_name: 'Charme Boquet', total: 250000, date: '12-12-2025' },
            { id: 2, order_number: 'P0002', customer_name: 'M. Iqbal', product_name: 'Charme Boquet', total: 250000, date: '12-12-2025' },
            { id: 3, order_number: 'P0003', customer_name: 'M. Fadhil', product_name: 'Charme Boquet', total: 250000, date: '12-12-2025' },
            { id: 4, order_number: 'P0004', customer_name: 'Hendri P', product_name: 'Charme Boquet', total: 250000, date: '12-12-2025' },
            { id: 5, order_number: 'P0005', customer_name: 'Reza F', product_name: 'Charme Boquet', total: 250000, date: '12-12-2025' }
        ];
        renderAllTransaksi(dummyTransaksi);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initKeuangan();
    initSearch();
    initFilter();
});