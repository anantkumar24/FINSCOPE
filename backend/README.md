Backend API

This folder contains a minimal Express server that serves the frontend and provides simple JSON persistence in `data.json`.

Available endpoints:
- GET /api/ping — health check
- GET /api/data — get profile/goals/transactions
- PUT /api/profile — update profile (JSON body)
- GET /api/goals — list goals
- POST /api/goals — add a goal (JSON body)
- GET /api/transactions — list transactions
- POST /api/transactions — add a transaction (JSON body)

Data is stored in `backend/data.json` as a simple JSON file. This is suitable for local development only.

Run server (from project root):

  npm start

Dev (auto-restart on changes):

  npm run dev

