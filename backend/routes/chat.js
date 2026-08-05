/**
 * chat.js — Route /api/chat
 * Endpoints:
 *   GET  /api/chat/kontak          — daftar pembeli yang punya chat (untuk panel kiri)
 *   GET  /api/chat/pesan/:userId   — semua pesan dengan pembeli tertentu
 *   POST /api/chat/pesan           — kirim pesan baru (penjual -> pembeli)
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/chat/kontak
// Ambil daftar pembeli yang punya riwayat chat,
// beserta pesan terakhir dan waktunya.
// ─────────────────────────────────────────────
router.get('/kontak', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.id_User,
                p.Nama,
                p.Foto_Profil,
                cp.Isi_Pesan   AS pesan_terakhir,
                cp.Waktu        AS waktu_terakhir,
                cp.Pengirim     AS pengirim_terakhir
            FROM pengguna p
            INNER JOIN (
                SELECT
                    id_User,
                    MAX(id_Chat) AS max_id
                FROM chat_pesan
                GROUP BY id_User
            ) latest ON latest.id_User = p.id_User
            INNER JOIN chat_pesan cp
                ON cp.id_Chat = latest.max_id
            ORDER BY cp.Waktu DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error GET /api/chat/kontak:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/chat/pesan/:userId
// Semua pesan antara penjual dan satu pembeli,
// diurutkan dari terlama ke terbaru.
// ─────────────────────────────────────────────
router.get('/pesan/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT
                id_Chat,
                id_User,
                Pengirim,
                Isi_Pesan,
                DATE_FORMAT(Waktu, '%H.%i') AS waktu_fmt,
                Waktu
            FROM chat_pesan
            WHERE id_User = ?
            ORDER BY Waktu ASC
        `, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('Error GET /api/chat/pesan:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// POST /api/chat/pesan
// Kirim pesan baru.
// Body: { id_User, pengirim: 'penjual'|'pembeli', isi_pesan }
// ─────────────────────────────────────────────
router.post('/pesan', async (req, res) => {
    try {
        const { id_User, pengirim, isi_pesan } = req.body;

        if (!id_User || !pengirim || !isi_pesan || !isi_pesan.trim()) {
            return res.status(400).json({ error: 'id_User, pengirim, dan isi_pesan wajib diisi.' });
        }

        const [result] = await pool.query(`
            INSERT INTO chat_pesan (id_User, Pengirim, Isi_Pesan, Waktu)
            VALUES (?, ?, ?, NOW())
        `, [id_User, pengirim, isi_pesan.trim()]);

        // Kembalikan baris yang baru dibuat
        const [newRow] = await pool.query(`
            SELECT
                id_Chat,
                id_User,
                Pengirim,
                Isi_Pesan,
                DATE_FORMAT(Waktu, '%H.%i') AS waktu_fmt,
                Waktu
            FROM chat_pesan WHERE id_Chat = ?
        `, [result.insertId]);

        res.status(201).json(newRow[0]);
    } catch (err) {
        console.error('Error POST /api/chat/pesan:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
