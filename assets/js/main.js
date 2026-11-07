(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PROJECTS = window.PROJECTS || [];

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  var themeBtn = $('#themeBtn');
  function syncThemeIcon() {
    var light = root.getAttribute('data-theme') === 'light';
    themeBtn.innerHTML = '<svg><use href="#i-' + (light ? 'moon' : 'sun') + '"/></svg>';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#f7f7f5' : '#08090b');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeIcon();
    if (graph) graph.refreshColors();
  });
  syncThemeIcon();

  /* ---------------- nav ---------------- */
  var nav = $('#nav');
  var navLinks = $('#navLinks');
  var menuBtn = $('#menuBtn');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { navLinks.classList.remove('open'); }); });

  var sections = $$('main section[id]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$('#navLinks a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------------- rotator ---------------- */
  (function () {
    var el = $('#rotator');
    var words = ['agentic recommenders', 'graph-augmented RAG', 'MCP tool servers', 'clinical imaging models', 'edge AI on ESP32'];
    if (reduceMotion) return;
    var w = 0, i = words[0].length, del = true;
    function tick() {
      var word = words[w];
      if (del) { i--; if (i <= 0) { del = false; w = (w + 1) % words.length; } }
      else { i++; if (i >= words[w].length) { del = true; el.textContent = words[w]; return setTimeout(tick, 2200); } }
      el.textContent = words[w].slice(0, Math.max(0, i)) || '​';
      setTimeout(tick, del ? 32 : 58);
    }
    setTimeout(tick, 2600);
  })();

  /* ---------------- reveal + counters ---------------- */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function observeReveals(scope) { $$('.reveal:not(.in)', scope).forEach(function (el) { revealObs.observe(el); }); }

  function countUp(el) {
    var target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    var small = el.querySelector('small'); var suffix = small ? small.outerHTML : '';
    if (reduceMotion) { el.innerHTML = target.toFixed(dec) + suffix; return; }
    var t0 = performance.now(), dur = 1200;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), v = target * (1 - Math.pow(1 - p, 3));
      el.innerHTML = v.toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------------- marquee ---------------- */
  (function () {
    var items = ['Python', 'PyTorch', 'MONAI', 'Hugging Face', 'Ollama', 'Model Context Protocol', 'LangGraph', 'LLM APIs', 'Neo4j', 'Qdrant', 'FastAPI', 'Docker', 'Kubernetes', 'MLflow', 'DVC', 'Airflow', 'ONNX', 'TensorRT', 'OpenCV', 'YOLO', 'scikit-learn', 'C++', 'ESP32', 'ROS', 'SwiftUI', 'Linux'];
    var html = items.map(function (t) { return '<span class="chip mono">' + t + '</span>'; }).join('');
    $('#marquee').innerHTML = html + html;
  })();

  /* ---------------- pillar glow follows cursor ---------------- */
  $$('.pillar').forEach(function (p) {
    p.addEventListener('pointermove', function (e) {
      var r = p.getBoundingClientRect();
      p.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      p.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------------- project covers ---------------- */
  function coverArt(kind) {
    if (kind === 'foodrec') {
      var rows = [
        ['Lentil & spinach dal', 'A · 25 min', [34, 30, 20, 16]],
        ['Roasted chickpea bowl', 'A · 30 min', [30, 34, 18, 18]],
        ['Mushroom barley risotto', 'B · 40 min', [24, 28, 14, 34]]
      ];
      var cols = ['var(--accent)', 'var(--sky)', 'var(--warm)', 'var(--violet)'];
      return '<div class="cover-art cover-foodrec"><div class="fr-ui">' + rows.map(function (r, i) {
        return '<div class="fr-row"><span class="rk">#' + (i + 1) + '</span><span class="nm">' + r[0] + '<small>' + r[1] + '</small></span><span class="fr-bars">' +
          r[2].map(function (w, j) { return '<i style="width:' + w + '%;background:' + cols[j] + '"></i>'; }).join('') + '</span></div>';
      }).join('') + '<div class="fr-agent">◆ supervisor: &ldquo;You\'ve picked quick meals 6× this week. Should convenience count more?&rdquo;</div></div></div>';
    }
    if (kind === 'pinni') {
      var pins = [[300, 150, 'var(--accent)'], [336, 128, 'var(--warm)'], [270, 176, 'var(--rose)'], [356, 186, 'var(--sky)'], [218, 112, 'var(--violet)'], [410, 96, 'var(--accent)'], [180, 206, 'var(--warm)'], [460, 210, 'var(--sky)']];
      var langs = ['FI', 'EN', 'FA', 'SV'];
      return '<div class="cover-art cover-pinni"><svg viewBox="0 0 600 338" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<g fill="none" stroke="var(--line-2)">' +
        '<circle cx="300" cy="160" r="46"/><circle cx="300" cy="160" r="102" stroke-dasharray="3 5"/><circle cx="300" cy="160" r="170"/><circle cx="300" cy="160" r="250" stroke-dasharray="3 5"/></g>' +
        '<g font-family="JetBrains Mono, monospace" font-size="10" fill="var(--text-3)"><text x="352" y="128">area</text><text x="404" y="82">city</text><text x="470" y="40">finland</text><text x="540" y="20">world</text></g>' +
        pins.map(function (p, i) { return '<g><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 0 ? 14 : 9) + '" fill="' + p[2] + '" opacity=".18"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 0 ? 5.5 : 3.8) + '" fill="' + p[2] + '"/></g>'; }).join('') +
        '<g transform="translate(24 292)">' + langs.map(function (l, i) { return '<g transform="translate(' + (i * 46) + ' 0)"><rect width="38" height="24" rx="7" fill="var(--surface)" stroke="var(--line-2)"/><text x="19" y="16" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text)">' + l + '</text></g>'; }).join('') + '</g>' +
        '<g transform="translate(404 288)"><rect width="172" height="30" rx="9" fill="var(--surface)" stroke="var(--rose)" stroke-opacity=".6"/><circle cx="16" cy="15" r="4" fill="var(--rose)"/><text x="28" y="19" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-2)">red-risk → editor</text></g>' +
        '</svg></div>';
    }
    return '';
  }

  function coverHTML(p) {
    if (p.cover.art) return coverArt(p.cover.art);
    var style = 'object-position:' + (p.cover.pos || 'center') + ';' + (p.cover.fit === 'contain' ? 'object-fit:contain;padding:18px;' : '');
    return '<img src="' + p.cover.img + '" alt="" loading="lazy" style="' + style + '" />';
  }

  /* ---------------- project grid + filters ---------------- */
  var grid = $('#projectsGrid');
  var filtersEl = $('#filters');
  var currentFilter = 'all';

  function card(p) {
    var stats = p.stats ? '<div class="p-stats">' + p.stats.map(function (s) { return '<div class="p-stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div>' : '';
    return '<button class="p-card reveal' + (p.featured ? ' featured' : '') + '" data-id="' + p.id + '" data-cats="' + p.cats.join(' ') + '" aria-label="Open case study: ' + p.title.replace(/"/g, '') + '">' +
      '<div class="p-cover">' + coverHTML(p) +
      '<div class="p-badges">' + (p.isNew ? '<span class="chip chip-new mono">● Recent</span>' : '') + '</div></div>' +
      '<div class="p-body"><div class="p-kicker">' + p.kicker.map(function (k) { return '<span>' + k + '</span>'; }).join('<span>/</span>') + '</div>' +
      '<h3 class="p-title">' + p.title + '</h3><p class="p-desc">' + p.short + '</p>' + stats +
      '<div class="p-foot"><div class="p-tags">' + p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
      '<span class="p-open">Case study <svg><use href="#i-arrow"/></svg></span></div></div></button>';
  }

  grid.innerHTML =
    PROJECTS.filter(function (p) { return p.featured; }).map(card).join('') +
    '<div class="subhead" id="earlierHead">Earlier work: medical imaging &amp; biosignals</div>' +
    PROJECTS.filter(function (p) { return !p.featured; }).map(card).join('');

  filtersEl.innerHTML = window.FILTERS.map(function (f) {
    var n = f.key === 'all' ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cats.indexOf(f.key) > -1; }).length;
    return '<button class="filter' + (f.key === 'all' ? ' active' : '') + '" role="tab" data-f="' + f.key + '">' + f.label + '<span class="count">' + n + '</span></button>';
  }).join('');

  function setFilter(key) {
    currentFilter = key;
    $$('.filter', filtersEl).forEach(function (b) {
      var on = b.dataset.f === key; b.classList.toggle('active', on); b.setAttribute('aria-selected', on);
    });
    var anyEarlier = false;
    $$('.p-card', grid).forEach(function (c) {
      var show = key === 'all' || c.dataset.cats.split(' ').indexOf(key) > -1;
      c.classList.toggle('hidden', !show);
      if (show) { c.classList.add('in'); if (!c.classList.contains('featured')) anyEarlier = true; }
    });
    $('#earlierHead').style.display = anyEarlier ? '' : 'none';
  }
  filtersEl.addEventListener('click', function (e) { var b = e.target.closest('.filter'); if (b) setFilter(b.dataset.f); });
  grid.addEventListener('click', function (e) { var c = e.target.closest('.p-card'); if (c) openCase(c.dataset.id); });

  observeReveals(document);

  /* ---------------- case study modal ---------------- */
  var modal = $('#modal'), content = $('#modalContent'), panel = $('#modalPanel');
  var lastFocus = null;

  function linkBtn(l) {
    var icon = l.icon === 'github' ? 'i-github' : 'i-ext';
    return '<a class="btn btn-ghost" href="' + l.href + '" target="_blank" rel="noopener"><svg><use href="#' + icon + '"/></svg>' + l.label + '</a>';
  }

  function openCase(id, fromHash) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = document.activeElement;
    var idx = PROJECTS.indexOf(p);
    var next = PROJECTS[(idx + 1) % PROJECTS.length];
    content.innerHTML =
      '<div class="cs-kicker">' + p.kicker.map(function (k) { return '<span class="chip mono">' + k + '</span>'; }).join('') + '</div>' +
      '<h2 class="cs-title" id="csTitle">' + p.title + '</h2>' +
      '<p class="cs-lede">' + p.short + '</p>' +
      (p.links && p.links.length ? '<div class="cs-links">' + p.links.map(linkBtn).join('') + '</div>' : '') +
      (p.facts ? '<div class="cs-facts">' + p.facts.map(function (f) { return '<div class="cs-fact"><span>' + f[0] + '</span><b>' + f[1] + '</b></div>'; }).join('') + '</div>' : '') +
      (p.body || '') +
      '<div class="cs-section" style="margin-bottom:0;border-top:1px solid var(--line);padding-top:28px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">' +
      '<span style="color:var(--text-3);font-size:14px">Next project</span>' +
      '<button class="btn btn-ghost" data-next="' + next.id + '">' + next.title.split(':')[0] + ' <svg><use href="#i-arrow"/></svg></button></div>';
    $('#csCrumbs').textContent = 'work / ' + p.id;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    panel.scrollTop = 0;
    if (typeof p.init === 'function') p.init(content);
    if (!fromHash) history.replaceState(null, '', '#project/' + p.id);
    setTimeout(function () { var c = $('[data-close].icon-btn', modal); if (c) c.focus(); }, 50);
  }

  function closeCase() {
    if (modal.hidden) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; content.innerHTML = ''; }, 300);
    if (location.hash.indexOf('#project/') === 0) history.replaceState(null, '', '#work');
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) return closeCase();
    var n = e.target.closest('[data-next]');
    if (n) openCase(n.dataset.next);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCase();
    if (e.key === 'Tab' && !modal.hidden) {
      var f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', panel);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  function fromHash() {
    var m = location.hash.match(/^#project\/([\w-]+)/);
    if (m) openCase(m[1], true);
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------------- copy email ---------------- */
  $('#copyEmail').addEventListener('click', function () {
    var email = 'amir.mohammad.nouri2000@gmail.com', toast = $('#copyToast');
    function done(msg) { toast.textContent = msg; setTimeout(function () { toast.textContent = ''; }, 2400); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { done('✓ Email copied to clipboard'); }, function () { location.href = 'mailto:' + email; });
    } else { location.href = 'mailto:' + email; }
  });
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- skill graph ---------------- */
  var graph = (function () {
    var canvas = $('#skillGraph');
    if (!canvas) return null;
    var ctx = canvas.getContext('2d');
    var foot = $('#graphFoot');
    var nodes = (window.SKILL_NODES || []).map(function (n) { return Object.assign({}, n); });
    var byId = {}; nodes.forEach(function (n) { byId[n.id] = n; });
    var edges = (window.SKILL_EDGES || []).map(function (e) { return [byId[e[0]], byId[e[1]]]; }).filter(function (e) { return e[0] && e[1]; });
    var W = 0, H = 0, dpr = 1, TOP = 48, BOT = 80;
    var hover = null, mouse = null, colors = {}, particles = [], t = 0;
    $('#graphStat').textContent = nodes.length + ' nodes · ' + edges.length + ' edges';

    function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }
    function refreshColors() {
      colors = {
        agents: cssVar('--accent'), medical: cssVar('--violet'), cv: cssVar('--sky'), edge: cssVar('--warm'), all: cssVar('--text-2'),
        text: cssVar('--text'), text2: cssVar('--text-2'), text3: cssVar('--text-3'), line: cssVar('--line-2'), bg: cssVar('--surface')
      };
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    }

    function layout() {
      // seeded positions grouped by cluster, then relaxed by a few hundred force iterations
      var cx = W / 2, cy = TOP + (H - TOP - BOT) / 2;
      var anchors = { agents: [-0.28, -0.22], medical: [0.26, 0.05], cv: [0.12, 0.3], edge: [-0.22, 0.3], all: [0.02, 0.02] };
      var s = Math.min(W, H - TOP - BOT);
      nodes.forEach(function (n, i) {
        ctx.font = (n.size >= 0.85 ? '600 13px' : '500 12px') + ' Inter, system-ui, sans-serif';
        n.pad = Math.max(radius(n) + 10, ctx.measureText(n.label).width / 2 + 10);
        var a = anchors[n.cat] || [0, 0];
        n.x = cx + a[0] * s * 1.3 + Math.cos(i * 2.4) * s * 0.12;
        n.y = cy + a[1] * s * 1.1 + Math.sin(i * 2.4) * s * 0.12;
        n.vx = 0; n.vy = 0; n.ox = 0; n.oy = 0; n.phase = i * 1.7;
      });
      for (var k = 0; k < 300; k++) simulate(s, 0.6);
      nodes.forEach(function (n) { n.hx = n.x; n.hy = n.y; });
    }

    function simulate(s, damp) {
      var cx = W / 2, cy = TOP + (H - TOP - BOT) / 2, i, j, a, b, dx, dy, d, f;
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j]; dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || 1;
        f = Math.min(10, (s * s * 0.03) / (d * d)); a.vx -= dx / d * f; a.vy -= dy / d * f; b.vx += dx / d * f; b.vy += dy / d * f;
      }
      edges.forEach(function (e) {
        a = e[0]; b = e[1]; dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || 1;
        f = (d - s * 0.3) * 0.015; a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f;
      });
      nodes.forEach(function (n) {
        n.vx += (cx - n.x) * 0.0025; n.vy += (cy - n.y) * 0.0025;
        n.vx *= damp; n.vy *= damp; n.x += n.vx; n.y += n.vy;
        n.x = Math.max(n.pad, Math.min(W - n.pad, n.x)); n.y = Math.max(TOP + 26, Math.min(H - BOT - 38, n.y));
      });
      // keep labels from overlapping: treat each node as a box (label width × ~34px)
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        var ox = (a.pad + b.pad - 12) - Math.abs(b.x - a.x), oy = 38 - Math.abs(b.y - a.y);
        if (ox > 0 && oy > 0) {
          if (ox < oy * 1.5) { var sx = (b.x >= a.x ? 1 : -1) * ox / 2; a.x -= sx; b.x += sx; }
          else { var sy = (b.y >= a.y ? 1 : -1) * oy / 2; a.y -= sy; b.y += sy; }
        }
      }
      nodes.forEach(function (n) {
        n.x = Math.max(n.pad, Math.min(W - n.pad, n.x));
        n.y = Math.max(TOP + 26, Math.min(H - BOT - 38, n.y));
      });
    }

    function radius(n) { return 5 + n.size * 7; }
    function neighbours(n) { return edges.filter(function (e) { return e[0] === n || e[1] === n; }); }

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      // gentle float
      nodes.forEach(function (n) {
        var amp = reduceMotion ? 0 : 3.5;
        n.x = n.hx + Math.sin(t * 0.012 + n.phase) * amp;
        n.y = n.hy + Math.cos(t * 0.01 + n.phase * 1.3) * amp;
        if (mouse && !reduceMotion) {
          var dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) { n.x += dx / d * (140 - d) * 0.06; n.y += dy / d * (140 - d) * 0.06; }
        }
      });
      var hn = hover ? neighbours(hover) : [];
      var active = {}; if (hover) { active[hover.id] = 1; hn.forEach(function (e) { active[e[0].id] = 1; active[e[1].id] = 1; }); }

      // edges
      edges.forEach(function (e) {
        var on = hover && (e[0] === hover || e[1] === hover);
        ctx.beginPath(); ctx.moveTo(e[0].x, e[0].y); ctx.lineTo(e[1].x, e[1].y);
        ctx.strokeStyle = on ? colors[hover.cat] : colors.line;
        ctx.globalAlpha = hover ? (on ? 0.9 : 0.25) : 0.7;
        ctx.lineWidth = on ? 1.6 : 1; ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // particles travelling along edges ("signal flow")
      if (!reduceMotion && t % 18 === 0) {
        var pool = hover ? hn : edges;
        if (pool.length) { var e = pool[Math.floor(Math.random() * pool.length)]; particles.push({ e: e, p: 0, dir: Math.random() > 0.5 }); }
      }
      particles = particles.filter(function (q) { return q.p <= 1; });
      particles.forEach(function (q) {
        q.p += 0.012;
        var a = q.dir ? q.e[0] : q.e[1], b = q.dir ? q.e[1] : q.e[0];
        var x = a.x + (b.x - a.x) * q.p, y = a.y + (b.y - a.y) * q.p;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colors[a.cat] || colors.text2; ctx.globalAlpha = Math.sin(q.p * Math.PI); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // nodes
      nodes.forEach(function (n) {
        var r = radius(n), c = colors[n.cat] || colors.text2, dim = hover && !active[n.id];
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, r + (n === hover ? 7 : 4), 0, Math.PI * 2);
        ctx.fillStyle = c; ctx.globalAlpha = dim ? 0.05 : (n === hover ? 0.22 : 0.12); ctx.fill();
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.55, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
        ctx.font = (n.size >= 0.85 ? '600 ' : '500 ') + (n.size >= 0.85 ? 13 : 12) + 'px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = n === hover ? colors.text : (n.size >= 0.85 ? colors.text : colors.text2);
        ctx.fillText(n.label, n.x, n.y + r + 6);
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(draw);
      else setTimeout(function () { requestAnimationFrame(draw); }, 400);
    }

    function pick(x, y) {
      var best = null, bd = 34;
      nodes.forEach(function (n) { var d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } });
      return best;
    }
    function setFoot(n) {
      if (!n) { foot.innerHTML = '<div class="gf-title">Hover a node to inspect it</div><div class="gf-hint">Click a node to jump to related projects ↓</div>'; return; }
      var c = colors[n.cat];
      var count = n.cat === 'all' ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cats.indexOf(n.cat) > -1; }).length;
      foot.innerHTML = '<div class="gf-title"><span style="width:8px;height:8px;border-radius:50%;background:' + c + ';display:inline-block"></span>' + n.label +
        '<span class="gf-hint" style="margin-left:auto">' + count + ' project' + (count === 1 ? '' : 's') + ' · click →</span></div><div class="gf-desc">' + n.desc + '</div>';
    }

    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      var n = pick(mouse.x, mouse.y);
      if (n !== hover) { hover = n; setFoot(n); canvas.style.cursor = n ? 'pointer' : 'crosshair'; }
    });
    canvas.addEventListener('pointerleave', function () { mouse = null; hover = null; setFoot(null); });
    canvas.addEventListener('click', function (e) {
      var r = canvas.getBoundingClientRect(); var n = pick(e.clientX - r.left, e.clientY - r.top);
      if (!n) return;
      setFilter(n.cat);
      $('#work').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    refreshColors();
    resize();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    requestAnimationFrame(draw);
    return { refreshColors: refreshColors };
  })();
})();
