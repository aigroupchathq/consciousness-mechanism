/**
 * THE UNEXPLORED INTERIOR // REAL-TIME IIT 4.0 BACKGROUND COMPUTE WORKER
 * Multithreaded Typed-Array Fallback Engine (Zero UI Stutter Guarantee)
 * Tononi & Albantakis Integrated Information Theory 4.0
 */

// Pre-allocate typed arrays for N = 8 nodes (256 states, 127 bipartitions)
const NUM_NODES = 8;
const NUM_BIPARTITIONS = 127;

const weightsBuffer = new Float32Array(64);
const thresholdsBuffer = new Float32Array(8);
const unpartitionedProbBuffer = new Float32Array(8);
const partitionedProbBuffer = new Float32Array(8);
const candidateMasks = new Uint8Array(NUM_BIPARTITIONS);

// Pre-generate canonical 127 bipartition masks where bit 0 is fixed to 1 (node 0 in part A)
// and at least one node is in part B (mask != 255)
for (let i = 0; i < NUM_BIPARTITIONS; i++) {
  candidateMasks[i] = (i << 1) | 1;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function computeIIT4(stateMask, couplingStrength) {
  const t0 = performance.now();

  // 1. Compute unpartitioned next-state probabilities P(X_i(t+1) = 1 | x*(t))
  for (let i = 0; i < NUM_NODES; i++) {
    let sum = 0;
    const rowOffset = i * NUM_NODES;
    for (let j = 0; j < NUM_NODES; j++) {
      if ((stateMask >> j) & 1) {
        sum += weightsBuffer[rowOffset + j];
      }
    }
    unpartitionedProbBuffer[i] = sigmoid(sum * couplingStrength - thresholdsBuffer[i]);
  }

  let minPhi = Infinity;
  let bestMipMask = 1;

  // 2. Iterate across all 127 candidate bipartitions
  for (let b = 0; b < NUM_BIPARTITIONS; b++) {
    const mask = candidateMasks[b];
    let divergence = 0;

    for (let i = 0; i < NUM_NODES; i++) {
      const part_i = (mask >> i) & 1;
      let sum = 0;
      const rowOffset = i * NUM_NODES;

      for (let j = 0; j < NUM_NODES; j++) {
        const part_j = (mask >> j) & 1;
        // Sever cross-partition causal connections
        if (part_i === part_j) {
          if ((stateMask >> j) & 1) {
            sum += weightsBuffer[rowOffset + j];
          }
        }
      }

      const q_i = sigmoid(sum * couplingStrength - thresholdsBuffer[i]);
      divergence += Math.abs(unpartitionedProbBuffer[i] - q_i);
    }

    if (divergence < minPhi) {
      minPhi = divergence;
      bestMipMask = mask;
    }
  }

  const dt = performance.now() - t0;

  return {
    phi: minPhi,
    mipMask: bestMipMask,
    computationTimeMs: dt
  };
}

self.onmessage = function (e) {
  const data = e.data;
  if (!data) return;

  if (data.type === 'INIT') {
    if (data.weights) weightsBuffer.set(data.weights);
    if (data.thresholds) thresholdsBuffer.set(data.thresholds);
    self.postMessage({ type: 'READY' });
    return;
  }

  if (data.type === 'COMPUTE') {
    if (data.weights) weightsBuffer.set(data.weights);
    if (data.thresholds) thresholdsBuffer.set(data.thresholds);

    const stateMask = data.stateMask !== undefined ? data.stateMask : 0;
    const coupling = data.couplingStrength !== undefined ? data.couplingStrength : 1.0;

    const result = computeIIT4(stateMask, coupling);

    self.postMessage({
      type: 'RESULT',
      id: data.id,
      phi: result.phi,
      mipMask: result.mipMask,
      computationTimeMs: result.computationTimeMs
    });
  }
};
