const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        // Opsional: Naikkan limit panjang teks jika suatu saat nama produknya sangat banyak/panjang
        await pool.query("SET SESSION group_concat_max_len = 10000;");

        const query = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS no_pesanan,
                u.Nama AS nama_pembeli,
                
                /* IFNULL: Jika produk kosong, otomatis diganti jadi strip "-" agar tidak error */
                IFNULL(GROUP_CONCAT(pr.Nama_Produk SEPARATOR ', '), '-') AS produk,
                
                /* Gabungan teks alamat lengkap */
                CONCAT(
                    a.Alamat_Lengkap, ', ', 
                    'Kel. ', a.Kelurahan, ', ', 
                    'Kec. ', a.Kecamatan, ', ', 
                    a.Kotakab, ' ', 
                    a.Kode_Pos
                ) AS alamat,
                
                p.Status_Pesanan AS status
            
            FROM pesanan p
            JOIN pengguna u ON p.id_User = u.id_User
            JOIN alamat a ON p.id_Alamat = a.id_Alamat
            
            /* MENGGUNAKAN LEFT JOIN: Memaksa semua pesanan tetap tampil walau produknya kosong */
            LEFT JOIN detail_pesanan dp ON p.id_Pesanan = dp.id_Pesanan
            LEFT JOIN produk pr ON dp.id_Produk = pr.id_produk
            
            /* HANYA MENGAMBIL STATUS DIKIRIM & DIPROSES */
            WHERE p.Status_Pesanan IN ('Dikirim', 'Diproses')
            
            GROUP BY p.id_Pesanan
            ORDER BY p.Tanggal_Pesan DESC
        `;

        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;