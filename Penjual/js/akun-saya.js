// Akun Saya - FLEURAHITA Admin
const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_EMAIL = 'admin@fleurahita.com';

let selectedAvatarFile = null;

// Load admin data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAdminProfile();
    setupEventListeners();
});

function setupEventListeners() {
    // Avatar upload
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', handleAvatarChange);

    // Save button
    const simpanBtn = document.getElementById('simpanBtn');
    simpanBtn.addEventListener('click', handleSaveProfile);
}

async function loadAdminProfile() {
    try {
        // Check if user is admin
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        
        if (!userStr) {
            showError('Anda belum login. Redirecting...');
            setTimeout(() => {
                window.location.href = '../../Auth/Login/log-in-user.html';
            }, 2000);
            return;
        }

        const user = JSON.parse(userStr);
        
        // Verify admin email
        if (user.email !== ADMIN_EMAIL) {
            showError('Akses ditolak. Halaman ini hanya untuk admin.');
            setTimeout(() => {
                window.location.href = '../../Pembeli/Pages/beranda.html';
            }, 2000);
            return;
        }

        // Fetch admin data from backend
        const response = await fetch(`${API_BASE_URL}/admin/profile`);
        const data = await response.json();

        if (data.success) {
            displayAdminProfile(data.data);
        } else {
            showError(data.message || 'Gagal memuat data profil');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Tidak dapat terhubung ke server');
    }
}

function displayAdminProfile(adminData) {
    // Update form fields
    document.getElementById('namaPenjual').value = adminData.nama || '';
    document.getElementById('nomorTelepon').value = adminData.noHp || '';
    document.getElementById('email').value = adminData.email || '';

    // Update avatar preview with error handling
    if (adminData.fotoProfil && adminData.fotoProfil !== 'default.jpg') {
        // Build full URL for avatar
        const avatarUrl = adminData.fotoProfil.startsWith('http') 
            ? adminData.fotoProfil 
            : `http://localhost:3001${adminData.fotoProfil}`;
        
        loadAvatarWithFallback(avatarUrl, 'avatarPreview', 'avatarIcon', 'avatarText');
        loadAvatarWithFallback(avatarUrl, 'sideAvatarPreview', 'sideAvatarIcon', 'sideAvatarText');
    } else {
        // Show default placeholder
        showDefaultAvatar('avatarPreview', 'avatarIcon', 'avatarText');
        showDefaultAvatar('sideAvatarPreview', 'sideAvatarIcon', 'sideAvatarText');
    }

    // Update side profile card with clean formatting
    const displayName = adminData.nama || 'Admin FLEURAHITA';
    const displayEmail = adminData.email || ADMIN_EMAIL;
    const displayPhone = adminData.noHp || '-';
    
    document.getElementById('sideNama').textContent = displayName;
    document.getElementById('sidePhone').textContent = displayPhone;
    document.getElementById('sideEmail').textContent = displayEmail;
}

function loadAvatarWithFallback(imageUrl, previewId, iconId, textId) {
    const preview = document.getElementById(previewId);
    
    if (previewId === 'avatarPreview') {
        const placeholder = document.getElementById('uploadPlaceholder');
        const img = new Image();
        img.onload = function() {
            preview.src = imageUrl;
            preview.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        };
        img.onerror = function() {
            preview.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        };
        img.src = imageUrl;
    } else if (previewId === 'sideAvatarPreview') {
        const sidePlaceholder = document.getElementById('sidePlaceholder');
        const img = new Image();
        img.onload = function() {
            preview.src = imageUrl;
            preview.style.display = 'block';
            if (sidePlaceholder) sidePlaceholder.style.display = 'none';
        };
        img.onerror = function() {
            preview.style.display = 'none';
            if (sidePlaceholder) sidePlaceholder.style.display = 'flex';
        };
        img.src = imageUrl;
    }
}

function showDefaultAvatar(previewId, iconId, textId) {
    const preview = document.getElementById(previewId);
    
    if (previewId === 'avatarPreview') {
        const placeholder = document.getElementById('uploadPlaceholder');
        preview.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    } else if (previewId === 'sideAvatarPreview') {
        const sidePlaceholder = document.getElementById('sidePlaceholder');
        preview.style.display = 'none';
        if (sidePlaceholder) sidePlaceholder.style.display = 'flex';
    }
}

function updateAvatarDisplay(imageUrl, previewId, iconId, textId) {
    const preview = document.getElementById(previewId);

    if (imageUrl && imageUrl !== 'default.jpg') {
        if (previewId === 'avatarPreview') {
            const placeholder = document.getElementById('uploadPlaceholder');
            preview.src = imageUrl;
            preview.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        } else if (previewId === 'sideAvatarPreview') {
            const sidePlaceholder = document.getElementById('sidePlaceholder');
            preview.src = imageUrl;
            preview.style.display = 'block';
            if (sidePlaceholder) sidePlaceholder.style.display = 'none';
        }
    } else {
        showDefaultAvatar(previewId, iconId, textId);
    }
}

function handleAvatarChange(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('File harus berupa gambar');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showError('Ukuran file maksimal 2MB');
            return;
        }

        selectedAvatarFile = file;

        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            updateAvatarDisplay(e.target.result, 'avatarPreview', 'avatarIcon', 'avatarText');
            updateAvatarDisplay(e.target.result, 'sideAvatarPreview', 'sideAvatarIcon', 'sideAvatarText');
        };
        reader.readAsDataURL(file);
    }
}

async function handleSaveProfile() {
    const simpanBtn = document.getElementById('simpanBtn');
    simpanBtn.disabled = true;
    simpanBtn.textContent = 'Menyimpan...';

    try {
        const nama = document.getElementById('namaPenjual').value.trim();
        const noHp = document.getElementById('nomorTelepon').value.trim();

        // Validation
        if (!nama) {
            showError('Nama harus diisi');
            return;
        }

        if (!noHp) {
            showError('Nomor telepon harus diisi');
            return;
        }

        let fotoProfil = null;

        // Upload avatar first if selected
        if (selectedAvatarFile) {
            const formData = new FormData();
            formData.append('avatar', selectedAvatarFile);

            const uploadResponse = await fetch(`${API_BASE_URL}/admin/upload-avatar`, {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadResponse.json();
            
            if (uploadData.success) {
                fotoProfil = uploadData.data.filePath;
            } else {
                showError(uploadData.message || 'Gagal mengupload foto');
                return;
            }
        }

        // Prepare update data
        const updateData = {
            nama: nama,
            noHp: noHp
        };

        if (fotoProfil) {
            updateData.fotoProfil = fotoProfil;
        }

        // Update profile
        const response = await fetch(`${API_BASE_URL}/admin/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Profil berhasil diupdate!');
            
            // Update stored user data
            const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
            const user = JSON.parse(userStr);
            
            const updatedUser = {
                ...user,
                namaLengkap: data.data.nama,
                noHp: data.data.noHp,
                fotoProfil: data.data.fotoProfil
            };

            // Update storage
            const storage = sessionStorage.getItem('user') ? sessionStorage : localStorage;
            storage.setItem('user', JSON.stringify(updatedUser));

            // Trigger custom event to update navbar
            window.dispatchEvent(new Event('userUpdated'));

            // Reload profile after 1 second
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showError(data.message || 'Gagal mengupdate profil');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        showError('Tidak dapat terhubung ke server');
    } finally {
        simpanBtn.disabled = false;
        simpanBtn.textContent = 'SIMPAN PERUBAHAN';
    }
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
}