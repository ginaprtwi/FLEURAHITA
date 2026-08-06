btnBayar.addEventListener('click', async () => {
    const userId = 1; // SEMENTARA: hardcode

    const accountRaw = localStorage.getItem('fleurahita_account') || sessionStorage.getItem('fleurahita_account');
    const account = accountRaw ? JSON.parse(accountRaw) : {};
    const namaProfil = account.namaLengkap || '';

    if (!namaPenerimaInput.value.trim()) {
        namaPenerimaInput.value = namaProfil;
    }

    const requiredFields = [
        { value: namaPenerimaInput.value.trim(), label: 'Nama Penerima' },
        { value: alamatInput.value.trim(), label: 'Alamat' },
        { value: kecamatanSelect.value.trim(), label: 'Kecamatan' },
        { value: kelurahanSelect.value.trim(), label: 'Kelurahan' },
        { value: kotaKabInput.value.trim(), label: 'Kota/Kabupaten' },
        { value: kodePosInput.value.trim(), label: 'Kode Pos' }
    ];

    const kosong = requiredFields.find(f => f.value === '');
    if (kosong) {
        alert(`${kosong.label} belum diisi`);
        return;
    }

    if (cartItemsGlobal.length === 0) {
        alert('Keranjang kosong, tidak bisa lanjut ke pembayaran.');
        return;
    }

    const payload = {
        id_Alamat: currentIdAlamat,
        id_User: userId,
        Nama_Penerima: namaPenerimaInput.value.trim(),
        No_HP: '',
        Alamat_Lengkap: alamatInput.value.trim(),
        Kecamatan: kecamatanSelect.value,
        Kelurahan: kelurahanSelect.value,
        Kotakab: kotaKabInput.value,
        Kode_Pos: kodePosInput.value.trim()
    };

    let saveResult;
    try {
        const res = await fetch('http://localhost:3000/api/alamat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        saveResult = await res.json();
    } catch (err) {
        console.error('Gagal simpan alamat:', err);
        alert('Gagal menyimpan alamat, coba lagi.');
        return;
    }

    if (!saveResult.success) {
        alert(saveResult.message);
        return;
    }

    const daftarProduk = cartItemsGlobal
        .map(item => `- ${item.Nama_Produk} x${item.Jumlah} (${formatRupiah(item.Subtotal)})`)
        .join('\n');

    const totalText = document.getElementById('totalText').textContent;
    const salam = `Saya user atas nama ${namaProfil}.`;

    let pesan = '';
    if (selectedMethod === 'gopay') {
        pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran via Gopay, boleh minta nomor Gopay-nya?`;
    } else if (selectedMethod === 'bca') {
        pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran via BCA, boleh minta nomor rekeningnya?`;
    } else if (selectedMethod === 'tunai') {
        pesan = `${salam}\nSaya mau pesan:\n${daftarProduk}\nTotal: ${totalText}\nSaya pilih pembayaran Tunai, mohon konfirmasi pesanannya ya.`;
    }

    const NOMOR_PENJUAL = '6281234567890';
    const waLink = `https://wa.me/${NOMOR_PENJUAL}?text=${encodeURIComponent(pesan)}`;
    window.open(waLink, '_blank');
});