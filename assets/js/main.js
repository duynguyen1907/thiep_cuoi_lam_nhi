/* ============================================================
   Thiệp cưới online — phần điều khiển
   Sửa thông tin đám cưới ở đối tượng CONFIG bên dưới.
   ============================================================ */

const CONFIG = {

  /* Thời điểm dùng cho đồng hồ đếm ngược.
     Định dạng: "YYYY-MM-DDTHH:mm:ss+07:00" (giờ Việt Nam). */
  weddingDate: '2026-12-20T18:00:00+07:00',

  /* Địa chỉ hiển thị trên bản đồ. Đổi thành địa chỉ nhà hàng thật. */
  mapQuery: '789 Đường DEF, Quận 5, Thành phố Hồ Chí Minh',

  /* Ảnh album. Thay bằng ảnh cưới thật, ví dụ 'images/album/01.jpg'. */
  album: [
    'images/bg-floral-blur-blush.jpg',
    'images/bg-floral-blur-rose.jpg',
    'images/bg-cream-gold-frame.jpg',
    'images/bg-floral-blur-cream.jpg',
    'images/bg-sky-clouds-pastel.jpg',
    'images/bg-marble-white.jpg'
  ],

  /* Tài khoản nhận mừng cưới.
     qr: đường dẫn ảnh QR (để trống '' nếu chưa có). */
  banks: [
    { side: 'Nhà trai', bank: 'Vietcombank', owner: 'NGUYEN HOANG LAM', number: '0123456789', qr: '' },
    { side: 'Nhà gái',  bank: 'Techcombank', owner: 'LE YEN NHI',       number: '9876543210', qr: '' }
  ],

  /* Nhạc nền. Để trống '' nếu không dùng. */
  music: '',

  /* Nơi nhận dữ liệu biểu mẫu (RSVP và lời chúc).
     Để null thì dữ liệu chỉ lưu trên trình duyệt của khách.
     Xem hướng dẫn nối Google Sheet trong README.md. */
  formEndpoint: null
};


/* ------------------------------------------------------------
   Tiện ích
   ------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bỏ qua */ }
  }
};


/* ------------------------------------------------------------
   Mở thiệp
   ------------------------------------------------------------ */
function initCover() {
  const cover = $('#cover');
  const card  = $('#card');
  const btn   = $('#openBtn');
  if (!cover || !card || !btn) return;

  btn.addEventListener('click', () => {
    card.hidden = false;
    cover.classList.add('is-open');
    document.body.classList.remove('is-locked');
    playMusic();
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth' }), 120);
  });
}


/* ------------------------------------------------------------
   Đếm ngược
   ------------------------------------------------------------ */
function initCountdown() {
  const root = $('#countdown');
  if (!root) return;

  const target = new Date(CONFIG.weddingDate).getTime();
  if (Number.isNaN(target)) return;

  const pad = n => String(n).padStart(2, '0');
  const cell = key => $(`[data-cd="${key}"]`, root);

  let timer = null;

  // Trả về true khi đã đến ngày cưới, để dừng bộ đếm.
  const tick = () => {
    const left = target - Date.now();
    if (left <= 0) {
      ['days', 'hours', 'mins', 'secs'].forEach(k => { cell(k).textContent = '00'; });
      if (timer !== null) clearInterval(timer);
      return true;
    }
    const s = Math.floor(left / 1000);
    cell('days').textContent  = pad(Math.floor(s / 86400));
    cell('hours').textContent = pad(Math.floor(s / 3600) % 24);
    cell('mins').textContent  = pad(Math.floor(s / 60) % 60);
    cell('secs').textContent  = pad(s % 60);
    return false;
  };

  if (!tick()) timer = setInterval(tick, 1000);
}


/* ------------------------------------------------------------
   Bản đồ
   ------------------------------------------------------------ */
function initMap() {
  const frame = $('#map');
  const link  = $('#mapLink');
  const q = encodeURIComponent(CONFIG.mapQuery);
  if (frame) frame.src = `https://maps.google.com/maps?q=${q}&hl=vi&z=16&output=embed`;
  if (link)  link.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
}


/* ------------------------------------------------------------
   Album + xem ảnh phóng to
   ------------------------------------------------------------ */
function initAlbum() {
  const grid = $('#album');
  const box  = $('#lightbox');
  const img  = $('#lightboxImg');
  if (!grid) return;

  CONFIG.album.forEach((src, i) => {
    const el = document.createElement('img');
    el.src = src;
    el.alt = `Ảnh cưới ${i + 1}`;
    el.loading = 'lazy';
    el.addEventListener('click', () => {
      img.src = src;
      img.alt = el.alt;
      box.classList.add('is-open');
    });
    grid.appendChild(el);
  });

  const close = () => box.classList.remove('is-open');
  $('#lightboxClose')?.addEventListener('click', close);
  box?.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}


/* ------------------------------------------------------------
   Mừng cưới
   ------------------------------------------------------------ */
function initGifts() {
  const wrap = $('#gifts');
  if (!wrap) return;

  CONFIG.banks.forEach(b => {
    const card = document.createElement('div');
    card.className = 'gift';
    card.innerHTML = `
      <h3>${b.side}</h3>
      ${b.qr ? `<img class="gift__qr" src="${b.qr}" alt="Mã QR ${b.bank}">` : ''}
      <p>${b.bank}</p>
      <p class="gift__acc">${b.number}</p>
      <p>${b.owner}</p>
      <button class="btn-copy" type="button">Sao chép số tài khoản</button>`;

    const btn = $('.btn-copy', card);
    btn.addEventListener('click', async () => {
      const done = () => { btn.textContent = 'Đã sao chép'; setTimeout(() => { btn.textContent = 'Sao chép số tài khoản'; }, 2000); };
      try {
        await navigator.clipboard.writeText(b.number);
        done();
      } catch {
        const t = document.createElement('textarea');
        t.value = b.number;
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); done(); } catch { btn.textContent = 'Không sao chép được'; }
        t.remove();
      }
    });

    wrap.appendChild(card);
  });
}


/* ------------------------------------------------------------
   Gửi biểu mẫu
   ------------------------------------------------------------ */
async function sendForm(type, data) {
  if (!CONFIG.formEndpoint) return { ok: false, offline: true };
  try {
    await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, ...data, at: new Date().toISOString() })
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function initRsvp() {
  const form = $('#rsvpForm');
  const note = $('#rsvpNote');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#rsvpName').value.trim();
    if (!name) { note.textContent = 'Vui lòng nhập họ và tên.'; return; }

    const data = {
      name,
      side:   $('#rsvpSide').value,
      attend: $('#rsvpAttend').value,
      guests: $('#rsvpCount').value
    };

    const btn = $('.btn-submit', form);
    btn.disabled = true;
    note.textContent = 'Đang gửi…';

    const res = await sendForm('rsvp', data);
    const saved = store.get('rsvp', []);
    saved.push(data);
    store.set('rsvp', saved);

    note.textContent = res.ok
      ? 'Cảm ơn bạn đã xác nhận!'
      : 'Đã ghi nhận xác nhận của bạn. Cảm ơn bạn rất nhiều!';
    form.reset();
    btn.disabled = false;
  });
}

function renderWishes() {
  const list = $('#wishList');
  if (!list) return;
  const wishes = store.get('wishes', []);
  list.innerHTML = wishes.length
    ? wishes.map(w => `
        <div class="wish">
          <p class="wish__name">${escapeHtml(w.name)}</p>
          <p class="wish__text">${escapeHtml(w.message)}</p>
        </div>`).join('')
    : '<p class="wishes__empty">Chưa có lời chúc nào. Hãy là người đầu tiên nhé!</p>';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initWishes() {
  const form = $('#wishForm');
  const note = $('#wishNote');
  if (!form) return;

  renderWishes();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = $('#wishName').value.trim();
    const message = $('#wishText').value.trim();
    if (!name || !message) { note.textContent = 'Vui lòng nhập tên và lời chúc.'; return; }

    const btn = $('.btn-submit', form);
    btn.disabled = true;
    note.textContent = 'Đang gửi…';

    await sendForm('wish', { name, message });
    const wishes = store.get('wishes', []);
    wishes.unshift({ name, message });
    store.set('wishes', wishes);

    renderWishes();
    note.textContent = 'Cảm ơn lời chúc của bạn!';
    form.reset();
    btn.disabled = false;
  });
}


/* ------------------------------------------------------------
   Đổi tông màu kem / đỏ
   ------------------------------------------------------------ */
function initTheme() {
  const saved = store.get('theme', null);
  if (saved) document.documentElement.dataset.theme = saved;

  $('#themeBtn')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'red' ? 'cream' : 'red';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
  });
}


/* ------------------------------------------------------------
   Nhạc nền
   ------------------------------------------------------------ */
function playMusic() {
  const audio = $('#bgm');
  if (!audio || !CONFIG.music) return;
  if (!audio.src) audio.src = CONFIG.music;
  audio.play().catch(() => { /* trình duyệt chặn tự phát — người dùng bấm nút */ });
}

function initMusic() {
  const audio = $('#bgm');
  const btn   = $('#musicBtn');
  if (!btn) return;

  if (!CONFIG.music) { btn.style.display = 'none'; return; }

  btn.addEventListener('click', () => {
    if (!audio.src) audio.src = CONFIG.music;
    if (audio.paused) { audio.play().catch(() => {}); btn.textContent = '♪'; }
    else { audio.pause(); btn.textContent = '♪̸'; }
  });
}


/* ------------------------------------------------------------
   Hiện dần khi cuộn
   ------------------------------------------------------------ */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}


/* ------------------------------------------------------------
   Khởi động
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCover();
  initCountdown();
  initMap();
  initAlbum();
  initGifts();
  initRsvp();
  initWishes();
  initMusic();
  initReveal();
});
