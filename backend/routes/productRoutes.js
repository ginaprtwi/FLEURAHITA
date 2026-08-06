const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products (untuk halaman produk & beranda)
router.get('/', async (req, res) => {
    try {
        const { kategori, search, sortBy = 'Nama_Produk', order = 'ASC', limit, featured } = req.query;
        
        let query = 'SELECT * FROM produk WHERE 1=1';
        const params = [];

        // Filter by category
        if (kategori) {
            query += ' AND Kategori = ?';
            params.push(kategori);
        }

        // Search by product name
        if (search) {
            query += ' AND Nama_Produk LIKE ?';
            params.push(`%${search}%`);
        }

        // Featured products (rating tinggi & stok > 0)
        if (featured === 'true') {
            query += ' AND Stok > 0 AND Rating >= 4.0';
        }

        // Sorting
        const allowedSort = ['Nama_Produk', 'Harga', 'Rating', 'Stok'];
        const allowedOrder = ['ASC', 'DESC'];
        
        if (allowedSort.includes(sortBy) && allowedOrder.includes(order.toUpperCase())) {
            query += ` ORDER BY ${sortBy} ${order}`;
        }

        // Limit results
        if (limit && !isNaN(limit)) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [products] = await db.query(query, params);

        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
            error: error.message
        });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [product] = await db.query(
            'SELECT * FROM produk WHERE id_produk = ?',
            [id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        // Get reviews for this product
        const [reviews] = await db.query(`
            SELECT u.*, p.Nama as nama_user 
            FROM ulasan_chat u 
            JOIN pengguna p ON u.id_User = p.id_User 
            WHERE u.id_Produk = ? 
            ORDER BY u.Tanggal_Ulasan DESC
        `, [id]);

        res.json({
            success: true,
            data: {
                ...product[0],
                reviews: reviews
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
            error: error.message
        });
    }
});

// GET all categories
router.get('/categories/list', async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT DISTINCT Kategori FROM produk WHERE Kategori IS NOT NULL ORDER BY Kategori'
        );

        res.json({
            success: true,
            data: categories.map(c => c.Kategori)
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error.message
        });
    }
});

module.exports = router;