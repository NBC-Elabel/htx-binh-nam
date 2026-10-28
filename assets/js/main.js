/* HTX Bình Nam — main.js (vanilla, no modules, works from file://) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceMQ.matches;
  reduceMQ.addEventListener && reduceMQ.addEventListener('change', function (e) { reduced = e.matches; });

  var ROOT = document.body.getAttribute('data-root') || '';
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
  var parallaxEls = $$('[data-parallax]');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    header.classList.toggle('is-scrolled', y > 24);
    toTop.classList.toggle('is-show', y > 700);


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

  /* ---------- Hero slider (home only) ---------- */
  if (hero) {
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
  }

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

  /* ---------- Filter tabs (products / posts) ---------- */
  var tabs = $$('.filter-tab'), cards = $$('[data-filterable]');
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
  if (tabs.length) {
    var qf = new URLSearchParams(location.search).get('loai');
    if (qf && tabs.some(function (t) { return t.getAttribute('data-filter') === qf; })) applyFilter(qf, false);
  }

  // tilt on hover (fine pointers only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.product-card').forEach(function (c) {
      var m = $('.pc-media picture', c);
      if (!m) return;
      c.addEventListener('pointermove', function (e) {
        if (reduced) return;
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        m.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
        m.style.setProperty('--rx', (-py * 6).toFixed(2) + 'deg');
        m.style.setProperty('--sc', 1.05);
      });
      c.addEventListener('pointerleave', function () {
        m.style.setProperty('--ry', '0deg'); m.style.setProperty('--rx', '0deg'); m.style.setProperty('--sc', 1);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  if ($('#lightbox')) {
  var SETS = {
    ocop: [{ src: ROOT + 'assets/img/chung-nhan-ocop.jpg', w: 950, h: 1336, title: 'Chứng nhận OCOP 3 sao', alt: 'Giấy chứng nhận OCOP 3 sao cho dầu đậu phộng nguyên chất Bình Nam, UBND huyện Thăng Bình cấp ngày 11/12/2024' }],
    tsl: [
      { src: ROOT + 'assets/img/kiem-nghiem-tsl-1.jpg', w: 930, h: 1280, title: 'Phiếu kiểm nghiệm TSL · Trang 1', alt: 'Trang 1 phiếu kết quả kiểm nghiệm của Trung tâm Kiểm nghiệm TSL, mẫu dầu lạc, bảng chỉ tiêu 1 đến 13' },
      { src: ROOT + 'assets/img/kiem-nghiem-tsl-2.jpg', w: 920, h: 1280, title: 'Phiếu kiểm nghiệm TSL · Trang 2', alt: 'Trang 2 phiếu kết quả kiểm nghiệm TSL, bảng chỉ tiêu 14 đến 16' }
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
      var g = b.getAttribute('data-lightbox');
      lbSet = SETS[g] || [{ src: b.getAttribute('data-src') ? ROOT + b.getAttribute('data-src') : '', w: parseInt(b.getAttribute('data-w'), 10), h: parseInt(b.getAttribute('data-h'), 10), title: b.getAttribute('data-title') || '', alt: b.getAttribute('data-alt') || '' }];
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
  }

  /* ---------- Lab table expand ---------- */
  if ($('#labToggle')) {
  var lab = $('#lab'), labBtn = $('#labToggle'), labTxt = $('#labToggleText');
  labBtn.addEventListener('click', function () {
    var open = !lab.classList.contains('is-expanded');
    lab.classList.toggle('is-expanded', open);
    labBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    labTxt.textContent = open ? 'Thu gọn' : 'Xem đầy đủ 16 chỉ tiêu';
  });
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      item.classList.toggle('is-open', open);
    });
  });

  /* ---------- Contact form (lien-he page only) ---------- */
  if ($('#orderForm')) {
  var form = $('#orderForm'), card = $('#formCard'), success = $('#formSuccess');
  var MSG = {
    name: 'Vui lòng nhập họ và tên.',
    phoneEmpty: 'Vui lòng nhập số điện thoại.',
    phoneBad: 'Số điện thoại chưa đúng. Vui lòng kiểm tra lại.',
    picker: 'Vui lòng chọn ít nhất 1 sản phẩm hoặc chọn “Tôi cần tư vấn thêm”.'
  };
  var PHONE_RE = /^(?:\+?84|0)[235789]\d{8}$/;
  function validateField(name) {
    var f = $('[data-field="' + name + '"]', form);
    var input = $('input', f), err = $('.field-error', f), v = input.value.trim(), msg = '';
    if (name === 'name' && !v) msg = MSG.name;
    if (name === 'phone') {
      if (!v) msg = MSG.phoneEmpty;
      else if (!PHONE_RE.test(v.replace(/[\s.\-()]/g, ''))) msg = MSG.phoneBad;
    }
    f.classList.toggle('has-error', !!msg);
    err.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }
  ['name', 'phone'].forEach(function (n) {
    var f = $('[data-field="' + n + '"]', form), input = $('input', f);
    input.addEventListener('blur', function () { if (input.value || f.classList.contains('has-error')) validateField(n); });
    input.addEventListener('input', function () { if (f.classList.contains('has-error')) validateField(n); });
  });

  /* picker + summary */
  var picker = $('#picker'), rows = $$('.pick-row', form), consult = $('#f-consult'), consultExtra = $('#consultExtra');
  var sumList = $('#sumList'), sumEmpty = $('#sumEmpty'), sumTotalWrap = $('#sumTotalWrap'), sumTotal = $('#sumTotal');
  var sumItems = {};
  function qtyOf(row) { return parseInt($('.qty', row).value, 10) || 0; }
  function setQty(row, n) {
    n = Math.max(0, Math.min(99, n | 0));
    $('.qty', row).value = n;
    row.classList.toggle('is-selected', n >= 1);
    renderSummary();
    clearPickerError();
  }
  function lines() {
    return rows.map(function (r) { return { id: r.getAttribute('data-sku'), name: r.getAttribute('data-name'), qty: qtyOf(r) }; })
      .filter(function (l) { return l.qty >= 1; });
  }
  function renderSummary() {
    var ls = lines(), total = 0, seen = {};
    ls.forEach(function (l) {
      total += l.qty; seen[l.id] = true;
      var li = sumItems[l.id];
      if (!li) {
        li = document.createElement('li');
        li.innerHTML = '<span class="sl-text"></span><button type="button" class="sum-x" data-x="' + l.id + '"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>';
        $('.sum-x', li).setAttribute('aria-label', 'Bỏ ' + l.name.charAt(0).toLowerCase() + l.name.slice(1) + ' khỏi đơn');
        sumList.appendChild(li); sumItems[l.id] = li;
      }
      $('.sl-text', li).textContent = l.name + ' × ' + l.qty;
      li.classList.remove('is-out');
    });
    Object.keys(sumItems).forEach(function (id) {
      if (!seen[id]) {
        var li = sumItems[id]; delete sumItems[id];
        if (reduced) { li.remove(); } else { li.classList.add('is-out'); setTimeout(function () { li.remove(); }, 250); }
      }
    });
    sumEmpty.hidden = ls.length > 0;
    sumTotalWrap.hidden = ls.length === 0;
    sumTotal.textContent = total;
  }
  function clearPickerError() {
    if (lines().length || consult.checked) {
      picker.classList.remove('has-error'); $('#e-picker').textContent = '';
    }
  }
  rows.forEach(function (row) {
    var input = $('.qty', row);
    $$('.step-btn', row).forEach(function (b) {
      b.addEventListener('click', function () { setQty(row, qtyOf(row) + parseInt(b.getAttribute('data-d'), 10)); });
    });
    input.addEventListener('keydown', function (e) { if (['e', 'E', '+', '-', '.', ','].indexOf(e.key) >= 0) e.preventDefault(); });
    input.addEventListener('input', function () {
      var raw = input.value.replace(/\D/g, '');
      if (raw === '') { row.classList.remove('is-selected'); renderSummary(); return; }
      setQty(row, parseInt(raw, 10));
    });
    input.addEventListener('blur', function () { setQty(row, qtyOf(row)); });
    row.addEventListener('click', function (e) {
      if (e.target.closest('.stepper') || e.target.closest('label')) return;
      if (qtyOf(row) === 0) setQty(row, 1);
    });
  });
  sumList.addEventListener('click', function (e) {
    var b = e.target.closest('.sum-x'); if (!b) return;
    var row = $('.pick-row[data-sku="' + b.getAttribute('data-x') + '"]', form);
    setQty(row, 0);
  });
  consult.addEventListener('change', function () {
    consultExtra.classList.toggle('is-open', consult.checked);
    if (consult.checked) consultExtra.removeAttribute('inert'); else consultExtra.setAttribute('inert', '');
    clearPickerError();
  });
  function syncAll() {
    rows.forEach(function (r) { r.classList.toggle('is-selected', qtyOf(r) >= 1); });
    consultExtra.classList.toggle('is-open', consult.checked);
    if (consult.checked) consultExtra.removeAttribute('inert'); else consultExtra.setAttribute('inert', '');
    renderSummary();
  }
  function orderSku(id, qty) {
    var row = $('.pick-row[data-sku="' + id + '"]', form); if (!row) return;
    setQty(row, Math.max(qtyOf(row), qty || 1));
    row.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () {
      row.classList.remove('is-pulse'); void row.offsetWidth; row.classList.add('is-pulse');
      setTimeout(function () { row.classList.remove('is-pulse'); }, 1500);
    }, reduced ? 0 : 500);
  }
  window.__orderSku = orderSku;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    ['name', 'phone'].forEach(function (n) {
      if (!validateField(n) && !first) first = $('input', $('[data-field="' + n + '"]', form));
    });
    if (!lines().length && !consult.checked) {
      picker.classList.add('has-error');
      $('#e-picker').textContent = MSG.picker;
      if (!first) first = picker;
      // order of fields: name, phone, picker. Focus the earliest invalid one.
    }
    if (first) { first.focus(); return; }
    if ($('.hp', form).value) { showSuccess(); return; }   // honeypot: fake success
    sendOrder();
  });
  var submitBtn = $('#submitBtn'), formError = $('#formError'), sending = false;
  function showSuccess() {
    var ls = lines(), phone = $('#f-phone').value.trim();
    var ul = $('#successLines'); ul.innerHTML = '';
    ls.forEach(function (l) { var li = document.createElement('li'); li.textContent = '• ' + l.name + ' × ' + l.qty; ul.appendChild(li); });
    if (!ls.length) { var li0 = document.createElement('li'); li0.textContent = 'Yêu cầu tư vấn'; ul.appendChild(li0); }
    $('#successCall').textContent = 'HTX sẽ gọi lại cho bạn theo số ' + phone + '.';
    form.reset();
    syncAll();
    card.classList.add('is-sent');
    success.classList.add('is-show');
    success.focus({ preventScroll: true });
  }
  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    $('.btn-label', submitBtn).textContent = on ? 'Đang gửi…' : 'Gửi yêu cầu';
  }
  function sendOrder() {
    if (sending) return;
    formError.hidden = true;
    var name = $('#f-name').value.trim();
    var ls = lines(), total = ls.reduce(function (s, l) { return s + l.qty; }, 0);
    var wantConsult = consult.checked;
    var topics = $$('input[name="topic"]:checked', form).map(function (i) { return i.value; });
    var payload = {
      'Họ và tên': name,
      'Số điện thoại': $('#f-phone').value.trim(),
      'Địa chỉ nhận hàng': $('#f-addr').value.trim() || '—',
      'Sản phẩm đặt': ls.length ? ls.map(function (l) { return '• ' + l.name + ' × ' + l.qty; }).join('\n') : '— (chỉ cần tư vấn)',
      'Tổng số sản phẩm': total,
      'Cần tư vấn thêm': wantConsult ? 'Có' : 'Không',
      'Nội dung cần tư vấn': wantConsult ? (topics.join(', ') || '—') : '—',
      'Thời gian gọi lại': wantConsult ? $('#f-time').value : '—',
      'Lời nhắn': $('#f-msg').value.trim() || '(không có)',
      'Thời gian gửi': new Date().toLocaleString('vi-VN'),
      'Trang': location.href,
      _subject: ls.length ? ('Đơn hàng mới – ' + name + ' – ' + total + ' sản phẩm') : ('Yêu cầu tư vấn – ' + name),
      _template: 'table',
      _captcha: 'false'
    };
    setSending(true);
    var ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, 15000);
    fetch('https://formsubmit.co/ajax/htxdvnnbinhnam@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      return res.json();
    }).then(function (json) {
      if (json && (json.success === true || json.success === 'true')) showSuccess();
      else throw new Error('rejected');
    }).catch(function () {
      formError.hidden = false;
    }).then(function () {
      clearTimeout(to);
      setSending(false);
    });
  }
  $('#formReset').addEventListener('click', function () {
    form.reset();
    syncAll();
    picker.classList.remove('has-error'); $('#e-picker').textContent = '';
    card.classList.remove('is-sent'); success.classList.remove('is-show');
    formError.hidden = true;
    $('#f-name').focus();
  });
  syncAll();
  (function () {
    var qs = new URLSearchParams(location.search), sp = qs.get('sp');
    if (sp) {
      var q = parseInt(qs.get('qty'), 10);
      setTimeout(function () { orderSku(sp, q > 0 ? Math.min(q, 99) : 1); }, 350);
    }
  })();
  }

  /* ---------- FAB visibility ---------- */
  (function () {
    var seen = {};
    var mq = window.matchMedia('(max-width: 640px)');
    function upd() { document.body.classList.toggle('fab-away', mq.matches && !!seen.contact); }
    mq.addEventListener && mq.addEventListener('change', upd);
    if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { seen[e.target.id === 'lien-he' ? 'contact' : 'footer'] = e.isIntersecting; });
        upd();
      });
      var a = $('#lien-he');
      a && fio.observe(a);
    }
    function ui() {
      var open = menuOpen || $$('.overlay').some(function (o) { return o.classList.contains('is-open'); });
      document.body.classList.toggle('ui-open', open);
      if (open || document.body.classList.contains('fab-away')) closeZalo(false);
    }
    var zp = $('#zaloPop'), zf = $('#zaloFab');
    function closeZalo(ret) {
      if (!zp.classList.contains('is-open')) return;
      zp.classList.remove('is-open'); zp.setAttribute('aria-hidden', 'true'); zp.setAttribute('inert', '');
      zf.setAttribute('aria-expanded', 'false');
      if (ret) zf.focus();
    }
    function openZalo() {
      zp.classList.add('is-open'); zp.removeAttribute('inert'); zp.setAttribute('aria-hidden', 'false');
      zf.setAttribute('aria-expanded', 'true');
      setTimeout(function () { $('.zp-open', zp).focus({ preventScroll: true }); }, 60);
    }
    zf.addEventListener('click', function () { if (zp.classList.contains('is-open')) closeZalo(true); else openZalo(); });
    $('#zaloClose').addEventListener('click', function () { closeZalo(true); });
    document.addEventListener('keydown', function (e) {
      if (!zp.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeZalo(true); return; }
      trapKeys(e, zp, [zf]);
    });
    document.addEventListener('click', function (e) {
      if (zp.classList.contains('is-open') && !zp.contains(e.target) && !zf.contains(e.target)) closeZalo(false);
    });
    var copied = $('#zaloCopied');
    $('#zaloCopy').addEventListener('click', function () {
      var num = '0971292430';
      function done() { copied.textContent = 'Đã sao chép'; setTimeout(function () { copied.textContent = ''; }, 2500); }
      function fallback() {
        var t = document.createElement('textarea'); t.value = num; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (err) { copied.textContent = 'Số: 0971 292 430'; }
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(num).then(done, fallback); else fallback();
    });
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
