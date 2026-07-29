/**
 * pengiriman.js
 * Handler untuk halaman Pengiriman - Fetch & Render Data Dinamis
 */

// API Configuration (Sesuaikan dengan backend Anda)
const API_BASE_URL = '/api'; // Ganti dengan URL backend Anda
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
 * Render satu baris data pengiriman
 */
function renderPengirimanRow(item) {
    const row = document.createElement('div');
    row.className = 'row-item-tabel';
    row.dataset.shippingId = item.id;
    
    // Determine status badge class
    const statusClass = getStatusClass(item.status);
    
    row.innerHTML = `
        <div>${item.order_number}</div>
        <div>${item.customer_name}</div>
        <div>${item.product_name}</div>
        <div>${item.address}</div>
        <div style="text-align: center;">
            <span class="badge-status ${statusClass}">${item.status}</span>
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
        tableBody.innerHTML = '<div style="padding: 20px; text-align: center; grid-column: 1 / -1;">Tidak ada data pengiriman</div>';
        return;
    }
    
    // Render each row
    dataArray.forEach(item => {
        const row = renderPengirimanRow(item);
        tableBody.appendChild(row);
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.cari-pengiriman input[type="text"]');
    const searchButton = document.querySelector('.cari-pengiriman button');
    
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const keyword = searchInput.value;
            initPengiriman({ search: keyword });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = searchInput.value;
                initPengiriman({ search: keyword });
            }
        });
    }
}

/**
 * Initialize filter status functionality
 */
function initFilterStatus() {
    const filterBtn = document.querySelector('.btn-status');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // TODO: Implement dropdown filter
            console.log('Filter status clicked');
            alert('Filter status - Implementasikan dropdown sesuai kebutuhan');
        });
    }
}

/**
 * Initialize & Load Data
 */
async function initPengiriman(filters = {}) {
    const data = await fetchPengiriman(filters);
    
    if (data) {
        renderAllPengiriman(data);
    } else {
        // Jika API belum tersedia, gunakan data dummy untuk testing
        console.warn('API belum tersedia, menggunakan data dummy');
        const dummyData = [
            {
                id: 1,
                order_number: '#1001',
                customer_name: 'Jane Doe',
                product_name: 'Buket Bunga Merah',
                address: 'Jl. Mawar No. 12',
                status: 'Dikirim'
            },
            {
                id: 2,
                order_number: '#1002',
                customer_name: 'Reisya Seinanda',
                product_name: 'Charme Bouquet',
                address: 'Jalan Dipatiukur',
                status: 'Dikirim'
            },
            {
                id: 3,
                order_number: '#1003',
                customer_name: 'Hendri Pradita',
                product_name: 'Charme Bouquet',
                address: 'Jalan Dipatiukur',
                status: 'Dikirim'
            }
        ];
        renderAllPengiriman(dummyData);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPengiriman();
    initSearch();
    initFilterStatus();
});