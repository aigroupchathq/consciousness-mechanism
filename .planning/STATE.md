# REAL-TIME PROJECT STATE // GSD ENGINE

## 📍 Current Status
- **Active Phase**: Phase 03 Complete / Preparing Phase 05 (BCI & Advanced Metacognition).
- **Current Objective**: GSD system installation, workspace skill integration, and spec-driven roadmap maintenance.
- **Repository Cleanliness**: All local changes committed and synchronized with `origin/main`.
- **Live Status**: GitHub Pages deployed at `https://aigroupchathq.github.io/consciousness-mechanism/`.

---

## 📝 Recent Architectural Decisions (ADR Log)
- **ADR-001 (Zero-Dependency Single File)**: Embedded all CSS and JS into `index.html` to eliminate local browser CORS module blocks on `file://` protocol.
- **ADR-002 (WebM In-Browser Video Recording)**: Implemented native `MediaRecorder` + `canvas.captureStream(60)` rather than requiring server-side ffmpeg transcoding.
- **ADR-003 (Binaural Channel Merger)**: Used Web Audio API `ChannelMergerNode` to generate a pure 40Hz acoustic beat frequency (216Hz Left, 256Hz Right).
- **ADR-004 (GSD Integration)**: Adopted GSD meta-prompting protocol with `.planning/` specifications for determinism and subagent isolation.

---

## 🚧 Blockers & Known Issues
- None. All visual experiments, audit calculations, audio synthesis, and video recording are operational.

---

## ⏩ Immediate Next Steps
1. Maintain GSD phase files in `.planning/phases/`.
2. Expand Phase 05 specs for Web Bluetooth BCI headband telemetry (Muse / NeuroSky / OpenBCI).
