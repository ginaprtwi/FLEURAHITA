const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET /api/wilayah/kodepos/:kodepos
  router.get('/kodepos/:kodepos', (req, res) => {
    const { kodepos } = req.params;

    db.query(
      'SELECT DISTINCT city, sub_district, village FROM kodepos WHERE postal_code = ? ORDER BY sub_district, village',
      [kodepos],
      (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Kode pos tidak ditemukan' });
        }
        res.json({ success: true, data: rows });
      }
    );
  });

  return router;
};