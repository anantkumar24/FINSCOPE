FinScope - Local development

This repository contains a simple frontend single-page app and a minimal Node static server to serve the frontend.

Files created/changed:
- frontend/index.html — HTML entrypoint (extracted from root index.html)
- frontend/styles.css — CSS extracted from original HTML
- frontend/script.js — Client-side JS extracted from original HTML
- backend/server.js — Minimal Node static server that serves `frontend/` and provides `/api/ping` for quick checks

Run locally (requires Node.js 12+):

1. Start the server from workspace root (PowerShell):

   node .\backend\server.js

2. Open http://localhost:3000 in your browser.

Notes and assumptions:
- The copy of Chart.js and Font Awesome are loaded from CDNs in `frontend/index.html`.
- No package.json or npm install is required for the minimal static server. If you'd like an Express-based server and a package.json, I can add that.

Next steps (optional):
- Add `package.json` and scripts to start the server (npm start).
- Add a small API for persisting user data on the server instead of localStorage.
- Wire up build tooling and a proper dev workflow.
