/* ==========================================================================
   唐睿 · 作品集 2027 — 动效层
   依赖 assets/vendor/anime.umd.min.js（Anime.js v4.5.0 · MIT）
   原则：动效只服务阅读节奏——每页演一次，落定即静止，不干扰翻页与截屏。
   ========================================================================== */
(function () {
  'use strict';

  var A = window.anime;
  var root = document.documentElement;
  if (!A) { root.classList.add('no-anime'); return; }

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  var built = new WeakMap();
  var played = new WeakSet();

  /* ---------- 工具 ---------- */
  function splitChars(el) {
    if (!el || el.dataset.split === '1') return [];
    el.dataset.split = '1';
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var txt = n.textContent;
          if (!txt.trim()) return;
          var frag = document.createDocumentFragment();
          Array.prototype.slice.call(txt).forEach(function (ch) {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            var sp = document.createElement('span');
            sp.className = 'ch';
            sp.textContent = ch;
            frag.appendChild(sp);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('ch')) {
          walk(n);
        }
      });
    })(el);
    return el.querySelectorAll('.ch');
  }

  // 每个元素只归属一组动画，避免多条动画抢同一属性（透明度会互相压回 0）
  function claim(claimed, list) {
    var out = [];
    Array.prototype.slice.call(list).forEach(function (el) {
      if (!claimed.has(el)) { claimed.add(el); out.push(el); }
    });
    return out;
  }

  function anim(targets, params) {
    if (!targets || (targets.length === 0)) return null;
    params.autoplay = false;
    return A.animate(targets, params);
  }

  /* ---------- 封面 ---------- */
  function buildCover(stage) {
    var claimed = new WeakSet();
    var list = [];

    list.push(anim(stage.querySelector('.wm'), {
      opacity: [0, 1], translateY: [52, 0], scale: [1.05, 1],
      duration: 1600, delay: 0, ease: 'outQuint'
    }));

    list.push(anim(stage.querySelector('.wm2'), {
      opacity: [0, 1], translateY: [34, 0], duration: 1300, delay: 140, ease: 'outCubic'
    }));

    var ph = stage.querySelector('.ph');
    list.push(anim(ph, {
      opacity: [0, 1], scale: [0.962, 1], duration: 1250, delay: 240, ease: 'outExpo'
    }));

    if (ph) {
      list.push(anim(ph.querySelectorAll('.ph-tag, .ph-label'), {
        opacity: [0, 1], translateY: [10, 0], duration: 900,
        delay: A.stagger(120, { start: 900 }), ease: 'outQuad'
      }));
      list.push(anim(ph.querySelectorAll('.cor'), {
        opacity: [0, 1], scale: [0.6, 1], duration: 700,
        delay: A.stagger(60, { start: 620 }), ease: 'outBack'
      }));
      list.push(anim(ph.querySelector('.ring'), {
        opacity: [0, 1], scale: [0.82, 1], duration: 1500, delay: 320, ease: 'outQuint'
      }));
    }

    list.push(anim(stage.querySelectorAll('.phrow .b'), {
      opacity: [0, 1], scaleX: [0, 1],
      duration: 900, delay: A.stagger(110, { start: 780 }), ease: 'outExpo'
    }));

    var txt = stage.querySelector('.cover-txt');

    if (txt) {
      var pill0 = txt.querySelector('.pill');
      list.push(anim(pill0, {
        opacity: [0, 1], translateY: [12, 0], duration: 800, delay: 460, ease: 'outCubic'
      }));
      claimed.add(pill0);

      // 姓名：整体上浮 + 轻微字距收紧
      var nameEl = txt.querySelector('div:not(.mini):not(.mono)');
      list.push(anim(nameEl, {
        opacity: [0, 1], translateY: [30, 0], scale: [0.99, 1],
        duration: 1000, delay: 300, ease: 'outExpo'
      }));
      claimed.add(nameEl);

      var mini = txt.querySelector('.mini');
      list.push(anim(mini, {
        opacity: [0, 1], translateY: [16, 0], duration: 860, delay: 560, ease: 'outCubic'
      }));
      claimed.add(mini);

      var pills = claim(claimed, txt.querySelectorAll('.pill'));
      list.push(anim(pills, {
        opacity: [0, 1], translateY: [12, 0], scale: [0.96, 1],
        duration: 760, delay: A.stagger(55, { start: 700 }), ease: 'outBack'
      }));

      var monoLine = claim(claimed, txt.querySelectorAll('.mono'));
      list.push(anim(monoLine, {
        opacity: [0, 1], translateY: [10, 0], duration: 800,
        delay: A.stagger(70, { start: 880 }), ease: 'outQuad'
      }));
    }

    list.push(anim(stage.querySelectorAll('.metabar'), {
      opacity: [0, 1], duration: 900, delay: 1100, ease: 'linear'
    }));

    return list.filter(Boolean);
  }

  /* ---------- 内容页 ---------- */
  function buildContent(stage) {
    var claimed = new WeakSet();
    var list = [];

    var kicker = stage.querySelector('.kicker');
    if (kicker) {
      claimed.add(kicker);
      list.push(anim(kicker, {
        opacity: [0, 1], translateX: [-12, 0], duration: 720, delay: 60, ease: 'outQuad'
      }));
    }

    var wm = stage.querySelector('.wm');
    if (wm) {
      claimed.add(wm);
      list.push(anim(wm, {
        opacity: [0, 1], translateY: [46, 0], scale: [1.04, 1],
        duration: 1500, delay: 0, ease: 'outQuint'
      }));
    }

    var title = stage.querySelector('h1.big');
    var chars = title ? splitChars(title) : [];
    if (chars.length) {
      claimed.add(title);
      list.push(anim(chars, {
        opacity: [0, 1], translateY: ['0.42em', 0], duration: 820,
        delay: A.stagger(20, { start: 150 }), ease: 'outExpo'
      }));
    } else if (title) {
      claimed.add(title);
      list.push(anim(title, {
        opacity: [0, 1], translateY: [26, 0], duration: 900, delay: 150, ease: 'outQuint'
      }));
    }

    var sub = stage.querySelector('.sub, .lead');
    if (sub && !claimed.has(sub)) {
      claimed.add(sub);
      list.push(anim(sub, {
        opacity: [0, 1], translateY: [16, 0], duration: 860, delay: 420, ease: 'outCubic'
      }));
    }

    // 正文块：按文档顺序错峰，已被上面认领的跳过
    var blocks = claim(claimed, Array.prototype.filter.call(
      stage.querySelectorAll('.rv'),
      function (el) { return !(title && (el === title || title.contains(el))); }
    ));
    list.push(anim(blocks, {
      opacity: [0, 1], translateY: ['1.6cqh', 0], duration: 900,
      delay: A.stagger(58, { start: 480 }), ease: 'outCubic'
    }));

    // 表格行
    var rows = claim(claimed, stage.querySelectorAll('tbody tr'));
    list.push(anim(rows, {
      opacity: [0, 1], translateX: [-8, 0], duration: 620,
      delay: A.stagger(24, { start: 520 }), ease: 'outQuad'
    }));

    // 图片：遮片由 CSS(.in) 负责，这里只做落定推近
    var imgs = claim(claimed, stage.querySelectorAll('.shot img'));
    list.push(anim(imgs, {
      scale: [1.05, 1], duration: 1600, delay: A.stagger(80, { start: 380 }), ease: 'outQuint'
    }));

    list.push(anim(stage.querySelectorAll('.metabar'), {
      opacity: [0, 1], duration: 800, delay: 900, ease: 'linear'
    }));

    return list.filter(Boolean);
  }

  function build(slide) {
    var stage = slide.querySelector('.stage');
    if (!stage) return [];
    try {
      return stage.querySelector('.cover-txt') ? buildCover(stage) : buildContent(stage);
    } catch (e) {
      return [];
    }
  }

  function play(slide) {
    if (reduce || played.has(slide)) return;
    played.add(slide);
    var stage = slide.querySelector('.stage');
    if (stage) requestAnimationFrame(function () { stage.classList.add('in'); });
    if (!built.has(slide)) built.set(slide, build(slide));
    built.get(slide).forEach(function (a) { try { a.play(); } catch (e) { } });
  }

  var FINAL = '.rv, .kicker, .sub, .lead, .wm2, .ch, .callout, .kpi, .card, .metabar, ' +
    '.cover-txt > *, .ph, .phrow .b, .cor, .pill, .ph-tag, .ph-label, .ring, .shot img, tbody tr';
  function settle(slide) {
    var stage = slide.querySelector('.stage');
    if (!stage) return;
    stage.classList.add('in');
    try {
      // 只清透明度与位移；.wm 的居中由 CSS translate:-50% 负责，不在这里覆盖
      A.set(stage.querySelectorAll(FINAL), {
        opacity: 1, translateX: 0, translateY: 0, scale: 1, scaleX: 1
      });
      A.set(stage.querySelectorAll('.wm'), { opacity: 1, translateY: 0, scale: 1 });
    } catch (e) { }
  }

  /* ---------- 进场观察 ---------- */
  if (reduce) {
    slides.forEach(settle);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) play(e.target); });
    }, { threshold: 0.35 });
    slides.forEach(function (s) { io.observe(s); });
    requestAnimationFrame(function () { play(slides[0]); });
  }

  /* ---------- 章节点 ---------- */
  var dots = document.getElementById('dots');
  var dotEls = [];
  if (dots) {
    slides.forEach(function (s, i) {
      var d = document.createElement('i');
      d.title = 'P' + String(i + 1).padStart(2, '0');
      d.addEventListener('click', function () { s.scrollIntoView({ behavior: 'smooth' }); });
      dots.appendChild(d);
      dotEls.push(d);
    });
    if (!reduce) {
      A.animate(dotEls, {
        opacity: [0, 1], scale: [0.4, 1], duration: 700,
        delay: A.stagger(28, { start: 700 }), ease: 'outBack'
      });
    }
  }

  /* ---------- 光标光晕 ---------- */
  var spot = document.getElementById('spot');
  if (spot) {
    var mx = innerWidth / 2, my = innerHeight / 2, sx = mx, sy = my, on = false;
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!on) { spot.classList.add('on'); on = true; }
    }, { passive: true });
    addEventListener('pointerleave', function () { spot.classList.remove('on'); on = false; });
    (function loop() {
      sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;
      spot.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 磁性 pill ---------- */
  if (!reduce) {
    document.querySelectorAll('.pill').forEach(function (p) {
      p.addEventListener('pointermove', function (e) {
        var r = p.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        p.style.transform = 'translate(' + (dx * 7).toFixed(2) + 'px,' + (dy * 5).toFixed(2) + 'px)';
      });
      p.addEventListener('pointerleave', function () { p.style.transform = ''; });
    });
  }

  /* ---------- 进度 / 水印视差 ---------- */
  var bar = document.getElementById('bar');
  var cur = document.getElementById('cur');
  var tot = document.getElementById('tot');
  if (tot) tot.textContent = String(slides.length).padStart(2, '0');

  function curIdx() {
    for (var i = 0; i < slides.length; i++) {
      var r = slides[i].getBoundingClientRect();
      if (r.top <= innerHeight * 0.5 && r.bottom > innerHeight * 0.5) return i;
    }
    return 0;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var i = curIdx();
      if (bar) bar.style.width = ((i + 1) / slides.length * 100) + '%';
      if (cur) cur.textContent = String(i + 1).padStart(2, '0');
      dotEls.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      if (!reduce) {
        var wm = slides[i].querySelector('.wm');
        if (wm) {
          var t = slides[i].getBoundingClientRect().top / innerHeight;
          wm.style.translate = '-50% ' + (t * 30).toFixed(1) + 'px';
        }
      }
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 键盘 ---------- */
  function go(n) {
    var i = Math.min(slides.length - 1, Math.max(0, n));
    slides[i].scrollIntoView({ behavior: 'smooth' });
  }
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || k === ' ') {
      e.preventDefault(); go(curIdx() + 1);
    } else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') {
      e.preventDefault(); go(curIdx() - 1);
    } else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(slides.length - 1); }
  });

  /* ---------- 导出 / 打印：一次落定 ---------- */
  // 注意：落定后必须把动画写下的 transform / scale / translate 撤掉。
  // 只要页面上残留非 none 的 transform，Chrome 导出 PDF 时会把整页栅格化，
  // 文件从 4MB 涨到 9MB、文字放大后发虚。
  window.__setFinal = function () {
    root.classList.add('__final');
    slides.forEach(function (s) {
      var rec = built.get(s);
      if (rec) rec.forEach(function (a) { try { a.pause(); } catch (e) { } });
      settle(s);
      var stage = s.querySelector('.stage');
      if (!stage) return;
      Array.prototype.forEach.call(
        stage.querySelectorAll('.rv, .kicker, .sub, .lead, .ch, .wm, .wm2, .ph, .phrow .b, .cor, .ring, .pill, .shot img, tbody tr, .cover-txt > *, .metabar, .ph-tag, .ph-label'),
        function (el) {
          ['transform', 'scale', 'translate', 'rotate', 'will-change'].forEach(function (k) {
            el.style.removeProperty(k);
          });
        }
      );
    });
    if (dots) { dots.style.opacity = '1'; }
  };
  window.__ready = true;
})();
