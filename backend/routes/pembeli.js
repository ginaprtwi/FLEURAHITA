const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==================== PROFIL / DETAIL AKUN ====================

// GET Profile by User ID (Default user ID = 1 if not specified)
router.get('/profil/:userId?', async (req, res) => {
    try {
        const userId = req.params.userId || 1;
        const [rows] = await pool.query(
            `SELECT id_User AS id, Nama AS namaLengkap, Email AS email, No_HP AS noTelp, Foto_Profil AS fotoProfil FROM pengguna WHERE id_User = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        res.json({
            success: true,
            data: {
                id: rows[0].id,
                namaLengkap: rows[0].namaLengkap,
                namaPengguna: rows[0].email ? rows[0].email.split('@')[0] : '',
                noTelp: rows[0].noTelp,
                email: rows[0].email,
                fotoProfil: rows[0].fotoProfil
            }
        });
    } catch (err) {
        console.error('Database error (get profile):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// UPDATE Profile by User ID
router.put('/profil/:userId?', async (req, res) => {
    try {
        const userId = req.params.userId || 1;
        const { namaLengkap, email, noTelp } = req.body;

        if (!namaLengkap || !email || !noTelp) {
            return res.status(400).json({ success: false, message: 'Nama lengkap, email, dan no HP wajib diisi' });
        }

        // Cek duplikasi email
        const [existing] = await pool.query(
            `SELECT id_User FROM pengguna WHERE Email = ? AND id_User != ?`,
            [email, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: `Email "${email}" sudah dipakai oleh pengguna lain.` });
        }

        const query = `UPDATE pengguna SET Nama = ?, Email = ?, No_HP = ? WHERE id_User = ?`;
        const [result] = await pool.query(query, [namaLengkap, email, noTelp, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        res.json({
            success: true,
            message: 'Data profil berhasil diperbarui',
            data: { id: userId, namaLengkap, email, noTelp }
        });
    } catch (err) {
        console.error('Database error (update profile):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==================== ALAMAT PROFIL ====================

// GET List Alamat User
router.get('/alamat/:userId?', async (req, res) => {
    try {
        const userId = req.params.userId || 1;
        const query = `
            SELECT 
                id_Alamat AS id,
                'Alamat' AS label,
                Nama_Penerima AS nama,
                No_HP AS telp,
                Kelurahan AS kelurahan,
                Kecamatan AS kecamatan,
                Kotakab AS kota,
                '' AS provinsi,
                Kode_Pos AS kodePos,
                Alamat_Lengkap AS detail
            FROM alamat
            WHERE id_User = ?
            ORDER BY id_Alamat DESC
        `;
        const [rows] = await pool.query(query, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Database error (get alamat):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST Tambah Alamat Baru
router.post('/alamat', async (req, res) => {
    try {
        const { userId = 1, nama, telp, kelurahan, kecamatan, kota, kodePos, detail, label } = req.body;

        if (!nama || !telp || !detail) {
            return res.status(400).json({ success: false, message: 'Nama penerima, no HP, dan detail alamat wajib diisi' });
        }

        const query = `
            INSERT INTO alamat (id_User, Nama_Penerima, No_HP, Alamat_Lengkap, Kecamatan, Kelurahan, Kotakab, Kode_Pos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            userId,
            nama,
            telp,
            detail,
            kecamatan || '',
            kelurahan || '',
            kota || '',
            kodePos || ''
        ]);

        res.status(201).json({
            success: true,
            message: 'Alamat berhasil ditambahkan',
            data: {
                id: result.insertId,
                label: label || 'Alamat',
                nama,
                telp,
                kelurahan,
                kecamatan,
                kota,
                kodePos,
                detail
            }
        });
    } catch (err) {
        console.error('Database error (add alamat):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT Edit Alamat
router.put('/alamat/:idAlamat', async (req, res) => {
    try {
        const { idAlamat } = req.params;
        const { nama, telp, kelurahan, kecamatan, kota, kodePos, detail, label } = req.body;

        const query = `
            UPDATE alamat 
            SET Nama_Penerima = ?, No_HP = ?, Alamat_Lengkap = ?, Kecamatan = ?, Kelurahan = ?, Kotakab = ?, Kode_Pos = ?
            WHERE id_Alamat = ?
        `;
        const [result] = await pool.query(query, [
            nama,
            telp,
            detail,
            kecamatan || '',
            kelurahan || '',
            kota || '',
            kodePos || '',
            idAlamat
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Alamat tidak ditemukan' });
        }

        res.json({
            success: true,
            message: 'Alamat berhasil diperbarui',
            data: { id: idAlamat, label: label || 'Alamat', nama, telp, kelurahan, kecamatan, kota, kodePos, detail }
        });
    } catch (err) {
        console.error('Database error (edit alamat):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE Hapus Alamat
router.delete('/alamat/:idAlamat', async (req, res) => {
    try {
        const { idAlamat } = req.params;
        const [result] = await pool.query(`DELETE FROM alamat WHERE id_Alamat = ?`, [idAlamat]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Alamat tidak ditemukan' });
        }

        res.json({ success: true, message: 'Alamat berhasil dihapus' });
    } catch (err) {
        console.error('Database error (delete alamat):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==================== HISTORI PESANAN ====================

// GET Histori Pesanan User
router.get('/histori-pesanan/:userId?', async (req, res) => {
    try {
        const userId = req.params.userId || 1;
        await pool.query("SET SESSION group_concat_max_len = 10000;");

        const query = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS kode_orderan,
                p.Tanggal_Pesan AS tanggal,
                p.Status_Pesanan AS status,
                p.Total_Bayar AS harga,
                IFNULL(GROUP_CONCAT(pr.Nama_Produk SEPARATOR ', '), 'Produk Fleurahita') AS nama,
                IFNULL(MIN(pr.Ukuran), 'Medium') AS variant,
                IFNULL(MIN(pr.Foto_Produk), 'content-img1.png') AS img
            FROM pesanan p
            LEFT JOIN detail_pesanan dp ON p.id_Pesanan = dp.id_Pesanan
            LEFT JOIN produk pr ON dp.id_Produk = pr.id_produk
            WHERE p.id_User = ?
            GROUP BY p.id_Pesanan
            ORDER BY p.Tanggal_Pesan DESC
        `;

        const [rows] = await pool.query(query, [userId]);

        const formatted = rows.map(r => ({
            id: r.id,
            kodeOrderan: r.kode_orderan,
            nama: r.nama,
            variant: r.variant ? `Ukuran: ${r.variant}` : '',
            harga: Number(r.harga),
            status: r.status === 'Selesai' ? 'Diterima' : r.status,
            img: r.img ? (r.img.startsWith('http') || r.img.startsWith('/') ? r.img : `/pembeli/assets/profil/${r.img}`) : '/pembeli/assets/profil/content-img1.png'
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error('Database error (histori pesanan):', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
