/**
 * pesanan-masuk.js
 * Handler untuk halaman Pesanan Masuk - Fetch & Render Data Dinamis
 */

// API Configuration (Server Express Backend Port 3001)
const API_BASE_URL = 'http://localhost:3001/api';
const API_ENDPOINTS = {
    pesananMasuk: `${API_BASE_URL}/pesanan-masuk`,
    updateStatus: `${API_BASE_URL}/pesanan-masuk/update-status`
};

/**
 * Fetch data pesanan masuk dari API
 */
async function fetchPesananMasuk(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_ENDPOINTS.pesananMasuk}?${queryParams}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pesanan masuk:', error);
        return null;
    }
}

/**
 * Render satu baris data pesanan
 */
function renderPesananRow(item) {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.dataset.orderId = item.id;
    
    // Fallback path untuk foto produk
    let imgSrc = '../assets/pesanan-masuk/column/column-img2.png';
    if (item.product_image) {
        if (item.product_image.startsWith('../') || item.product_image.startsWith('/') || item.product_image.startsWith('http')) {
            imgSrc = item.product_image;
        } else {
            imgSrc = `../assets/pesanan-masuk/${item.product_image}`;
        }
    }

    const productName = item.product_name || '-';
    const customerName = item.customer_name || '-';
    const totalFormatted = formatCurrency(item.total || 0);
    const paymentStatus = (item.payment_status || '').toLowerCase();
    const isLunas = paymentStatus === 'lunas' || paymentStatus.includes('gopay') || paymentStatus.includes('ovo') || paymentStatus.includes('dana') || paymentStatus.includes('transfer');

    // Status badge text & class
    const statusBadgeText = isLunas ? 'Lunas' : 'Belum Lunas';
    const statusBadgeClass = isLunas ? 'badge-lunas' : 'badge-belum-lunas';

    row.innerHTML = `
        <!-- Produk -->
        <div class="col-produk">
            <div class="column-b col4">
                <div class="rect column-rect"></div>
                <img src="${imgSrc}" class="img-a" alt="${productName}" onerror="this.src='../assets/pesanan-masuk/column/column-img2.png'" />
            </div>
            <span class="text-sweet-aurora1 text-dark">${productName}</span>
        </div>

        <!-- Nama Pembeli -->
        <div>${customerName}</div>

        <!-- Total -->
        <div>${totalFormatted}</div>

        <!-- Status (Badge Pembayaran) -->
        <div class="col-status">
            <span class="status-badge ${statusBadgeClass}">${statusBadgeText}</span>
        </div>

        <!-- Aksi (Detail + Selesai) -->
        <div class="col-aksi">
            <div class="aksi-item" onclick="showDetailPesanan(${item.id})" style="cursor: pointer;">
                <img src="../assets/pesanan-masuk/eye-detail-icon.svg" class="aksi-icon" alt="Detail" />
                <span class="aksi-label">Detail</span>
            </div>
            <div class="aksi-item" onclick="selesaikanPesanan(${item.id})" style="cursor: pointer;">
                <object data="../assets/pesanan-masuk/column/column-iconly-light.svg" class="aksi-icon-svg" type="image/svg+xml"></object>
                <span class="aksi-label">Selesai</span>
            </div>
        </div>
    `;
    
    return row;
}

/**
 * Render semua data pesanan ke tabel
 */
function renderAllPesanan(dataArray) {
    const tableBody = document.getElementById('table-body');
    
    if (!tableBody) {
        console.error('Element #table-body tidak ditemukan');
        return;
    }
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1;">Tidak ada data pesanan</div>';
        return;
    }
    
    // Render each row
    dataArray.forEach(item => {
        const row = renderPesananRow(item);
        tableBody.appendChild(row);
    });
}

/**
 * Format currency (Rupiah)
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp. ');
}

/**
 * Show detail pesanan (implementasi sesuai kebutuhan)
 */
function showDetailPesanan(orderId) {
    console.log('Show detail for order:', orderId);
    // TODO: Implement modal atau redirect ke halaman detail
    alert(`Detail pesanan #${orderId} - Implementasikan sesuai kebutuhan`);
}

/**
 * Tandai pesanan sebagai Selesai
 */
async function selesaikanPesanan(orderId) {
    if (!confirm('Tandai pesanan ini sebagai SELESAI?')) return;
    
    try {
        const response = await fetch(`${API_ENDPOINTS.updateStatus}/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Selesai' })
        });
        
        if (response.ok) {
            alert('Pesanan berhasil ditandai selesai');
            initPesananMasuk(); // Reload data
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Gagal mengubah status pesanan');
    }
}

/**
 * Update payment status
 */
async function updatePaymentStatus(orderId) {
    if (!confirm('Tandai pesanan ini sebagai LUNAS?')) return;
    
    try {
        const response = await fetch(`${API_ENDPOINTS.updateStatus}/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_status: 'lunas' })
        });
        
        if (response.ok) {
            alert('Status pembayaran berhasil diupdate');
            initPesananMasuk(); // Reload data
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        alert('Gagal update status pembayaran');
    }
}

/**
 * Delete pesanan
 */
async function deletePesanan(orderId) {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) return;
    
    try {
        const response = await fetch(`${API_ENDPOINTS.pesananMasuk}/${orderId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Pesanan berhasil dihapus');
            initPesananMasuk(); // Reload data
        } else {
            throw new Error('Failed to delete');
        }
    } catch (error) {
        console.error('Error deleting pesanan:', error);
        alert('Gagal menghapus pesanan');
    }
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

    const rows = Array.from(tableBody.querySelectorAll('.table-row'));
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
        const badge = row.querySelector('.status-badge');
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
            emptyMsg.textContent = 'Tidak ada data pesanan yang cocok.';
            tableBody.appendChild(emptyMsg);
        } else {
            emptyMsg.style.display = '';
        }
    } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.cari-pesanan-box input[type="text"]');
    const searchButton = document.querySelector('.cari-pesanan-box button');
    
    const performSearch = () => {
        currentSearchQuery = searchInput ? searchInput.value : '';
        applyTableFilters();
    };

    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
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
            e.stopPropagation();
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

    // 3. Pilihan Status Dropdown (Semua Status, Lunas, Belum Lunas)
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
async function initPesananMasuk(filters = {}) {
    const data = await fetchPesananMasuk(filters);
    
    if (data && Array.isArray(data) && data.length > 0) {
        renderAllPesanan(data);
        applyTableFilters(); // Terapkan filter jika ada
    } else if (data && Array.isArray(data) && data.length === 0) {
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: #666;">Belum ada data pesanan masuk.</div>';
        }
    } else {
        console.error('Gagal memuat data pesanan masuk dari API');
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1; color: red;">⚠️ Gagal memuat data pesanan masuk dari API.</div>';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPesananMasuk();
    initSearch();
    initFilterStatus();
});