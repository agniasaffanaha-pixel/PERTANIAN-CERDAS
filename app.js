const $ = (id) => document.getElementById(id);
const toast = (message) => {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
};
$('year').textContent = new Date().getFullYear();
$('growthDate').value = new Date().toISOString().slice(0, 10);

// Mobile navigation
$('menuToggle').addEventListener('click', () => {
  const nav = $('mainNav');
  const open = nav.classList.toggle('open');
  $('menuToggle').setAttribute('aria-expanded', String(open));
  $('menuToggle').setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  $('menuToggle').textContent = open ? '×' : '☰';
});
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => {
  $('mainNav').classList.remove('open');
  $('menuToggle').setAttribute('aria-expanded', 'false');
  $('menuToggle').textContent = '☰';
}));

// Accessibility preferences
const accessDialog = $('accessDialog');
const accessKeys = ['fontChoice','fontScale','themeChoice','reduceMotion'];
let fontScale = 1;
function loadAccess() {
  try {
    const prefs = JSON.parse(localStorage.getItem('taniCerdasAccess') || '{}');
    fontScale = Number(prefs.fontScale) || 1;
    $('fontChoice').value = prefs.fontChoice || 'standard';
    $('themeChoice').value = prefs.themeChoice || 'soft';
    $('reduceMotion').checked = Boolean(prefs.reduceMotion);
  } catch (_) {}
  applyAccess(false);
}
function applyAccess(save = true) {
  document.documentElement.style.setProperty('--font-scale', fontScale);
  document.body.classList.toggle('dyslexic', $('fontChoice').value === 'dyslexic');
  document.body.dataset.theme = $('themeChoice').value === 'soft' ? 'soft' : $('themeChoice').value;
  document.body.classList.toggle('reduce-motion', $('reduceMotion').checked);
  $('fontSizeOutput').textContent = `${Math.round(fontScale * 100)}%`;
  if (save) {
    localStorage.setItem('taniCerdasAccess', JSON.stringify({
      fontChoice: $('fontChoice').value, fontScale,
      themeChoice: $('themeChoice').value, reduceMotion: $('reduceMotion').checked
    }));
  }
}
function openAccess() { accessDialog.showModal(); }
$('openAccess').addEventListener('click', openAccess);
$('footerAccess').addEventListener('click', openAccess);
$('fontChoice').addEventListener('change', () => applyAccess());
$('themeChoice').addEventListener('change', () => applyAccess());
$('reduceMotion').addEventListener('change', () => applyAccess());
$('fontDown').addEventListener('click', () => { fontScale = Math.max(.85, Math.round((fontScale - .05) * 100) / 100); applyAccess(); });
$('fontUp').addEventListener('click', () => { fontScale = Math.min(1.35, Math.round((fontScale + .05) * 100) / 100); applyAccess(); });
$('resetAccess').addEventListener('click', () => {
  fontScale = 1; $('fontChoice').value = 'standard'; $('themeChoice').value = 'soft'; $('reduceMotion').checked = false; applyAccess();
  toast('Pengaturan tampilan dikembalikan.');
});
loadAccess();

// Fertilizer calculator
$('fertilizerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const area = Number($('landArea').value);
  const unit = $('areaUnit').value;
  const dose = Number($('dose').value);
  const percent = Number($('fertPercent').value);
  const name = $('fertName').value.trim() || 'Pupuk';
  const crop = $('fertCrop').value;
  const nutrient = $('nutrient').value;
  if (!(area > 0) || dose < 0 || !(percent > 0 && percent <= 100)) {
    toast('Periksa kembali luas, dosis, dan kadar pupuk.');
    return;
  }
  const areaHa = unit === 'ha' ? area : area / 10000;
  const nutrientKg = dose * areaHa;
  const productKg = nutrientKg / (percent / 100);
  const areaLabel = unit === 'ha' ? `${area.toLocaleString('id-ID')} ha` : `${area.toLocaleString('id-ID')} m²`;
  const nutrientLabel = nutrient === 'N' ? 'N' : nutrient === 'P2O5' ? 'P₂O₅' : nutrient === 'K2O' ? 'K₂O' : 'unsur yang dipilih';
  $('fertResult').innerHTML = `
    <div class="result-top"><span class="result-icon">🌿</span><span class="eyebrow">Hasil perhitungan</span></div>
    <h3>${escapeHTML(name)} untuk ${escapeHTML(crop)}</h3>
    <p class="muted">Luas lahan: ${areaLabel}</p>
    <div class="result-number">${formatNumber(productKg, 3)} <small>kg</small></div>
    <div class="result-detail">
      <b>Setara dengan ${formatNumber(productKg * 1000, 1)} gram produk.</b><br>
      Kebutuhan ${nutrientLabel}: ${formatNumber(nutrientKg, 3)} kg.<br>
      Dosis yang dimasukkan: ${formatNumber(dose, 2)} kg/ha.<br>
      Kadar ${nutrientLabel} pada pupuk: ${formatNumber(percent, 2)}%.<br><br>
      Rumus: kebutuhan unsur (${formatNumber(nutrientKg, 3)} kg) ÷ kadar (${formatNumber(percent / 100, 4)}) = ${formatNumber(productKg, 3)} kg produk.
      <br><br><b>Catatan:</b> hasil ini hanya benar jika dosis yang dimasukkan dan kadar pada label mengacu pada unsur/bentuk hara yang sama. Dosis rekomendasi perlu ditentukan berdasarkan komoditas, tanah, dan kondisi setempat.
    </div>`;
});
function formatNumber(n, max = 2) {
  return n.toLocaleString('id-ID', {maximumFractionDigits: max, minimumFractionDigits: 0});
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// Germination calculator
function updateGermination(event) {
  if (event) event.preventDefault();
  const tested = Number($('seedsTested').value);
  const sprouted = Number($('seedsSprouted').value);
  const crop = $('germCrop').value.trim() || 'Komoditas';
  if (!Number.isInteger(tested) || tested <= 0 || !Number.isInteger(sprouted) || sprouted < 0 || sprouted > tested) {
    toast('Jumlah benih berkecambah harus 0 sampai jumlah benih yang diuji.');
    return;
  }
  const percentage = sprouted / tested * 100;
  $('germResult').innerHTML = `<strong>${formatNumber(percentage, 2)}%</strong><span>${sprouted} dari ${tested} benih ${escapeHTML(crop)} berkecambah.</span>`;
}
$('germForm').addEventListener('submit', updateGermination);

// Crop details
const cropInfo = {
  'Padi': 'Tanaman pangan yang membutuhkan pengelolaan air, varietas, dan hara sesuai kondisi lahan.',
  'Jagung': 'Perhatikan mutu benih, jarak tanam, ketersediaan air, serta pemupukan sesuai fase pertumbuhan.',
  'Cabai': 'Pantau kondisi daun, batang, bunga, dan buah secara berkala untuk mengenali gangguan sejak awal.',
  'Tomat': 'Perhatikan drainase, dukungan tanaman, pemantauan hama, serta kondisi buah menjelang panen.',
  'Pakcoy': 'Jaga ketersediaan air dan amati kondisi daun. Sesuaikan media dan pemupukan dengan sistem budidaya.',
  'Kedelai': 'Pantau pertumbuhan vegetatif, pembungaan, pembentukan polong, dan kondisi tanaman menjelang panen.'
};
document.querySelectorAll('.crop-detail').forEach(button => button.addEventListener('click', () => {
  const crop = button.dataset.crop;
  $('cropDialogTitle').textContent = crop;
  $('cropDialogContent').innerHTML = `<p>${escapeHTML(cropInfo[crop] || 'Pilih sumber budidaya yang sesuai untuk memperoleh rekomendasi lebih spesifik.')}</p>
  <ul><li>Gunakan benih bermutu dan varietas yang sesuai.</li><li>Amati kondisi tanah, air, serta pertumbuhan tanaman.</li><li>Gunakan rekomendasi pemupukan berdasarkan sumber tepercaya dan kondisi lahan.</li></ul>
  <p><b>Catatan:</b> ringkasan ini merupakan informasi awal, bukan rekomendasi dosis pupuk khusus.</p>`;
  $('fertCrop').value = ['Padi','Jagung','Cabai','Tomat','Pakcoy','Kedelai'].includes(crop) ? crop : 'Komoditas lainnya';
  $('cropCalcLink').onclick = () => $('cropDialog').close();
  $('cropDialog').showModal();
}));
$('cropSearch').addEventListener('input', () => {
  const query = $('cropSearch').value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll('.crop-card').forEach(card => {
    const match = card.dataset.name.includes(query);
    card.hidden = !match;
    if (match) shown++;
  });
  const existing = document.getElementById('noCrops');
  if (!shown && !existing) {
    const p = document.createElement('p'); p.id = 'noCrops'; p.className = 'empty-state'; p.textContent = 'Komoditas belum ditemukan. Coba kata kunci lain.';
    $('cropGrid').after(p);
  } else if (shown && existing) existing.remove();
});

// Growth records stored locally
const STORAGE_KEY = 'taniCerdasGrowthRecords';
function getRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) { return []; }
}
function saveRecords(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function renderRecords() {
  const records = getRecords().sort((a,b) => b.date.localeCompare(a.date));
  $('recordCount').textContent = `${records.length} catatan tersimpan`;
  if (!records.length) {
    $('growthRecords').innerHTML = '<p class="empty-state">Belum ada catatan. Tambahkan pengamatan pertamamu.</p>';
    return;
  }
  $('growthRecords').innerHTML = records.map(r => `<article class="record-item">
    <div><h4>${escapeHTML(r.crop)}${r.height !== '' ? ` · ${formatNumber(Number(r.height), 2)} cm` : ''}</h4><p>${escapeHTML(r.notes || 'Tidak ada catatan kondisi.')}</p></div>
    <div><span class="record-date">${escapeHTML(r.date)}</span><br><button class="text-button delete-record" data-id="${r.id}" type="button" aria-label="Hapus catatan ${escapeHTML(r.crop)} tanggal ${escapeHTML(r.date)}">Hapus</button></div>
  </article>`).join('');
  document.querySelectorAll('.delete-record').forEach(button => button.addEventListener('click', () => {
    saveRecords(getRecords().filter(r => r.id !== button.dataset.id));
    renderRecords(); toast('Catatan dihapus.');
  }));
}
$('growthForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const crop = $('growthCrop').value.trim();
  const date = $('growthDate').value;
  const height = $('growthHeight').value;
  if (!crop || !date || (height !== '' && Number(height) < 0)) {
    toast('Lengkapi data dan pastikan tinggi tidak negatif.');
    return;
  }
  const records = getRecords();
  records.push({id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, crop, date, height, notes: $('growthNotes').value.trim()});
  saveRecords(records);
  renderRecords();
  $('growthForm').reset();
  $('growthDate').value = new Date().toISOString().slice(0,10);
  toast('Pengamatan tersimpan di perangkat ini.');
});
$('clearRecords').addEventListener('click', () => {
  if (!getRecords().length) { toast('Belum ada catatan untuk dihapus.'); return; }
  if (confirm('Hapus semua catatan pengamatan dari browser ini?')) {
    saveRecords([]); renderRecords(); toast('Semua catatan dihapus.');
  }
});
renderRecords();

// Close mobile menu on Escape, and show smooth scroll for internal links
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    $('mainNav').classList.remove('open');
    $('menuToggle').setAttribute('aria-expanded', 'false');
    $('menuToggle').textContent = '☰';
  }
});
