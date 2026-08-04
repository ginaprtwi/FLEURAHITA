// Register Logic - FLEURAHITA
// Database connection untuk registrasi user

// Configuration - Sesuaikan dengan setup database Anda
const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL backend Anda

// Get form elements
const registerForm = document.getElementById('registerForm');
const submitBtn = registerForm.querySelector('.submit-btn');

// Toggle password visibility
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

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (Indonesian format)
function validatePhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate password strength
function validatePassword(password) {
    // Minimal 8 karakter, mengandung huruf dan angka
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return {
        valid: minLength && hasLetter && hasNumber,
        message: !minLength ? 'Password minimal 8 karakter' :
                 !hasLetter ? 'Password harus mengandung huruf' :
                 !hasNumber ? 'Password harus mengandung angka' :
                 'Password valid'
    };
}

// Show error message
function showError(message) {
    // Bisa diganti dengan toast notification atau modal yang lebih bagus
    alert(message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// Register user to database
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registrasi gagal');
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Handle form submission
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses...';
    
    try {
        // Get form values
        const namaLengkap = document.getElementById('namaLengkap').value.trim();
        const email = document.getElementById('email').value.trim();
        const noHp = document.getElementById('noHp').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!namaLengkap || !email || !noHp || !password || !confirmPassword) {
            showError('Semua field harus diisi!');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Format email tidak valid!');
            return;
        }
        
        if (!validatePhone(noHp)) {
            showError('Format nomor HP tidak valid! Gunakan format: 08xx atau +628xx');
            return;
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            showError(passwordValidation.message);
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Password dan Konfirmasi Password tidak cocok!');
            return;
        }
        
        // Prepare user data
        const userData = {
            namaLengkap: namaLengkap,
            email: email,
            noHp: noHp,
            password: password,
            role: 'pembeli', // Default role sebagai pembeli
            createdAt: new Date().toISOString()
        };
        
        // Register to database
        const result = await registerUser(userData);
        
        if (result.success) {
            showSuccess('Registrasi berhasil! Silakan login.');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '../Login/log-in-user.html';
            }, 2000);
        } else {
            showError(result.error || 'Registrasi gagal. Silakan coba lagi.');
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

// Real-time validation feedback (optional)
document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

document.getElementById('noHp').addEventListener('blur', function() {
    if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    if (this.value && this.value !== password) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});