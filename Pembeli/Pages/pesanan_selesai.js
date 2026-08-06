// pesanan_selesai.js
// Render data order terakhir yang disimpan pembayaran.js, plus fungsi 2 tombol bawah.
// Taruh sebelum stepper.js di pesanan-saya4.html

document.addEventListener('DOMContentLoaded', () => {
    const orderRaw = sessionStorage.getItem('lastOrder');

    if (orderRaw) {
        const order = JSON.parse(orderRaw);

        document.getElementById('kodeOrderText').textContent = order.kodeOrder;
        document.getElementById('tanggalText').textContent = order.tanggal;
        document.getElementById('totalOrderText').textContent = order.total;
        document.getElementById('metodeText').textContent = order.metode;
        document.getElementById('jumlahItemBadge').textContent = order.jumlahTotalItem;

        const imgEl = document.getElementById('produkUtamaImg');
        if (imgEl && order.fotoProdukUtama) {
            imgEl.src = `../assets/pesanan-saya/${order.fotoProdukUtama}`;
        }
    }
    // Kalau tidak ada 'lastOrder' (misal user buka halaman ini langsung tanpa checkout),
    // biarkan placeholder default di HTML.

    // --- Tombol Histori Pembelian ---
    document.getElementById('btnHistori').addEventListener('click', () => {
        window.location.href = 'histori_pesanan.html'; // SESUAIKAN path halaman histori kamu
    });

    // --- Tombol Kembali Ke Beranda ---
    document.getElementById('btnBeranda').addEventListener('click', () => {
        window.location.href = 'beranda.html'; // SESUAIKAN path halaman beranda kamu
    });
});