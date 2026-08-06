document.addEventListener('DOMContentLoaded', () => {
    const paymentOptions = document.querySelectorAll('.payment-option');
    let selectedMethod = 'gopay';

    document.querySelector('[data-method="gopay"]').classList.add('payment-selected');

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(o => o.classList.remove('payment-selected'));
            option.classList.add('payment-selected');
            selectedMethod = option.dataset.method;
        });
    });

    const NOMOR_PENJUAL = '6281234567890'; // GANTI dengan nomor WA penjual

    document.querySelector('.btn7').addEventListener('click', () => {
        const namaUser = localStorage.getItem('nama_user') || 'Tidak diketahui';

        if (cartItemsGlobal.length === 0) {
            alert('Keranjang kosong, tidak bisa lanjut ke pembayaran.');
            return;
        }

        const daftarProduk = cartItemsGlobal
            .map(item => `- ${item.Nama_Produk} x${item.Jumlah} (${formatRupiah(item.Subtotal)})`)
            .join('\n');

        const totalText = document.getElementById('totalText').textContent;

        const salam = `Saya user atas nama ${namaUser}.`;
        let pesan = '';

        if (selectedMethod === 'gopay') {
            pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran via Gopay, boleh minta nomor Gopay-nya?`;
        } else if (selectedMethod === 'bca') {
            pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran via BCA, boleh minta nomor rekeningnya?`;
        } else if (selectedMethod === 'tunai') {
            pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran Tunai, mohon konfirmasi pesanannya ya.`;
        }

        const waLink = `https://wa.me/${NOMOR_PENJUAL}?text=${encodeURIComponent(pesan)}`;
        window.open(waLink, '_blank');
         window.location.href = 'pesanan-saya4.html'; // <-- ini bagiannya
    });
    });