// voucher.js
document.addEventListener('DOMContentLoaded', () => {
    const voucherInput = document.querySelector('.order-summary-coupon-form-input');
    const applyBtn = document.querySelector('.order-summary-coupon-btn');

    // ubah div jadi input beneran biar bisa diketik
    voucherInput.outerHTML = `<input type="text" class="order-summary-coupon-form-input text-16px-regular card-white3" id="voucherInput" placeholder="Kode voucher" />`;

    const DAFTAR_VOUCHER = {
        'FLEUR10': 0.10,  // diskon 10%
        'FLEUR20': 0.20   // diskon 20%
    };

    let diskonAktif = 0;

    document.getElementById('voucherInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyBtn.click();
    });

    applyBtn.addEventListener('click', () => {
        const kode = document.getElementById('voucherInput').value.trim().toUpperCase();

        if (!DAFTAR_VOUCHER[kode]) {
            alert('Kode voucher tidak valid');
            diskonAktif = 0;
        } else {
            diskonAktif = DAFTAR_VOUCHER[kode];
            alert(`Voucher berhasil dipakai! Diskon ${diskonAktif * 100}%`);
        }

        window.diskonAktif = diskonAktif; // dibaca sama updateTotals()
        updateTotals(cartItemsGlobal);
    });
});