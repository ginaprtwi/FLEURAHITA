/**
 * ulasan.js — Route /api/ulasan
 *
 * Endpoints:
 *   GET  /api/ulasan/saya/:userId          — ulasan milik user (untuk halaman pembeli)
 *   GET  /api/ulasan/produk/:idProduk      — semua ulasan produk tertentu
 *   POST /api/ulasan                       — tulis ulasan baru
 *   PUT  /api/ulasan/:idUlasan             — edit ulasan milik sendiri
 *   DELETE /api/ulasan/:idUlasan           — hapus ulasan milik sendiri
 */

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/ulasan/produk-bisa-diulas/:userId
// Produk yang sudah pernah dipesan user ini
// dan BELUM punya ulasan dari user ini.
// Dipakai untuk dropdown pilih produk di modal.
// ─────────────────────────────────────────────
router.get('/produk-bisa-diulas/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT DISTINCT
                pr.id_produk   AS id_Produk,
                pr.Nama_Produk,
                pr.Foto_Produk
            FROM detail_pesanan dp
            JOIN pesanan p  ON p.id_Pesanan  = dp.id_Pesanan
            JOIN produk  pr ON pr.id_produk  = dp.id_Produk
            WHERE p.id_User = ?
              AND pr.id_produk NOT IN (
                  SELECT id_Produk FROM ulasan_chat WHERE id_User = ?
              )
            ORDER BY pr.Nama_Produk ASC
        `, [userId, userId]);
        res.json(rows);
    } catch (err) {
        console.error('GET /api/ulasan/produk-bisa-diulas error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/ulasan/saya/:userId
// Semua ulasan yang ditulis oleh user ini,
// beserta nama produk dan foto produknya.
// ─────────────────────────────────────────────
router.get('/saya/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT
                u.id_Ulasan,
                u.id_Produk,
                p.Nama_Produk,
                p.Foto_Produk,
                u.Rating,
                u.Komentar,
                DATE_FORMAT(u.Tanggal_Ulasan, '%Y-%m-%d %H:%i') AS tanggal_fmt
            FROM ulasan_chat u
            JOIN produk p ON p.id_produk = u.id_Produk
            WHERE u.id_User = ?
            ORDER BY u.Tanggal_Ulasan DESC
        `, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('GET /api/ulasan/saya error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/ulasan/produk/:idProduk
// Semua ulasan untuk satu produk.
// ─────────────────────────────────────────────
router.get('/produk/:idProduk', async (req, res) => {
    try {
        const { idProduk } = req.params;
        const [rows] = await pool.query(`
            SELECT
                u.id_Ulasan,
                u.id_User,
                pg.Nama        AS nama_user,
                pg.Foto_Profil AS foto_user,
                u.Rating,
                u.Komentar,
                DATE_FORMAT(u.Tanggal_Ulasan, '%Y-%m-%d %H:%i') AS tanggal_fmt
            FROM ulasan_chat u
            JOIN pengguna pg ON pg.id_User = u.id_User
            WHERE u.id_Produk = ?
            ORDER BY u.Tanggal_Ulasan DESC
        `, [idProduk]);
        res.json(rows);
    } catch (err) {
        console.error('GET /api/ulasan/produk error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// POST /api/ulasan
// Tulis ulasan baru.
// Body: { id_User, id_Produk, rating, komentar }
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { id_User, id_Produk, rating, komentar } = req.body;

        if (!id_User || !id_Produk || !rating) {
            return res.status(400).json({ error: 'id_User, id_Produk, dan rating wajib diisi.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating harus antara 1 dan 5.' });
        }

        // Cek apakah user sudah pernah review produk ini
        const [existing] = await pool.query(
            'SELECT id_Ulasan FROM ulasan_chat WHERE id_User = ? AND id_Produk = ?',
            [id_User, id_Produk]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Kamu sudah mengulas produk ini. Gunakan edit untuk memperbarui.' });
        }

        const [result] = await pool.query(`
            INSERT INTO ulasan_chat (id_Produk, id_User, Rating, Komentar, Tanggal_Ulasan)
            VALUES (?, ?, ?, ?, NOW())
        `, [id_Produk, id_User, rating, komentar || null]);

        // Perbarui rating rata-rata produk
        await updateRatingProduk(id_Produk);

        const [newRow] = await pool.query(`
            SELECT
                u.id_Ulasan, u.id_Produk, u.Rating, u.Komentar,
                DATE_FORMAT(u.Tanggal_Ulasan, '%Y-%m-%d %H:%i') AS tanggal_fmt,
                p.Nama_Produk, p.Foto_Produk
            FROM ulasan_chat u
            JOIN produk p ON p.id_produk = u.id_Produk
            WHERE u.id_Ulasan = ?
        `, [result.insertId]);

        res.status(201).json(newRow[0]);
    } catch (err) {
        console.error('POST /api/ulasan error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// PUT /api/ulasan/:idUlasan
// Edit ulasan sendiri.
// Body: { id_User, rating, komentar }
// ─────────────────────────────────────────────
router.put('/:idUlasan', async (req, res) => {
    try {
        const { idUlasan } = req.params;
        const { id_User, rating, komentar } = req.body;

        if (!id_User || !rating) {
            return res.status(400).json({ error: 'id_User dan rating wajib diisi.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating harus antara 1 dan 5.' });
        }

        // Pastikan ulasan milik user ini
        const [check] = await pool.query(
            'SELECT id_Produk FROM ulasan_chat WHERE id_Ulasan = ? AND id_User = ?',
            [idUlasan, id_User]
        );
        if (check.length === 0) {
            return res.status(403).json({ error: 'Ulasan tidak ditemukan atau bukan milikmu.' });
        }

        await pool.query(`
            UPDATE ulasan_chat SET Rating = ?, Komentar = ?, Tanggal_Ulasan = NOW()
            WHERE id_Ulasan = ? AND id_User = ?
        `, [rating, komentar || null, idUlasan, id_User]);

        await updateRatingProduk(check[0].id_Produk);

        const [updated] = await pool.query(`
            SELECT
                u.id_Ulasan, u.id_Produk, u.Rating, u.Komentar,
                DATE_FORMAT(u.Tanggal_Ulasan, '%Y-%m-%d %H:%i') AS tanggal_fmt,
                p.Nama_Produk, p.Foto_Produk
            FROM ulasan_chat u
            JOIN produk p ON p.id_produk = u.id_Produk
            WHERE u.id_Ulasan = ?
        `, [idUlasan]);

        res.json(updated[0]);
    } catch (err) {
        console.error('PUT /api/ulasan error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// DELETE /api/ulasan/:idUlasan
// Hapus ulasan sendiri.
// Body: { id_User }
// ─────────────────────────────────────────────
router.delete('/:idUlasan', async (req, res) => {
    try {
        const { idUlasan } = req.params;
        const { id_User } = req.body;

        const [check] = await pool.query(
            'SELECT id_Produk FROM ulasan_chat WHERE id_Ulasan = ? AND id_User = ?',
            [idUlasan, id_User]
        );
        if (check.length === 0) {
            return res.status(403).json({ error: 'Ulasan tidak ditemukan atau bukan milikmu.' });
        }

        await pool.query('DELETE FROM ulasan_chat WHERE id_Ulasan = ?', [idUlasan]);
        await updateRatingProduk(check[0].id_Produk);

        res.json({ success: true, message: 'Ulasan berhasil dihapus.' });
    } catch (err) {
        console.error('DELETE /api/ulasan error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// Helper: recalculate avg rating for a product
// ─────────────────────────────────────────────
async function updateRatingProduk(idProduk) {
    await pool.query(`
        UPDATE produk
        SET Rating = (
            SELECT IFNULL(ROUND(AVG(Rating), 2), 0)
            FROM ulasan_chat
            WHERE id_Produk = ?
        )
        WHERE id_produk = ?
    `, [idProduk, idProduk]);
}

module.exports = router;
