document.addEventListener('DOMContentLoaded', () => {
    const kodePosInput = document.getElementById('kodePosInput');
    const kecamatanSelect = document.getElementById('kecamatanSelect');
    const kelurahanSelect = document.getElementById('kelurahanSelect');
    const kotaKabInput = document.getElementById('kotaKabInput');
    const namaPenerimaInput = document.getElementById('namaPenerimaInput');
    const alamatInput = document.getElementById('alamatInput');

    let wilayahData = [];
    let currentIdAlamat = null;
    const userId = localStorage.getItem('id_User');

    async function isiWilayahDariKodepos(kodepos, kecamatanTerpilih = null, kelurahanTerpilih = null) {
        kecamatanSelect.innerHTML = '<option value="">Kecamatan</option>';
        kelurahanSelect.innerHTML = '<option value="">Kelurahan</option>';
        kotaKabInput.value = '';
        wilayahData = [];

        if (!kodepos || kodepos.length !== 5) return;

        try {
            const res = await fetch(`http://localhost:3000/api/wilayah/kodepos/${kodepos}`);
            const result = await res.json();
            if (!result.success) return;

            wilayahData = result.data;
            kotaKabInput.value = wilayahData[0].city;

            const kecamatanUnik = [...new Set(wilayahData.map(d => d.sub_district))];
            kecamatanUnik.forEach(kec => {
                const opt = document.createElement('option');
                opt.value = kec;
                opt.textContent = kec;
                kecamatanSelect.appendChild(opt);
            });

            const kecamatanFinal = kecamatanTerpilih || (kecamatanUnik.length === 1 ? kecamatanUnik[0] : '');
            if (kecamatanFinal) {
                kecamatanSelect.value = kecamatanFinal;
                isiKelurahan(kecamatanFinal, kelurahanTerpilih);
            }
        } catch (err) {
            console.error('Gagal ambil data wilayah:', err);
        }
    }

    function isiKelurahan(kecamatan, kelurahanTerpilih = null) {
        kelurahanSelect.innerHTML = '<option value="">Kelurahan</option>';
        if (!kecamatan) return;

        const kelurahanList = wilayahData
            .filter(d => d.sub_district === kecamatan)
            .map(d => d.village);

        kelurahanList.forEach(kel => {
            const opt = document.createElement('option');
            opt.value = kel;
            opt.textContent = kel;
            kelurahanSelect.appendChild(opt);
        });

        kelurahanSelect.value = kelurahanTerpilih || (kelurahanList.length === 1 ? kelurahanList[0] : '');
    }

    kodePosInput.addEventListener('input', () => {
        isiWilayahDariKodepos(kodePosInput.value.trim());
    });

    kecamatanSelect.addEventListener('change', () => isiKelurahan(kecamatanSelect.value));

    async function loadAlamat() {
        if (!userId) return;

        try {
            const res = await fetch(`http://localhost:3000/api/alamat/${userId}`);
            const result = await res.json();
            if (!result.success) return;

            const a = result.data;
            currentIdAlamat = a.id_Alamat;

            namaPenerimaInput.value = a.Nama_Penerima;
            alamatInput.value = a.Alamat_Lengkap;
            kotaKabInput.value = a.Kotakab;
            kodePosInput.value = a.Kode_Pos;

            await isiWilayahDariKodepos(a.Kode_Pos, a.Kecamatan, a.Kelurahan);
        } catch (err) {
            console.error('Gagal load alamat:', err);
        }
    }

    loadAlamat();

    document.querySelector('.btn7').addEventListener('click', async () => {
        // kalau nama penerima kosong, ambil dari nama profil user
        if (!namaPenerimaInput.value.trim()) {
            const namaProfil = localStorage.getItem('nama_user'); // sesuaikan key-nya dgn yg kamu pakai saat login
            if (namaProfil) {
                namaPenerimaInput.value = namaProfil;
            }
        }

        // validasi semua field wajib
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
            return; // stop, jangan lanjut fetch
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

        try {
            const res = await fetch('http://localhost:3000/api/alamat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();

            if (result.success) {
                window.location.href = 'pesanan-saya4.html';
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('Gagal simpan alamat:', err);
        }
    });
});