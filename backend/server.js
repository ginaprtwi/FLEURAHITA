const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Ganti dengan user MySQL Kalian
    password: '',           // Ganti dengan password MySQL Kalian
    database: 'fleurahita'  // Ganti dengan nama database Kalian
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// ==================== ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { namaLengkap, email, noHp, password, role } = req.body;

        if (!namaLengkap || !email || !noHp || !password) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        const checkEmailQuery = 'SELECT * FROM pengguna WHERE Email = ?';
        db.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan server'
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO pengguna (Nama, Email, No_HP, Password, Foto_Profil) 
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [namaLengkap, email, noHp, hashedPassword, '../assets/auto-layout-horizontal/auto-layout-horizontal-3d-avatars.png'],
                (err, result) => {
                    if (err) {
                        console.error('Insert error:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Gagal mendaftarkan user'
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Registrasi berhasil',
                        data: {
                            userId: result.insertId,
                            email: email
                        }
                    });
                }
            );
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Login User
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password harus diisi'
            });
        }

        // Check user exists
        const query = 'SELECT * FROM pengguna WHERE Email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan server'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            const user = results[0];

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.Password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            // Login successful
            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                data: {
                    userId: user.id_User,
                    namaLengkap: user.Nama,
                    email: user.Email,
                    fotoProfil: user.Foto_Profil
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

// Forgot Password - Verifikasi email + No HP
app.post('/api/auth/forgot-password', (req, res) => {
    try {
        const { email, noHp } = req.body;

        if (!email || !noHp) {
            return res.status(400).json({
                success: false,
                message: 'Email dan No HP harus diisi'
            });
        }

        const query = 'SELECT id_User, Nama, Email FROM pengguna WHERE Email = ? AND No_HP = ?';
        db.query(query, [email, noHp], (err, results) => {
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
                    message: 'Data tidak ditemukan. Pastikan email dan No HP sesuai dengan yang terdaftar.'
                });
            }

            // Verifikasi berhasil, kirim userId untuk reset
            res.status(200).json({
                success: true,
                message: 'Verifikasi berhasil',
                data: {
                    userId: results[0].id_User,
                    nama: results[0].Nama
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

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = 'UPDATE pengguna SET Password = ? WHERE id_User = ?';
        db.query(query, [hashedPassword, userId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mereset password'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Password berhasil diubah'
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

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});