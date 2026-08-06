// voucher.js
// Kode voucher hardcode (belum ada tabel voucher di database).
// Taruh SETELAH order_summary.js, SEBELUM checkout.js

const DAFTAR_VOUCHER = {
    'FLEUR10': 0.10,
    'FLEUR20': 0.20
};

window.diskonAktif = 0; // dibaca oleh updateTotals() di order_summary.js

document.addEventListener('DOMContentLoaded', () => {
    const voucherInput = document.getElementById('voucherInput');
    const applyBtn = document.getElementById('voucherApplyBtn');

    if (!voucherInput || !applyBtn) return;

    function terapkanVoucher() {
        const kode = voucherInput.value.trim().toUpperCase();

        if (!kode) {
            alert('Masukkan kode voucher terlebih dahulu');
            return;
        }

        if (!DAFTAR_VOUCHER[kode]) {
            alert('Kode voucher tidak valid');
            window.diskonAktif = 0;
        } else {
            window.diskonAktif = DAFTAR_VOUCHER[kode];
            alert(`Voucher berhasil dipakai! Diskon ${DAFTAR_VOUCHER[kode] * 100}%`);
        }

        updateTotals(cartItemsGlobal);
    }

    applyBtn.addEventListener('click', terapkanVoucher);

    voucherInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            terapkanVoucher();
        }
    });
});