// Sidebar Logout Handler untuk Penjual
// Menggunakan modal notification yang sama dengan Pembeli

(function() {
    // Handle logout untuk Penjual
    window.handlePenjualLogout = function() {
        showLogoutConfirmation();
    };

    function showLogoutConfirmation() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 32px 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            text-align: center;
            min-width: 320px;
            max-width: 400px;
        `;
        
        modal.innerHTML = `
            <div style="color: #820805; font-size: 48px; margin-bottom: 16px;">❓</div>
            <div style="color: #333; font-size: 16px; font-weight: 500; margin-bottom: 8px;">Konfirmasi Logout</div>
            <div style="color: #666; font-size: 14px; margin-bottom: 24px;">Apakah anda yakin ingin keluar?</div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="penjual-logout-cancel-btn" style="
                    background: #f5f5f5;
                    color: #333;
                    border: 1px solid #ddd;
                    padding: 10px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                ">Tidak</button>
                <button id="penjual-logout-confirm-btn" style="
                    background: #820805;
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                ">Keluar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('penjual-logout-cancel-btn').onclick = () => modal.remove();
        document.getElementById('penjual-logout-confirm-btn').onclick = () => {
            modal.remove();
            logout();
        };
    }

    function logout() {
        // Clear all user data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        
        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(180deg, #820805 0%, #ff5f5b 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        notification.textContent = 'Anda telah berhasil logout';
        document.body.appendChild(notification);
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = '../../Auth/Login/log-in-user.html';
        }, 1500);
    }
})();