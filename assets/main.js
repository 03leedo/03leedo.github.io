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

  /* ── 흐름: 누가 하는지 세고, 차례로 보여 준다 ── */
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
    // 단계를 눌러도, 키보드로 골라도 그 단계에 멈춘다
    s.setAttribute('tabindex', '0');
    function pick() {
      if (timer) { clearInterval(timer); timer = null; }
      show(i);
      stop();
    }
    s.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      pick();
    });
    s.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
    });
  });
})();
