/* ============================================================
   Thiệp cưới online — phần điều khiển
   Sửa thông tin đám cưới ở đối tượng CONFIG bên dưới.

   Thiệp có hai thứ tiếng. Chữ tiếng Việt nằm trong index.html, bản tiếng
   Anh nằm ngay cạnh trong thuộc tính data-en (và data-en-placeholder,
   data-en-title) — xem hàm setLang. Chữ do mã sinh ra (lịch, đếm ngược,
   hộp quà, lời nhắn của biểu mẫu) lấy trong bảng T; tên sự kiện tiếng
   Anh nằm ở CONFIG.events[].en.
   ============================================================ */

const CONFIG = {

  /* Các sự kiện, theo hai file PDF (TP.HCM v1.1 và Hà Nội v1.1.2).
     Định dạng giờ: "YYYY-MM-DDTHH:mm:ss+07:00" (giờ Việt Nam).
     - map:       địa chỉ tra trên Google Maps cho nút "Chỉ đường"
     - end:       giờ kết thúc, chỉ dùng cho nút "Thêm vào lịch" (bỏ trống = +2 giờ)
     - countdown: true thì đồng hồ đếm ngược tới sự kiện này
     - city:      tên hiện dưới ngày được khoanh tim trên lịch
     - name:      tên sự kiện, hiện ở đồng hồ đếm ngược
     - title:     tên khi khách bấm "Thêm vào lịch"
     - en:        bản tiếng Anh của name / title / city */
  events: [
    { id: 'sg-party', name: 'Lễ Vu Quy', title: 'Lễ Vu Quy — Duy Lâm & Yến Nhi', city: 'TP.HCM', countdown: true,
      en: { name: 'Vu Quy Ceremony', title: 'Vu Quy Ceremony — Duy Lam & Yen Nhi', city: 'HCMC' },
      start: '2026-11-28T18:00:00+07:00', end: '2026-11-28T21:30:00+07:00',
      place: 'Trung tâm Hội nghị Tiệc cưới Asiana Plaza',
      address: '284 – 286 Vườn Lài, Phường Phú Thọ Hòa, Quận Tân Phú, Thành phố Hồ Chí Minh',
      map: 'Trung tâm Hội nghị Tiệc cưới Asiana Plaza, 284 Vườn Lài, Phú Thọ Hòa, Tân Phú, Thành phố Hồ Chí Minh' },

    { id: 'hn-party', name: 'Lễ Thành Hôn', title: 'Lễ Thành Hôn — Duy Lâm & Yến Nhi', city: 'Hà Nội', countdown: true,
      en: { name: 'Thanh Hon Ceremony', title: 'Thanh Hon Ceremony — Duy Lam & Yen Nhi', city: 'Hanoi' },
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
     qr: đường dẫn ảnh QR (để trống '' nếu chưa có).
     sideEn: tên bên, hiện khi khách xem bản tiếng Anh. */
  banks: [
    { side: 'Chú rể', sideEn: 'Groom', bank: '', owner: 'PHAM DUY LAM',     number: '', qr: '' },
    { side: 'Cô dâu', sideEn: 'Bride', bank: '', owner: 'LE HUYNH YEN NHI', number: '', qr: '' }
  ],

  /* Nhạc nền. Để trống '' nếu không dùng. */
  music: '',

  /* Nơi nhận dữ liệu biểu mẫu xác nhận tham dự (RSVP).
     Để null thì dữ liệu chỉ lưu trên trình duyệt của khách.
     Xem hướng dẫn nối Google Sheet trong README.md. */
  formEndpoint: 'https://script.google.com/macros/s/AKfycbxZojclFNNfE6eqSUFf1hDVFlZOxMsojwYRP0M2ZT6oI-wZ6qA_nNBK3qAaAYkoBtP2/exec'
};


/* ------------------------------------------------------------
   Chữ do mã sinh ra, theo từng thứ tiếng
   ------------------------------------------------------------ */
const T = {
  vi: {
    title: 'Duy Lâm & Yến Nhi — Thiệp cưới',
    weekdays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    month: m => `Tháng ${m}`,
    left: 'Còn lại đến',
    ended: 'Cảm ơn quý khách đã đến chung vui!',
    copy: 'Sao chép số tài khoản',
    copied: 'Đã sao chép',
    copyFail: 'Không sao chép được',
    qrAlt: 'Mã QR',
    albumAlt: 'Ảnh cưới',
    sending: 'Đang gửi…',
    needName: 'Vui lòng nhập họ và tên.',
    rsvpOk: 'Cảm ơn bạn đã xác nhận!',
    rsvpLocal: 'Đã ghi nhận xác nhận của bạn. Cảm ơn bạn rất nhiều!',
    calDetails: 'Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi.'
  },
  en: {
    title: 'Duy Lâm & Yến Nhi — Wedding Invitation',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: m => ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                 'August', 'September', 'October', 'November', 'December'][m - 1],
    left: 'Time left until',
    ended: 'Thank you for celebrating with us!',
    copy: 'Copy account number',
    copied: 'Copied',
    copyFail: 'Could not copy',
    qrAlt: 'QR code',
    albumAlt: 'Wedding photo',
    sending: 'Sending…',
    needName: 'Please enter your full name.',
    rsvpOk: 'Thank you for confirming!',
    rsvpLocal: 'Your RSVP has been saved. Thank you very much!',
    calDetails: 'We would be honoured to have you celebrate with us.'
  }
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
   Thứ tiếng — 'vi' (mặc định) hoặc 'en'
   ------------------------------------------------------------ */
let LANG = 'vi';

const t       = key => (LANG === 'en' ? T.en : T.vi)[key];
const evName  = ev => (LANG === 'en' && ev.en && ev.en.name)  || ev.name;
const evCity  = ev => (LANG === 'en' && ev.en && ev.en.city)  || ev.city;
const evTitle = ev => (LANG === 'en' && ev.en && ev.en.title) || ev.title;

// Giữ bản tiếng Việt gốc để đổi qua đổi lại được
const viHtml = new Map();
const viAttr = new Map();

function setLang(lang) {
  LANG = lang === 'en' ? 'en' : 'vi';
  document.documentElement.lang = LANG;
  document.documentElement.dataset.lang = LANG;

  $$('[data-en]').forEach(el => {
    if (!viHtml.has(el)) viHtml.set(el, el.innerHTML);
    el.innerHTML = LANG === 'en' ? el.dataset.en : viHtml.get(el);
  });

  $$('[data-en-placeholder]').forEach(el => {
    if (!viAttr.has(el)) viAttr.set(el, el.placeholder);
    el.placeholder = LANG === 'en' ? el.dataset.enPlaceholder : viAttr.get(el);
  });

  $$('[data-en-title]').forEach(el => {
    if (!viAttr.has(el)) viAttr.set(el, el.title);
    el.title = LANG === 'en' ? el.dataset.enTitle : viAttr.get(el);
    el.setAttribute('aria-label', el.title);
  });

  document.title = t('title');

  // Vẽ lại những phần do mã sinh ra
  initEventLinks();
  initCalendars();
  initCountdown();
  renderAlbum();
  renderGifts();
}


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
   Mở thiệp — "Mở thiệp" mở bản tiếng Việt, "Open" mở bản tiếng Anh
   ------------------------------------------------------------ */
function initCover() {
  const cover = $('#cover');
  const card  = $('#card');
  const btns  = $$('[data-open-lang]');
  if (!cover || !card || !btns.length) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    setLang(btn.dataset.openLang);
    card.hidden = false;
    cover.classList.add('is-open');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    playMusic();
  }));
}


/* ------------------------------------------------------------
   Nút "Chỉ đường" và "Thêm vào lịch" trên từng thẻ mời
   ------------------------------------------------------------ */
function calendarUrl(ev) {
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(ev.start);
  const end   = ev.end ? new Date(ev.end) : new Date(start.getTime() + 2 * 3600e3);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: evTitle(ev),
    dates: `${stamp(start)}/${stamp(end)}`,
    location: `${ev.place}, ${ev.address}`,
    details: t('calDetails')
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

  // Gom sự kiện theo tháng: { "2026-11": { 28: <sự kiện> } }
  const months = {};
  CONFIG.events.forEach(ev => {
    const { y, m, d } = ymd(ev.start);
    const key = `${y}-${pad2(m)}`;
    (months[key] ||= {})[d] = ev;
  });

  wrap.innerHTML = Object.keys(months).sort().map(key => {
    const [y, m] = key.split('-').map(Number);
    const marks = months[key];
    const first = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;   // thứ Hai = 0
    const days  = new Date(Date.UTC(y, m, 0)).getUTCDate();

    let cells = '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) {
      cells += marks[d]
        ? `<span class="cal__day is-marked" title="${evCity(marks[d])}"><b>${d}</b></span>`
        : `<span class="cal__day">${d}</span>`;
    }
    const labels = Object.entries(marks)
      .map(([d, ev]) => `<p class="cal__note"><b>${pad2(d)} . ${pad2(m)}</b> ${evCity(ev)}</p>`).join('');

    return `
      <div class="cal">
        <p class="cal__head">${t('month')(m)}<small>${y}</small></p>
        <div class="cal__grid">
          ${t('weekdays').map(w => `<span class="cal__wd">${w}</span>`).join('')}
          ${cells}
        </div>
        ${labels}
      </div>`;
  }).join('');
}


/* ------------------------------------------------------------
   Đếm ngược — tới sự kiện gần nhất chưa diễn ra
   ------------------------------------------------------------ */
let cdTimer = null;

function initCountdown() {
  const root  = $('#countdown');
  const label = $('#countdownLabel');
  if (!root) return;

  // Gọi lại khi đổi thứ tiếng, nên phải dừng đồng hồ cũ
  if (cdTimer !== null) { clearInterval(cdTimer); cdTimer = null; }

  const targets = CONFIG.events
    .filter(ev => ev.countdown)
    .map(ev => ({ ev, t: new Date(ev.start).getTime() }))
    .filter(x => !Number.isNaN(x.t))
    .sort((a, b) => a.t - b.t);
  if (!targets.length) return;

  const cell = key => $(`[data-cd="${key}"]`, root);
  let current = null;

  const tick = () => {
    const now  = Date.now();
    const next = targets.find(x => x.t > now);

    if (!next) {
      ['days', 'hours', 'mins', 'secs'].forEach(k => { cell(k).textContent = '00'; });
      if (label) label.textContent = t('ended');
      if (cdTimer !== null) { clearInterval(cdTimer); cdTimer = null; }
      return true;
    }

    if (next !== current && label) {
      const { d, m } = ymd(next.ev.start);
      label.innerHTML = `${t('left')} <b>${evName(next.ev)}</b> · ${evCity(next.ev)} · ${pad2(d)} . ${pad2(m)}`;
      current = next;
    }

    const s = Math.floor((next.t - now) / 1000);
    cell('days').textContent  = pad2(Math.floor(s / 86400));
    cell('hours').textContent = pad2(Math.floor(s / 3600) % 24);
    cell('mins').textContent  = pad2(Math.floor(s / 60) % 60);
    cell('secs').textContent  = pad2(s % 60);
    return false;
  };

  if (!tick()) cdTimer = setInterval(tick, 1000);
}


/* ------------------------------------------------------------
   Album + xem ảnh phóng to
   ------------------------------------------------------------ */
function renderAlbum() {
  const grid    = $('#album');
  const section = $('#albumSection');
  const box     = $('#lightbox');
  const img     = $('#lightboxImg');
  if (!grid) return;

  // Chưa có ảnh thì ẩn hẳn mục Album thay vì để một ô trống
  if (!CONFIG.album.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;

  grid.innerHTML = '';
  CONFIG.album.forEach((src, i) => {
    const el = document.createElement('img');
    el.src = src;
    el.alt = `${t('albumAlt')} ${i + 1}`;
    el.loading = 'lazy';
    el.addEventListener('click', () => {
      img.src = src;
      img.alt = el.alt;
      box.classList.add('is-open');
    });
    grid.appendChild(el);
  });
}

function initAlbum() {
  const box = $('#lightbox');
  renderAlbum();

  const close = () => box?.classList.remove('is-open');
  $('#lightboxClose')?.addEventListener('click', close);
  box?.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}


/* ------------------------------------------------------------
   Hộp quà mừng — bấm hộp quà để hiện số tài khoản
   ------------------------------------------------------------ */
function renderGifts() {
  const section = $('#giftSection');
  const wrap    = $('#gifts');
  if (!section || !wrap) return;

  const banks = CONFIG.banks.filter(b => b.number);
  section.hidden = !banks.length;
  if (!banks.length) return;

  wrap.innerHTML = '';
  banks.forEach(b => {
    const card = document.createElement('div');
    card.className = 'gift';
    card.innerHTML = `
      <h3>${LANG === 'en' && b.sideEn ? b.sideEn : b.side}</h3>
      ${b.qr ? `<img class="gift__qr" src="${b.qr}" alt="${t('qrAlt')} ${b.bank}">` : ''}
      <p>${b.bank}</p>
      <p class="gift__acc">${b.number}</p>
      <p>${b.owner}</p>
      <button class="btn-copy" type="button">${t('copy')}</button>`;

    const btn = $('.btn-copy', card);
    btn.addEventListener('click', async () => {
      const done = () => { btn.textContent = t('copied'); setTimeout(() => { btn.textContent = t('copy'); }, 2000); };
      try {
        await navigator.clipboard.writeText(b.number);
        done();
      } catch {
        const ta = document.createElement('textarea');
        ta.value = b.number;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch { btn.textContent = t('copyFail'); }
        ta.remove();
      }
    });

    wrap.appendChild(card);
  });
}

function initGifts() {
  const wrap   = $('#gifts');
  const toggle = $('#giftToggle');
  renderGifts();

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    if (wrap) wrap.hidden = !open;
  });
}


/* ------------------------------------------------------------
   Gửi biểu mẫu
   ------------------------------------------------------------ */
async function sendForm(type, data) {
  if (!CONFIG.formEndpoint) return { ok: false, offline: true };
  try {
    // Content-Type: text/plain để trình duyệt gửi thẳng, không phải hỏi trước
    // (Apps Script không trả lời câu hỏi preflight). Bản web app của Apps Script
    // có gắn Access-Control-Allow-Origin: * nên đọc được kết quả — nhờ vậy biết
    // được là gửi hỏng thật hay không, thay vì lúc nào cũng báo thành công.
    const res = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, ...data, at: new Date().toISOString() })
    });
    return { ok: res.ok };
  } catch (err) {
    console.warn('Không gửi được dữ liệu biểu mẫu:', err);
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
    if (!name) { note.textContent = t('needName'); return; }

    const data = {
      name,
      side:   $('#rsvpSide').value,
      attend: $('#rsvpAttend').value,
      guests: $('#rsvpCount').value
    };

    const btn = $('.btn-submit', form);
    btn.disabled = true;
    note.textContent = t('sending');

    const res = await sendForm('rsvp', data);
    const saved = store.get('rsvp', []);
    saved.push(data);
    store.set('rsvp', saved);

    note.textContent = res.ok ? t('rsvpOk') : t('rsvpLocal');
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
