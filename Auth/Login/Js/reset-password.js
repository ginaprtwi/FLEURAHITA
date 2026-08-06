// Reset Password Logic - FLEURAHITA

const API_BASE_URL = window.location.origin.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api';

const resetPasswordForm = document.getElementById('resetPasswordForm');
const submitBtn = resetPasswordForm.querySelector('.submit-btn');
const userNameSpan = document.getElementById('userName');

// Get user data from sessionStorage
let resetUser = null;
try {
    resetUser = JSON.parse(sessionStorage.getItem('resetUser'));
} catch (e) {
    console.error('Error parsing resetUser:', e);
}

// Check if user data exists
if (!resetUser || !resetUser.userId) {
    alert('Session expired. Silakan verifikasi ulang.');
    window.location.href = '../Components/forgot-password.html';
} else {
    // Display user name
    userNameSpan.textContent = resetUser.nama || 'User';
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Validate password strength
function validatePassword(password) {
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
    alert(message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// Reset password via API
async function resetPassword(userId, newPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Reset password gagal');
        }

        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error('Reset password error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Handle form submission
resetPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses...';
    
    try {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!newPassword || !confirmPassword) {
            showError('Semua field harus diisi!');
            return;
        }
        
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            showError(passwordValidation.message);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('Password dan Konfirmasi Password tidak cocok!');
            return;
        }
        
        // Reset password
        const result = await resetPassword(resetUser.userId, newPassword);
        
        if (result.success) {
            showSuccess('Password berhasil diubah! Silakan login dengan password baru.');
            
            // Clear sessionStorage
            sessionStorage.removeItem('resetUser');
            
            // Redirect ke login
            setTimeout(() => {
                window.location.href = '../log-in-user.html';
            }, 1500);
        } else {
            showError(result.error || 'Gagal mereset password. Silakan coba lagi.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
});

// Real-time validation feedback
document.getElementById('confirmPassword').addEventListener('input', function() {
    const newPassword = document.getElementById('newPassword').value;
    if (this.value && this.value !== newPassword) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});