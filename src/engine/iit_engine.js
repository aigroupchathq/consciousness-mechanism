/**
 * THE UNEXPLORED INTERIOR // REAL-TIME IIT 4.0 DUAL-ENGINE BRIDGE
 * Orchestrates WebGPU WGSL Tensor Compute with automatic multithreaded Web Worker fallback.
 * Governed by LoveFrom × Antigravity Executive Design Studio Canon.
 */

class IIT4Engine {
  constructor(options = {}) {
    this.numNodes = 8;
    this.numBipartitions = 127;
    
    // Core state buffers
    this.weights = new Float32Array(64);       // 8x8 synaptic weight matrix
    this.thresholds = new Float32Array(8);     // Activation thresholds
    this.stateMask = 0b00000001;               // Current binary state x*
    this.couplingStrength = 1.0;

    // Computed metrics
    this.phi = 0.0;
    this.mipMask = 1;
    this.computationTimeMs = 0.0;
    this.backend = 'INITIALIZING'; // 'WEBGPU' | 'WORKER' | 'CPU'
    this.isComputing = false;

    // Listeners for telemetry updates
    this.onUpdate = options.onUpdate || null;

    // Node 3D positions in the Gyroscopic Reticle (angles on unit circle)
    this.nodePositions = [];
    for (let i = 0; i < this.numNodes; i++) {
      const angle = (i / this.numNodes) * Math.PI * 2;
      this.nodePositions.push({
        id: i,
        name: i < 4 ? `S${i}` : `E${i - 4}`,
        subsystem: i < 4 ? 'SENSORY' : 'EXECUTIVE',
        angle: angle,
        x: Math.cos(angle),
        y: Math.sin(angle),
        activation: 0.0
      });
    }

    this._initDefaultConnectivity();
  }

  _initDefaultConnectivity() {
    // Canonical 8-node neuromorphic cortical motif:
    // Sensory ring (0-3), Executive ring (4-7), and bi-directional cross-bridge feedback.
    for (let i = 0; i < 64; i++) this.weights[i] = 0;
    for (let i = 0; i < 8; i++) this.thresholds[i] = 0.5;

    // Sensory feed-forward loop
    this.weights[0 * 8 + 1] = 1.8;
    this.weights[1 * 8 + 2] = 1.8;
    this.weights[2 * 8 + 3] = 1.8;
    this.weights[3 * 8 + 0] = 1.8;

    // Executive recurrence loop
    this.weights[4 * 8 + 5] = 2.0;
    this.weights[5 * 8 + 6] = 2.0;
    this.weights[6 * 8 + 7] = 2.0;
    this.weights[7 * 8 + 4] = 2.0;

    // Cross-bridge causal thalamo-cortical projections (binding perception to executive monitoring)
    this.weights[0 * 8 + 4] = 1.2;
    this.weights[4 * 8 + 0] = 1.2;
    this.weights[2 * 8 + 6] = 1.4;
    this.weights[6 * 8 + 2] = 1.4;
    this.weights[1 * 8 + 5] = 0.9;
    this.weights[3 * 8 + 7] = 0.9;
  }

  async init(wgslSource, workerBlobUrl) {
    // Attempt WebGPU initialization first
    if (typeof navigator !== 'undefined' && navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: 'high-performance'
        });
        if (adapter) {
          const device = await adapter.requestDevice();
          if (device && wgslSource) {
            await this._initWebGPU(device, wgslSource);
            this.backend = 'WEBGPU';
            return;
          }
        }
      } catch (err) {
        console.warn('[IIT4Engine] WebGPU initialization failed, bridging to Web Worker:', err);
      }
    }

    // Fallback: Multithreaded Web Worker
    this._initWorker(workerBlobUrl);
  }

  async _initWebGPU(device, wgslSource) {
    this.gpuDevice = device;

    const module = device.createShaderModule({ code: wgslSource });

    this.computePipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module, entryPoint: 'main_compute_divergences' }
    });

    this.reducePipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module, entryPoint: 'main_find_minimum' }
    });

    // Uniform buffer (node_count, num_bipartitions, active_state_mask, coupling_strength)
    this.uniformBuffer = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    // Weights buffer (64 * 4 = 256 bytes)
    this.weightsBuffer = device.createBuffer({
      size: 64 * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    // Thresholds buffer (8 * 4 = 32 bytes)
    this.thresholdsBuffer = device.createBuffer({
      size: 8 * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    // Divergences buffer (128 * 4 = 512 bytes)
    this.divergencesBuffer = device.createBuffer({
      size: 128 * 4,
      usage: GPUBufferUsage.STORAGE
    });

    // Reduction output buffer [phi, mip_mask]
    this.reductionBuffer = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Staging readback buffer
    this.readbackBuffer = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    this.bindGroup = device.createBindGroup({
      layout: this.computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: this.weightsBuffer } },
        { binding: 2, resource: { buffer: this.thresholdsBuffer } },
        { binding: 3, resource: { buffer: this.divergencesBuffer } },
        { binding: 4, resource: { buffer: this.reductionBuffer } }
      ]
    });
  }

  _initWorker(workerBlobUrl) {
    if (typeof Worker === 'undefined') {
      this.backend = 'CPU_SYNC';
      return;
    }

    try {
      this.worker = workerBlobUrl
        ? new Worker(workerBlobUrl)
        : (typeof document !== 'undefined' ? new Worker('src/engine/iit_worker.js') : null);

      if (this.worker) {
        this.backend = 'WORKER';

        this.worker.onmessage = (e) => {
          const data = e.data;
          if (!data) return;
          if (data.type === 'RESULT') {
            this.phi = data.phi;
            this.mipMask = data.mipMask;
            this.computationTimeMs = data.computationTimeMs;
            this.isComputing = false;
            if (this.onUpdate) this.onUpdate(this.getMetrics());
          }
        };

        this.worker.postMessage({
          type: 'INIT',
          weights: this.weights,
          thresholds: this.thresholds
        });
      } else {
        this.backend = 'CPU_SYNC';
      }
    } catch (err) {
      console.warn('[IIT4Engine] Web Worker failed, falling back to synchronous CPU:', err);
      this.backend = 'CPU_SYNC';
    }
  }

  /**
   * Modulate neural weights & state mask based on live cognitive telemetry
   */
  updateDynamicCoupling(telemetry = {}) {
    // Sensory experiment parameters modulate nodes 0-3
    const flickerPhase = telemetry.flickerPhase || 0;
    const troxlerFade = telemetry.troxlerFade || 0;
    const neckerRate = telemetry.neckerRate || 0.5;
    const cfsSuppression = telemetry.cfsSuppression || 0;

    // Attenuator sliders & pointer dynamics modulate nodes 4-7
    const sensoryAtten = telemetry.sensory || 0.5;
    const temporalAtten = telemetry.temporal || 0.5;
    const somaticAtten = telemetry.somatic || 0.5;
    const pointerEntropy = telemetry.pointerEntropy || 0.5;

    // Modulate node activations
    this.nodePositions[0].activation = flickerPhase;
    this.nodePositions[1].activation = troxlerFade;
    this.nodePositions[2].activation = neckerRate;
    this.nodePositions[3].activation = cfsSuppression;

    this.nodePositions[4].activation = sensoryAtten;
    this.nodePositions[5].activation = temporalAtten;
    this.nodePositions[6].activation = somaticAtten;
    this.nodePositions[7].activation = pointerEntropy;

    // Derive active binary state mask x*
    let mask = 0;
    for (let i = 0; i < 8; i++) {
      if (this.nodePositions[i].activation > 0.45) {
        mask |= (1 << i);
      }
    }
    this.stateMask = mask;

    // Dynamic synaptic strength coupling
    const crossBridgeStrength = 1.0 + (somaticAtten + temporalAtten) * 0.8;
    this.weights[0 * 8 + 4] = crossBridgeStrength;
    this.weights[4 * 8 + 0] = crossBridgeStrength;
    this.weights[2 * 8 + 6] = crossBridgeStrength * 1.1;
    this.weights[6 * 8 + 2] = crossBridgeStrength * 1.1;

    this.couplingStrength = 0.8 + pointerEntropy * 0.6;
  }

  /**
   * Triggers a computation cycle using active backend
   */
  async computeStep() {
    if (this.isComputing) return;
    this.isComputing = true;

    if (this.backend === 'WEBGPU' && this.gpuDevice) {
      await this._computeWebGPU();
    } else if (this.backend === 'WORKER' && this.worker) {
      this.worker.postMessage({
        type: 'COMPUTE',
        weights: this.weights,
        thresholds: this.thresholds,
        stateMask: this.stateMask,
        couplingStrength: this.couplingStrength
      });
    } else {
      this._computeCPUSync();
    }
  }

  async _computeWebGPU() {
    const t0 = performance.now();
    const device = this.gpuDevice;

    // Upload uniforms: [node_count, num_bipartitions, active_state_mask, coupling_strength]
    const uniformArray = new ArrayBuffer(16);
    const u32View = new Uint32Array(uniformArray);
    const f32View = new Float32Array(uniformArray);
    u32View[0] = 8;
    u32View[1] = 127;
    u32View[2] = this.stateMask;
    f32View[3] = this.couplingStrength;

    device.queue.writeBuffer(this.uniformBuffer, 0, uniformArray);
    device.queue.writeBuffer(this.weightsBuffer, 0, this.weights);
    device.queue.writeBuffer(this.thresholdsBuffer, 0, this.thresholds);

    const commandEncoder = device.createCommandEncoder();
    
    // Pass 1: Compute divergences for all 127 bipartitions
    const pass1 = commandEncoder.beginComputePass();
    pass1.setPipeline(this.computePipeline);
    pass1.setBindGroup(0, this.bindGroup);
    pass1.dispatchWorkgroups(1);
    pass1.end();

    // Pass 2: Parallel reduction to find minimum Phi and MIP mask
    const pass2 = commandEncoder.beginComputePass();
    pass2.setPipeline(this.reducePipeline);
    pass2.setBindGroup(0, this.bindGroup);
    pass2.dispatchWorkgroups(1);
    pass2.end();

    // Copy result to readback buffer
    commandEncoder.copyBufferToBuffer(this.reductionBuffer, 0, this.readbackBuffer, 0, 8);
    device.queue.submit([commandEncoder.finish()]);

    // Asynchronous buffer mapping
    await this.readbackBuffer.mapAsync(GPUMapMode.READ);
    const resultView = new Float32Array(this.readbackBuffer.getMappedRange().slice(0, 8));
    this.readbackBuffer.unmap();

    this.phi = resultView[0];
    this.mipMask = Math.round(resultView[1]);
    this.computationTimeMs = performance.now() - t0;
    this.isComputing = false;

    if (this.onUpdate) this.onUpdate(this.getMetrics());
  }

  _computeCPUSync() {
    const t0 = performance.now();
    const unpartitionedProb = new Float32Array(8);

    for (let i = 0; i < 8; i++) {
      let sum = 0;
      for (let j = 0; j < 8; j++) {
        if ((this.stateMask >> j) & 1) sum += this.weights[i * 8 + j];
      }
      unpartitionedProb[i] = 1 / (1 + Math.exp(-(sum * this.couplingStrength - this.thresholds[i])));
    }

    let minPhi = Infinity;
    let bestMipMask = 1;

    for (let b = 0; b < 127; b++) {
      const mask = (b << 1) | 1;
      let divergence = 0;

      for (let i = 0; i < 8; i++) {
        const part_i = (mask >> i) & 1;
        let sum = 0;
        for (let j = 0; j < 8; j++) {
          if (part_i === ((mask >> j) & 1)) {
            if ((this.stateMask >> j) & 1) sum += this.weights[i * 8 + j];
          }
        }
        const q_i = 1 / (1 + Math.exp(-(sum * this.couplingStrength - this.thresholds[i])));
        divergence += Math.abs(unpartitionedProb[i] - q_i);
      }

      if (divergence < minPhi) {
        minPhi = divergence;
        bestMipMask = mask;
      }
    }

    this.phi = minPhi;
    this.mipMask = bestMipMask;
    this.computationTimeMs = performance.now() - t0;
    this.isComputing = false;

    if (this.onUpdate) this.onUpdate(this.getMetrics());
  }

  getMetrics() {
    const partA = [];
    const partB = [];
    for (let i = 0; i < 8; i++) {
      if ((this.mipMask >> i) & 1) {
        partA.push(i);
      } else {
        partB.push(i);
      }
    }

    // Calculate dynamic 2D cleavage plane angle separating centroid(A) and centroid(B)
    let ax = 0, ay = 0, bx = 0, by = 0;
    partA.forEach(idx => {
      ax += this.nodePositions[idx].x;
      ay += this.nodePositions[idx].y;
    });
    partB.forEach(idx => {
      bx += this.nodePositions[idx].x;
      by += this.nodePositions[idx].y;
    });

    ax /= Math.max(1, partA.length);
    ay /= Math.max(1, partA.length);
    bx /= Math.max(1, partB.length);
    by /= Math.max(1, partB.length);

    // Cleavage plane normal line passes between centroids
    const dx = bx - ax;
    const dy = by - ay;
    const cleavageAngle = Math.atan2(dy, dx) + Math.PI / 2;

    return {
      phi: this.phi,
      mipMask: this.mipMask,
      partA,
      partB,
      partitionText: `{${partA.join(',')}} | {${partB.join(',')}}`,
      cleavageAngle,
      computationTimeMs: this.computationTimeMs,
      backend: this.backend,
      stateMask: this.stateMask,
      nodes: this.nodePositions
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IIT4Engine };
}
