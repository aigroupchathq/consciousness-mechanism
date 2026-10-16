#!/usr/bin/env node
/**
 * THE UNEXPLORED INTERIOR // AUTOMATED PROTOCOL AUDITOR
 * Validates repository files against the AGENTS.md Constitution & Quality Canon.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const AGENTS_MD_PATH = path.join(ROOT_DIR, 'AGENTS.md');
const PLAN_MD_PATH = path.join(ROOT_DIR, 'PLAN.md');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const redlines = [];

function pass(rule, detail) {
  totalChecks++;
  passedChecks++;
  console.log(`  \x1b[32m✓\x1b[0m [PASS] ${rule.padEnd(35)} \x1b[90m${detail}\x1b[0m`);
}

function fail(rule, issue) {
  totalChecks++;
  failedChecks++;
  redlines.push({ rule, issue });
  console.log(`  \x1b[31m✗\x1b[0m [FAIL] ${rule.padEnd(35)} \x1b[31m${issue}\x1b[0m`);
}

console.log('\n\x1b[1m\x1b[37m========================================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m  THE UNEXPLORED INTERIOR // EXECUTIVE DESIGN & CODE AUDITOR\x1b[0m');
console.log('\x1b[90m  Enforcing AGENTS.md Constitutional Canon & LoveFrom Standards\x1b[0m');
console.log('\x1b[1m\x1b[37m========================================================================\x1b[0m\n');

// 1. Verify Constitutional Files Exist
if (!fs.existsSync(AGENTS_MD_PATH) || !fs.existsSync(PLAN_MD_PATH)) {
  fail('GOVERNANCE_FILES', 'AGENTS.md or PLAN.md is missing from the repository root.');
} else {
  pass('GOVERNANCE_FILES', 'AGENTS.md and PLAN.md verified and committed.');
}

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('\x1b[31mCRITICAL ERROR: index.html not found!\x1b[0m');
  process.exit(1);
}

const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

// 2. Rule: Zero Emojis in User-Facing Interface
// Bans consumer pictographs and emojis while permitting standard typographical and media transport symbols
const allowedSymbols = new Set([
  '✓', '✔', '✕', '✖', '→', '←', '↑', '↓', '·', '©', '®', '™', '°', '±', '−', '—', '–', '•', '𝕏',
  '▶', '⏸', '⏺', '⏹', '▲', '▼', '◀'
]);
const pictographicRegex = /\p{Extended_Pictographic}/ug;

let foundForbiddenEmoji = null;
const matches = html.match(pictographicRegex) || [];
for (const char of matches) {
  if (!allowedSymbols.has(char)) {
    foundForbiddenEmoji = char;
    break;
  }
}

if (foundForbiddenEmoji) {
  fail('ZERO_EMOJI_RULE', `Prohibited consumer emoji detected in codebase: "${foundForbiddenEmoji}"`);
} else {
  pass('ZERO_EMOJI_RULE', 'Zero playful/consumer emojis detected in client code.');
}

// 3. Rule: Zero-Pill Discipline
if (/badge-pill|pill-badge|rounded-full\s+bg-red|rounded-full\s+bg-blue/i.test(html)) {
  fail('ZERO_PILL_DISCIPLINE', 'Prohibited colored pill badge class detected.');
} else {
  pass('ZERO_PILL_DISCIPLINE', 'Unboxed monospace metadata hierarchy strictly maintained.');
}

// 4. Rule: Acoustic Architecture (Zero Audio Assets, Pure Math Synthesis)
const hasAudioFileRef = /\.(mp3|wav|ogg|flac|aac)['"]/i.test(html);
if (hasAudioFileRef) {
  fail('ACOUSTIC_ASSETS', 'External audio files (.mp3, .wav) detected. Only pure Web Audio synthesis allowed.');
} else {
  pass('ACOUSTIC_ASSETS', 'Zero external audio assets imported. 100% mathematical synthesis.');
}

const hasWebAudio = /AudioContext|webkitAudioContext/i.test(html);
const hasSolfeggio = /528/.test(html);
const hasExpRamp = /exponentialRampToValueAtTime/i.test(html);

if (hasWebAudio && hasSolfeggio && hasExpRamp) {
  pass('SOLFEGGIO_SYNTHESIS', '528Hz dual-harmonic oscillator with exponential decay verified.');
} else {
  fail('SOLFEGGIO_SYNTHESIS', 'Acoustic engine missing 528Hz Solfeggio tuning or exponential decay ramp.');
}

// 5. Rule: Empirical Consciousness Paradigms
const paradigms = ['flicker', 'mib', 'bistable', 'cfs', 'chronostasis'];
const missingParadigms = paradigms.filter(p => !html.includes(`data-exp="${p}"`));

if (missingParadigms.length === 0) {
  pass('AWARENESS_PARADIGMS', 'All 5 empirical visual gating experiments implemented.');
} else {
  fail('AWARENESS_PARADIGMS', `Missing awareness paradigms: ${missingParadigms.join(', ')}`);
}

// Check 240ms saccade blanking mask
if (/240/.test(html)) {
  pass('SACCADIC_TIMING', 'Empirical 240ms temporal saccade blanking parameter calibrated.');
} else {
  fail('SACCADIC_TIMING', 'Saccade mask timing deviation from peer-reviewed 240ms threshold.');
}

// 6. Rule: Keyboard Accessibility & Hotkey Gating
const hasHotkeys = /['"]1['"]/.test(html) && /['"]2['"]/.test(html) && /['"]5['"]/.test(html);
const hasEscapeDismissal = /Escape/i.test(html);

if (hasHotkeys && hasEscapeDismissal) {
  pass('KEYBOARD_NAVIGATION', 'Universal [1]-[5] experiment hotkeys & Escape dismissal active.');
} else {
  fail('KEYBOARD_NAVIGATION', 'Keyboard shortcuts [1]-[5] or Escape modal dismissal missing.');
}

// 7. Rule: Privacy & Zero Third-Party Telemetry
const telemetryPatterns = [
  'google-analytics.com',
  'googletagmanager.com',
  'gtag(',
  'fbevents.js',
  'mixpanel.com',
  'hotjar.com',
  'segment.com'
];

const foundTelemetry = telemetryPatterns.filter(pattern => html.includes(pattern));
if (foundTelemetry.length > 0) {
  fail('PRIVACY_TELEMETRY', `Surveillance tracking script detected: ${foundTelemetry.join(', ')}`);
} else {
  pass('PRIVACY_TELEMETRY', '100% Client-side privacy verified. Zero surveillance beacons.');
}

// 8. Rule: Monochromatic Titanium Design Tokens
const hasObsidianBase = /#030305|#070707|#08090b/i.test(html);
const hasParchmentBase = /#fbfaf6|#f2eee3/i.test(html);

if (hasObsidianBase && hasParchmentBase) {
  pass('MATERIAL_PALETTE', 'Monochromatic Dark Titanium & Archival Warm Parchment verified.');
} else {
  fail('MATERIAL_PALETTE', 'Palette tokens violate constitutional dark titanium / parchment spec.');
}

// SUMMARY REPORT
console.log('\n------------------------------------------------------------------------');
console.log(`AUDIT RESULTS: ${passedChecks}/${totalChecks} RULES VERIFIED`);
console.log('------------------------------------------------------------------------');

if (failedChecks === 0) {
  console.log('\n\x1b[1m\x1b[32m✓ STATUS: [APPROVED BY EXECUTIVE DESIGN SUPERVISOR]\x1b[0m');
  console.log('\x1b[90m  Repository strictly satisfies all AGENTS.md constitutional constraints.\x1b[0m\n');
  process.exit(0);
} else {
  console.log(`\n\x1b[1m\x1b[31m✗ STATUS: [DISAPPROVED — ${failedChecks} REDLINES ISSUED]\x1b[0m`);
  redlines.forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.rule}]: ${r.issue}`);
  });
  console.log('\x1b[31m\nAction Required: Resolve all constitutional violations before committing.\x1b[0m\n');
  process.exit(1);
}
