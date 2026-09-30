/**
 * Neural Consciousness Dynamics Simulator
 * Simulates GNWT ignition, IIT Φ causal density, and Predictive Processing loops.
 */
export class ConsciousnessSimulator {
  constructor(canvasElement, statusElement, metricElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.statusEl = statusElement;
    this.metricEl = metricElement;

    // Simulation Parameters
    this.params = {
      phi: 0.78,             // Integrated causal density (IIT)
      priors: 0.65,          // Top-down predictive expectation weight (PP)
      ignitionThreshold: 0.55,// Frontoparietal ignition cutoff (GNWT)
      quantumCoherence: 0.30,// Microtubule noise/coherence (Orch-OR)
      arousal: 0.85          // Reticular activating system drive (RAS)
    };

    this.nodes = [];
    this.connections = [];
    this.pulses = [];
    this.time = 0;
    this.isIgnited = false;
    this.ignitionWave = 0;
    this.ignitedTime = 0;
    this.running = true;

    this.initCanvas();
    this.buildNetwork();
    this.setupListeners();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 420;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  buildNetwork() {
    this.nodes = [];
    this.connections = [];
    this.pulses = [];

    const w = this.width;
    const h = this.height;

    // Node layers:
    // 0: Sensory / V1 (bottom-left/mid)
    // 1: Posterior Hot Zone (IIT cluster, right mid)
    // 2: Frontoparietal Workspace (dlPFC/PPC top-left and top-right)
    // 3: Thalamocortical Relay (center core)

    const layerDefs = [
      // Sensory (Bottom)
      { id: 'S1', x: w * 0.18, y: h * 0.78, layer: 'sensory', name: 'V1 Sensory In' },
      { id: 'S2', x: w * 0.30, y: h * 0.82, layer: 'sensory', name: 'V2 Secondary' },
      { id: 'S3', x: w * 0.42, y: h * 0.80, layer: 'sensory', name: 'V4 Visual Cortex' },

      // Thalamus (Core)
      { id: 'TH1', x: w * 0.50, y: h * 0.52, layer: 'thalamus', name: 'Centromedian Thalamus' },
      { id: 'TH2', x: w * 0.58, y: h * 0.48, layer: 'thalamus', name: 'Pulvinar Nucleus' },

      // Posterior Hot Zone (IIT Hub)
      { id: 'HZ1', x: w * 0.72, y: h * 0.65, layer: 'hotzone', name: 'Parieto-Occipital' },
      { id: 'HZ2', x: w * 0.84, y: h * 0.55, layer: 'hotzone', name: 'Temporoparietal' },
      { id: 'HZ3', x: w * 0.78, y: h * 0.42, layer: 'hotzone', name: 'Inferior Parietal' },
      { id: 'HZ4', x: w * 0.68, y: h * 0.35, layer: 'hotzone', name: 'Precuneus (Core Φ)' },

      // Frontoparietal Workspace (GNWT Top Hubs)
      { id: 'FP1', x: w * 0.22, y: h * 0.28, layer: 'workspace', name: 'dlPFC (Left)' },
      { id: 'FP2', x: w * 0.34, y: h * 0.20, layer: 'workspace', name: 'Frontopolar (BA10)' },
      { id: 'FP3', x: w * 0.48, y: h * 0.22, layer: 'workspace', name: 'Anterior Cingulate' },
      { id: 'FP4', x: w * 0.62, y: h * 0.18, layer: 'workspace', name: 'Parietal Workspace Hub' }
    ];

    layerDefs.forEach(d => {
      this.nodes.push({
        ...d,
        radius: d.layer === 'workspace' ? 7 : d.layer === 'hotzone' ? 6 : 5,
        activity: 0.1,
        potential: Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        quantumPhase: Math.random() * Math.PI * 2
      });
    });

    // Build Interconnected Graph
    const addConn = (fromId, toId, type = 'feedforward') => {
      const from = this.nodes.find(n => n.id === fromId);
      const to = this.nodes.find(n => n.id === toId);
      if (from && to) {
        this.connections.push({ from, to, type, strength: 0.8, signal: 0 });
      }
    };

    // Bottom-Up Sensory Feed
    addConn('S1', 'S2');
    addConn('S2', 'S3');
    addConn('S2', 'TH1');
    addConn('S3', 'HZ1');
    addConn('S3', 'TH2');

    // Thalamocortical loops
    addConn('TH1', 'FP1');
    addConn('TH1', 'HZ4');
    addConn('TH2', 'HZ2');
    addConn('TH2', 'FP3');

    // Dense IIT Hot-Zone Mesh (Recurrent)
    addConn('HZ1', 'HZ2', 'recurrent');
    addConn('HZ2', 'HZ3', 'recurrent');
    addConn('HZ3', 'HZ4', 'recurrent');
    addConn('HZ4', 'HZ1', 'recurrent');
    addConn('HZ2', 'HZ4', 'recurrent');

    // Long-Range Workspace Collaterals (GNWT)
    addConn('FP1', 'FP2', 'workspace');
    addConn('FP2', 'FP3', 'workspace');
    addConn('FP3', 'FP4', 'workspace');
    addConn('FP1', 'HZ4', 'broadcast');
    addConn('FP3', 'HZ3', 'broadcast');
    addConn('FP4', 'HZ2', 'broadcast');

    // Top-Down Predictive Feedback (PP)
    addConn('FP1', 'S2', 'feedback');
    addConn('FP2', 'S3', 'feedback');
    addConn('HZ4', 'S3', 'feedback');
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.buildNetwork();
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find closest node
      const clicked = this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < 22);
      if (clicked) {
        this.stimulate(clicked.id, 1.0);
      } else {
        // Stimulate sensory input by default
        this.stimulate('S1', 0.9);
      }
    });
  }

  stimulate(nodeId = 'S1', intensity = 0.9) {
    const startNode = this.nodes.find(n => n.id === nodeId) || this.nodes[0];
    startNode.activity = Math.min(1.0, startNode.activity + intensity);

    // Spawn pulses
    this.connections.filter(c => c.from === startNode).forEach(c => {
      this.pulses.push({
        from: c.from,
        to: c.to,
        progress: 0,
        speed: 0.035 * (0.8 + this.params.arousal * 0.5),
        intensity: intensity,
        type: c.type
      });
    });
  }

  setPreset(name) {
    switch (name) {
      case 'awake':
        this.params = { phi: 0.85, priors: 0.65, ignitionThreshold: 0.50, quantumCoherence: 0.35, arousal: 0.90 };
        this.stimulate('S1', 1.0);
        break;
      case 'lucid':
        this.params = { phi: 0.72, priors: 0.92, ignitionThreshold: 0.40, quantumCoherence: 0.50, arousal: 0.75 };
        this.stimulate('FP2', 1.0);
        break;
      case 'anesthesia':
        this.params = { phi: 0.08, priors: 0.20, ignitionThreshold: 0.95, quantumCoherence: 0.05, arousal: 0.12 };
        this.isIgnited = false;
        break;
      case 'psychedelic':
        this.params = { phi: 0.94, priors: 0.15, ignitionThreshold: 0.25, quantumCoherence: 0.88, arousal: 0.85 };
        this.stimulate('HZ4', 1.0);
        break;
      case 'blindsight':
        this.params = { phi: 0.28, priors: 0.50, ignitionThreshold: 0.88, quantumCoherence: 0.20, arousal: 0.70 };
        this.stimulate('S1', 0.45);
        break;
    }
  }

  update() {
    this.time += 0.025;

    // Decay activities
    this.nodes.forEach(n => {
      n.activity = Math.max(0.05, n.activity * 0.965);
      n.phase += 0.08 * (0.5 + this.params.arousal);
      n.quantumPhase += 0.15 * (this.params.quantumCoherence + 0.1);
    });

    // Check workspace ignition condition
    const workspaceNodes = this.nodes.filter(n => n.layer === 'workspace');
    const avgWorkspace = workspaceNodes.reduce((acc, n) => acc + n.activity, 0) / workspaceNodes.length;

    const ignitionCutoff = this.params.ignitionThreshold;
    const canIgnite = this.params.arousal > 0.35 && this.params.phi > 0.35;

    if (avgWorkspace > ignitionCutoff && canIgnite) {
      if (!this.isIgnited) {
        this.isIgnited = true;
        this.ignitionWave = 1.0;
        this.ignitedTime = this.time;
        // Global Broadcast cascade
        this.nodes.forEach(n => {
          n.activity = Math.min(1.0, n.activity + 0.6 * this.params.phi);
        });
      }
    } else if (avgWorkspace < 0.25) {
      this.isIgnited = false;
    }

    if (this.ignitionWave > 0) {
      this.ignitionWave -= 0.02;
    }

    // Move pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        // Pulse arrived at target node
        const target = p.to;
        let gain = p.intensity * (p.type === 'feedback' ? this.params.priors : 1.0);
        if (p.type === 'recurrent') gain *= (1.0 + this.params.phi * 0.8);
        if (p.type === 'broadcast') gain *= (this.isIgnited ? 1.2 : 0.4);

        target.activity = Math.min(1.0, target.activity + gain * 0.6);

        // Branch out
        if (target.activity > 0.25 && Math.random() < 0.75) {
          const outgoing = this.connections.filter(c => c.from === target);
          outgoing.forEach(c => {
            if (this.pulses.length < 80) {
              this.pulses.push({
                from: c.from,
                to: c.to,
                progress: 0,
                speed: 0.035 * (0.8 + this.params.arousal * 0.5),
                intensity: p.intensity * 0.75,
                type: c.type
              });
            }
          });
        }

        this.pulses.splice(i, 1);
      }
    }

    // Autonomous spontaneous pacemaker / resting state oscillations
    if (Math.random() < 0.035 * this.params.arousal) {
      const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      randomNode.activity = Math.min(1.0, randomNode.activity + 0.3);
    }
  }

  evaluateConsciousState() {
    const { phi, priors, ignitionThreshold, quantumCoherence, arousal } = this.params;

    let stateTitle = "";
    let stateDesc = "";
    let color = "#009dd8";

    if (arousal < 0.25 || phi < 0.20) {
      stateTitle = "UNCONSCIOUS (COMA / DEEP ANESTHESIA)";
      stateDesc = "Irreducible causal density Φ collapsed. Thalamocortical synchronization extinguished. No global broadcast.";
      color = "#666666";
    } else if (priors > 0.82 && arousal > 0.55) {
      stateTitle = "INTERNALLY GENERATED QUALIA (LUCID DREAM)";
      stateDesc = "Top-down predictive priors uncoupled from sensory bottom-up constraints. Autonomous high-order narrative binding.";
      color = "#9333ea";
    } else if (priors < 0.25 && phi > 0.75) {
      stateTitle = "HIGH-ENTROPY EXPANSION (ENTROPIC / PSYCHEDELIC)";
      stateDesc = "DMN hierarchical priors suppressed. Unconstrained multi-sensory cross-talk and ego-boundary relaxation.";
      color = "#e11d48";
    } else if (this.isIgnited && phi >= 0.50) {
      stateTitle = "CONSCIOUS ACCESS (GLOBAL WORKSPACE IGNITION)";
      stateDesc = "P3b gamma ignition active. Long-range frontoparietal synchronization broadcast across modular cortices.";
      color = "#009dd8";
    } else if (phi >= 0.45 && !this.isIgnited) {
      stateTitle = "PHENOMENAL CONSCIOUSNESS (LOCAL SENSORY RECURRENCE)";
      stateDesc = "Recurrent posterior loops active with rich phenomenal qualia, but below access/reportability threshold.";
      color = "#d97706";
    } else {
      stateTitle = "SUBLIMINAL / PRE-CONSCIOUS PROCESSING";
      stateDesc = "Feedforward sensory wave active; transient local feature extraction fading before triggering global cascade.";
      color = "#52525b";
    }

    const calculatedPhi = (phi * (0.6 + arousal * 0.4) * (this.isIgnited ? 1.35 : 0.85)).toFixed(3);

    if (this.statusEl) {
      this.statusEl.innerHTML = `<span style="color:${color}; font-weight:700;">● ${stateTitle}</span><br><span style="font-size:0.82rem; opacity:0.85;">${stateDesc}</span>`;
    }

    if (this.metricEl) {
      this.metricEl.innerText = `Φ = ${calculatedPhi} bits | IGNITION: ${this.isIgnited ? 'ACTIVE (P3b+)' : 'SUB-THRESHOLD'} | COHERENCE: ${(quantumCoherence * 100).toFixed(0)}%`;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Background Grid lines (Brutalist Sleutelaar style)
    ctx.strokeStyle = "rgba(180, 180, 180, 0.12)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Subtle Brain Outline / Anatomical Boundaries
    ctx.strokeStyle = "rgba(100, 100, 100, 0.18)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(w * 0.50, h * 0.48, w * 0.42, h * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Area labels
    ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
    ctx.fillStyle = "rgba(120, 120, 120, 0.45)";
    ctx.fillText("[ ANTERIOR PFC / WORKSPACE ]", w * 0.15, h * 0.12);
    ctx.fillText("[ POSTERIOR HOT ZONE (Φ) ]", w * 0.65, h * 0.88);
    ctx.fillText("[ PRIMARY SENSORY GATEWAYS ]", w * 0.12, h * 0.94);

    // Ignition Wave Effect
    if (this.ignitionWave > 0) {
      ctx.save();
      ctx.strokeStyle = `rgba(0, 157, 216, ${this.ignitionWave * 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.25, (1 - this.ignitionWave) * w * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Connections
    this.connections.forEach(c => {
      const avgActivity = (c.from.activity + c.to.activity) / 2;
      ctx.beginPath();
      ctx.moveTo(c.from.x, c.from.y);
      ctx.lineTo(c.to.x, c.to.y);

      let alpha = 0.12 + avgActivity * 0.5;
      let strokeColor = `rgba(140, 140, 140, ${alpha})`;

      if (c.type === 'workspace') {
        strokeColor = `rgba(0, 157, 216, ${alpha * 1.2})`;
      } else if (c.type === 'recurrent') {
        strokeColor = `rgba(217, 119, 6, ${alpha * 1.2})`;
      } else if (c.type === 'feedback') {
        strokeColor = `rgba(147, 51, 234, ${alpha * 1.1})`;
      } else if (c.type === 'broadcast' && this.isIgnited) {
        strokeColor = `rgba(0, 157, 216, 0.85)`;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = c.type === 'broadcast' && this.isIgnited ? 2.5 : 1.2;
      ctx.stroke();
    });

    // Draw Pulses
    this.pulses.forEach(p => {
      const curX = p.from.x + (p.to.x - p.from.x) * p.progress;
      const curY = p.from.y + (p.to.y - p.from.y) * p.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.type === 'feedback' ? '#9333ea' : p.type === 'recurrent' ? '#d97706' : '#009dd8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes
    this.nodes.forEach(n => {
      const osc = Math.sin(n.phase) * 0.2;
      const quantumWiggle = Math.sin(n.quantumPhase) * (this.params.quantumCoherence * 3);
      const r = n.radius + n.activity * 5 + osc;

      // Glow halo
      if (n.activity > 0.25) {
        ctx.beginPath();
        ctx.arc(n.x + quantumWiggle, n.y, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.layer === 'workspace'
          ? `rgba(0, 157, 216, ${n.activity * 0.35})`
          : n.layer === 'hotzone'
          ? `rgba(217, 119, 6, ${n.activity * 0.35})`
          : `rgba(255, 255, 255, ${n.activity * 0.25})`;
        ctx.fill();
      }

      // Main Node Dot
      ctx.beginPath();
      ctx.arc(n.x + quantumWiggle, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.layer === 'workspace'
        ? (this.isIgnited ? '#009dd8' : '#0d0d0d')
        : n.layer === 'hotzone'
        ? '#d97706'
        : '#222222';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Micro Monospace Node Label
      ctx.font = "8px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "rgba(60, 60, 60, 0.85)";
      ctx.fillText(n.id, n.x + 9, n.y + 3);
    });
  }

  animate() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.evaluateConsciousState();
    requestAnimationFrame(this.animate);
  }

  destroy() {
    this.running = false;
  }
}
