import { CONSCIOUSNESS_DATA } from './data.js';
import { ConsciousnessSimulator } from './simulator.js';
import { NeuralAudioEngine } from './audio.js';

class ConsciousnessArchiveApp {
  constructor() {
    this.simulator = null;
    this.audio = new NeuralAudioEngine();
    this.activeFilter = 'all';

    this.init();
  }

  init() {
    this.renderHeaderMeta();
    this.renderHero();
    this.renderLeadArticle();
    this.renderTheories();
    this.renderArchiveGrid();
    this.renderChronology();
    this.renderInstitutions();
    this.setupSimulator();
    this.setupEventListeners();
    this.setupHoverPreviews();
    this.startTimeTicker();
  }

  renderHeaderMeta() {
    const coordsEl = document.getElementById('headerCoords');
    if (coordsEl) coordsEl.innerText = CONSCIOUSNESS_DATA.header.coordinates;
  }

  renderHero() {
    const pillarsEl = document.getElementById('heroPillars');
    if (pillarsEl) {
      pillarsEl.innerHTML = CONSCIOUSNESS_DATA.heroPillars.map(p => `
        <div class="pillar-card">
          <div class="pillar-label">${p.label}</div>
          <div class="pillar-val">${p.value}</div>
        </div>
      `).join('');
    }
  }

  renderLeadArticle() {
    const leadContainer = document.getElementById('articleLeadContainer');
    if (!leadContainer) return;

    const { lead, paragraphs } = CONSCIOUSNESS_DATA.leadArticle;
    
    let html = `<div class="article-lead">${lead}</div>`;

    paragraphs.forEach(p => {
      let text = p.text;
      // Inject interactive hover tokens
      CONSCIOUSNESS_DATA.glossary.forEach(g => {
        const regex = new RegExp(`\\b(${g.term})\\b`, 'gi');
        text = text.replace(regex, `<span class="token-link" data-term="${g.term}" data-def="${g.def}">$1</span>`);
      });

      html += `<p class="article-paragraph">${text}</p>`;
    });

    leadContainer.innerHTML = html;
  }

  renderTheories() {
    const container = document.getElementById('theoriesGrid');
    if (!container) return;

    container.innerHTML = CONSCIOUSNESS_DATA.theories.map((t, idx) => `
      <div class="theory-card" data-theory-id="${t.id}">
        <div>
          <div class="theory-tag">[ 0${idx + 1} / ${t.tag} ]</div>
          <h3 class="theory-name">${t.name}</h3>
          <div class="theory-architects">${t.architects} (${t.year})</div>
          <p class="theory-summary">${t.coreIdea}</p>
        </div>
        <div class="theory-inspect-link">
          Inspect Architecture <span>→</span>
        </div>
      </div>
    `).join('');
  }

  renderArchiveGrid() {
    const grid = document.getElementById('archiveGrid');
    if (!grid) return;

    const filtered = this.activeFilter === 'all'
      ? CONSCIOUSNESS_DATA.archiveCards
      : CONSCIOUSNESS_DATA.archiveCards.filter(c => c.category.toLowerCase().includes(this.activeFilter.toLowerCase()));

    grid.innerHTML = filtered.map(item => `
      <div class="archive-item" data-archive-id="${item.id}">
        <div>
          <div class="item-category">${item.category}</div>
          <h4 class="item-title">${item.title}</h4>
          <div class="item-originator">${item.originator}</div>
          <p class="item-excerpt">${item.excerpt}</p>
        </div>
        <div class="item-tag">${item.tag}</div>
      </div>
    `).join('');
  }

  renderChronology() {
    const tableBody = document.getElementById('chronologyTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = CONSCIOUSNESS_DATA.milestones.map(m => `
      <tr>
        <td style="font-weight:700; color:var(--accent-blue); width: 90px;">${m.year}</td>
        <td style="font-weight:600; width: 260px;">${m.title}</td>
        <td style="color:var(--text-muted);">${m.desc}</td>
      </tr>
    `).join('');
  }

  renderInstitutions() {
    const tableBody = document.getElementById('institutionsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = CONSCIOUSNESS_DATA.institutions.map(inst => `
      <tr>
        <td style="font-weight:600;">${inst.name}</td>
        <td style="color:var(--text-muted);">${inst.location}</td>
        <td style="color:var(--accent-blue);">${inst.lead}</td>
      </tr>
    `).join('');
  }

  setupSimulator() {
    const canvas = document.getElementById('neuralCanvas');
    const statusEl = document.getElementById('simStateStatus');
    const metricEl = document.getElementById('simMetricsDisplay');

    if (canvas) {
      this.simulator = new ConsciousnessSimulator(canvas, statusEl, metricEl);
    }
  }

  setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          themeBtn.innerText = 'THEME : LIGHT';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          themeBtn.innerText = 'THEME : DARK';
        }
      });
    }

    // Audio Engine Toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const active = this.audio.toggle();
        audioBtn.innerText = active ? 'GAMMA 40HZ : ON' : 'GAMMA 40HZ : OFF';
        audioBtn.style.color = active ? 'var(--accent-blue)' : '';
      });
    }

    // Simulator Sliders
    const bindSlider = (id, paramKey) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}Val`);
      if (el && this.simulator) {
        el.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          this.simulator.params[paramKey] = val;
          if (valEl) valEl.innerText = val.toFixed(2);
        });
      }
    };

    bindSlider('sliderPhi', 'phi');
    bindSlider('sliderPriors', 'priors');
    bindSlider('sliderIgnition', 'ignitionThreshold');
    bindSlider('sliderQuantum', 'quantumCoherence');
    bindSlider('sliderArousal', 'arousal');

    // Simulator Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-preset');
        if (this.simulator && preset) {
          this.simulator.setPreset(preset);
          this.syncSliderUI();
          this.audio.playIgnitionChime();
        }
      });
    });

    // Stimulate Button
    const stimBtn = document.getElementById('btnStimulatePulse');
    if (stimBtn && this.simulator) {
      stimBtn.addEventListener('click', () => {
        this.simulator.stimulate('S1', 1.0);
        this.audio.playIgnitionChime();
      });
    }

    // Archive Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeFilter = e.target.getAttribute('data-filter');
        this.renderArchiveGrid();
        this.setupArchiveClickListeners();
      });
    });

    // Theory Click -> Open Drawer
    document.addEventListener('click', (e) => {
      const theoryCard = e.target.closest('.theory-card');
      if (theoryCard) {
        const id = theoryCard.getAttribute('data-theory-id');
        this.openTheoryDrawer(id);
      }

      const archiveCard = e.target.closest('.archive-item');
      if (archiveCard) {
        const id = archiveCard.getAttribute('data-archive-id');
        this.openArchiveDrawer(id);
      }
    });

    // Drawer Close
    const closeBtn = document.getElementById('drawerCloseBtn');
    const overlay = document.getElementById('drawerOverlay');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (overlay) overlay.addEventListener('click', () => this.closeDrawer());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDrawer();
    });
  }

  syncSliderUI() {
    if (!this.simulator) return;
    const p = this.simulator.params;
    const update = (id, val) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}Val`);
      if (el) el.value = val;
      if (valEl) valEl.innerText = val.toFixed(2);
    };

    update('sliderPhi', p.phi);
    update('sliderPriors', p.priors);
    update('sliderIgnition', p.ignitionThreshold);
    update('sliderQuantum', p.quantumCoherence);
    update('sliderArousal', p.arousal);
  }

  setupArchiveClickListeners() {
    // Dynamic refresh
  }

  openTheoryDrawer(theoryId) {
    const theory = CONSCIOUSNESS_DATA.theories.find(t => t.id === theoryId);
    if (!theory) return;

    const drawer = document.getElementById('inspectorDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerDynamicContent');

    if (content) {
      content.innerHTML = `
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-blue); text-transform:uppercase;">
          [ PARADIGM DOSSIER // ${theory.acronym} ]
        </div>
        <h2 style="font-size:2rem; font-weight:900; line-height:1.1; margin-top:0.25rem;">${theory.name}</h2>
        <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">
          Key Architects: ${theory.architects} (${theory.year})
        </div>

        <div style="background:var(--bg-surface); padding:1.25rem; border:1px solid var(--border-hairline); margin-top:1rem;">
          <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; margin-bottom:0.35rem;">Core Axiom / Hypothesis</div>
          <p style="font-size:1rem; font-weight:500;">${theory.coreIdea}</p>
        </div>

        <div style="margin-top:1rem;">
          <h4 style="font-family:var(--font-mono); font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem; color:var(--text-primary);">Biophysical Mechanism</h4>
          <p style="font-size:0.95rem; line-height:1.65; color:var(--text-primary);">${theory.mechanism}</p>
        </div>

        <div style="margin-top:1rem;">
          <h4 style="font-family:var(--font-mono); font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem; color:var(--text-primary);">Mathematical / Formal Substrate</h4>
          <div style="font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-surface); padding:0.85rem; border-left:3px solid var(--accent-blue);">
            <code>${theory.keyFormula}</code>
          </div>
        </div>

        <div style="margin-top:1rem;">
          <h4 style="font-family:var(--font-mono); font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem; color:var(--text-primary);">Anatomical Localization</h4>
          <p style="font-size:0.9rem; line-height:1.55; color:var(--text-muted);">${theory.substrate}</p>
        </div>

        <div style="margin-top:1rem; border-top:1px solid var(--border-hairline); padding-top:1rem;">
          <h4 style="font-family:var(--font-mono); font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem; color:var(--accent-blue);">Empirical Corroboration</h4>
          <p style="font-size:0.9rem; line-height:1.55;">${theory.empiricalEvidence}</p>
        </div>
      `;
    }

    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
    }
  }

  openArchiveDrawer(archiveId) {
    const item = CONSCIOUSNESS_DATA.archiveCards.find(a => a.id === archiveId);
    if (!item) return;

    const drawer = document.getElementById('inspectorDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerDynamicContent');

    if (content) {
      content.innerHTML = `
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-blue); text-transform:uppercase;">
          [ ARCHIVE RECORD // ${item.category} ]
        </div>
        <h2 style="font-size:2rem; font-weight:900; line-height:1.1; margin-top:0.25rem;">${item.title}</h2>
        <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">
          Recorded by: ${item.originator}
        </div>

        <div style="background:var(--bg-surface); padding:1.25rem; border:1px solid var(--border-hairline); margin-top:1.5rem;">
          <p style="font-size:1.05rem; line-height:1.6;">${item.excerpt}</p>
        </div>

        <div style="margin-top:1.5rem;">
          <h4 style="font-family:var(--font-mono); font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem; color:var(--accent-blue);">Philosophical & Cognitive Significance</h4>
          <p style="font-size:0.95rem; line-height:1.65; color:var(--text-primary);">${item.significance}</p>
        </div>

        <div style="margin-top:1.5rem; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">
          TAGS: #${item.tag.replace(/\\s+/g, '_')} #CONSCIOUSNESS_ARCHIVE
        </div>
      `;
    }

    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('inspectorDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  setupHoverPreviews() {
    const popover = document.getElementById('hoverPreviewPopover');
    if (!popover) return;

    document.addEventListener('mouseover', (e) => {
      const token = e.target.closest('.token-link');
      if (token) {
        const term = token.getAttribute('data-term');
        const def = token.getAttribute('data-def');

        popover.innerHTML = `
          <div class="popover-term">${term}</div>
          <div class="popover-body">${def}</div>
        `;
        popover.classList.add('visible');

        const updatePos = (mouseEvent) => {
          const x = Math.min(window.innerWidth - 300, mouseEvent.clientX + 16);
          const y = Math.min(window.innerHeight - 150, mouseEvent.clientY + 16);
          popover.style.left = `${x}px`;
          popover.style.top = `${y}px`;
        };

        updatePos(e);
        token.onmousemove = updatePos;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const token = e.target.closest('.token-link');
      if (token) {
        token.onmousemove = null;
        popover.classList.remove('visible');
      }
    });
  }

  startTimeTicker() {
    const tickerEl = document.getElementById('liveTimeTicker');
    if (!tickerEl) return;

    const start = performance.now();
    setInterval(() => {
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      tickerEl.innerText = `REC T+${elapsed}s`;
    }, 100);
  }
}

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ConsciousnessArchiveApp();
});
