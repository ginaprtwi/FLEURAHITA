// account.js
// Logika untuk halaman "Akun Saya" (Account Details) - FLEURAHITA
// Tidak mengubah layout/HTML/CSS, hanya menambahkan fungsi load & save.
// Aturan bisnis:
//   - Nama Lengkap  : TIDAK BISA diganti sama sekali.
//   - Nama Pengguna : hanya bisa diganti tiap 14 hari sekali.
//   - Email         : ganti harus verifikasi kode dulu.
//   - No. Telp      : ganti harus verifikasi kode dulu.
// Data disimpan di localStorage (key: 'fleurahita_account').
// TODO: ganti bagian yang ditandai TODO dengan API asli kalau backend sudah ada.

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'fleurahita_account';
  const USERNAME_COOLDOWN_DAYS = 14;

  const els = {
    namaLengkap: document.querySelector('.input-group-name3 .input-group-name-input1'),
    namaPengguna: document.querySelector('.account-section-input'),
    noTelp: document.querySelector('.input-group-name4 .input-group-name-input1'),
    email: document.querySelector('.input-group-name5 .input-group-name-input1'),
    simpanBtn: document.querySelector('.account-section-btn-form'),
    sidebarName: document.querySelector('.column-gibran-rakabuming'),
  };

  let data = {
    namaLengkap: els.namaLengkap ? els.namaLengkap.value : '',
    namaPengguna: els.namaPengguna ? els.namaPengguna.value : '',
    namaPenggunaLastChanged: null,
    noTelp: els.noTelp ? els.noTelp.value : '',
    email: els.email ? els.email.value : '',
  };

  function daysSince(timestamp) {
    if (!timestamp) return Infinity;
    return (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  }

  function canChangeUsername() {
    return daysSince(data.namaPenggunaLastChanged) >= USERNAME_COOLDOWN_DAYS;
  }

  function nextUsernameChangeDate() {
    const nextTs = data.namaPenggunaLastChanged + USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const d = new Date(nextTs);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function setFieldNote(inputEl, text, isError) {
    if (!inputEl) return;
    const wrapper = inputEl.closest('.input-group-name-a') || inputEl.parentElement;
    let note = wrapper.querySelector('.field-note');
    if (!text) {
      if (note) note.remove();
      return;
    }
    if (!note) {
      note = document.createElement('p');
      note.className = 'field-note';
      note.style.margin = '0';
      note.style.fontSize = '12px';
      wrapper.appendChild(note);
    }
    note.textContent = text;
    note.style.color = isError ? '#c0392b' : '#6c7275';
  }

  function showMessage(msg, isError) {
    let box = document.querySelector('.account-section-message');
    if (!box) {
      box = document.createElement('p');
      box.className = 'account-section-message';
      box.style.margin = '0';
      box.style.fontSize = '13px';
      els.simpanBtn.insertAdjacentElement('afterend', box);
    }
    box.textContent = msg;
    box.style.color = isError ? '#c0392b' : '#1e8449';
  }

  function applyFieldStates() {
    if (els.namaLengkap) {
      els.namaLengkap.disabled = true;
      els.namaLengkap.title = 'Nama lengkap tidak dapat diubah.';
    }

    if (els.namaPengguna) {
      if (!canChangeUsername()) {
        els.namaPengguna.disabled = true;
        setFieldNote(els.namaPengguna, `Nama pengguna bisa diganti lagi pada ${nextUsernameChangeDate()}.`, false);
      } else {
        els.namaPengguna.disabled = false;
        setFieldNote(els.namaPengguna, null);
      }
    }
  }

  function loadAccount() {
    // TODO: ganti dengan fetch('/api/account') kalau sudah ada backend
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        data = { ...data, ...JSON.parse(saved) };
      } catch (err) {
        console.error('Gagal memuat data akun:', err);
      }
    }

    if (els.namaLengkap) els.namaLengkap.value = data.namaLengkap;
    if (els.namaPengguna) els.namaPengguna.value = data.namaPengguna;
    if (els.noTelp) els.noTelp.value = data.noTelp;
    if (els.email) els.email.value = data.email;
    if (els.sidebarName) els.sidebarName.textContent = data.namaPengguna;

    applyFieldStates();
  }

  function validate(input) {
    const errors = [];

    if (!input.namaPengguna.trim()) {
      errors.push('Nama pengguna tidak boleh kosong.');
    }

    const phoneRegex = /^0[0-9]{9,14}$/;
    if (!phoneRegex.test(input.noTelp.trim())) {
      errors.push('Nomor telepon tidak valid (contoh: 0897xxxxxxx).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.push('Email tidak valid.');
    }

    return errors;
  }

  // Simulasi kirim & cek kode verifikasi (mock, belum terhubung ke email/SMS asli)
  // TODO: ganti dengan kirim kode via API email/SMS asli, lalu verifikasi ke server
  function verifyWithCode(channelLabel, destination) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`[MOCK] Kode verifikasi ${channelLabel} (${destination}): ${code}`);
    const input = window.prompt(
      `Kode verifikasi sudah "dikirim" ke ${channelLabel} baru kamu (${destination}).\n` +
      `Untuk demo, buka Console browser (F12) untuk lihat kodenya.\n\n` +
      `Masukkan kode verifikasi:`
    );
    if (input === null) return false;
    return input.trim() === code;
  }

  function saveAccount() {
    const input = {
      namaPengguna: els.namaPengguna.value,
      noTelp: els.noTelp.value,
      email: els.email.value,
    };

    const errors = validate(input);
    if (errors.length > 0) {
      showMessage(errors.join(' '), true);
      return;
    }

    const usernameChanged = input.namaPengguna.trim() !== data.namaPengguna.trim();
    const phoneChanged = input.noTelp.trim() !== data.noTelp.trim();
    const emailChanged = input.email.trim() !== data.email.trim();

    if (usernameChanged && !canChangeUsername()) {
      els.namaPengguna.value = data.namaPengguna;
      showMessage(`Nama pengguna hanya bisa diganti setiap ${USERNAME_COOLDOWN_DAYS} hari. Coba lagi pada ${nextUsernameChangeDate()}.`, true);
      return;
    }

    if (emailChanged) {
      const ok = verifyWithCode('email', input.email.trim());
      if (!ok) {
        els.email.value = data.email;
        showMessage('Verifikasi email gagal atau dibatalkan. Email tidak diubah.', true);
        return;
      }
    }

    if (phoneChanged) {
      const ok = verifyWithCode('nomor telepon', input.noTelp.trim());
      if (!ok) {
        els.noTelp.value = data.noTelp;
        showMessage('Verifikasi nomor telepon gagal atau dibatalkan. Nomor tidak diubah.', true);
        return;
      }
    }

    els.simpanBtn.disabled = true;
    const originalText = els.simpanBtn.textContent;
    els.simpanBtn.textContent = 'Menyimpan...';

    // TODO: ganti setTimeout ini dengan fetch('/api/account', { method: 'PUT', body: ... })
    setTimeout(() => {
      data.namaPengguna = input.namaPengguna.trim();
      data.noTelp = input.noTelp.trim();
      data.email = input.email.trim();
      if (usernameChanged) {
        data.namaPenggunaLastChanged = Date.now();
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      if (els.sidebarName) els.sidebarName.textContent = data.namaPengguna;

      els.simpanBtn.disabled = false;
      els.simpanBtn.textContent = originalText;

      applyFieldStates();
      showMessage('Perubahan berhasil disimpan.', false);
    }, 400);
  }

  if (els.simpanBtn) {
    els.simpanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveAccount();
    });
  }

  loadAccount();
});