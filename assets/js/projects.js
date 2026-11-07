/* =========================================================
   Project data. Each project renders a card in #work and a case
   study in the side panel. To add a project, copy an object below.

   cats:  agents | medical | edge | cv   (used by filters + skill graph)
   cover: { img, fit?, pos? }  or  { art: 'foodrec' | 'pinni' }
   body:  HTML string for the case study (optional)
   init:  function(root) run after the case study opens (optional)
   ========================================================= */

window.FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'agents', label: 'LLM & Agents' },
  { key: 'medical', label: 'Medical AI' },
  { key: 'edge', label: 'Edge & Signals' },
  { key: 'cv', label: 'Computer Vision' }
];

window.PROJECTS = [
  /* ------------------------------------------------------------------ */
  {
    id: 'foodrec',
    featured: true,
    isNew: true,
    title: 'FoodRec: transparent, agent-supervised recommendation',
    kicker: ['2026', 'Research system', 'Solo'],
    cats: ['agents'],
    cover: { art: 'foodrec' },
    short: 'A multi-criteria recipe recommender where a supervisor agent notices when what users say and what they do drift apart, then asks before changing anything. I validated it with a 300-run study using GPT-4o as simulated participants.',
    stats: [['9,605', 'recipes ranked'], ['300', 'simulated live runs'], ['−87%', 'needless interruptions']],
    tags: ['Agents', 'Knowledge graph', 'RecSys', 'FastAPI'],
    links: [{ label: 'GitHub', href: 'https://github.com/AmirMohammad-Nouri/agentic_recom_sys', icon: 'github' }],
    facts: [['Role', 'Design, engineering, study'], ['Stack', 'Python · FastAPI · Ollama'], ['Data', 'HUMMUS (food.com)'], ['Tests', '129 automated']],
    body: `
      <div class="cs-section">
        <h3>The problem</h3>
        <p>Recommenders learn from clicks, but people's clicks don't always match their goals. Someone who wants to eat healthier still taps the quick pasta on a busy Tuesday. Systems either ignore the gap or quietly overwrite the user's stated goal. Neither is transparent, and neither respects the user.</p>
        <blockquote>The agent manages the learning process; it does not pick the food.</blockquote>
      </div>
      <div class="cs-section">
        <h3>What I built</h3>
        <ul class="cs-list">
          <li><b>Deterministic, auditable ranking.</b> Recipes are scored on healthiness, sustainability and convenience, weighted by the user, plus a learned taste share. Allergies and diets are hard rules, and there are explicit policies for missing data, diversity and freshness across days.</li>
          <li><b>A supervisor agent with evidence.</b> When the weights learned from behaviour drift from the saved goal, the agent looks up the user's history in a knowledge graph and asks a question or proposes a change, with the evidence attached. Nothing about the goal changes until the user accepts.</li>
          <li><b>A constrained LLM.</b> The model only classifies messages, chooses among fixed options and phrases answers. Any wording that states something the evidence doesn't support is rejected. It runs on a 2B local model (Ollama), any hosted LLM API, or no model at all.</li>
          <li><b>Built for research.</b> Every score can be opened, every agent step streams live, and administrators manage participant accounts, scripted scenarios and a standard per-user export, all from one config page.</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Evaluation: how eager should an agent be?</h3>
        <p>The key setting is the intervention threshold τ: how far learned behaviour may drift from the saved goal before the supervisor speaks up. To tune it without recruiting people, I built a <b>simulation harness</b> with GPT-4o playing 10 personas whose real preferences are hidden from FoodRec. The design covered 6 scenarios (stable, wrong onboarding, feedback mistakes, temporary circumstances, abrupt change and gradual change), 5 thresholds, and silent, replay and live runs, for about 68,000 reactions in total.</p>
        <p>I controlled for known LLM-participant biases: no numbers in prompts, shuffled dish order, decision before reactions, and a hidden-state check that overrides answers contradicting the persona's goal. Measured position bias was flat (23 / 21 / 17 / 20 / 18 %).</p>
        <div class="widget" id="thWidget">
          <div class="widget-head"><b>Threshold trade-off: live runs, all personas</b><span>Drag to compare</span></div>
          <input type="range" class="slider" min="0" max="4" step="1" value="2" aria-label="Intervention threshold" />
          <div class="ticks"><span>0.10</span><span>0.15</span><span>0.30</span><span>0.45</span><span>0.60</span></div>
          <div class="th-bars"></div>
          <div class="th-note"></div>
        </div>
      </div>
      <div class="cs-section">
        <h3>Findings</h3>
        <div class="cs-results">
          <div class="cs-result"><b>−87%</b><span>unnecessary notifications going from τ = 0.10 to 0.30</span></div>
          <div class="cs-result"><b>~10%</b><span>fewer changes detected at that setting, about 2 rounds later</span></div>
          <div class="cs-result"><b>0</b><span>wrong goal changes at any threshold</span></div>
          <div class="cs-result"><b>36%</b><span>persona's top dish chosen (20% chance), so personas behaved plausibly</span></div>
        </div>
        <p style="margin-top:16px">There's no single best threshold. 0.10–0.30 score similarly, and the choice depends on how much an interruption costs. I reported that honestly instead of overfitting a winner on 10 personas.</p>
      </div>`,
    init: function (root) {
      var data = [
        { t: '0.10', det: 93, prec: 50, corr: 33, help: 17, unn: 34.3, delay: 1.5, score: 0.631 },
        { t: '0.15', det: 94, prec: 53, corr: 44, help: 23, unn: 23.7, delay: 1.9, score: 0.653 },
        { t: '0.30', det: 84, prec: 79, corr: 38, help: 47, unn: 4.3, delay: 3.6, score: 0.621 },
        { t: '0.45', det: 57, prec: 94, corr: 7, help: 57, unn: 0.5, delay: 4.5, score: 0.455 },
        { t: '0.60', det: 20, prec: 100, corr: 0, help: 43, unn: 0, delay: 5.0, score: 0.317 }
      ];
      var notes = [
        'Catches almost every real change within ~1.5 rounds, but interrupts about once every 3 days even when nothing is wrong.',
        'Highest overall score. Still noisy: about one unnecessary notification every 4 rounds.',
        'The sweet spot for respecting attention: it stays silent during temporary circumstances, and 47% of its interventions are rated helpful.',
        'Very precise, but misses almost half of the real changes.',
        'Never interrupts needlessly, and catches only 1 in 5 real changes.'
      ];
      var rows = [
        { k: 'det', name: 'Changes detected', max: 100, unit: '%', color: 'var(--accent)' },
        { k: 'prec', name: 'Precision', max: 100, unit: '%', color: 'var(--sky)' },
        { k: 'help', name: 'Rated helpful', max: 100, unit: '%', color: 'var(--violet)' },
        { k: 'unn', name: 'Unnecessary / 100 rounds', max: 40, unit: '', color: 'var(--rose)' },
        { k: 'delay', name: 'Mean delay (rounds)', max: 5, unit: '', color: 'var(--warm)' }
      ];
      var w = root.querySelector('#thWidget');
      var bars = w.querySelector('.th-bars');
      bars.innerHTML = rows.map(function (r) {
        return '<div class="th-bar"><span class="name">' + r.name + '</span><div class="track"><div class="fill" data-k="' + r.k + '" style="background:' + r.color + '"></div></div><span class="val" data-v="' + r.k + '"></span></div>';
      }).join('');
      var slider = w.querySelector('input');
      var ticks = w.querySelectorAll('.ticks span');
      function render(i) {
        var d = data[i];
        rows.forEach(function (r) {
          bars.querySelector('[data-k="' + r.k + '"]').style.width = Math.min(100, (d[r.k] / r.max) * 100) + '%';
          bars.querySelector('[data-v="' + r.k + '"]').textContent = d[r.k] + r.unit;
        });
        ticks.forEach(function (t, j) { t.classList.toggle('on', j === i); });
        w.querySelector('.th-note').innerHTML = '<b>τ = ' + d.t + '</b> · score ' + d.score.toFixed(3) + ' — ' + notes[i];
      }
      slider.addEventListener('input', function () { render(+slider.value); });
      render(2);
    }
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'pinni',
    featured: true,
    isNew: true,
    title: 'Pinni: a multilingual local-news agent with a human in the loop',
    kicker: ['2026', 'Team of 3', 'Agent track lead'],
    cats: ['agents'],
    cover: { art: 'pinni' },
    short: 'Hyperlocal news for everyone in Oulu, internationals first. I built the agent track: an MCP server with 10 tools, a bounded supervisor that classifies, explains and translates stories into 4 languages, and a recommender, with sensitive topics always routed to a human editor.',
    stats: [['10', 'MCP tools'], ['4', 'languages + back-check'], ['3', 'retrieval signals fused']],
    tags: ['MCP', 'Supervisor agent', 'Hybrid search', 'SwiftUI'],
    links: [{ label: 'GitHub', href: 'https://github.com/The-Arctic-byte/Pinni', icon: 'github' }],
    facts: [['Role', 'Agents, MCP & recommender'], ['Team', 'App · Agents · Backend'], ['Models', 'Qwen 3.5 (Ollama)'], ['Clients', 'iPhone + Mac']],
    body: `
      <div class="cs-section">
        <h3>The idea</h3>
        <p>Newcomers to a city miss the news that matters most to them, such as housing notices, residence rules and campus changes, because it's local, scattered and in a language they don't read yet. Pinni is a map you can zoom from your street out to the world. Stories are ranked per person, explained in that person's language and checked by a human.</p>
        <p>We split the work into three tracks (app, agents, backend) behind a <b>contract-first</b> API: JSON Schema 2020-12 plus OpenAPI 3.1, with a validator that enforces rules a schema can't express, for example that a red-risk story is never published without a human.</p>
      </div>
      <div class="cs-section">
        <h3>The supervisor pipeline I built</h3>
        <div class="widget">
          <div class="widget-head"><b>One story through the bounded supervisor</b><span>Auto-plays · hover to pause</span></div>
          <div class="pipeline" id="plWidget">
            <div class="pl-step"><span class="n">01</span><div><b>Find &amp; ingest</b><small>RSS and local portals: Kaleva, City of Oulu, PSOAS, university</small></div><span class="tag">gather_news</span></div>
            <div class="pl-step"><span class="n">02</span><div><b>Gather by profile</b><small>A PSOAS tenant gets housing notices; a student gets campus news</small></div><span class="tag">gather_by_profile</span></div>
            <div class="pl-step"><span class="n">03</span><div><b>Select &amp; classify</b><small>Dedupe, spam filter, strict-JSON classification of category, scale, need and risk</small></div><span class="tag">Qwen 3.5 · schema</span></div>
            <div class="pl-step"><span class="n">04</span><div><b>Explain</b><small>Structured sections: what's known, what happened, what isn't known, what it means for you</small></div><span class="tag">create_draft</span></div>
            <div class="pl-step"><span class="n">05</span><div><b>Translate &amp; check</b><small>FI · EN · FA · SV with back-translation and quality tiers</small></div><span class="tag">tier 1–3</span></div>
            <div class="pl-step gate"><span class="n">06</span><div><b>Risk gate</b><small>Residence, health, money, work and safety go to a human editor</small></div><span class="tag">route_to_human</span></div>
            <div class="pl-step"><span class="n">07</span><div><b>Publish &amp; distribute</b><small>Matched to reader interests and location; must-see alerts</small></div><span class="tag">recommender</span></div>
            <div class="pl-step"><span class="n">08</span><div><b>Suggest channels</b><small>Collaborative neighbour overlap in the knowledge graph</small></div><span class="tag">suggest_channels</span></div>
            <div class="pl-step"><span class="n">09</span><div><b>Audit</b><small>Every decision and model trace goes to an append-only log</small></div><span class="tag">audit_log</span></div>
          </div>
        </div>
      </div>
      <div class="cs-section">
        <h3>Engineering highlights</h3>
        <ul class="cs-list">
          <li><b>MCP server (JSON-RPC 2.0)</b> with handshake, tool discovery and 10 tools: news gathering, vector search, geocoding, knowledge-graph queries, interaction recording, drafting and human routing.</li>
          <li><b>Hybrid search:</b> dense cosine similarity and BM25, fused with Reciprocal Rank Fusion and filtered by category, scale, place and risk.</li>
          <li><b>Recommender:</b> semantic profile match plus collaborative graph signal, a 24-hour half-life time decay, hard filters, a must-see override for safety alerts, a cold-start learner and 10–15% exploration against filter bubbles.</li>
          <li><b>Privacy by design:</b> story locations are areas, never points that could identify a home.</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Stack</h3>
        <div class="cs-stack">${['Python', 'MCP', 'Ollama · Qwen 3.5', 'SQLite', 'Knowledge graph', 'BM25 + dense + RRF', 'FastAPI', 'OpenAPI 3.1', 'JSON Schema', 'SwiftUI', 'uv · pytest'].map(function (s) { return '<span class="chip mono">' + s + '</span>'; }).join('')}</div>
      </div>`,
    init: function (root) {
      var steps = root.querySelectorAll('#plWidget .pl-step');
      var i = 0, paused = false;
      var wrap = root.querySelector('#plWidget');
      wrap.addEventListener('mouseenter', function () { paused = true; });
      wrap.addEventListener('mouseleave', function () { paused = false; });
      steps.forEach(function (s, j) { s.addEventListener('mouseenter', function () { set(j); }); });
      function set(j) { i = j; steps.forEach(function (s, k) { s.classList.toggle('active', k === j); }); }
      set(0);
      var timer = setInterval(function () {
        if (!document.body.contains(wrap)) return clearInterval(timer);
        if (!paused) set((i + 1) % steps.length);
      }, 1300);
    }
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'multihop',
    featured: true,
    isNew: true,
    title: 'MultiHopRAG: knowledge graph + vector retrieval',
    kicker: ['2026', 'Open source', 'Solo'],
    cats: ['agents'],
    cover: { img: 'assets/img/rag-poster.webp', pos: 'center' },
    short: 'Plain vector RAG can\'t connect facts that live in different documents. This system extracts a knowledge graph from the same corpus and combines graph traversal with vector search to answer multi-hop medical questions. It runs fully locally with no frameworks.',
    stats: [['1.7B', 'local LLM'], ['1–2', 'graph hops'], ['3', 'ablated modes']],
    tags: ['Graph RAG', 'Neo4j', 'Qdrant', 'Ollama'],
    links: [{ label: 'GitHub', href: 'https://github.com/AmirMohammad-Nouri/MultiHopRAG', icon: 'github' }],
    facts: [['Role', 'Solo'], ['LLM', 'Qwen3-1.7B (Ollama)'], ['Stores', 'Qdrant · Neo4j'], ['Cost', '$0, fully local']],
    body: `
      <div class="cs-section">
        <h3>The problem</h3>
        <p>Vector search finds text that <i>sounds like</i> the question. That works for "What does the A1C test measure?" and fails for:</p>
        <blockquote>What complications can result from the condition that the A1C test diagnoses?</blockquote>
        <p>No single chunk contains the answer. It needs the chain <b>A1C → diagnoses → Diabetes → causes → complications</b>, which spans at least two articles.</p>
        <div class="widget">
          <div class="widget-head"><b>Same question, two retrieval strategies</b>
            <div class="seg" id="hopSeg"><button data-m="vec">Vector only</button><button data-m="hyb" class="on">Hybrid</button></div>
          </div>
          <svg class="hop-svg" viewBox="0 0 720 230" id="hopSvg" role="img" aria-label="Multi-hop path from the A1C test to diabetes complications">
            <path class="edge" data-e="1" d="M150 115 C 200 115, 220 115, 270 115"/>
            <path class="edge" data-e="2" d="M410 115 C 450 115, 460 45, 510 45"/>
            <path class="edge" data-e="2" d="M410 115 C 450 115, 470 115, 510 115"/>
            <path class="edge" data-e="2" d="M410 115 C 450 115, 460 185, 510 185"/>
            <text class="elabel" x="182" y="105">diagnoses</text>
            <text class="elabel" x="430" y="100">causes</text>
            <g class="node" data-n="a1c"><rect x="20" y="92" width="130" height="46" rx="10"/><text x="85" y="120" text-anchor="middle">A1C test</text></g>
            <g class="node" data-n="dm"><rect x="270" y="92" width="140" height="46" rx="10"/><text x="340" y="120" text-anchor="middle">Diabetes</text></g>
            <g class="node" data-n="c1"><rect x="510" y="22" width="190" height="46" rx="10"/><text x="605" y="50" text-anchor="middle">Kidney disease</text></g>
            <g class="node" data-n="c2"><rect x="510" y="92" width="190" height="46" rx="10"/><text x="605" y="120" text-anchor="middle">Eye damage (retinopathy)</text></g>
            <g class="node" data-n="c3"><rect x="510" y="162" width="190" height="46" rx="10"/><text x="605" y="190" text-anchor="middle">Nerve damage</text></g>
          </svg>
          <div class="hop-answer" id="hopAnswer"></div>
        </div>
      </div>
      <div class="cs-section">
        <h3>Architecture</h3>
        <figure class="cs-figure"><img src="assets/img/rag-architecture.webp" alt="Architecture: source docs split into a vector path (chunk, embed, Qdrant) and a graph path (LLM extraction into Neo4j), merged in hybrid retrieval and grounded synthesis" loading="lazy" /><figcaption>Ingestion splits into a vector path and a graph path, which merge at query time.</figcaption></figure>
        <ul class="cs-list" style="margin-top:18px">
          <li><b>Ingestion:</b> parse MedlinePlus, chunk and embed into Qdrant, and separately prompt the LLM to extract (entity, relation, entity) triples into Neo4j.</li>
          <li><b>Schema-validated extraction:</b> JSON output is parsed defensively and then checked against a fixed entity and relation vocabulary. Off-vocabulary relations are dropped instead of trusted.</li>
          <li><b>Entity resolution:</b> names are canonicalised against the source article title, so "HbA1C", "A1C" and "Glycohemoglobin" become one node.</li>
          <li><b>Retrieval:</b> always run vector search, extract entities from the question and expand 1–2 hops in the graph. An empty graph result degrades gracefully to vector-only.</li>
          <li><b>Grounded synthesis:</b> answer only from the merged context, and say so explicitly when the context is insufficient.</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Decisions worth calling out</h3>
        <ul class="cs-list">
          <li><b>I removed the multi-hop classifier.</b> A 1.7B model reasoned about hop structure correctly in free text but was unreliable at one-word labels, which is a format-following limit rather than a reasoning one. Running graph expansion unconditionally removed a silent failure mode at a small compute cost.</li>
          <li><b>Deterministic evaluation.</b> Three modes (vector-only, graph-only, hybrid) run on the same pipeline with parts disabled, so the comparison isolates retrieval. Questions are scored by keyword match rather than having a small model judge its own output.</li>
          <li><b>No LangChain or LlamaIndex.</b> The orchestration is plain Python, so every mechanism is visible and testable.</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Stack</h3>
        <div class="cs-stack">${['Python', 'Ollama', 'Qwen3-1.7B', 'nomic-embed-text', 'Qdrant', 'Neo4j · Cypher', 'Docker Compose', 'FastAPI', 'Streamlit'].map(function (s) { return '<span class="chip mono">' + s + '</span>'; }).join('')}</div>
      </div>`,
    init: function (root) {
      var svg = root.querySelector('#hopSvg');
      var ans = root.querySelector('#hopAnswer');
      var seg = root.querySelector('#hopSeg');
      var timers = [];
      function clear() {
        timers.forEach(clearTimeout); timers = [];
        svg.querySelectorAll('.on, .vec').forEach(function (el) { el.classList.remove('on', 'vec'); });
      }
      function on(sel, cls, t) { timers.push(setTimeout(function () { svg.querySelectorAll(sel).forEach(function (el) { el.classList.add(cls); }); }, t)); }
      function run(mode) {
        clear();
        if (mode === 'vec') {
          on('[data-n="a1c"]', 'vec', 50);
          ans.innerHTML = '<b>Vector only:</b> retrieves the A1C article, which "sounds like" the question but never lists complications. Result: <b>insufficient context</b>.';
        } else {
          on('[data-n="a1c"]', 'on', 50);
          on('[data-e="1"]', 'on', 450);
          on('[data-n="dm"]', 'on', 800);
          on('[data-e="2"]', 'on', 1200);
          on('[data-n="c1"],[data-n="c2"],[data-n="c3"]', 'on', 1550);
          ans.innerHTML = '<b>Hybrid:</b> vector hit → entity "A1C" → hop 1 to <b>Diabetes</b> → hop 2 to its complications. The answer is grounded in facts from two separate articles.';
        }
      }
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        run(b.dataset.m);
      });
      run('hyb');
    }
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'stress',
    featured: true,
    isNew: true,
    title: 'Edge AI Stress Sense: voice-triggered wireless stress measurement',
    kicker: ['2026', 'Hardware + ML', 'Solo'],
    cats: ['edge', 'medical'],
    cover: { img: 'assets/img/stress-dashboard.webp', pos: 'top left' },
    short: 'Say "measure my stress level". An ESP32 hears it, wakes an ESP8266 over WiFi, and both stream pulse, skin-conductance and motion data for 60 seconds. A WESAD-trained model beats the original paper\'s wrist results.',
    stats: [['94.7%', 'accuracy (LOSO, 15 subj.)'], ['+6.4 pt', 'vs. WESAD paper'], ['r = 0.91', 'HR vs. chest ECG']],
    tags: ['ESP32', 'Signal processing', 'scikit-learn', 'Voice'],
    links: [
      { label: 'Project site', href: 'https://amirmohammad-nouri.github.io/edge-ai-stress-sense/', icon: 'ext' },
      { label: 'GitHub', href: 'https://github.com/AmirMohammad-Nouri/edge-ai-stress-sense', icon: 'github' }
    ],
    facts: [['Role', 'Firmware, ML, server, UI'], ['Hardware', 'ESP32 · ESP8266 · ADS1115'], ['Dataset', 'WESAD (15 subjects)'], ['Link', 'WiFi: WebSocket + UDP']],
    body: `
      <div class="cs-section">
        <h3>How it works</h3>
        <ul class="cs-list">
          <li><b>Trigger:</b> the ESP32 runs on-device voice activity detection and streams speech over WebSocket. Moonshine transcribes it, and a fuzzy rule matcher accepts commands even when STT hears "dress" for "stress".</li>
          <li><b>Coordination:</b> the ESP32 relays <code>START</code> to the ESP8266 over UDP, retrying every 250 ms until it gets an ACK, with a direct laptop-to-ESP8266 fallback. Discovery works through heartbeats, so no IPs need configuring.</li>
          <li><b>Sensing:</b> PPG and GSR at 64 Hz through a 16-bit ADS1115, and motion at 32 Hz, chosen to match the WESAD wrist device. Every packet is indexed, so loss is measured and interpolated.</li>
          <li><b>Inference:</b> 44 HRV, EDA and motion features computed by the <b>same module used in training</b>, followed by P(stress), a 3-class state, and a spoken reply via Piper TTS.</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Results vs. the WESAD paper (wrist)</h3>
        <div class="widget">
          <div class="widget-head"><b>Leave-one-subject-out accuracy</b><span class="legend"><span><i style="background:var(--accent)"></i>This work</span><span><i style="background:var(--text-3)"></i>WESAD paper</span></span></div>
          <div class="bars-cmp" id="bcWidget"></div>
        </div>
        <p style="margin-top:14px">The paper's best stress result also used skin temperature, which this hardware doesn't measure. Amusement remains hard to separate from baseline, as in the paper, and I report that rather than hide it.</p>
      </div>
      <div class="cs-section">
        <h3>Decisions backed by data</h3>
        <ul class="cs-list">
          <li><b>Motion is excluded from the deployed model.</b> Accelerometer data alone hit 87.5% because WESAD participants moved during the stress speech, so a still user would look "unstressed". Removing it costs nothing (94.7% vs. 94.9%) and removes the shortcut.</li>
          <li><b>Device-independent features.</b> Only beat timing is taken from PPG, never amplitude, and per-axis accelerometer means are dropped because sensor orientation differs between devices.</li>
          <li><b>Personal baseline.</b> A 3-minute relaxed calibration normalises every feature, raising accuracy from 91.2% to 94.7%.</li>
          <li><b>Hardware-free testing.</b> A simulator replays real WESAD recordings over the exact firmware protocol. HR through the simulated wireless path at 2% loss matches the direct computation (102.8 vs. 102.9 bpm).</li>
        </ul>
      </div>
      <div class="cs-section">
        <h3>Live dashboard</h3>
        <figure class="cs-figure"><img src="assets/img/stress-dashboard.webp" alt="Dashboard showing a live system diagram, stress gauge, heart rate, HRV and skin-conductance readouts and live signal charts" loading="lazy" /><figcaption>An animated system diagram, live signals, link health (RSSI, rate, loss) and the stress estimate.</figcaption></figure>
      </div>
      <div class="cs-section">
        <h3>Stack</h3>
        <div class="cs-stack">${['C++ / Arduino', 'ESP32 · I2S · VAD', 'ESP8266', 'Python asyncio', 'WebSocket · UDP', 'scikit-learn · AdaBoost', 'Moonshine STT', 'Piper TTS', 'Ollama + LangGraph', 'Canvas / SVG dashboard'].map(function (s) { return '<span class="chip mono">' + s + '</span>'; }).join('')}</div>
      </div>`,
    init: function (root) {
      var rows = [
        ['Stress vs. no stress', 'pulse + skin, personal baseline', 94.7, 88.3],
        ['Stress vs. no stress', 'pulse only', 90.2, 85.8],
        ['Stress vs. no stress', 'skin only', 88.9, 79.7],
        ['3-class affect', 'baseline / stress / amusement', 74.8, 76.2]
      ];
      var el = root.querySelector('#bcWidget');
      el.innerHTML = rows.map(function (r) {
        return '<div class="bc-row"><div class="lbl">' + r[0] + '<small>' + r[1] + '</small></div><div class="bc-pair">' +
          '<div class="bc-line"><div class="bc-track"><div class="bc-fill" data-w="' + r[2] + '" style="background:var(--accent)"></div></div><span>' + r[2] + '%</span></div>' +
          '<div class="bc-line"><div class="bc-track"><div class="bc-fill" data-w="' + r[3] + '" style="background:var(--text-3)"></div></div><span style="color:var(--text-3)">' + r[3] + '%</span></div>' +
          '</div></div>';
      }).join('');
      requestAnimationFrame(function () {
        setTimeout(function () {
          el.querySelectorAll('.bc-fill').forEach(function (f) { f.style.width = ((+f.dataset.w - 50) / 50 * 100) + '%'; });
        }, 120);
      });
    }
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'ceph',
    title: 'ViT cephalometric landmark detection',
    kicker: ['2025', 'SIMUT', 'Patent pending'],
    cats: ['medical', 'cv'],
    cover: { img: 'assets/img/ceph.webp' },
    short: 'A Vision Transformer that detects orthodontic landmarks on lateral cephalograms to plan treatment with removable appliances in children.',
    tags: ['ViT', 'PyTorch', 'Radiography'],
    links: [{ label: 'LinkedIn post', href: 'https://www.linkedin.com/posts/amir-mohammad-nouri_artificialintelligence-ai-computervision-activity-7368253060206202884-AHf6', icon: 'ext' }],
    facts: [['Company', 'Med Fanavaran Plus'], ['Status', 'Patent pending'], ['Paper', 'Under review (OCR)']],
    body: `<div class="cs-section"><h3>Overview</h3><p>Manual cephalometric tracing is slow and varies between clinicians. I designed a ViT-based system that localises the skeletal and dental landmarks on lateral cephalometric radiographs and turns them into the measurements orthodontists use to plan removable-appliance treatment in children.</p><p>The system is <b>patent pending</b>, and the paper is under review at <i>Orthodontics &amp; Craniofacial Research</i>.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">Vision Transformer</span><span class="chip mono">PyTorch</span><span class="chip mono">DICOM</span><span class="chip mono">Landmark regression</span></div></div>`
  },
  {
    id: 'healthyscope',
    title: 'HealthyScope: colonoscopy AI',
    kicker: ['2025', 'SIMUT'],
    cats: ['medical', 'cv'],
    cover: { img: 'assets/img/healthyscope.webp' },
    short: 'An end-to-end colonoscopy assistant that detects, segments and classifies polyps for early colorectal cancer prevention.',
    tags: ['Detection', 'Segmentation', 'Endoscopy'],
    links: [{ label: 'LinkedIn post', href: 'https://www.linkedin.com/posts/amir-mohammad-nouri_ai-healthcare-medicalimaging-activity-7372578269193211904-CAMK', icon: 'ext' }],
    facts: [['Company', 'Med Fanavaran Plus'], ['Modality', 'Endoscopic video']],
    body: `<div class="cs-section"><h3>Overview</h3><p>Missed polyps during colonoscopy are a leading cause of interval colorectal cancer. HealthyScope runs on the endoscopy stream to flag polyps in real time, segment their boundaries and classify them, giving the endoscopist a second pair of eyes during the procedure.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">PyTorch</span><span class="chip mono">Detection</span><span class="chip mono">Semantic segmentation</span><span class="chip mono">Classification</span></div></div>`
  },
  {
    id: 'pe',
    title: 'Pulmonary embolism segmentation in CT',
    kicker: ['2025', 'SIMUT'],
    cats: ['medical', 'cv'],
    cover: { img: 'assets/img/pe.webp' },
    short: 'A U-Net + MONAI pipeline for voxel-level segmentation of pulmonary emboli in CT angiography.',
    tags: ['U-Net', 'MONAI', '3D CT'],
    links: [{ label: 'LinkedIn post', href: 'https://www.linkedin.com/posts/amir-mohammad-nouri_deeppe-medicalimaging-pulmonaryembolism-ugcPost-7396423721638461440-N0zh/', icon: 'ext' }],
    facts: [['Company', 'Med Fanavaran Plus'], ['Modality', 'CT angiography']],
    body: `<div class="cs-section"><h3>Overview</h3><p>Pulmonary embolism is life-threatening and time-critical. I built a 3D segmentation pipeline with U-Net and MONAI that delineates emboli in lung CT scans, supporting AI-assisted radiology workflows that can flag them for priority reading.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">MONAI</span><span class="chip mono">U-Net</span><span class="chip mono">PyTorch</span><span class="chip mono">DICOM / NIfTI</span></div></div>`
  },
  {
    id: 'fetal',
    title: 'Fetal ultrasound biometry',
    kicker: ['2025', 'SIMUT'],
    cats: ['medical', 'cv'],
    cover: { img: 'assets/img/fetal.webp', fit: 'contain' },
    short: 'YOLOv8 models that automatically measure fetal head circumference and nuchal translucency in first-trimester 2D ultrasound.',
    tags: ['YOLOv8', 'Ultrasound', 'Prenatal'],
    links: [{ label: 'LinkedIn post', href: 'https://www.linkedin.com/posts/mostafa-ghelich-oghli_simuts-ai-powered-solution-the-future-ugcPost-7231615047481851904-KeFV', icon: 'ext' }],
    facts: [['Company', 'Med Fanavaran Plus'], ['Paper', 'Under review (IJIST)']],
    body: `<div class="cs-section"><h3>Overview</h3><p>Nuchal translucency thickness is a key first-trimester screening marker, but measuring it by hand is operator-dependent. I developed YOLOv8-based models that localise the relevant structures and produce automatic NT and head-circumference measurements. The paper is under review at the <i>International Journal of Imaging Systems and Technology</i>.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">YOLOv8</span><span class="chip mono">PyTorch</span><span class="chip mono">Ultrasound</span></div></div>`
  },
  {
    id: 'echo',
    title: 'Echocardiography: vector flow & strain',
    kicker: ['2024', 'SIMUT'],
    cats: ['medical', 'cv'],
    cover: { img: 'assets/img/echo.webp' },
    short: 'Vector flow imaging and speckle tracking to visualise blood flow and measure myocardial strain in echocardiographic sequences.',
    tags: ['VFI', 'Speckle tracking', 'Cardiac'],
    links: [{ label: 'LinkedIn post', href: 'https://www.linkedin.com/posts/amir-mohammad-nouri_artificialintelligence-medicalimaging-vectorflow-activity-7322564285799317504-BaWG', icon: 'ext' }],
    facts: [['Company', 'Med Fanavaran Plus'], ['Modality', 'Echocardiography']],
    body: `<div class="cs-section"><h3>Overview</h3><p>Vector Flow Imaging and speckle tracking turn echocardiographic sequences into quantitative cardiac function: blood-flow vector fields inside the chambers, and strain curves that reveal myocardial dysfunction before ejection fraction drops.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">Optical flow</span><span class="chip mono">Speckle tracking</span><span class="chip mono">Python</span><span class="chip mono">OpenCV</span></div></div>`
  },
  {
    id: 'wearables',
    title: 'Wearable biosignal analysis',
    kicker: ['2026', 'Vitruvian Shield'],
    cats: ['edge'],
    cover: { img: 'assets/img/wearables.webp' },
    short: 'A real-time ECG, PPG and IMU pipeline for physiological state estimation and anomaly detection on resource-constrained wearables.',
    tags: ['ECG / PPG', 'Wearables', 'Real-time'],
    links: [],
    facts: [['Company', 'Vitruvian Shield'], ['Signals', 'ECG · PPG · IMU']],
    body: `<div class="cs-section"><h3>Overview</h3><p>At Vitruvian Shield I built the AI layer of a wearable health platform: signal cleaning, beat detection and feature extraction from ECG, PPG and motion sensors, plus models that estimate physiological state and flag anomalies within the compute budget of wearable hardware.</p></div><div class="cs-section"><h3>Stack</h3><div class="cs-stack"><span class="chip mono">Signal processing</span><span class="chip mono">PyTorch</span><span class="chip mono">HRV</span><span class="chip mono">Anomaly detection</span></div></div>`
  }
];

/* Nodes for the hero skill graph. `cat` links a node to a project filter. */
window.SKILL_NODES = [
  { id: 'agents', label: 'LLM Agents', cat: 'agents', size: 1.0, desc: 'Supervisor agents, tool use and human-in-the-loop (FoodRec, Pinni)' },
  { id: 'rag', label: 'Graph RAG', cat: 'agents', size: 0.9, desc: 'Hybrid vector + knowledge-graph retrieval (MultiHopRAG)' },
  { id: 'mcp', label: 'MCP', cat: 'agents', size: 0.6, desc: 'Model Context Protocol server with 10 tools (Pinni)' },
  { id: 'recsys', label: 'RecSys', cat: 'agents', size: 0.8, desc: 'Multi-criteria and collaborative recommenders (FoodRec, Pinni)' },
  { id: 'kg', label: 'Knowledge Graphs', cat: 'agents', size: 0.7, desc: 'Neo4j, entity resolution, graph-based suggestions' },
  { id: 'med', label: 'Medical Imaging', cat: 'medical', size: 1.0, desc: 'CT, ultrasound, endoscopy and radiography models in clinical settings' },
  { id: 'seg', label: 'Segmentation', cat: 'medical', size: 0.65, desc: 'U-Net, MONAI, polyp and embolism segmentation' },
  { id: 'vit', label: 'ViT', cat: 'medical', size: 0.55, desc: 'Transformer landmark detection (patent pending)' },
  { id: 'cv', label: 'Computer Vision', cat: 'cv', size: 0.85, desc: 'Detection, calibration, tracking and broadcast vision' },
  { id: 'edge', label: 'Edge AI', cat: 'edge', size: 0.9, desc: 'ESP32 firmware, on-device VAD, wireless sensing' },
  { id: 'bio', label: 'Biosignals', cat: 'edge', size: 0.75, desc: 'ECG, PPG and EDA features; 94.7% LOSO stress detection' },
  { id: 'eval', label: 'Evaluation', cat: 'all', size: 0.6, desc: 'Ablations, LOSO and simulated user studies, with honest limitations' }
];
window.SKILL_EDGES = [
  ['agents', 'rag'], ['agents', 'mcp'], ['agents', 'recsys'], ['rag', 'kg'], ['recsys', 'kg'], ['agents', 'kg'],
  ['med', 'seg'], ['med', 'vit'], ['med', 'cv'], ['seg', 'cv'], ['vit', 'cv'],
  ['edge', 'bio'], ['bio', 'med'], ['edge', 'cv'],
  ['eval', 'agents'], ['eval', 'med'], ['eval', 'bio'], ['eval', 'rag'], ['rag', 'med']
];
