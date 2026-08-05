/* ============================================================
   FLEURAHITA — Alamat Saya
   Fungsionalitas: tambah, edit, dan hapus alamat,
   sinkronisasi nama di sidebar, navigasi menu, dan toast.
   Data diakses lewat FleuraData (js/data.js).
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Elemen halaman ---------- */
    var alamatList = document.getElementById('alamatList');
    var btnTambahAlamat = document.getElementById('btnTambahAlamat');
    var modal = document.getElementById('alamatModal');
    var formAlamat = document.getElementById('formAlamat');
    var modalTitle = document.getElementById('modalTitle');
    var btnTutupModal = document.getElementById('btnTutupModal');
    var btnBatalModal = document.getElementById('btnBatalModal');
    var inputLabel = document.getElementById('alamatLabel');
    var inputNama = document.getElementById('alamatNama');
    var inputTelp = document.getElementById('alamatTelp');
    var inputKelurahan = document.getElementById('alamatKelurahan');
    var inputKecamatan = document.getElementById('alamatKecamatan');
    var inputKota = document.getElementById('alamatKota');
    var inputProvinsi = document.getElementById('alamatProvinsi');
    var inputKodePos = document.getElementById('alamatKodePos');
    var inputDetail = document.getElementById('alamatDetail');
    var namaSidebar = document.getElementById('namaSidebar');
    var editingId = null;

    var formInputs = [
        inputLabel, inputNama, inputTelp, inputKelurahan,
        inputKecamatan, inputKota, inputProvinsi, inputKodePos, inputDetail
    ];

    /* ---------- Akses data (via data layer) ---------- */
    function loadAddresses() {
        return FleuraData.load('addresses');
    }

    function saveAddresses(list) {
        return FleuraData.save('addresses', list);
    }

    function buildRegionText(item) {
        var region = [item.kelurahan, item.kecamatan, item.kota, item.provinsi]
            .filter(Boolean).join(', ');
        return item.kodePos ? region + '\u2014 Kode Pos: ' + item.kodePos : region;
    }

    /* ---------- Render daftar alamat ---------- */
    function renderAddresses() {
        var list = loadAddresses();

        if (!list.length) {
            alamatList.innerHTML = '<div class="alamat-empty">Belum ada alamat. Klik &ldquo;Tambah Alamat&rdquo; untuk menambahkan.</div>';
            return;
        }

        alamatList.innerHTML = list.map(function (item) {
            return '' +
                '<div class="alamat-card" data-id="' + item.id + '">' +
                    '<div class="alamat-card-top">' +
                        '<p class="alamat-card-label"></p>' +
                        '<div class="alamat-card-actions">' +
                            '<button type="button" class="alamat-action alamat-action-edit" data-action="edit">' +
                                '<object data="/pembeli/assets/profil/card-content-outline-edit.svg" class="alamat-action-icon" type="image/svg+xml"></object>' +
                                '<span>Edit</span>' +
                            '</button>' +
                            '<button type="button" class="alamat-action alamat-action-hapus" data-action="hapus">' +
                                '<span class="alamat-action-icon">&times;</span>' +
                                '<span>Hapus</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="alamat-card-body">' +
                        '<p class="alamat-card-nama"></p>' +
                        '<p class="alamat-card-telp"></p>' +
                        '<p class="alamat-card-region"></p>' +
                        '<p class="alamat-card-detail"></p>' +
                    '</div>' +
                '</div>';
        }).join('');

        var cards = alamatList.querySelectorAll('.alamat-card');
        list.forEach(function (item, index) {
            var card = cards[index];
            card.querySelector('.alamat-card-label').textContent = item.label || 'Alamat';
            card.querySelector('.alamat-card-nama').textContent = item.nama || '-';
            card.querySelector('.alamat-card-telp').textContent = item.telp || '-';
            card.querySelector('.alamat-card-region').textContent = buildRegionText(item);
            card.querySelector('.alamat-card-detail').textContent = item.detail || '-';
        });
    }

    /* ---------- Buka / tutup modal ---------- */
    function openModal(address) {
        editingId = address ? address.id : null;

        if (address) {
            modalTitle.textContent = 'Edit Alamat';
            inputLabel.value = address.label || '';
            inputNama.value = address.nama || '';
            inputTelp.value = address.telp || '';
            inputKelurahan.value = address.kelurahan || '';
            inputKecamatan.value = address.kecamatan || '';
            inputKota.value = address.kota || '';
            inputProvinsi.value = address.provinsi || '';
            inputKodePos.value = address.kodePos || '';
            inputDetail.value = address.detail || '';
        } else {
            modalTitle.textContent = 'Tambah Alamat';
            formAlamat.reset();
        }

        formInputs.forEach(function (el) { el.classList.remove('input-error'); });

        modal.hidden = false;
        inputLabel.focus();
    }

    function closeModal() {
        modal.hidden = true;
        editingId = null;
        formAlamat.reset();
    }

    /* ---------- Validasi form alamat ---------- */
    function validate() {
        var fields = [
            { el: inputLabel, rule: function (v) { return v.trim().length >= 2; } },
            { el: inputNama, rule: function (v) { return v.trim().length >= 3; } },
            { el: inputTelp, rule: function (v) { return /^[0-9+\-\s()]{9,}$/.test(v.trim()); } },
            { el: inputKelurahan, rule: function (v) { return v.trim().length >= 2; } },
            { el: inputKecamatan, rule: function (v) { return v.trim().length >= 2; } },
            { el: inputKota, rule: function (v) { return v.trim().length >= 2; } },
            { el: inputProvinsi, rule: function (v) { return v.trim().length >= 2; } },
            { el: inputKodePos, rule: function (v) { return /^[0-9]{5}$/.test(v.trim()); } },
            { el: inputDetail, rule: function (v) { return v.trim().length >= 10; } }
        ];

        var valid = true;
        fields.forEach(function (field) {
            var ok = field.rule(field.el.value);
            field.el.classList.toggle('input-error', !ok);
            if (!ok) { valid = false; }
        });
        return valid;
    }

    /* ---------- Simpan alamat (tambah / edit) ---------- */
    function onSimpanAlamat(event) {
        event.preventDefault();

        if (!validate()) {
            FleuraData.toast('Mohon lengkapi data alamat dengan benar (tanda * wajib diisi).', 'error');
            return;
        }

        var list = loadAddresses();
        var data = {
            label: inputLabel.value.trim(),
            nama: inputNama.value.trim(),
            telp: inputTelp.value.trim(),
            kelurahan: inputKelurahan.value.trim(),
            kecamatan: inputKecamatan.value.trim(),
            kota: inputKota.value.trim(),
            provinsi: inputProvinsi.value.trim(),
            kodePos: inputKodePos.value.trim(),
            detail: inputDetail.value.trim()
        };

        if (editingId) {
            var found = false;
            list = list.map(function (item) {
                if (item.id === editingId) {
                    found = true;
                    return Object.assign({}, item, data);
                }
                return item;
            });
            if (!found) { return; }
        } else {
            data.id = 'addr-' + Date.now();
            list.push(data);
        }

        if (!saveAddresses(list)) {
            FleuraData.toast('Gagal menyimpan alamat. Coba lagi.', 'error');
            return;
        }

        closeModal();
        renderAddresses();
        FleuraData.toast(editingId ? 'Alamat berhasil diperbarui.' : 'Alamat berhasil ditambahkan.', 'success');
    }

    /* ---------- Hapus alamat ---------- */
    function onHapusAlamat(id) {
        var list = loadAddresses();
        var item = list.filter(function (a) { return a.id === id; })[0];
        var label = item ? (item.label || 'Alamat ini') : 'Alamat ini';

        if (!window.confirm('Yakin ingin menghapus "' + label + '"?')) {
            return;
        }

        list = list.filter(function (a) { return a.id !== id; });
        if (!saveAddresses(list)) {
            FleuraData.toast('Gagal menghapus alamat. Coba lagi.', 'error');
            return;
        }

        renderAddresses();
        FleuraData.toast('Alamat berhasil dihapus.', 'success');
    }

    /* ---------- Inisialisasi ---------- */
    function init() {
        FleuraData.applySidebarName(namaSidebar);
        renderAddresses();

        formInputs.forEach(function (el) {
            el.addEventListener('focus', function () {
                el.setAttribute('data-placeholder', el.getAttribute('placeholder') || '');
                el.removeAttribute('placeholder');
            });
            el.addEventListener('blur', function () {
                if (el.value.trim() === '' && el.getAttribute('data-placeholder')) {
                    el.setAttribute('placeholder', el.getAttribute('data-placeholder'));
                }
            });
            el.addEventListener('input', function () {
                el.classList.remove('input-error');
            });
        });

        alamatList.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-action]');
            if (!btn) { return; }
            var card = btn.closest('.alamat-card');
            if (!card) { return; }
            var id = card.getAttribute('data-id');
            var action = btn.getAttribute('data-action');

            if (action === 'edit') {
                var address = loadAddresses().filter(function (a) { return a.id === id; })[0];
                if (address) { openModal(address); }
            } else if (action === 'hapus') {
                onHapusAlamat(id);
            }
        });

        if (btnTambahAlamat) {
            btnTambahAlamat.addEventListener('click', function () { openModal(null); });
        }
        if (btnTutupModal) { btnTutupModal.addEventListener('click', closeModal); }
        if (btnBatalModal) { btnBatalModal.addEventListener('click', closeModal); }

        modal.addEventListener('click', function (event) {
            if (event.target === modal) { closeModal(); }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !modal.hidden) { closeModal(); }
        });

        if (formAlamat) { formAlamat.addEventListener('submit', onSimpanAlamat); }

        FleuraData.bindNavigation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
