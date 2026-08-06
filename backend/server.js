const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const pengirimanRoutes = require('./routes/pengiriman');
const pesananMasukRoutes = require('./routes/pesanan-masuk');
const keuanganRoutes = require('./routes/keuangan');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== STATIC FILES ====================
app.use(express.static(path.join(__dirname, '../Penjual/Pages')));
app.use(express.static(path.join(__dirname, '../Auth')));
app.use(express.static(path.join(__dirname, '../Pembeli/Pages')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/css', express.static(path.join(__dirname, '../Pembeli/css')));
app.use('/js', express.static(path.join(__dirname, '../Pembeli/js')));
app.use('/assets', express.static(path.join(__dirname, '../Pembeli/assets')));
app.use('/components', express.static(path.join(__dirname, '../Pembeli/components')));

app.use('/css', express.static(path.join(__dirname, '../Penjual/css')));
app.use('/js', express.static(path.join(__dirname, '../Penjual/js')));
app.use('/assets', express.static(path.join(__dirname, '../Penjual/assets')));
app.use('/components', express.static(path.join(__dirname, '../Penjual/components')));

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/Auth/Login/log-in-user.html');
});

// ==================== DATABASE ====================
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.DB_PASS || ''),
    database: process.env.DB_NAME || 'Fleurahita',
    port: process.env.DB_PORT || 3306
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('⚠️ Warning: MySQL database connection failed:', err.message);
        console.error('Pastikan MySQL service/XAMPP sudah berjalan dan database "Fleurahita" telah dibuat.');
        return;
    }
    console.log('✅ Connected to MySQL database:', dbConfig.database);
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes(db));
app.use('/api/admin', adminRoutes(db));
app.use('/api/pengiriman', pengirimanRoutes);
app.use('/api/pesanan-masuk', pesananMasukRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is running!',
        status: 'OK'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
=====================================================
🚀 Server FLEURAHITA jalan di http://localhost:${PORT}
=====================================================
📌 Login Page:     http://localhost:${PORT}/Auth/Login/log-in-user.html
📌 Register Page:  http://localhost:${PORT}/Auth/Register/register.html
📌 Dashboard Seller: http://localhost:${PORT}/Penjual/Pages/beranda-fix.html
📌 Dashboard Buyer:  http://localhost:${PORT}/Pembeli/Pages/beranda.html
=====================================================
`);
});