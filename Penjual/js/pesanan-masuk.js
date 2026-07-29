/**
 * pesanan-masuk.js
 * Handler untuk halaman Pesanan Masuk - Fetch & Render Data Dinamis
 */

// API Configuration (Sesuaikan dengan backend Anda)
const API_BASE_URL = '/api'; // Ganti dengan URL backend Anda
const API_ENDPOINTS = {
    pesananMasuk: `${API_BASE_URL}/pesanan-masuk`,
    updateStatus: `${API_BASE_URL}/pesanan/update-status`
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
    
    row.innerHTML = `
        <!-- Produk -->
        <div class="col-produk">
            <div class="column-b col4">
                <div class="rect column-rect"></div>
                <img src="${item.product_image || '../assets/pesanan-masuk/column/column-img2.png'}" class="img-a" alt="${item.product_name}" />
            </div>
            <span class="text-sweet-aurora1 text-dark">${item.product_name}</span>
        </div>

        <!-- Nama Pembeli -->
        <div>${item.customer_name}</div>

        <!-- Total -->
        <div>${formatCurrency(item.total)}</div>

        <!-- Status -->
        <div class="col-status">
            <div class="column-c col5">
                <object data="../assets/pesanan-masuk/column/column-iconly-light.svg" class="column-iconly-light-outline-tick column-iconly-light1" type="image/svg+xml"></object>
                <p class="column-text1">${item.status}</p>
            </div>
        </div>

        <!-- Aksi -->
        <div class="col-aksi">
            <span class="text-detail" onclick="showDetailPesanan(${item.id})">Detail</span>
            ${item.payment_status !== 'lunas' ? `<button class="btn-belum-lunas hover-dark" onclick="updatePaymentStatus(${item.id})">Belum Lunas</button>` : ''}
            <div class="iconly-light2">
                <object data="../assets/pesanan-masuk/iconly-light-fill.svg" class="iconly-light-fill" type="image/svg+xml"></object>
                <img src="../assets/pesanan-masuk/iconly-light-img.png" class="iconly-light-img" onclick="deletePesanan(${item.id})" style="cursor: pointer;" />
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

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.cari-pesanan-box input[type="text"]');
    const searchButton = document.querySelector('.cari-pesanan-box button');
    
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const keyword = searchInput.value;
            initPesananMasuk({ search: keyword });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = searchInput.value;
                initPesananMasuk({ search: keyword });
            }
        });
    }
}

/**
 * Initialize & Load Data
 */
async function initPesananMasuk(filters = {}) {
    const data = await fetchPesananMasuk(filters);
    
    if (data) {
        renderAllPesanan(data);
    } else {
        // Jika API belum tersedia, gunakan data dummy untuk testing
        console.warn('API belum tersedia, menggunakan data dummy');
        const dummyData = [
            {
                id: 1,
                product_name: 'Sweet Aurora Bloom',
                product_image: '../assets/pesanan-masuk/column/column-img2.png',
                customer_name: 'Reza Fahrizki',
                total: 250000,
                status: 'Selesai',
                payment_status: 'belum_lunas'
            },
            {
                id: 2,
                product_name: 'Lush & Plush',
                product_image: '../assets/pesanan-masuk/img1.png',
                customer_name: 'Reisya Seinanda',
                total: 250000,
                status: 'Selesai',
                payment_status: 'belum_lunas'
            },
            {
                id: 3,
                product_name: 'Sweet Aurora Bloom',
                product_image: '../assets/pesanan-masuk/column/column-img2.png',
                customer_name: 'Hendri Pradita',
                total: 250000,
                status: 'Selesai',
                payment_status: 'lunas'
            }
        ];
        renderAllPesanan(dummyData);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPesananMasuk();
    initSearch();
});