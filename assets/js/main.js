/* HTX Bình Nam — main.js (vanilla, no modules, works from file://) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceMQ.matches;
  reduceMQ.addEventListener && reduceMQ.addEventListener('change', function (e) { reduced = e.matches; });

  var header = $('#header');
  var headerH = function () { return header ? header.offsetHeight : 72; };

  /* ---------- Scroll lock + focus trap helpers ---------- */
  var lockCount = 0;
  function lockScroll() {
    if (lockCount++ === 0) {
      var sb = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = sb > 0 ? sb + 'px' : '';
      document.body.classList.add('is-locked');
    }
  }
  function unlockScroll() {
    if (--lockCount <= 0) {
      lockCount = 0;
      document.body.classList.remove('is-locked');
      document.body.style.paddingRight = '';
    }
  }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(root) {
    return $$(FOCUSABLE, root).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function trapKeys(e, root, extra) {
    if (e.key !== 'Tab') return;
    var list = focusables(root);
    if (extra) list = extra.concat(list);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement) && extra && extra.indexOf(document.activeElement) < 0)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Wave dividers (injected) ---------- */
  var WAVES = [
    'M0 60 C 240 0, 480 100, 720 50 S 1200 0, 1440 56 L1440 0 L0 0 Z',
    'M0 30 C 300 90, 520 0, 800 44 S 1260 90, 1440 20 L1440 0 L0 0 Z'
  ];
  $$('[data-wave]').forEach(function (sec, i) {
    var d = document.createElement('div');
    d.className = 'wave';
    d.setAttribute('aria-hidden', 'true');
    d.style.setProperty('--wave', sec.getAttribute('data-wave'));
    d.innerHTML = '<svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path d="' + WAVES[i % 2] + '"/></svg>';
    sec.insertBefore(d, sec.firstChild);
  });

  /* ---------- Reveal with stagger ---------- */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--d', (i * 60) + 'ms'); });
  });
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Counters ---------- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced) { el.textContent = target; return; }
    var dur = 1400, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Header, progress, scroll-spy, parallax, back-to-top ---------- */
  var progress = $('#progress');
  var toTop = $('#toTop');
  var hero = $('.hero');
  var navLinks = $$('[data-nav]');
  var spySections = $$('[data-spy]');
  var parallaxEls = $$('[data-parallax]');
  var ticking = false;

  function setActiveNav(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-nav') === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    header.classList.toggle('is-scrolled', y > 24);
    toTop.classList.toggle('is-show', y > 700);

    // scroll-spy
    var line = headerH() + window.innerHeight * 0.3, current = '';
    spySections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = s.getAttribute('data-spy');
    });
    setActiveNav(current);

    // parallax (transform only), only while hero in view
    if (!reduced && hero && y < hero.offsetHeight + 200) {
      parallaxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translate3d(0,' + (y * f * -1).toFixed(1) + 'px,0)';
      });
    }
    // timeline
    updateTimeline();
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

  /* ---------- Timeline draw ---------- */
  var timeline = $('#timeline'), tlFill = $('#tlFill');
  var tlSteps = $$('.tl-step');
  function updateTimeline() {
    if (!timeline) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    if (reduced) p = 1;
    tlFill.style.strokeDashoffset = (1 - p).toFixed(4);
    tlSteps.forEach(function (s) {
      var n = s.querySelector('.tl-node').getBoundingClientRect();
      s.classList.toggle('is-on', reduced || n.top + n.height / 2 < vh * 0.6);
    });
  }

  /* ---------- Hero slider ---------- */
  var slides = $$('.hero-slide');
  var dots = $$('.hero-dot');
  var themes = ['peanut', 'sesame'];
  var heroIdx = 0, heroTimer = null, heroUserPaused = false, heroHover = false, heroFocus = false;
  var heroCur = $('#heroCur'), heroPause = $('#heroPause'), prevBtn = $('#heroPrev'), nextBtn = $('#heroNext');

  function syncHeaderTone() {
    header.classList.toggle('on-dark', themes[heroIdx] === 'sesame');
  }
  function goSlide(n) {
    n = (n + slides.length) % slides.length;
    heroIdx = n;
    slides.forEach(function (s, i) {
      var on = i === n;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === n ? 'true' : 'false'); });
    hero.setAttribute('data-theme', themes[n]);
    heroCur.textContent = '0' + (n + 1);
    var other = (n + 1) % slides.length, prev = (n - 1 + slides.length) % slides.length;
    prevBtn.setAttribute('aria-label', 'Chuyển đến slide ' + (prev + 1));
    nextBtn.setAttribute('aria-label', 'Chuyển đến slide ' + (other + 1));
    syncHeaderTone();
  }
  function heroShouldRun() { return !reduced && !heroUserPaused && !heroHover && !heroFocus && !document.hidden; }
  function heroSchedule() {
    clearTimeout(heroTimer);
    if (heroShouldRun()) heroTimer = setTimeout(function () { goSlide(heroIdx + 1); heroSchedule(); }, 6500);
  }
  prevBtn.addEventListener('click', function () { goSlide(heroIdx - 1); heroSchedule(); });
  nextBtn.addEventListener('click', function () { goSlide(heroIdx + 1); heroSchedule(); });
  dots.forEach(function (d) { d.addEventListener('click', function () { goSlide(parseInt(d.getAttribute('data-slide'), 10)); heroSchedule(); }); });
  heroPause.addEventListener('click', function () {
    heroUserPaused = !heroUserPaused;
    heroPause.setAttribute('aria-label', heroUserPaused ? 'Tiếp tục slide' : 'Tạm dừng slide');
    heroPause.querySelector('use').setAttribute('href', heroUserPaused ? '#i-play' : '#i-pause');
    heroSchedule();
  });
  hero.addEventListener('mouseenter', function () { heroHover = true; heroSchedule(); });
  hero.addEventListener('mouseleave', function () { heroHover = false; heroSchedule(); });
  hero.addEventListener('focusin', function () { heroFocus = true; heroSchedule(); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) { heroFocus = false; heroSchedule(); } });
  document.addEventListener('visibilitychange', heroSchedule);
  hero.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, select, textarea')) return;
    if (e.key === 'ArrowLeft') { goSlide(heroIdx - 1); heroSchedule(); }
    else if (e.key === 'ArrowRight') { goSlide(heroIdx + 1); heroSchedule(); }
  });
  // swipe
  (function () {
    var stage = $('#heroStage'), sx = 0, sy = 0, tracking = false;
    stage.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; tracking = true; sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', function (e) {
      if (!tracking) return; tracking = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { goSlide(heroIdx + (dx < 0 ? 1 : -1)); heroSchedule(); }
    });
    stage.addEventListener('pointercancel', function () { tracking = false; });
  })();
  goSlide(0);
  heroSchedule();

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle'), menu = $('#mobileMenu');
  var menuReturn = null;
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    header.classList.toggle('menu-open', open);
    if (open) { lockScroll(); } else { unlockScroll(); }
    if (open) { menuReturn = menuBtn; var f = $('a', menu); setTimeout(function () { f && f.focus({ preventScroll: true }); }, 60); }
  }
  menu.setAttribute('inert', '');
  var menuOpen = false;
  function toggleMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    setMenu(open);
  }
  menuBtn.addEventListener('click', function () { toggleMenu(!menuOpen); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { toggleMenu(false); menuBtn.focus(); return; }
    trapKeys(e, menu, [menuBtn]);
  });
  window.matchMedia('(min-width: 961px)').addEventListener && window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches && menuOpen) toggleMenu(false); });

  /* ---------- Overlay (modal / lightbox) base ---------- */
  function Overlay(el, dialog, onClose) {
    var returnTo = null, isOpen = false;
    function keydown(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      trapKeys(e, dialog);
    }
    function open(trigger, focusEl) {
      if (isOpen) return;
      isOpen = true; returnTo = trigger || document.activeElement;
      el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
      lockScroll();
      document.addEventListener('keydown', keydown, true);
      setTimeout(function () { (focusEl || focusables(dialog)[0]).focus({ preventScroll: true }); }, 50);
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
      unlockScroll();
      document.removeEventListener('keydown', keydown, true);
      if (onClose) onClose();
      if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
    }
    $$('[data-close]', el).forEach(function (b) { b.addEventListener('click', close); });
    return { open: open, close: close, isOpen: function () { return isOpen; } };
  }
  $$('.overlay').forEach(function (o) { o.setAttribute('inert', ''); });
  function inertSync(el, open) { if (open) el.removeAttribute('inert'); else el.setAttribute('inert', ''); }

  /* ---------- Product filter ---------- */
  var tabs = $$('.filter-tab'), cards = $$('.product-card');
  function applyFilter(f, animate) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-filter') === f;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    cards.forEach(function (c) {
      var match = f === 'all' || c.getAttribute('data-line') === f;
      if (!animate || reduced) { c.hidden = !match; return; }
      if (match && c.hidden) {
        c.hidden = false; c.classList.add('is-entering');
        c.classList.add('is-in');
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove('is-entering'); }); });
      } else if (!match && !c.hidden) {
        c.classList.add('is-leaving');
        setTimeout(function () { c.hidden = true; c.classList.remove('is-leaving'); }, 280);
      }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { applyFilter(t.getAttribute('data-filter'), true); });
    t.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); tabs[j].focus(); applyFilter(tabs[j].getAttribute('data-filter'), true); }
    });
  });
  $$('[data-filter-link]').forEach(function (a) {
    a.addEventListener('click', function () { applyFilter(a.getAttribute('data-filter-link'), false); });
  });

  // tilt on hover (fine pointers only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach(function (c) {
      var m = $('.pc-media picture', c);
      if (!m) return;
      c.addEventListener('pointermove', function (e) {
        if (reduced) return;
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        m.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
        m.style.setProperty('--rx', (-py * 6).toFixed(2) + 'deg');
        m.style.setProperty('--sc', reduced ? 1 : 1.05);
      });
      c.addEventListener('pointerleave', function () {
        m.style.setProperty('--ry', '0deg'); m.style.setProperty('--rx', '0deg'); m.style.setProperty('--sc', 1);
      });
    });
  }

  /* ---------- Product modal ---------- */
  var P = {
    dp500: { line: 'dau-phong', img: 'dau-phong-500ml', w: 1280, h: 1170, w2: 1280, spec: '500 ml', name: 'Dầu đậu phộng Bình Nam 500 ml', tag: 'Gọn nhẹ, đủ cho bếp nhà.', desc: 'Chai 500 ml nhỏ gọn, dễ cầm và dễ bảo quản trong tủ bếp. Dầu được ép từ 100% hạt đậu phộng nguyên chất, màu vàng óng, hương béo bùi tự nhiên. Thích hợp để xào rau củ hằng ngày, trộn gỏi hay rưới lên món ăn trong bữa cơm gia đình.', fit: 'Gia đình nhỏ, bữa cơm hằng ngày', ing: '100% từ đậu phộng nguyên chất.', code: '8938535139037 · 500 ml', alt: 'Hai chai dầu đậu phộng Bình Nam 500 ml, mặt trước và mặt sau, đặt cạnh hạt đậu phộng', prod: 'Dầu đậu phộng 500 ml' },
    dp1l: { line: 'dau-phong', img: 'dau-phong-1l', w: 1280, h: 1170, w2: 1280, spec: '1 lít', name: 'Dầu đậu phộng Bình Nam 1 lít', tag: 'Đầy chai, cho bếp dùng đều tay.', desc: 'Chai 1 lít có dung tích vừa đủ cho bếp dùng thường xuyên. Dầu đậu phộng nguyên chất có màu vàng tươi, mùi thơm nhẹ, kết hợp tốt với nhiều món như xào, kho, rưới rau luộc. Chỉ cần mở nắp là có thể dùng ngay trong bữa ăn.', fit: 'Gia đình đông người, bếp nấu thường ngày', ing: '100% từ đậu phộng nguyên chất.', code: '8938535139006 · 1 lít (1.000 ml)', alt: 'Hai chai dầu đậu phộng Bình Nam 1 lít, mặt trước và mặt sau, màu vàng óng', prod: 'Dầu đậu phộng 1 lít' },
    dp5l: { line: 'dau-phong', img: 'dau-phong-5l', w: 853, h: 1280, w2: 853, fit_img: 'contain', spec: 'Can 5 lít', name: 'Dầu đậu phộng Bình Nam can 5 lít', tag: 'Đủ đầy cho bếp lớn.', desc: 'Can 5 lít dành cho bếp ăn và quán ăn cần lượng dầu lớn. Can có quai xách, dễ di chuyển trong bếp. Dầu được ép từ 100% hạt đậu phộng nguyên chất. Nhãn sản phẩm ghi rõ không chất bảo quản, không chất tạo màu, không chất tẩy trắng.', fit: 'Bếp ăn, quán ăn, nhà hàng nhỏ', ing: '100% từ đậu phộng nguyên chất.', code: '[Cập nhật mã vạch] · 5 lít (5.000 ml)', alt: 'Can dầu đậu phộng Bình Nam 5 lít có quai xách, nhãn xanh lá, bên cạnh hạt đậu phộng', prod: 'Dầu đậu phộng can 5 lít' },
    me250: { line: 'me-den', img: 'dau-me-den-250ml', w: 1280, h: 853, w2: 1280, spec: '250 ml', name: 'Dầu mè đen Bình Nam 250 ml', tag: 'Một chai nhỏ, thơm cả bữa.', desc: 'Chai 250 ml nhỏ gọn, vừa để làm quen với dầu mè đen, vừa tiện để sẵn trên bàn ăn. Dầu được ép từ 100% hạt mè đen nguyên chất, màu nâu hổ phách, hương mè thơm đậm. Chỉ cần vài giọt rưới lên cơm nóng, cháo hoặc rau trộn là bữa ăn đã đậm đà hơn.', fit: 'Gia đình nhỏ, người mới dùng dầu mè đen', ing: '100% từ mè đen nguyên chất.', code: '8938535139044 · 250 ml', alt: 'Hai chai dầu mè đen Bình Nam 250 ml, có nhãn ghi dầu mè đen 250ml', prod: 'Dầu mè đen 250 ml' },
    me500: { line: 'me-den', img: 'dau-me-den-500ml', w: 1280, h: 1170, w2: 1280, spec: '500 ml', name: 'Dầu mè đen Bình Nam 500 ml', tag: 'Hương mè đậm, dùng cả nhà.', desc: 'Chai 500 ml là lựa chọn cân bằng giữa gọn nhẹ và đủ dùng cho gia đình. Dầu ép từ 100% hạt mè đen nguyên chất, màu hổ phách óng, mùi thơm đặc trưng. Dùng để trộn gỏi, rưới cháo, chấm rau hay thêm vào món canh để đổi vị.', fit: 'Gia đình, bếp ăn cần dầu mè đen thường xuyên', ing: '100% từ mè đen nguyên chất.', code: '8938535139051 · 500 ml', alt: 'Hai chai dầu mè đen Bình Nam 500 ml màu nâu hổ phách, cạnh hạt mè đen và bát dầu', prod: 'Dầu mè đen 500 ml' }
  };
  var pmEl = $('#productModal'), pmDialog = $('#pmDialog');
  var pmCurrent = null;
  var pm = Overlay(pmEl, pmDialog, function () { inertSync(pmEl, false); });
  function openProduct(id, trigger) {
    var p = P[id]; if (!p) return;
    pmCurrent = p;
    pmDialog.setAttribute('data-line', p.line);
    pmDialog.setAttribute('data-fit', p.fit_img || 'cover');
    $('#pmMedia').innerHTML = '<picture><source type="image/webp" srcset="assets/img/' + p.img + '-800.webp 800w, assets/img/' + p.img + '-1600.webp ' + p.w2 + 'w" sizes="(min-width: 960px) 460px, 90vw"><img src="assets/img/' + p.img + '.jpg" width="' + p.w + '" height="' + p.h + '" alt="' + p.alt + '"></picture>';
    $('#pmSpec').textContent = p.spec;
    $('#pm-title').textContent = p.name;
    $('#pmTag').textContent = p.tag;
    $('#pmDesc').textContent = p.desc;
    $('#pmFor').textContent = p.fit;
    $('#pmIng').textContent = p.ing;
    $('#pmCode').textContent = p.code;
    inertSync(pmEl, true);
    pm.open(trigger, $('.modal-close', pmEl));
    pmDialog.scrollTop = 0;
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openProduct(b.getAttribute('data-open'), b); }); });
  // whole card clickable (mouse); keyboard uses the button
  cards.forEach(function (c) {
    c.addEventListener('click', function (e) {
      if (e.target.closest('button') || !c.getAttribute('data-id')) return;
      openProduct(c.getAttribute('data-id'), $('.pc-open', c));
    });
  });
  $('#pmOrder').addEventListener('click', function (e) {
    e.preventDefault();
    var sel = $('#f-product');
    if (pmCurrent && sel) sel.value = pmCurrent.prod;
    pmEl.setAttribute('inert', '');
    pm.close();
    var t = $('#lien-he');
    setTimeout(function () { t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 60);
  });

  /* ---------- Lightbox ---------- */
  var SETS = {
    ocop: [{ src: 'assets/img/chung-nhan-ocop.jpg', w: 950, h: 1336, title: 'Chứng nhận OCOP 3 sao', alt: 'Giấy chứng nhận OCOP 3 sao cho Dầu đậu phộng nguyên chất Bình Nam, UBND huyện Thăng Bình cấp ngày 11/12/2024' }],
    tsl: [
      { src: 'assets/img/kiem-nghiem-tsl-1.jpg', w: 930, h: 1280, title: 'Phiếu kiểm nghiệm TSL · Trang 1', alt: 'Trang 1 phiếu kết quả kiểm nghiệm của Trung tâm Kiểm nghiệm TSL, mẫu dầu lạc, bảng chỉ tiêu 1 đến 13' },
      { src: 'assets/img/kiem-nghiem-tsl-2.jpg', w: 920, h: 1280, title: 'Phiếu kiểm nghiệm TSL · Trang 2', alt: 'Trang 2 phiếu kết quả kiểm nghiệm TSL, bảng chỉ tiêu 14 đến 16' }
    ]
  };
  var lbEl = $('#lightbox'), lbDialog = $('#lbDialog'), lbImg = $('#lbImg'), lbStage = $('#lbStage');
  var lbSet = [], lbI = 0, zoomed = false;
  function setZoom(on, ev) {
    zoomed = on;
    lbImg.classList.toggle('is-zoomed', on);
    $('#lbZoom').setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) {
      lbImg.style.setProperty('--z', reduced ? 1.8 : 2.2);
      if (ev) moveOrigin(ev); else { lbImg.style.setProperty('--ox', '50%'); lbImg.style.setProperty('--oy', '30%'); }
    } else { lbImg.style.setProperty('--z', 1); }
  }
  function moveOrigin(e) {
    var r = lbImg.getBoundingClientRect();
    // r is the scaled rect; use stage rect for stable mapping
    var s = lbStage.getBoundingClientRect();
    var px = Math.max(0, Math.min(1, (e.clientX - s.left) / s.width));
    var py = Math.max(0, Math.min(1, (e.clientY - s.top) / s.height));
    lbImg.style.setProperty('--ox', (px * 100).toFixed(1) + '%');
    lbImg.style.setProperty('--oy', (py * 100).toFixed(1) + '%');
  }
  var lb = Overlay(lbEl, lbDialog, function () { setZoom(false); inertSync(lbEl, false); });
  function showLb(i, instant) {
    lbI = (i + lbSet.length) % lbSet.length;
    var it = lbSet[lbI];
    setZoom(false);
    function apply() {
      lbImg.src = it.src; lbImg.alt = it.alt; lbImg.width = it.w; lbImg.height = it.h;
      $('#lbTitle').textContent = it.title;
      $('#lbCap').textContent = it.alt + (lbSet.length > 1 ? ' (' + (lbI + 1) + '/' + lbSet.length + ')' : '');
      lbImg.classList.remove('is-swap');
    }
    if (instant || reduced) apply(); else { lbImg.classList.add('is-swap'); setTimeout(apply, 180); }
    var multi = lbSet.length > 1;
    $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
  }
  $$('[data-lightbox]').forEach(function (b) {
    b.addEventListener('click', function () {
      lbSet = SETS[b.getAttribute('data-lightbox')];
      inertSync(lbEl, true);
      showLb(parseInt(b.getAttribute('data-index') || '0', 10), true);
      lb.open(b, $('.icon-btn[data-close]', lbEl));
    });
  });
  $('#lbPrev').addEventListener('click', function () { showLb(lbI - 1); });
  $('#lbNext').addEventListener('click', function () { showLb(lbI + 1); });
  $('#lbZoom').addEventListener('click', function () { setZoom(!zoomed); });
  lbImg.addEventListener('click', function (e) { setZoom(!zoomed, e); });
  lbStage.addEventListener('pointermove', function (e) { if (zoomed) moveOrigin(e); });
  document.addEventListener('keydown', function (e) {
    if (!lb.isOpen() || lbSet.length < 2) return;
    if (e.key === 'ArrowLeft') showLb(lbI - 1); else if (e.key === 'ArrowRight') showLb(lbI + 1);
  });

  /* ---------- Lab table expand ---------- */
  var lab = $('#lab'), labBtn = $('#labToggle'), labTxt = $('#labToggleText');
  labBtn.addEventListener('click', function () {
    var open = !lab.classList.contains('is-expanded');
    lab.classList.toggle('is-expanded', open);
    labBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    labTxt.textContent = open ? 'Thu gọn' : 'Xem đầy đủ 16 chỉ tiêu';
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      item.classList.toggle('is-open', open);
    });
  });

  /* ---------- Contact form ---------- */
  var form = $('#orderForm'), card = $('#formCard'), success = $('#formSuccess');
  var MSG = {
    name: 'Vui lòng nhập họ và tên.',
    phoneEmpty: 'Vui lòng nhập số điện thoại.',
    phoneBad: 'Số điện thoại chưa đúng. Vui lòng kiểm tra lại.',
    product: 'Vui lòng chọn sản phẩm quan tâm.'
  };
  var PHONE_RE = /^(?:\+?84|0)[235789]\d{8}$/;
  function validateField(name) {
    var f = $('[data-field="' + name + '"]', form);
    var input = $('input, select', f), err = $('.field-error', f), v = input.value.trim(), msg = '';
    if (name === 'name' && !v) msg = MSG.name;
    if (name === 'phone') {
      if (!v) msg = MSG.phoneEmpty;
      else if (!PHONE_RE.test(v.replace(/[\s.\-()]/g, ''))) msg = MSG.phoneBad;
    }
    if (name === 'product' && !v) msg = MSG.product;
    f.classList.toggle('has-error', !!msg);
    err.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }
  ['name', 'phone', 'product'].forEach(function (n) {
    var f = $('[data-field="' + n + '"]', form), input = $('input, select', f);
    input.addEventListener('blur', function () { if (input.value || f.classList.contains('has-error')) validateField(n); });
    input.addEventListener('input', function () { if (f.classList.contains('has-error')) validateField(n); });
    input.addEventListener('change', function () { if (f.classList.contains('has-error')) validateField(n); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    ['name', 'phone', 'product'].forEach(function (n) {
      if (!validateField(n) && !first) first = $('input, select', $('[data-field="' + n + '"]', form));
    });
    if (first) { first.focus(); return; }
    // No backend: show on-page success state.
    card.classList.add('is-sent');
    success.classList.add('is-show');
    success.focus({ preventScroll: true });
  });
  $('#formReset').addEventListener('click', function () {
    form.reset();
    card.classList.remove('is-sent'); success.classList.remove('is-show');
    $('#f-name').focus();
  });

  /* ---------- FAB visibility ---------- */
  (function () {
    var seen = {};
    function upd() { document.body.classList.toggle('fab-away', !!(seen.contact || seen.footer)); }
    if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { seen[e.target.id === 'lien-he' ? 'contact' : 'footer'] = e.isIntersecting; });
        upd();
      });
      var a = $('#lien-he'), b = $('#footer');
      a && fio.observe(a); b && fio.observe(b);
    }
    function ui() {
      var open = menuOpen || $$('.overlay').some(function (o) { return o.classList.contains('is-open'); });
      document.body.classList.toggle('ui-open', open);
    }
    new MutationObserver(ui).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  })();

  /* ---------- Reveal safety net ---------- */
  function revealAbove() {
    var y = window.innerHeight * 0.9;
    revealEls.forEach(function (el) { if (el.getBoundingClientRect().top < y) el.classList.add('is-in'); });
  }
  window.addEventListener('hashchange', function () { setTimeout(revealAbove, 900); });
  window.addEventListener('load', function () { setTimeout(revealAbove, 4000); });

  /* ---------- Init ---------- */
  onScroll();
  window.addEventListener('load', onScroll);
})();
