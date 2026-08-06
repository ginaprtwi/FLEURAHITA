
const API_BASE_URL = 'http://localhost:3001/api'; // Ganti dengan URL backend Anda
const ADMIN_EMAIL = 'admin@fleurahita.com'; // Email admin (hardcoded)
const loginForm = document.getElementById('loginForm');
const submitBtn = loginForm.querySelector('.submit-btn');

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const svg = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        // Icon mata tertutup (slash)
        svg.innerHTML = `
            <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        `;
    } else {
        input.type = 'password';
        // Icon mata terbuka
        svg.innerHTML = `
            <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        `;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearErrors() {
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    // Remove error styling from inputs
    document.querySelectorAll('.input-error').forEach(el => {
        el.classList.remove('input-error');
    });
}

function showError(message, fieldId = null) {
    clearErrors();
    
    if (fieldId) {
        // Show error for specific field
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add('input-error');
        }
    } else {
        // Show general error
        const generalError = document.getElementById('generalError');
        if (generalError) {
            generalError.textContent = message;
        }
    }
}

function showSuccess(message) {
    clearErrors();
    const generalError = document.getElementById('generalError');
    if (generalError) {
        generalError.textContent = message;
        generalError.style.color = '#28a745';
        generalError.style.background = '#f0fff4';
        generalError.style.borderColor = '#c3e6cb';
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Login gagal',
                errorField: data.errorField || null
            };
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Tidak dapat terhubung ke server',
            errorField: null
        };
    }
}

// Load cart user dari database saat login
async function loadUserCartFromDatabase(userId) {
    try {
        // Fetch cart dari backend
        const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
        const result = await response.json();
        
        const cartKey = `fleurahita_cart_${userId}`;
        
        if (response.ok && result.success && result.data && result.data.length > 0) {
            // Ada cart di database, load dari database
            const cartItems = result.data.map(item => ({
                id: item.id_Produk,
                name: item.Nama_Produk,
                price: parseFloat(item.Harga),
                quantity: item.Jumlah,
                image: item.Foto_Produk ? `../assets/products/${item.Foto_Produk}` : '../assets/card/card-img.png'
            }));
            
            // Save ke localStorage dengan key per user
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
            
            // Juga save ke key lama untuk backward compatibility
            localStorage.setItem('fleurahita_cart', JSON.stringify(cartItems));
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            console.log(`Cart loaded for user ${userId}:`, cartItems.length, 'items');
        } else {
            // Cart kosong di database, cek localStorage
            const existingCart = localStorage.getItem(cartKey);
            
            if (existingCart && existingCart !== '[]') {
                // Ada cart di localStorage, keep it
                console.log(`Keeping existing localStorage cart for user ${userId}`);
                try {
                    const parsed = JSON.parse(existingCart);
                    // Update key lama juga
                    localStorage.setItem('fleurahita_cart', existingCart);
                    localStorage.setItem('cartItems', existingCart);
                } catch (e) {
                    // Invalid JSON, initialize empty
                    localStorage.setItem(cartKey, JSON.stringify([]));
                    localStorage.setItem('fleurahita_cart', JSON.stringify([]));
                    localStorage.setItem('cartItems', JSON.stringify([]));
                }
            } else {
                // Tidak ada cart di localStorage, buat baru kosong
                localStorage.setItem(cartKey, JSON.stringify([]));
                localStorage.setItem('fleurahita_cart', JSON.stringify([]));
                localStorage.setItem('cartItems', JSON.stringify([]));
                console.log(`Empty cart initialized for user ${userId}`);
            }
        }
    } catch (error) {
        console.error('Error loading cart from database:', error);
        // Pada error, keep existing localStorage cart if any
        const cartKey = `fleurahita_cart_${userId}`;
        const existingCart = localStorage.getItem(cartKey);
        
        if (!existingCart || existingCart === '[]') {
            // Initialize empty cart only if tidak ada cart sebelumnya
            localStorage.setItem(cartKey, JSON.stringify([]));
            localStorage.setItem('fleurahita_cart', JSON.stringify([]));
            localStorage.setItem('cartItems', JSON.stringify([]));
        } else {
            console.log('Keeping existing cart due to API error');
        }
    }
}

// Handle form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses...';
    
    try {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!email) {
            showError('Email harus diisi!', 'email');
            return;
        }
        
        if (!password) {
            showError('Password harus diisi!', 'password');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Format email tidak valid!', 'email');
            return;
        }
        
        const result = await loginUser(email, password);
        
        if (result.success) {
            showSuccess('Login berhasil!');
            
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(result.data));

            // Load cart user dari database dan sync ke localStorage
            await loadUserCartFromDatabase(result.data.userId || result.data.id_user);

            // Redirect based on admin email (hardcoded)
            setTimeout(() => {
                if (email === ADMIN_EMAIL) {
                    window.location.href = "/beranda-fix.html";
                } else {
                    window.location.href = "/beranda.html";
                }
            }, 1000);
        } else {
            // Show error on specific field if provided by backend
            if (result.errorField) {
                showError(result.error, result.errorField);
            } else {
                showError(result.error || 'Email atau password salah.');
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Masuk';
    }
});