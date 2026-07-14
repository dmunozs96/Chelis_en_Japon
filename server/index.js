const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';
const distPath = path.join(__dirname, '..', 'client', 'dist');
const hasDist = fs.existsSync(distPath);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(express.json());

// Allow the Vite dev server to call the API during development.
if (!isProd) {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
}

// ---------------------------------------------------------------------------
// Static data files (trip.json etc.) — served in both dev and production.
// In production the React build is served from client/dist, but /data must
// remain accessible for the useTripData hook.
// ---------------------------------------------------------------------------

app.use('/data', express.static(path.join(__dirname, '..', 'data')));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.use('/api/health', healthRouter);

// Placeholder for future API routes (Ola 2+).
app.get('/api', (_req, res) => {
  res.json({ message: 'Chelis en Japón API — Ola 1' });
});

// ---------------------------------------------------------------------------
// Static frontend (production only)
// ---------------------------------------------------------------------------

if (hasDist) {
  app.use(express.static(distPath));

  // SPA fallback — all non-API routes return index.html.
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ status: 'API running — frontend build not found (run npm run build)' });
  });
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  if (isProd) {
    console.log(`[server] Serving static files from client/dist`);
  }
});
