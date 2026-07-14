const { Router } = require('express');

const router = Router();

/**
 * GET /api/health
 * Simple liveness probe used by Railway healthcheck.
 */
router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;
