const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const pengirimanRoutes = require('./routes/pengiriman');
const pesananMasukRoutes = require('./routes/pesanan-masuk');
const keuanganRoutes = require('./routes/keuangan');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==================== STATIC FILES ====================

app.use(express.static(path.join(__dirname, '../Penjual/Pages')));

app.use('/css', express.static(path.join(__dirname, '../Penjual/css')));
app.use('/js', express.static(path.join(__dirname, '../Penjual/js')));
app.use('/assets', express.static(path.join(__dirname, '../Penjual/assets')));
app.use('/components', express.static(path.join(__dirname, '../Penjual/components')));


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
Akses halaman: http://localhost:${PORT}/pengiriman.html
=================================
`);
});