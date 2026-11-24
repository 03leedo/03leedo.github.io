(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 저장이 막혀 있어도 화면은 그대로 동작한다 */ }
  }

  /* ── 테마 ── */
  var themeBtn = document.getElementById('theme-toggle');
  function effectiveTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
    });
  }

  /* ── 근거 세기 — 아이캐치의 "근거 0행이면 버그" 를 이 페이지에 건다 ── */
  var claims = Array.prototype.slice.call(document.querySelectorAll('.claim'));
  var missing = claims.filter(function (el) {
    var links = el.querySelectorAll('a.ev[href]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href').trim() !== '') return false;
    }
    return true;
  });
  var totalEl = document.getElementById('claims-total');
  var missEl = document.getElementById('claims-missing');
  var missBox = document.getElementById('claims-missing-box');
  if (totalEl) totalEl.textContent = String(claims.length - missing.length);
  if (missEl) missEl.textContent = String(missing.length);
  if (missBox) {
    missBox.classList.toggle('meter--ok', missing.length === 0);
    missBox.classList.toggle('meter--bad', missing.length > 0);
  }
  missing.forEach(function (el) { el.setAttribute('data-missing-evidence', ''); });

  var evBtn = document.getElementById('ev-toggle');
  var evLabel = document.getElementById('ev-toggle-label');
  function syncEv() {
    var on = root.classList.contains('ev-on');
    if (evBtn) evBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (evLabel) evLabel.textContent = on ? '근거 접기' : '근거 펼쳐 보기';
  }
  if (evBtn) {
    evBtn.addEventListener('click', function () {
      root.classList.toggle('ev-on');
      store('evidence', root.classList.contains('ev-on') ? 'on' : 'off');
      syncEv();
    });
  }
  syncEv();

  /* ── 흐름 — 누가 하는지 세고, 차례로 보여 준다 ── */
  var list = document.getElementById('flow-list');
  if (!list) return;
  var steps = Array.prototype.slice.call(list.querySelectorAll('.step'));
  var counts = { code: 0, llm: 0, human: 0 };
  steps.forEach(function (s) {
    var a = s.getAttribute('data-actor');
    if (counts.hasOwnProperty(a)) counts[a] += 1;
  });
  Object.keys(counts).forEach(function (k) {
    var el = document.querySelector('[data-count="' + k + '"]');
    if (el) el.textContent = String(counts[k]);
  });

  var playBtn = document.getElementById('flow-play');
  var resetBtn = document.getElementById('flow-reset');
  var timer = null;
  var current = -1;
  var STEP_MS = 1900;

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top >= 72 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  function show(i) {
    current = i;
    list.classList.add('is-playing');
    steps.forEach(function (s, j) {
      s.classList.toggle('is-on', j === i);
      s.classList.toggle('is-done', j < i);
    });
    var target = steps[i];
    if (target && !inView(target)) {
      target.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (resetBtn) resetBtn.disabled = false;
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    if (playBtn) playBtn.textContent = current >= steps.length - 1 ? '▶ 다시 보기' : '▶ 이어서 보기';
  }

  function play() {
    if (timer) { stop(); return; }
    if (current >= steps.length - 1) current = -1;
    show(current + 1);
    if (playBtn) playBtn.textContent = '❚❚ 멈추기';
    timer = setInterval(function () {
      if (current >= steps.length - 1) { stop(); return; }
      show(current + 1);
    }, STEP_MS);
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    current = -1;
    list.classList.remove('is-playing');
    steps.forEach(function (s) { s.classList.remove('is-on', 'is-done'); });
    if (playBtn) playBtn.textContent = '▶ 차례로 보기';
    if (resetBtn) resetBtn.disabled = true;
  }

  if (playBtn) playBtn.addEventListener('click', play);
  if (resetBtn) resetBtn.addEventListener('click', reset);
  steps.forEach(function (s, i) {
    s.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      if (timer) { clearInterval(timer); timer = null; }
      show(i);
      stop();
    });
  });
})();
