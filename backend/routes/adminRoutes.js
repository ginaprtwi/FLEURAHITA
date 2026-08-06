const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/avatars');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB max
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'));
        }
    }
});

// Router untuk admin (penjual)
module.exports = (db) => {
    // Get Admin Profile - khusus untuk admin@fleurahita.com
    router.get('/profile', (req, res) => {
        try {
            const adminEmail = 'admin@fleurahita.com';

            const query = 'SELECT id_User, Nama, Email, No_HP, Foto_Profil FROM pengguna WHERE Email = ?';
            db.query(query, [adminEmail], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Terjadi kesalahan server'
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Admin tidak ditemukan'
                    });
                }

                const admin = results[0];
                res.status(200).json({
                    success: true,
                    data: {
                        userId: admin.id_User,
                        nama: admin.Nama,
                        email: admin.Email,
                        noHp: admin.No_HP,
                        fotoProfil: admin.Foto_Profil
                    }
                });
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            });
        }
    });

    // Upload Avatar
    router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada file yang diupload'
                });
            }

            // Return the file path (relative to uploads directory)
            const filePath = `/uploads/avatars/${req.file.filename}`;
            
            res.status(200).json({
                success: true,
                message: 'File berhasil diupload',
                data: {
                    filePath: filePath
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Gagal mengupload file'
            });
        }
    });

    // Update Admin Profile
    router.put('/profile', (req, res) => {
        try {
            const { nama, noHp, fotoProfil } = req.body;
            const adminEmail = 'admin@fleurahita.com';

            // Build update query dynamically based on provided fields
            let updateFields = [];
            let updateValues = [];

            if (nama) {
                updateFields.push('Nama = ?');
                updateValues.push(nama);
            }
            if (noHp) {
                updateFields.push('No_HP = ?');
                updateValues.push(noHp);
            }
            if (fotoProfil) {
                updateFields.push('Foto_Profil = ?');
                updateValues.push(fotoProfil);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada data yang akan diupdate'
                });
            }

            // Add email to values array for WHERE clause
            updateValues.push(adminEmail);

            const query = `UPDATE pengguna SET ${updateFields.join(', ')} WHERE Email = ?`;
            
            db.query(query, updateValues, (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Gagal mengupdate profil'
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Admin tidak ditemukan'
                    });
                }

                // Get updated admin data
                const selectQuery = 'SELECT id_User, Nama, Email, No_HP, Foto_Profil FROM pengguna WHERE Email = ?';
                db.query(selectQuery, [adminEmail], (err, results) => {
                    if (err) {
                        return res.status(200).json({
                            success: true,
                            message: 'Profil berhasil diupdate'
                        });
                    }

                    const admin = results[0];
                    res.status(200).json({
                        success: true,
                        message: 'Profil berhasil diupdate',
                        data: {
                            userId: admin.id_User,
                            nama: admin.Nama,
                            email: admin.Email,
                            noHp: admin.No_HP,
                            fotoProfil: admin.Foto_Profil
                        }
                    });
                });
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            });
        }
    });

    return router;
};