
const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL backend Anda
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

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
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
            throw new Error(data.message || 'Login gagal');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message
        };
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
        
        if (!email || !password) {
            showError('Email dan password harus diisi!');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Format email tidak valid!');
            return;
        }
        
        const result = await loginUser(email, password);
        
        if (result.success) {
            showSuccess('Login berhasil!');
            
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(result.data));

            setTimeout(() => {
                window.location.href = '../../Pembeli/Pages/beranda.html';
            }, 1000);
        } else {
            showError(result.error || 'Email atau password salah.');
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