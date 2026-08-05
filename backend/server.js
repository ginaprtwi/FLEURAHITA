const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const pengirimanRoutes = require('./routes/pengiriman');
const pesananMasukRoutes = require('./routes/pesanan-masuk');
const keuanganRoutes = require('./routes/keuangan');
const authRoutes = require('./routes/authRoutes');
const pembeliRoutes = require('./routes/pembeli');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==================== STATIC FILES ====================

// Penjual Static Files
app.use(express.static(path.join(__dirname, '../Penjual/Pages')));
app.use('/css', express.static(path.join(__dirname, '../Penjual/css')));
app.use('/js', express.static(path.join(__dirname, '../Penjual/js')));
app.use('/assets', express.static(path.join(__dirname, '../Penjual/assets')));
app.use('/components', express.static(path.join(__dirname, '../Penjual/components')));

// Pembeli Static Files & Page Routes
app.use('/Pembeli', express.static(path.join(__dirname, '../Pembeli')));
app.use('/pembeli/css', express.static(path.join(__dirname, '../Pembeli/css')));
app.use('/pembeli/js', express.static(path.join(__dirname, '../Pembeli/js')));
app.use('/pembeli/assets', express.static(path.join(__dirname, '../Pembeli/assets')));
app.use('/pembeli/components', express.static(path.join(__dirname, '../Pembeli/components')));
app.use('/pembeli', express.static(path.join(__dirname, '../Pembeli/Pages')));

// Clean Web Routes untuk Pembeli
app.get('/pembeli/detail-akun', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pembeli/Pages/detail_akun.html'));
});
app.get('/pembeli/alamat-profil', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pembeli/Pages/alamat_profil.html'));
});
app.get('/pembeli/histori-pesanan', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pembeli/Pages/histori_pesanan.html'));
});


// ==================== DATABASE ====================

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting MySQL:', err);
        return;
    }

    console.log('Connected to MySQL database');
});


// ==================== API ROUTES ====================

app.use('/api/auth', authRoutes(db));

app.use('/api/pengiriman', pengirimanRoutes);
app.use('/api/pesanan-masuk', pesananMasukRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/pembeli', pembeliRoutes);


// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is running!'
    });
});


// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`
=================================
Server jalan di http://localhost:${PORT}
Akses Pembeli:
- Detail Akun:     http://localhost:${PORT}/pembeli/detail_akun.html
- Alamat Saya:     http://localhost:${PORT}/pembeli/alamat_profil.html
- Histori Pesanan: http://localhost:${PORT}/pembeli/histori_pesanan.html
=================================
`);
});