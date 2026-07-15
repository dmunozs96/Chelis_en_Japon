const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const healthRouter = require('./routes/health');
const plannerRouter = require('./routes/planner');

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

// Un fichero de data inexistente debe ser un 404 diagnosticable, no caer al
// fallback SPA y devolver index.html con status 200.
app.use('/data', (_req, res) => res.status(404).json({ error: 'Data file not found' }));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.use('/api/health', healthRouter);
app.use('/api/planner', plannerRouter);

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
// Error handling — sin esto, una promesa rechazada en un handler async
// tumba el proceso entero en Node >= 15.
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled route error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection:', reason);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  if (isProd) {
    console.log(`[server] Serving static files from client/dist`);
  }
});
