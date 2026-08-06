const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET dashboard stats
router.get('/dashboard/stats', async (req, res) => {
    try {
        // Get counts by status
        const statsQuery = `
            SELECT 
                COUNT(CASE WHEN Status_Pesanan = 'Menunggu Pembayaran' THEN 1 END) AS pending,
                COUNT(CASE WHEN Status_Pesanan = 'Diproses' THEN 1 END) AS processing,
                COUNT(CASE WHEN Status_Pesanan = 'Selesai' THEN 1 END) AS completed,
                COUNT(*) AS total
            FROM pesanan
        `;
        
        const [stats] = await pool.query(statsQuery);
        
        res.json({
            success: true,
            data: stats[0]
        });
    } catch (err) {
        console.error("Database error (dashboard stats):", err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

// GET recent orders for dashboard
router.get('/dashboard/recent', async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        
        const query = `
            SELECT 
                p.id_Pesanan AS id,
                u.Nama AS buyer_name,
                u.Foto_Profil AS avatar,
                GROUP_CONCAT(DISTINCT pr.Nama_Produk SEPARATOR ', ') AS product_names,
                p.Total_Bayar AS total,
                p.Status_Pesanan AS status,
                p.Tanggal_Pesan AS order_date
            FROM pesanan p
            JOIN pengguna u ON p.id_User = u.id_User
            INNER JOIN detail_pesanan dp ON p.id_Pesanan = dp.id_Pesanan
            INNER JOIN produk pr ON dp.id_Produk = pr.id_produk
            GROUP BY p.id_Pesanan
            HAVING product_names IS NOT NULL
            ORDER BY p.Tanggal_Pesan DESC
            LIMIT ?
        `;
        
        const [rows] = await pool.query(query, [parseInt(limit)]);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Database error (recent orders):", err);
        res.json({ 
            success: false,
            error: err.message 
        });
    }
});

// GET recent chats for dashboard
router.get('/dashboard/chats', async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        
        const query = `
            SELECT 
                uc.id_Ulasan AS id,
                u.Nama AS customer_name,
                u.Foto_Profil AS avatar,
                uc.Riwayat_Chat AS message,
                uc.Tanggal_Ulasan AS chat_date,
                pr.Nama_Produk AS product_name
            FROM ulasan_chat uc
            JOIN pengguna u ON uc.id_User = u.id_User
            LEFT JOIN produk pr ON uc.id_Produk = pr.id_Produk
            WHERE uc.Riwayat_Chat IS NOT NULL AND uc.Riwayat_Chat != ''
            ORDER BY uc.Tanggal_Ulasan DESC
            LIMIT ?
        `;
        
        const [rows] = await pool.query(query, [parseInt(limit)]);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Database error (recent chats):", err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

router.get('/', async (req, res) => {
    try {
        await pool.query("SET SESSION group_concat_max_len = 10000;");

        const { search, status } = req.query;
        let whereConditions = [];
        let queryParams = [];

        if (search) {
            whereConditions.push("(u.Nama LIKE ? OR pr.Nama_Produk LIKE ? OR p.Kode_Orderan LIKE ?)");
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (status && status !== 'Semua Status') {
            whereConditions.push("p.Status_Pesanan = ?");
            queryParams.push(status);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const query = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS kode_orderan,
                u.Nama AS customer_name,
                p.Total_Bayar AS total,
                p.Status_Pesanan AS status,
                p.Metode_Pembayaran AS payment_status,
                IFNULL(GROUP_CONCAT(pr.Nama_Produk SEPARATOR ', '), '-') AS product_name,
                IFNULL(MIN(pr.Foto_Produk), 'column-img2.png') AS product_image
            FROM pesanan p
            JOIN pengguna u ON p.id_User = u.id_User
            LEFT JOIN detail_pesanan dp ON p.id_Pesanan = dp.id_Pesanan
            LEFT JOIN produk pr ON dp.id_Produk = pr.id_produk
            ${whereClause}
            GROUP BY p.id_Pesanan
            ORDER BY p.Tanggal_Pesan DESC
        `;

        const [rows] = await pool.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error("Database error (pesanan-masuk):", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE pesanan
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM pesanan WHERE id_Pesanan = ?", [id]);
        res.json({ message: "Pesanan berhasil dihapus" });
    } catch (err) {
        console.error("Database delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE status pesanan / payment status
router.patch('/update-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;
        
        let fields = [];
        let params = [];

        if (status) {
            fields.push("Status_Pesanan = ?");
            params.push(status);
        }
        if (payment_status) {
            fields.push("Metode_Pembayaran = ?");
            params.push(payment_status);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Tidak ada data status yang diupdate" });
        }

        params.push(id);
        const query = `UPDATE pesanan SET ${fields.join(', ')} WHERE id_Pesanan = ?`;
        await pool.query(query, params);
        res.json({ message: "Status pesanan berhasil diupdate" });
    } catch (err) {
        console.error("Database update status error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET detail pesanan berdasarkan id
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Query info header pesanan, pemesan, & alamat
        const orderQuery = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS kode_orderan,
                DATE_FORMAT(p.Tanggal_Pesan, '%d-%m-%Y %H:%i') AS tanggal_pesan,
                p.Metode_Pengiriman AS metode_pengiriman,
                p.Metode_Pembayaran AS metode_pembayaran,
                p.Status_Pesanan AS status_pesanan,
                p.Subtotal AS subtotal,
                p.Total_Bayar AS total_bayar,
                u.Nama AS customer_name,
                u.Email AS customer_email,
                u.No_HP AS customer_phone,
                a.Nama_Penerima AS nama_penerima,
                a.No_HP AS no_hp_penerima,
                a.Alamat_Lengkap AS alamat_lengkap,
                a.Kecamatan AS kecamatan,
                a.Kelurahan AS kelurahan,
                a.Kotakab AS kotakab,
                a.Kode_Pos AS kode_pos
            FROM pesanan p
            JOIN pengguna u ON p.id_User = u.id_User
            LEFT JOIN alamat a ON p.id_Alamat = a.id_Alamat
            WHERE p.id_Pesanan = ?
        `;

        const [orderRows] = await pool.query(orderQuery, [id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ error: "Pesanan tidak ditemukan" });
        }

        const orderInfo = orderRows[0];

        // Query rincian item pesanan
        const itemsQuery = `
            SELECT 
                dp.id_Detail AS id_detail,
                dp.id_Produk AS id_produk,
                pr.Nama_Produk AS nama_produk,
                IFNULL(pr.Foto_Produk, 'column-img2.png') AS foto_produk,
                dp.Jumlah AS jumlah,
                dp.Harga_Satuan AS harga_satuan,
                dp.Catatan_Pesanan AS catatan,
                (dp.Jumlah * dp.Harga_Satuan) AS total_item_price
            FROM detail_pesanan dp
            JOIN produk pr ON dp.id_Produk = pr.id_produk
            WHERE dp.id_Pesanan = ?
        `;

        const [itemRows] = await pool.query(itemsQuery, [id]);
        orderInfo.items = itemRows;

        res.json(orderInfo);
    } catch (err) {
        console.error("Database error (pesanan detail):", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
