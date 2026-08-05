// Register Logic - FLEURAHITA
// Database connection untuk registrasi user

// Configuration - Sesuaikan dengan setup database Anda
const API_BASE_URL = 'http://localhost:3001/api'; // Ganti dengan URL backend Anda

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

// Validate name
function validateName(name) {
    if (name.length < 3) {
        return {
            valid: false,
            message: 'Nama minimal 3 karakter (saat ini: ' + name.length + ' karakter)'
        };
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return {
            valid: false,
            message: 'Nama hanya boleh berisi huruf dan spasi'
        };
    }
    
    return { valid: true, message: '' };
}

// Validate email format
function validateEmail(email) {
    // Check for @ symbol
    if (!email.includes('@')) {
        return {
            valid: false,
            message: 'Email harus mengandung karakter @ (contoh: nama@domain.com)'
        };
    }
    
    // Check for domain
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return {
            valid: false,
            message: 'Format email tidak valid (contoh: nama@domain.com)'
        };
    }
    
    // Check domain has dot and valid TLD
    const domain = parts[1];
    if (!domain.includes('.')) {
        return {
            valid: false,
            message: 'Email harus memiliki domain yang valid (contoh: @gmail.com, @yahoo.com)'
        };
    }
    
    // Check domain length and TLD
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    
    if (tld.length < 2) {
        return {
            valid: false,
            message: 'Domain email tidak valid (TLD minimal 2 karakter, contoh: .com, .id)'
        };
    }
    
    // Common domain check
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 
                          'student.telkomuniversity.ac.id', 'telkomuniversity.ac.id'];
    const knownProviders = ['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'telkomuniversity'];
    
    // Check if domain contains known provider but wrong format
    const domainLower = domain.toLowerCase();
    const hasKnownProvider = knownProviders.some(provider => domainLower.includes(provider));
    
    if (hasKnownProvider && !commonDomains.some(common => domainLower === common)) {
        return {
            valid: false,
            message: 'Domain email salah ketik? Periksa kembali (contoh: gmail.com, bukan gmaidsd.com)'
        };
    }
    
    // Check basic email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return {
            valid: false,
            message: 'Format email tidak valid (hanya huruf, angka, titik, underscore, dan dash)'
        };
    }
    
    return { valid: true, message: '' };
}

// Validate phone number (Indonesian format)
function validatePhone(phone) {
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Check if starts with valid prefix
    if (!cleanPhone.match(/^(\+62|62|0)/)) {
        return {
            valid: false,
            message: 'Nomor HP harus diawali dengan 0, 62, atau +62'
        };
    }
    
    // Check length (after prefix)
    const phoneWithoutPrefix = cleanPhone.replace(/^(\+62|62|0)/, '');
    if (phoneWithoutPrefix.length < 9) {
        return {
            valid: false,
            message: 'Nomor HP terlalu pendek (minimal 10-13 digit total)'
        };
    }
    if (phoneWithoutPrefix.length > 12) {
        return {
            valid: false,
            message: 'Nomor HP terlalu panjang (maksimal 10-13 digit total)'
        };
    }
    
    // Check if contains only numbers
    if (!/^(\+62|62|0)[0-9]{9,12}$/.test(cleanPhone)) {
        return {
            valid: false,
            message: 'Nomor HP hanya boleh berisi angka'
        };
    }
    
    return { valid: true, message: '' };
}

// Validate password strength
function validatePassword(password) {
    // Check minimum length
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password minimal 8 karakter (saat ini: ' + password.length + ' karakter)'
        };
    }
    
    // Check for letter
    if (!/[a-zA-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Password harus mengandung minimal 1 huruf (A-Z atau a-z)'
        };
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            message: 'Password harus mengandung minimal 1 angka (0-9)'
        };
    }
    
    return {
        valid: true,
        message: 'Password valid'
    };
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
        if (!namaLengkap) {
            showError('Nama lengkap harus diisi!', 'namaLengkap');
            return;
        }
        
        const nameValidation = validateName(namaLengkap);
        if (!nameValidation.valid) {
            showError(nameValidation.message, 'namaLengkap');
            return;
        }
        
        if (!email) {
            showError('Email harus diisi!', 'email');
            return;
        }
        
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            showError(emailValidation.message, 'email');
            return;
        }
        
        if (!noHp) {
            showError('Nomor HP harus diisi!', 'noHp');
            return;
        }
        
        const phoneValidation = validatePhone(noHp);
        if (!phoneValidation.valid) {
            showError(phoneValidation.message, 'noHp');
            return;
        }
        
        if (!password) {
            showError('Password harus diisi!', 'password');
            return;
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            showError(passwordValidation.message, 'password');
            return;
        }
        
        if (!confirmPassword) {
            showError('Konfirmasi password harus diisi!', 'confirmPassword');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Password dan Konfirmasi Password tidak cocok!', 'confirmPassword');
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