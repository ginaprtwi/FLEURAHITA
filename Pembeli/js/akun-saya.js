/* ============================================================
   FLEURAHITA — Akun Saya
   Fungsionalitas: simpan profil, validasi form, navigasi menu,
   sinkronisasi nama di sidebar, dan notifikasi (toast).
   Data diakses lewat FleuraData (js/data.js).
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Database dummy akun terdaftar ---------- */
    var REGISTERED_USERS = [
        { namaPengguna: 'gibran.rakabuming', email: 'gibran.rakabuming@gmail.com' },
        { namaPengguna: 'andini.putri', email: 'andini.putri@gmail.com' },
        { namaPengguna: 'rafi.ahmad', email: 'rafi.ahmad@gmail.com' },
        { namaPengguna: 'siti.nurhaliza', email: 'siti.nurhaliza@gmail.com' }
    ];

    /* ---------- Elemen halaman ---------- */
    var form = document.getElementById('formAkun');
    var btnSimpan = document.getElementById('btnSimpan');
    var inputNamaLengkap = document.getElementById('namaLengkap');
    var inputNamaPengguna = document.getElementById('namaPengguna');
    var inputNoTelp = document.getElementById('noTelp');
    var inputEmail = document.getElementById('email');
    var namaSidebar = document.getElementById('namaSidebar');

    /* ---------- Data profil (via data layer) ---------- */
    function loadProfile() {
        return FleuraData.load('profile');
    }

    function saveProfile(profile) {
        return FleuraData.save('profile', profile);
    }

    function applyProfile(profile) {
        inputNamaLengkap.value = profile.namaLengkap || '';
        inputNamaPengguna.value = profile.namaPengguna || '';
        inputNoTelp.value = profile.noTelp || '';
        inputEmail.value = profile.email || '';

        if (namaSidebar && profile.namaLengkap) {
            namaSidebar.textContent = profile.namaLengkap;
        }
    }

    /* ---------- Validasi form ---------- */
    function validate() {
        var fields = [
            { el: inputNamaLengkap, rule: function (v) { return v.trim().length >= 3; } },
            { el: inputNamaPengguna, rule: function (v) { return v.trim().length >= 3; } },
            { el: inputNoTelp, rule: function (v) { return /^[0-9+\-\s()]{9,}$/.test(v.trim()); } },
            { el: inputEmail, rule: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } }
        ];

        var valid = true;
        fields.forEach(function (field) {
            var ok = field.rule(field.el.value);
            field.el.classList.toggle('input-error', !ok);
            if (!ok) { valid = false; }
        });
        return valid;
    }

    /* ---------- Pesan error inline ---------- */
    function setFieldError(field, message) {
        var input = document.getElementById(field);
        var msg = document.getElementById(field === 'namaPengguna' ? 'errorNamaPengguna' : 'errorEmail');
        if (input) { input.classList.add('input-error'); }
        if (msg) { msg.textContent = message || ''; msg.classList.toggle('show', !!message); }
    }

    function clearRegisteredErrors() {
        ['namaPengguna', 'email'].forEach(function (field) {
            var msg = document.getElementById(field === 'namaPengguna' ? 'errorNamaPengguna' : 'errorEmail');
            if (msg) { msg.classList.remove('show'); msg.textContent = ''; }
        });
    }

    /* ---------- Cek duplikat nama pengguna / email ---------- */
    function findDuplicate(username, email) {
        username = (username || '').toLowerCase();
        email = (email || '').toLowerCase();
        var current = loadProfile();
        var curUser = (current.namaPengguna || '').toLowerCase();
        var curEmail = (current.email || '').toLowerCase();

        for (var i = 0; i < REGISTERED_USERS.length; i++) {
            var u = REGISTERED_USERS[i];
            var dbUser = (u.namaPengguna || '').toLowerCase();
            var dbEmail = (u.email || '').toLowerCase();

            if (username !== '' && dbUser !== '' && username === dbUser && dbUser !== curUser) {
                return { field: 'namaPengguna', message: 'Nama pengguna "' + u.namaPengguna + '" sudah dipakai.' };
            }
            if (email !== '' && dbEmail !== '' && email === dbEmail && dbEmail !== curEmail) {
                return { field: 'email', message: 'Email "' + u.email + '" sudah dipakai.' };
            }
        }
        return null;
    }

    /* ---------- Simpan data ---------- */
    function onSimpan(event) {
        event.preventDefault();

        if (!validate()) {
            FleuraData.toast('Mohon lengkapi data dengan benar (tanda * wajib diisi).', 'error');
            return;
        }

        var profile = {
            namaLengkap: inputNamaLengkap.value.trim(),
            namaPengguna: inputNamaPengguna.value.trim(),
            noTelp: inputNoTelp.value.trim(),
            email: inputEmail.value.trim()
        };

        var dup = findDuplicate(profile.namaPengguna, profile.email);
        if (dup) {
            setFieldError(dup.field, dup.message);
            FleuraData.toast(dup.message, 'error');
            return;
        }

        if (!saveProfile(profile)) {
            FleuraData.toast('Gagal menyimpan data. Coba lagi.', 'error');
            return;
        }

        applyProfile(profile);
        clearRegisteredErrors();
        FleuraData.toast('Data akun berhasil disimpan.', 'success');
    }

    /* ---------- Inisialisasi ---------- */
    function init() {
        applyProfile(loadProfile());

        [inputNamaLengkap, inputNamaPengguna, inputNoTelp, inputEmail].forEach(function (el) {
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
                var msgId = el.id === 'namaPengguna' ? 'errorNamaPengguna' : (el.id === 'email' ? 'errorEmail' : null);
                if (msgId) {
                    var m = document.getElementById(msgId);
                    if (m) { m.classList.remove('show'); m.textContent = ''; }
                }
            });
        });

        if (form) { form.addEventListener('submit', onSimpan); }
        if (btnSimpan) { btnSimpan.addEventListener('click', onSimpan); }

        FleuraData.bindNavigation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
