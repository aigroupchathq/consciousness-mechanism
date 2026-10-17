/**
 * DATUM INTELLIGENCE // PSYCHOMETRIC NORMS & DIAGNOSTIC VERIFICATION
 * Automated verification of rapid diagnostic math, z-scores, and open-science norm lookup
 */

const fs = require('fs');
const path = require('path');
const { RapidDiagnosticEngine } = require('../src/engine/rapid_diagnostic.js');

console.log('\n========================================================================');
console.log('  DATUM INTELLIGENCE // PSYCHOPHYSICS NORMS VALIDATION');
console.log('  Verification of Empirical Latency Mapping & Cumulative Distribution CDF');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName.padEnd(52)} ${details}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${testName.padEnd(52)} ${details}`);
    failCount++;
  }
}

// 1. Verify cognitive_norms.json structure
const normsPath = path.join(__dirname, '../src/data/cognitive_norms.json');
assert(fs.existsSync(normsPath), 'Normative Database File Existence', 'cognitive_norms.json located on disk');

const norms = JSON.parse(fs.readFileSync(normsPath, 'utf8'));
assert(norms.meta && norms.meta.citations.length >= 4, 'Normative Citations Present', `Found ${norms.meta?.citations?.length || 0} peer-reviewed references`);
assert(
  norms.distributions.saccadic_change_latency_ms &&
  norms.distributions.foveal_fixation_hold_sec &&
  norms.distributions.motor_response_variability_ms &&
  norms.distributions.p3b_ignition_latency_ms,
  'All 4 Empirical Target Distributions',
  'Saccade, Troxler, RTV, and P3b profiles configured'
);

// 2. Unit test Abramowitz & Stegun Z-to-Percentile CDF
const engine = new RapidDiagnosticEngine({ norms });

const pZero = engine._zToPercentile(0.0);
assert(pZero === 50, 'Standard Normal CDF Median (z = 0)', `Percentile: ${pZero}th (Expected: 50th)`);

const pHigh = engine._zToPercentile(2.0);
assert(pHigh >= 97 && pHigh <= 99, 'Standard Normal CDF Upper 2-Sigma (z = 2.0)', `Percentile: ${pHigh}th (Expected: ~98th)`);

const pLow = engine._zToPercentile(-2.0);
assert(pLow >= 1 && pLow <= 3, 'Standard Normal CDF Lower 2-Sigma (z = -2.0)', `Percentile: ${pLow}th (Expected: ~2nd)`);

// 3. Test High-Performance Observer (Rapid Saccade, High Troxler Hold, Low RTV)
engine.t1LatencyMs = 230; // ~2.1 standard deviations faster than mean 485ms
engine.t2FixationHoldMs = 8500; // 8.5 seconds foveal hold
engine.t3ReactionTimes = [250, 255, 248, 252, 249]; // Extremely low RTV (~2.8ms)
const topResults = engine.computeResults();

assert(
  topResults.overallPercentile >= 90,
  'Elite Cognitive Operator Classification',
  `Overall: ${topResults.overallPercentile}th percentile -> "${topResults.phenotype}"`
);
assert(
  topResults.phenotype === 'SOVEREIGN PHENOMENAL OPERATOR',
  'Phenotype Mapping Strictness',
  `Identified phenotype: ${topResults.phenotype}`
);

// 4. Test Automated / Distracted Observer (Slow Saccade, Low Troxler Hold, High RTV)
const slowEngine = new RapidDiagnosticEngine({ norms });
slowEngine.t1LatencyMs = 690; // High latency
slowEngine.t2FixationHoldMs = 1800; // Rapid fixation breakdown
slowEngine.t3ReactionTimes = [420, 560, 310, 610, 390]; // High RTV
const reactiveResults = slowEngine.computeResults();

assert(
  reactiveResults.overallPercentile <= 35,
  'Sub-Optimal Focus Classification',
  `Overall: ${reactiveResults.overallPercentile}th percentile -> "${reactiveResults.phenotype}"`
);

console.log('\n------------------------------------------------------------------------');
console.log(`VALIDATION RESULTS: ${passCount}/${passCount + failCount} TESTS PASSED`);
console.log('------------------------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✓ PSYCHOPHYSICS NORMS & RAPID DIAGNOSTIC RIGOR RATIFIED.\n');
  process.exit(0);
}
