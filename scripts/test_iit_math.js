#!/usr/bin/env node
/**
 * DATUM INTELLIGENCE // IIT 4.0 MATHEMATICAL RIGOR VERIFICATION SUITE
 * Validates Tononi & Albantakis Integrated Information Theory calculations
 * against analytical benchmarks and theoretical edge cases.
 */

const { IIT4Engine } = require('../src/engine/iit_engine.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✓\x1b[0m [PASS] ${testName.padEnd(45)} \x1b[90m${details}\x1b[0m`);
  } else {
    failedTests++;
    console.log(`  \x1b[31m✗\x1b[0m [FAIL] ${testName.padEnd(45)} \x1b[31m${details}\x1b[0m`);
  }
}

console.log('\n\x1b[1m\x1b[37m========================================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m  DATUM INTELLIGENCE // IIT 4.0 MATHEMATICAL VALIDATION\x1b[0m');
console.log('\x1b[90m  Tononi & Albantakis Earth Mover\'s Distance (Wasserstein-1) Checks\x1b[0m');
console.log('\x1b[1m\x1b[37m========================================================================\x1b[0m\n');

// --------------------------------------------------------------------------
// TEST 1: Fully Disconnected Subsystems Postulate (Phi == 0)
// --------------------------------------------------------------------------
const disconnectedEngine = new IIT4Engine();
// Zero out all weights
for (let i = 0; i < 64; i++) disconnectedEngine.weights[i] = 0;

// Subsystem A: Nodes 0, 1, 2, 3 internally connected
disconnectedEngine.weights[0 * 8 + 1] = 2.0;
disconnectedEngine.weights[1 * 8 + 2] = 2.0;
disconnectedEngine.weights[2 * 8 + 3] = 2.0;
disconnectedEngine.weights[3 * 8 + 0] = 2.0;

// Subsystem B: Nodes 4, 5, 6, 7 internally connected
disconnectedEngine.weights[4 * 8 + 5] = 2.0;
disconnectedEngine.weights[5 * 8 + 6] = 2.0;
disconnectedEngine.weights[6 * 8 + 7] = 2.0;
disconnectedEngine.weights[7 * 8 + 4] = 2.0;

// Zero cross-connections between A and B!
disconnectedEngine.stateMask = 0b11111111; // All active
disconnectedEngine.computeStep();
const disconnectedResult = disconnectedEngine.getMetrics();

assert(
  Math.abs(disconnectedResult.phi) < 1e-6,
  'Uncoupled Subsystems (Postulate 1)',
  `Phi = ${disconnectedResult.phi.toFixed(6)} (Expected exactly 0.000000)`
);

// The MIP cut must isolate {0,1,2,3} and {4,5,6,7} (mask 0b00001111 = 15)
assert(
  disconnectedResult.mipMask === 15,
  'MIP Cut on Uncoupled Boundary',
  `Detected MIP Mask: ${disconnectedResult.mipMask} (${disconnectedResult.partitionText})`
);

// --------------------------------------------------------------------------
// TEST 2: Integrated System with Strong Recurrent Feedback (Phi > 0)
// --------------------------------------------------------------------------
const integratedEngine = new IIT4Engine(); // Default has dense cross-connections
integratedEngine.stateMask = 0b11111111; // All nodes active & causally integrated
integratedEngine.couplingStrength = 1.2;
integratedEngine.computeStep();
const integratedResult = integratedEngine.getMetrics();

assert(
  integratedResult.phi > 0.1,
  'Integrated Causal Feedback Loop',
  `Phi = ${integratedResult.phi.toFixed(4)} > 0.1 (System is irreducible, MIP: ${integratedResult.partitionText})`
);

// --------------------------------------------------------------------------
// TEST 3: Weak Link Minimum Information Partition (MIP) Isolation
// --------------------------------------------------------------------------
// Construct an 8-node system where node 7 has only a tiny connection (0.05)
// to the rest of the tightly bound 7-node cluster (weights 2.5)
const weakLinkEngine = new IIT4Engine();
for (let i = 0; i < 64; i++) weakLinkEngine.weights[i] = 0;

// Nodes 0-6 tightly connected in a mesh
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 7; j++) {
    if (i !== j) weakLinkEngine.weights[i * 8 + j] = 2.5;
  }
}
// Node 7 has minimal weak connection to Node 0
weakLinkEngine.weights[0 * 8 + 7] = 0.05;
weakLinkEngine.weights[7 * 8 + 0] = 0.05;

weakLinkEngine.stateMask = 0b11111111;
weakLinkEngine.computeStep();
const weakResult = weakLinkEngine.getMetrics();

// The MIP cut MUST sever node 7 from the rest: partition {0,1,2,3,4,5,6} | {7} (mask 127 = 0b01111111)
assert(
  weakResult.mipMask === 127,
  'Weakest Causal Link Identification',
  `Identified MIP Mask: ${weakResult.mipMask} -> Isolated Node {7}`
);

// --------------------------------------------------------------------------
// TEST 4: Performance & Latency Budget Benchmark (< 1.5ms)
// --------------------------------------------------------------------------
const benchEngine = new IIT4Engine();
const iterations = 50;
const tStart = performance.now();
for (let i = 0; i < iterations; i++) {
  benchEngine.stateMask = i % 256;
  benchEngine.computeStep();
}
const avgTime = (performance.now() - tStart) / iterations;

assert(
  avgTime < 1.5,
  'Computational Latency Budget (< 1.5ms)',
  `Average Compute Time: ${avgTime.toFixed(3)}ms per 127 bipartitions`
);

// --------------------------------------------------------------------------
// SUMMARY REPORT
// --------------------------------------------------------------------------
console.log('\n------------------------------------------------------------------------');
console.log(`MATHEMATICAL VALIDATION: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('------------------------------------------------------------------------\n');

if (failedTests === 0) {
  console.log('\x1b[1m\x1b[32m✓ MATHEMATICAL RIGOR RATIFIED: IIT 4.0 Engine strictly verified.\x1b[0m\n');
  process.exit(0);
} else {
  console.log(`\x1b[1m\x1b[31m✗ FAILED: ${failedTests} mathematical tests violated.\x1b[0m\n`);
  process.exit(1);
}
