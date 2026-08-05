/**
 * keuangan.js
 * Handler untuk halaman Keuangan - Fetch & Render Data Dinamis
 */

// API Configuration (Server Express Backend Port 3001)
const API_BASE_URL = window.location.origin.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api';
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
 * Format number with thousand separators
 */
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num || 0);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount || 0).replace('Rp', 'Rp. ');
}

// Global State Keuangan
let currentSortKey = 'terbaru';
let currentTransactions = [];

/**
 * Urutkan array transaksi berdasarkan sortKey
 */
function sortTransactions(dataArray, sortKey) {
    if (!dataArray || !Array.isArray(dataArray)) return [];
    const sorted = [...dataArray];
    
    const parseDateStr = (dateStr) => {
        if (!dateStr) return 0;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
        }
        return new Date(dateStr).getTime() || 0;
    };

    switch (sortKey) {
        case 'terbaru':
            sorted.sort((a, b) => {
                const timeA = parseDateStr(a.date);
                const timeB = parseDateStr(b.date);
                if (timeA !== timeB) return timeB - timeA;
                return (b.id || 0) - (a.id || 0);
            });
            break;
        case 'terlama':
            sorted.sort((a, b) => {
                const timeA = parseDateStr(a.date);
                const timeB = parseDateStr(b.date);
                if (timeA !== timeB) return timeA - timeB;
                return (a.id || 0) - (b.id || 0);
            });
            break;
        case 'tertinggi':
            sorted.sort((a, b) => (parseFloat(b.total) || 0) - (parseFloat(a.total) || 0));
            break;
        case 'terendah':
            sorted.sort((a, b) => (parseFloat(a.total) || 0) - (parseFloat(b.total) || 0));
            break;
        default:
            break;
    }
    return sorted;
}

let itemsPerPage = 8;
let currentPage = 1;

/**
 * Generate rentang nomor halaman dengan ellipsis (...) jika jumlah halaman banyak
 */
function generatePageRange(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const range = [];
    range.push(1);

    if (current > 3) {
        range.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        if (!range.includes(i)) range.push(i);
    }

    if (current < total - 2) {
        range.push('...');
    }

    if (!range.includes(total)) range.push(total);
    return range;
}

/**
 * Update pagination UI & navigation buttons sesuai gambar referensi
 */
function updatePaginationControls(totalItems) {
    const pageStartEl = document.getElementById('page-start');
    const pageEndEl = document.getElementById('page-end');
    const totalCountEl = document.getElementById('total-count');
    const pageNumbersEl = document.getElementById('page-numbers');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const perPageSelect = document.getElementById('items-per-page-select');

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (pageStartEl) pageStartEl.textContent = startItem;
    if (pageEndEl) pageEndEl.textContent = endItem;
    if (totalCountEl) totalCountEl.textContent = totalItems;

    if (btnPrev) {
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderAllTransaksi(currentTransactions, false);
            }
        };
    }

    if (btnNext) {
        btnNext.disabled = currentPage >= totalPages;
        btnNext.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderAllTransaksi(currentTransactions, false);
            }
        };
    }

    if (perPageSelect) {
        perPageSelect.value = itemsPerPage;
        perPageSelect.onchange = (e) => {
            itemsPerPage = parseInt(e.target.value) || 8;
            currentPage = 1;
            renderAllTransaksi(currentTransactions, false);
        };
    }

    if (pageNumbersEl) {
        pageNumbersEl.innerHTML = '';
        const pageRange = generatePageRange(currentPage, totalPages);

        pageRange.forEach(p => {
            if (p === '...') {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersEl.appendChild(ellipsis);
            } else {
                const numBtn = document.createElement('div');
                numBtn.className = `page-num ${p === currentPage ? 'active' : ''}`;
                numBtn.textContent = p;
                numBtn.onclick = () => {
                    currentPage = p;
                    renderAllTransaksi(currentTransactions, false);
                };
                pageNumbersEl.appendChild(numBtn);
            }
        });
    }
}

/**
 * Render semua transaksi ke tabel dengan paginasi
 */
function renderAllTransaksi(dataArray, resetPage = true) {
    if (resetPage) currentPage = 1;

    const tableBody = document.getElementById('table-body');
    if (!tableBody) {
        console.error('Element #table-body tidak ditemukan');
        return;
    }
    
    // Simpan ke state global
    currentTransactions = dataArray || [];

    // Clear existing content
    tableBody.innerHTML = '';
    
    if (!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1;">Tidak ada data transaksi</div>';
        updatePaginationControls(0);
        return;
    }
    
    // Sort array berdasarkan opsi aktif
    const sortedData = sortTransactions(dataArray, currentSortKey);

    // Calculate pagination slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = sortedData.slice(startIndex, startIndex + itemsPerPage);

    // Render sorted & sliced rows
    pageItems.forEach(item => {
        const row = renderTransaksiRow(item);
        tableBody.appendChild(row);
    });

    // Update pagination UI
    updatePaginationControls(sortedData.length);
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.input-cari-produk');
    const searchBtn = document.querySelector('.btn-search-trigger') || document.querySelector('.row-vuesax-outline3');

    const performSearch = () => {
        const keyword = searchInput ? searchInput.value : '';
        initKeuangan({ search: keyword });
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
}

/**
 * Initialize filter/urutkan functionality
 */
function initFilter() {
    const sortBtn = document.querySelector('.btn-sort-keuangan') || document.querySelector('.dropdown-trigger-keuangan');
    const menu = document.querySelector('.sort-dropdown-menu-keuangan');
    const label = document.querySelector('.text-urutkan-transaksi');
    const options = document.querySelectorAll('.sort-option-keuangan');

    if (sortBtn && menu) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('show');
            menu.classList.toggle('show', !isOpen);
            sortBtn.classList.toggle('open', !isOpen);
        });

        document.addEventListener('click', (e) => {
            if (menu.classList.contains('show') && !menu.contains(e.target) && !sortBtn.contains(e.target)) {
                menu.classList.remove('show');
                sortBtn.classList.remove('open');
            }
        });
    }

    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const sortKey = opt.getAttribute('data-sort');
            currentSortKey = sortKey;

            // Update active styling
            options.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            // Update label text
            const rawText = opt.textContent.trim();
            const cleanText = rawText.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]\s*/u, '');
            if (label) {
                label.textContent = `Urutkan: ${cleanText}`;
            }

            if (menu) menu.classList.remove('show');
            if (sortBtn) sortBtn.classList.remove('open');

            // Re-render table
            if (currentTransactions && currentTransactions.length > 0) {
                renderAllTransaksi(currentTransactions);
            }
        });
    });
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
        console.error('Gagal memuat summary keuangan dari API');
    }
    
    // Load and render transaksi table
    const transaksi = await fetchTransaksi(filters);
    if (transaksi) {
        renderAllTransaksi(transaksi);
    } else {
        console.error('Gagal memuat transaksi keuangan dari API');
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: red;">⚠️ Gagal memuat data transaksi dari API.</div>';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initKeuangan();
    initSearch();
    initFilter();
});