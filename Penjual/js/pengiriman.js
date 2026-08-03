/**
 * pengiriman.js
 * Handler untuk halaman Pengiriman - Fetch & Render Data Dinamis
 */

// 1. UBAH API_BASE_URL mengarah ke Server Express Backend (Port 3001)
const API_BASE_URL = 'http://localhost:3001/api';

const API_ENDPOINTS = {
    pengiriman: `${API_BASE_URL}/pengiriman`,
    updateStatus: `${API_BASE_URL}/pengiriman/update-status`
};

/**
 * Fetch data pengiriman dari API
 */
async function fetchPengiriman(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_ENDPOINTS.pengiriman}?${queryParams}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pengiriman:', error);
        return null;
    }
}

/**
 * Render skeleton/placeholder rows while data is being fetched.
 * Shown immediately (no network wait), swapped out once real data arrives.
 */
function renderTableSkeleton(rowCount = 4) {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    let html = '';
    for (let i = 0; i < rowCount; i++) {
        html += `
            <div class="row-skeleton">
                <div class="skeleton-block" style="width: 70%;"></div>
                <div class="skeleton-block" style="width: 60%;"></div>
                <div class="skeleton-block" style="width: 65%;"></div>
                <div class="skeleton-block" style="width: 85%;"></div>
                <div class="skeleton-block" style="width: 50%; margin: 0 auto;"></div>
            </div>
        `;
    }
    tableBody.innerHTML = html;
}

/**
 * Render satu baris data pengiriman
 */
function renderPengirimanRow(item) {
    const row = document.createElement('div');
    row.className = 'row-item-tabel';
    row.dataset.shippingId = item.id;
    
    // Determine status badge class
    const statusClass = getStatusClass(item.status);
    
    // 2. DISESUAIKAN DENGAN NAMA PROPERTI DARI BACKEND SQL
    row.innerHTML = `
        <div>${item.no_pesanan || '-'}</div>
        <div>${item.nama_pembeli || '-'}</div>
        <div>${item.produk || '-'}</div>
        <div>${item.alamat || '-'}</div>
        <div style="text-align: center;">
            <span class="badge-status ${statusClass}">${item.status || 'Diproses'}</span>
        </div>
    `;
    
    return row;
}

/**
 * Get CSS class for status badge
 */
function getStatusClass(status) {
    const statusMap = {
        'Dikirim': 'dikirim',
        'Diproses': 'diproses',
        'Selesai': 'selesai',
        'Dibatalkan': 'dibatalkan'
    };
    return statusMap[status] || 'dikirim';
}

/**
 * Render semua data pengiriman ke tabel
 */
function renderAllPengiriman(dataArray) {
    const tableBody = document.getElementById('table-body');
    
    if (!tableBody) {
        console.error('Element #table-body tidak ditemukan');
        return;
    }
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: #666;">Tidak ada data pengiriman</div>';
        return;
    }
    
    // Render each row
    dataArray.forEach(item => {
        const row = renderPengirimanRow(item);
        tableBody.appendChild(row);
    });

    // Panggil applyTableFilters untuk paginasi (8 per halaman), filter, dan update counter Results
    applyTableFilters(true);
}

// State global untuk filter, pencarian, pengurutan, dan paginasi
let currentSearchQuery = '';
let currentStatusFilter = 'Semua Status';
let currentSortState = 0; // 0: Normal, 1: Ascending (A-Z), 2: Descending (Z-A)
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
                applyTableFilters(false);
            }
        };
    }

    if (btnNext) {
        btnNext.disabled = currentPage >= totalPages;
        btnNext.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyTableFilters(false);
            }
        };
    }

    if (perPageSelect) {
        perPageSelect.value = itemsPerPage;
        perPageSelect.onchange = (e) => {
            itemsPerPage = parseInt(e.target.value) || 8;
            currentPage = 1;
            applyTableFilters(false);
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
                    applyTableFilters(false);
                };
                pageNumbersEl.appendChild(numBtn);
            }
        });
    }
}

/**
 * Terapkan kombinasi pencarian, filter status, pengurutan, dan paginasi
 */
function applyTableFilters(resetPage = true) {
    if (resetPage) currentPage = 1;

    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('.row-item-tabel'));
    if (rows.length === 0) {
        updatePaginationControls(0);
        return;
    }

    rows.forEach((row, index) => {
        if (row.dataset.originalIndex === undefined) {
            row.dataset.originalIndex = index;
        }
    });

    const query = currentSearchQuery.toLowerCase().trim();
    const statusFilter = currentStatusFilter.toLowerCase().trim();

    // 1. Filter matching rows
    const matchedRows = rows.filter(row => {
        const text = row.textContent.toLowerCase();
        const badge = row.querySelector('.badge-status');
        const rowStatus = badge ? badge.textContent.toLowerCase().trim() : '';

        const matchesSearch = !query || text.includes(query);
        const matchesStatus = statusFilter === 'semua status' || rowStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 2. Hide unmatched rows
    rows.forEach(row => {
        if (!matchedRows.includes(row)) {
            row.style.display = 'none';
        }
    });

    // 3. Sort matched rows
    matchedRows.sort((a, b) => {
        if (currentSortState === 1) { // Ascending
            const textA = (a.children[1] ? a.children[1].textContent : '').toLowerCase().trim();
            const textB = (b.children[1] ? b.children[1].textContent : '').toLowerCase().trim();
            return textA.localeCompare(textB, undefined, { numeric: true, sensitivity: 'base' });
        } else if (currentSortState === 2) { // Descending
            const textA = (a.children[1] ? a.children[1].textContent : '').toLowerCase().trim();
            const textB = (b.children[1] ? b.children[1].textContent : '').toLowerCase().trim();
            return textB.localeCompare(textA, undefined, { numeric: true, sensitivity: 'base' });
        } else { // Normal
            return parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex);
        }
    });

    // 4. Calculate pagination slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    matchedRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
        tableBody.appendChild(row);
    });

    // 5. Update pagination UI
    updatePaginationControls(matchedRows.length);

    // Pesan jika tidak ada hasil
    let emptyMsg = document.getElementById('no-search-results');
    if (matchedRows.length === 0) {
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.id = 'no-search-results';
            emptyMsg.style.cssText = 'padding: 20px; text-align: center; color: #666; width: 100%; grid-column: 1 / -1;';
            emptyMsg.textContent = 'Tidak ada data pengiriman yang cocok.';
            tableBody.appendChild(emptyMsg);
        } else {
            emptyMsg.style.display = '';
        }
    } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
    }
}

/**
 * Compatible fallback wrapper untuk filterTableRows
 */
function filterTableRows(query) {
    currentSearchQuery = query || '';
    applyTableFilters();
}

/**
 * Initialize search functionality
 * Filter baru dijalankan ketika tombol icon pencarian diklik atau menekan Enter
 */
function initSearch() {
    const searchInput = document.querySelector('.cari-pengiriman input[type="text"]');
    const searchButton = document.querySelector('.cari-pengiriman button');

    const performSearch = () => {
        currentSearchQuery = searchInput ? searchInput.value : '';
        applyTableFilters();
    };

    if (searchInput) {
        // Trigger filter saat menekan tombol Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    if (searchButton) {
        // Trigger filter saat icon search diklik
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
}

/**
 * Initialize filter status & sort functionality
 */
function initFilterStatus() {
    const sortBtn = document.querySelector('.btn-status .btn-sort');
    const sortIndicator = document.querySelector('.btn-status .sort-indicator');
    const dropdownTrigger = document.querySelector('.btn-status .dropdown-trigger');
    const dropdownMenu = document.querySelector('.btn-status .status-dropdown-menu');
    const statusText = document.querySelector('.btn-status .row-text8');
    const statusOptions = document.querySelectorAll('.btn-status .status-option');

    // 1. Toggle Sort Nama Pembeli (Normal -> Ascending -> Descending -> Normal)
    if (sortBtn) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Jangan sampai membuka/tutup dropdown
            currentSortState = (currentSortState + 1) % 3;

            if (currentSortState === 1) {
                if (sortIndicator) sortIndicator.textContent = '▲';
                sortBtn.title = 'Urutan Nama Pembeli: Ascending (A-Z)';
            } else if (currentSortState === 2) {
                if (sortIndicator) sortIndicator.textContent = '▼';
                sortBtn.title = 'Urutan Nama Pembeli: Descending (Z-A)';
            } else {
                if (sortIndicator) sortIndicator.textContent = '';
                sortBtn.title = 'Urutan Nama Pembeli: Normal';
            }

            applyTableFilters();
        });
    }

    // 2. Toggle Dropdown Menu
    const btnStatus = document.querySelector('.btn-status');
    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownMenu.classList.contains('show');
            dropdownMenu.classList.toggle('show', !isOpen);
            if (btnStatus) btnStatus.classList.toggle('open', !isOpen);
        });

        // Tutup dropdown saat mengklik di luar area
        document.addEventListener('click', (e) => {
            if (dropdownMenu.classList.contains('show') && !dropdownMenu.contains(e.target) && !dropdownTrigger.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                if (btnStatus) btnStatus.classList.remove('open');
            }
        });
    }

    // 3. Pilihan Status Dropdown (Semua Status, Dikirim, Diproses)
    statusOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedStatus = option.getAttribute('data-status');
            currentStatusFilter = selectedStatus;

            // Toggle active styling
            statusOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            if (statusText) {
                statusText.textContent = selectedStatus;
            }

            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
                if (btnStatus) btnStatus.classList.remove('open');
            }

            applyTableFilters();
        });
    });
}

/**
 * Initialize & Load Data
 */
async function initPengiriman(filters = {}) {
    // Show skeleton rows right away instead of leaving the table body blank
    // while fetchPengiriman() is in flight — this is what removes the "flash".
    renderTableSkeleton();

    const data = await fetchPengiriman(filters);
    
    if (data && Array.isArray(data) && data.length > 0) {
        renderAllPengiriman(data);
    } else if (data && Array.isArray(data) && data.length === 0) {
        // API berhasil, tapi data kosong
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: #666;">Belum ada data pengiriman.</div>';
        }
    } else {
        // API gagal atau belum tersedia
        console.error('Gagal memuat data pengiriman dari API');
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: red;">⚠️ Gagal memuat data. Pastikan API backend Node.js (Port 3001) sudah berjalan dan MySQL terkoneksi.</div>';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPengiriman();
    initSearch();
    initFilterStatus();
});