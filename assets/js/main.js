/* ============================================================
   Thiệp cưới online — phần điều khiển
   Sửa thông tin đám cưới ở đối tượng CONFIG bên dưới.
   ============================================================ */

const CONFIG = {

  /* Các sự kiện, theo hai file PDF (TP.HCM v1.1 và Hà Nội v1.1.2).
     Định dạng giờ: "YYYY-MM-DDTHH:mm:ss+07:00" (giờ Việt Nam).
     - map:       địa chỉ tra trên Google Maps cho nút "Chỉ đường"
     - end:       giờ kết thúc, chỉ dùng cho nút "Thêm vào lịch" (bỏ trống = +2 giờ)
     - countdown: true thì đồng hồ đếm ngược tới sự kiện này
     - city:      tên hiện dưới ngày được khoanh tim trên lịch */
  events: [
    { id: 'sg-party', title: 'Tiệc cưới Duy Lâm & Yến Nhi — TP. Hồ Chí Minh', city: 'TP.HCM', countdown: true,
      start: '2026-11-28T18:00:00+07:00', end: '2026-11-28T21:30:00+07:00',
      place: 'Trung tâm Hội nghị Tiệc cưới Asiana Plaza',
      address: '284 – 286 Vườn Lài, Phường Phú Thọ Hòa, Quận Tân Phú, Thành phố Hồ Chí Minh',
      map: 'Trung tâm Hội nghị Tiệc cưới Asiana Plaza, 284 Vườn Lài, Phú Thọ Hòa, Tân Phú, Thành phố Hồ Chí Minh' },

    { id: 'hn-party', title: 'Tiệc cưới Duy Lâm & Yến Nhi — Hà Nội', city: 'Hà Nội', countdown: true,
      start: '2026-12-10T12:00:00+07:00',
      place: 'Nhà văn hoá thôn Mai Hiên',
      address: 'Thôn Mai Hiên, xã Mai Lâm, huyện Đông Anh, Hà Nội',
      map: 'Nhà văn hoá thôn Mai Hiên, Mai Lâm, Đông Anh, Hà Nội' }
  ],

  /* Ảnh album. Bỏ ảnh cưới vào images/album/ rồi liệt kê ở đây,
     ví dụ 'images/album/01.jpg'. Để mảng rỗng thì mục Album tự ẩn đi. */
  album: [],

  /* Tài khoản mừng cưới. Chưa điền số tài khoản (number: '') thì
     cả mục "Hộp quà mừng" tự ẩn, khách sẽ không thấy số giả.
     qr: đường dẫn ảnh QR (để trống '' nếu chưa có). */
  banks: [
    { side: 'Chú rể', bank: '', owner: 'PHAM DUY LAM',     number: '', qr: '' },
    { side: 'Cô dâu', bank: '', owner: 'LE HUYNH YEN NHI', number: '', qr: '' }
  ],

  /* Nhạc nền. Để trống '' nếu không dùng. */
  music: '',

  /* Nơi nhận dữ liệu biểu mẫu xác nhận tham dự (RSVP).
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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const eventById = id => CONFIG.events.find(e => e.id === id);

// Lấy ngày/tháng/năm theo giờ Việt Nam thẳng từ chuỗi, không phụ thuộc
// múi giờ của máy khách.
const ymd = iso => ({ y: +iso.slice(0, 4), m: +iso.slice(5, 7), d: +iso.slice(8, 10) });
const pad2 = n => String(n).padStart(2, '0');


/* ------------------------------------------------------------
   Tim bay trên nền đỏ
   ------------------------------------------------------------ */
function initHearts() {
  const box = $('#hearts');
  if (!box || reduceMotion) return;
  const tints = ['#e9ce9e', '#c9a24a', '#b8434e', '#f3e8de'];
  for (let i = 0; i < 16; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.style.setProperty('--x', `${Math.random() * 100}%`);
    h.style.setProperty('--s', `${10 + Math.random() * 16}px`);
    h.style.setProperty('--c', tints[i % tints.length]);
    h.style.setProperty('--o', (0.25 + Math.random() * 0.4).toFixed(2));
    h.style.setProperty('--d', `${11 + Math.random() * 10}s`);
    h.style.setProperty('--delay', `${-Math.random() * 20}s`);
    box.appendChild(h);
  }
}


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
    window.scrollTo(0, 0);
    playMusic();
  });
}


/* ------------------------------------------------------------
   Nút "Chỉ đường" và "Thêm vào lịch" trên từng thẻ tiệc
   ------------------------------------------------------------ */
function calendarUrl(ev) {
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(ev.start);
  const end   = ev.end ? new Date(ev.end) : new Date(start.getTime() + 2 * 3600e3);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: `${ev.place}, ${ev.address}`,
    details: 'Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi.'
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function initEventLinks() {
  $$('[data-map]').forEach(a => {
    const ev = eventById(a.dataset.map);
    if (!ev) return;
    const q = encodeURIComponent(ev.map || `${ev.place}, ${ev.address}`);
    a.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  });
  $$('[data-cal]').forEach(a => {
    const ev = eventById(a.dataset.cal);
    if (ev) a.href = calendarUrl(ev);
  });
}


/* ------------------------------------------------------------
   Lịch tháng — mỗi tháng có sự kiện một tờ lịch, ngày cưới khoanh tim
   ------------------------------------------------------------ */
function initCalendars() {
  const wrap = $('#calendars');
  if (!wrap) return;

  // Gom ngày có sự kiện theo tháng: { "2026-11": { 28: "TP.HCM" } }
  const months = {};
  CONFIG.events.forEach(ev => {
    const { y, m, d } = ymd(ev.start);
    const key = `${y}-${pad2(m)}`;
    (months[key] ||= {})[d] = ev.city;
  });

  wrap.innerHTML = Object.keys(months).sort().map(key => {
    const [y, m] = key.split('-').map(Number);
    const marks = months[key];
    const first = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;   // thứ Hai = 0
    const days  = new Date(Date.UTC(y, m, 0)).getUTCDate();

    let cells = '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) {
      cells += marks[d]
        ? `<span class="cal__day is-marked" title="${marks[d]}"><b>${d}</b></span>`
        : `<span class="cal__day">${d}</span>`;
    }
    const labels = Object.entries(marks)
      .map(([d, city]) => `<p class="cal__note"><b>${pad2(d)} . ${pad2(m)}</b> ${city}</p>`).join('');

    return `
      <div class="cal">
        <p class="cal__head">Tháng ${m}<small>${y}</small></p>
        <div class="cal__grid">
          ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(w => `<span class="cal__wd">${w}</span>`).join('')}
          ${cells}
        </div>
        ${labels}
      </div>`;
  }).join('');
}


/* ------------------------------------------------------------
   Đếm ngược — tới buổi tiệc gần nhất chưa diễn ra
   ------------------------------------------------------------ */
function initCountdown() {
  const root  = $('#countdown');
  const label = $('#countdownLabel');
  if (!root) return;

  const targets = CONFIG.events
    .filter(ev => ev.countdown)
    .map(ev => ({ ev, t: new Date(ev.start).getTime() }))
    .filter(x => !Number.isNaN(x.t))
    .sort((a, b) => a.t - b.t);
  if (!targets.length) return;

  const cell = key => $(`[data-cd="${key}"]`, root);
  let timer = null;
  let current = null;

  const tick = () => {
    const now  = Date.now();
    const next = targets.find(x => x.t > now);

    if (!next) {
      ['days', 'hours', 'mins', 'secs'].forEach(k => { cell(k).textContent = '00'; });
      if (label) label.textContent = 'Cảm ơn quý khách đã đến chung vui!';
      if (timer !== null) clearInterval(timer);
      return true;
    }

    if (next !== current && label) {
      const { d, m } = ymd(next.ev.start);
      label.innerHTML = `Còn lại đến tiệc cưới <b>${next.ev.city}</b> · ${pad2(d)} . ${pad2(m)}`;
      current = next;
    }

    const s = Math.floor((next.t - now) / 1000);
    cell('days').textContent  = pad2(Math.floor(s / 86400));
    cell('hours').textContent = pad2(Math.floor(s / 3600) % 24);
    cell('mins').textContent  = pad2(Math.floor(s / 60) % 60);
    cell('secs').textContent  = pad2(s % 60);
    return false;
  };

  if (!tick()) timer = setInterval(tick, 1000);
}


/* ------------------------------------------------------------
   Album + xem ảnh phóng to
   ------------------------------------------------------------ */
function initAlbum() {
  const grid = $('#album');
  const box  = $('#lightbox');
  const img  = $('#lightboxImg');
  if (!grid) return;

  // Chưa có ảnh thì ẩn hẳn mục Album thay vì để một ô trống
  const section = $('#albumSection');
  if (!CONFIG.album.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;

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
   Hộp quà mừng — bấm hộp quà để hiện số tài khoản
   ------------------------------------------------------------ */
function initGifts() {
  const section = $('#giftSection');
  const wrap    = $('#gifts');
  const toggle  = $('#giftToggle');
  if (!section || !wrap) return;

  const banks = CONFIG.banks.filter(b => b.number);
  section.hidden = !banks.length;
  if (!banks.length) return;

  wrap.innerHTML = '';
  banks.forEach(b => {
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

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    wrap.hidden = !open;
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
  initHearts();
  initCover();
  initEventLinks();
  initCalendars();
  initCountdown();
  initAlbum();
  initGifts();
  initRsvp();
  initMusic();
  initReveal();
});
