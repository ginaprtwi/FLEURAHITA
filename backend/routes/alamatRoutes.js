const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET /api/alamat/:userId — ambil alamat user (kalau sudah pernah isi)
  router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    db.query(
      'SELECT * FROM Alamat WHERE id_User = ? ORDER BY id_Alamat DESC LIMIT 1',
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Alamat belum ada' });
        }
        res.json({ success: true, data: rows[0] });
      }
    );
  });

  // POST /api/alamat — simpan alamat baru, atau update kalau id_Alamat dikirim
  router.post('/', (req, res) => {
    const {
      id_Alamat, id_User, Nama_Penerima, No_HP,
      Alamat_Lengkap, Kecamatan, Kelurahan, Kotakab, Kode_Pos
    } = req.body;

    if (!id_User || !Nama_Penerima || !Alamat_Lengkap || !Kode_Pos) {
      return res.status(400).json({ success: false, message: 'Data alamat belum lengkap' });
    }

    if (id_Alamat) {
      // update alamat yang sudah ada
      db.query(
        `UPDATE Alamat SET Nama_Penerima=?, No_HP=?, Alamat_Lengkap=?, Kecamatan=?, Kelurahan=?, Kotakab=?, Kode_Pos=?
         WHERE id_Alamat=? AND id_User=?`,
        [Nama_Penerima, No_HP, Alamat_Lengkap, Kecamatan, Kelurahan, Kotakab, Kode_Pos, id_Alamat, id_User],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: 'Alamat berhasil diupdate', id_Alamat });
        }
      );
    } else {
      // insert alamat baru
      db.query(
        `INSERT INTO Alamat (id_User, Nama_Penerima, No_HP, Alamat_Lengkap, Kecamatan, Kelurahan, Kotakab, Kode_Pos)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_User, Nama_Penerima, No_HP, Alamat_Lengkap, Kecamatan, Kelurahan, Kotakab, Kode_Pos],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.status(201).json({ success: true, message: 'Alamat berhasil disimpan', id_Alamat: result.insertId });
        }
      );
    }
  });

  return router;
};