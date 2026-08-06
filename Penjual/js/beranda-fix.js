// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupSearch();
});

// Load all dashboard data
async function loadDashboardData() {
    try {
        // Load stats
        await loadDashboardStats();
        
        // Load recent orders
        await loadRecentOrders();
        
        // Load recent chats
        await loadRecentChats();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/pesanan-masuk/dashboard/stats`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const stats = result.data;
            
            // Update stat cards
            updateStatCard(0, stats.pending || 0, 'Belum diproses');
            updateStatCard(1, stats.processing || 0, 'Dalam Pengerjaan');
            updateStatCard(2, stats.completed || 0, 'Pesanan Selesai');
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Update individual stat card
function updateStatCard(index, count, badgeText) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const valueEl = statCards[index].querySelector('.stat-value');
        const badgeEl = statCards[index].querySelector('.stat-badge');
        
        if (valueEl) valueEl.textContent = `${count} Pesanan`;
        if (badgeEl) badgeEl.textContent = badgeText;
    }
}

// Load recent orders for table
async function loadRecentOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/pesanan-masuk/dashboard/recent?limit=10`);
        const result = await response.json();
        
        if (result.success && result.data) {
            renderOrders(result.data);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        renderOrders([]);
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterTableRows(searchTerm);
        });
    }
}

// Filter table rows based on search term
function filterTableRows(searchTerm) {
    const rows = document.querySelectorAll('.orders-table tbody tr');
    
    rows.forEach(row => {
        const buyerName = row.querySelector('.buyer-cell span')?.textContent.toLowerCase() || '';
        const productName = row.cells[1]?.textContent.toLowerCase() || '';
        const date = row.cells[3]?.textContent.toLowerCase() || '';
        
        if (buyerName.includes(searchTerm) || productName.includes(searchTerm) || date.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Render orders table
function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #6C7275;">
                    Tidak ada pesanan ditemukan
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        // Get avatar path
        const avatarPath = order.avatar && order.avatar !== 'default-avatar.png' 
            ? `http://localhost:3001/uploads/profiles/${order.avatar}` 
            : '../assets/column/column-3d-avatars.png';
        
        // Get first product name
        const productName = order.product_names ? order.product_names.split(',')[0].trim() : '-';
        
        // Map status
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        
        // Format date
        const orderDate = formatDateRelative(order.order_date);
        
        return `
            <tr>
                <td>
                    <div class="buyer-cell">
                        <img src="${avatarPath}" alt="Avatar" class="avatar" onerror="this.src='../assets/column/column-3d-avatars.png'">
                        <span>${order.buyer_name}</span>
                    </div>
                </td>
                <td>${productName}</td>
                <td>${formatPrice(order.total)}</td>
                <td>${orderDate}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

// Get status CSS class
function getStatusClass(status) {
    const statusMap = {
        'Menunggu Pembayaran': 'pending',
        'Diproses': 'processing',
        'Dikirim': 'processing',
        'Selesai': 'completed',
        'Dibatalkan': 'pending'
    };
    return statusMap[status] || 'pending';
}

// Get status display text
function getStatusText(status) {
    const statusMap = {
        'Menunggu Pembayaran': 'Belum diproses',
        'Diproses': 'Diproses',
        'Dikirim': 'Diproses',
        'Selesai': 'Selesai',
        'Dibatalkan': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// Format price to IDR
function formatPrice(price) {
    return parseFloat(price).toLocaleString('id-ID');
}

// Load recent chats
async function loadRecentChats() {
    try {
        const response = await fetch(`${API_BASE_URL}/pesanan-masuk/dashboard/chats?limit=5`);
        const result = await response.json();
        
        if (result.success && result.data) {
            renderChats(result.data);
        }
    } catch (error) {
        console.error('Error loading chats:', error);
        renderChats([]);
    }
}

// Render chat messages
function renderChats(chats) {
    const container = document.getElementById('chatContainer');
    
    if (!container) return;
    
    if (chats.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6C7275;">
                Belum ada chat masuk
            </div>
        `;
        return;
    }
    
    container.innerHTML = chats.map(chat => {
        const avatarPath = chat.avatar && chat.avatar !== 'default-avatar.png' 
            ? `http://localhost:3001/uploads/profiles/${chat.avatar}` 
            : '../assets/column/column-3d-avatars.png';
        
        const timeAgo = formatDateRelative(chat.chat_date);
        
        return `
            <div class="chat-item">
                <img src="${avatarPath}" alt="Avatar" class="chat-avatar" onerror="this.src='../assets/column/column-3d-avatars.png'">
                <div class="chat-content">
                    <div class="chat-header">
                        <span class="chat-name">${chat.customer_name}</span>
                        <span class="chat-time">${timeAgo}</span>
                    </div>
                    <p class="chat-message">${chat.message}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Format date relative
function formatDateRelative(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
}