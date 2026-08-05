// Forgot Password Logic - FLEURAHITA

const API_BASE_URL = 'http://localhost:3001/api';

const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const submitBtn = forgotPasswordForm.querySelector('.submit-btn');

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

// Show error message
function showError(message) {
    alert(message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// Verify user via email and phone
async function verifyUser(email, noHp) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, noHp })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Verifikasi gagal');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Verification error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Handle form submission
forgotPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memverifikasi...';
    
    try {
        const email = document.getElementById('email').value.trim();
        const noHp = document.getElementById('noHp').value.trim();
        
        // Validation
        if (!email || !noHp) {
            showError('Email dan No HP harus diisi!');
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
        
        // Verify user
        const result = await verifyUser(email, noHp);
        
        if (result.success) {
            showSuccess('Verifikasi berhasil! Silakan masukkan password baru.');
            
            // Simpan data user sementara di sessionStorage
            sessionStorage.setItem('resetUser', JSON.stringify(result.data));
            
            // Redirect ke halaman reset password
            setTimeout(() => {
                window.location.href = '../Components/reset-password.html';
            }, 1000);
        } else {
            showError(result.error || 'Data tidak ditemukan. Pastikan email dan No HP sesuai dengan yang terdaftar.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verifikasi';
    }
});