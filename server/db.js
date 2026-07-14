const { Pool } = require('pg');

let pool = null;

if (!process.env.DATABASE_URL) {
  console.warn(
    '[db] WARNING: DATABASE_URL is not defined. ' +
    'Database features are disabled — this is expected in Ola 1.'
  );
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  });

  pool.on('error', (err) => {
    console.error('[db] Unexpected error on idle client', err);
  });
}

/**
 * Execute a parameterised SQL query.
 * Returns null (with a warning) when DATABASE_URL is not configured.
 *
 * @param {string} text   - SQL query string
 * @param {Array}  params - Query parameters
 * @returns {Promise<import('pg').QueryResult|null>}
 */
async function query(text, params) {
  if (!pool) {
    console.warn('[db] query() called but no database pool is available.');
    return null;
  }
  return pool.query(text, params);
}

module.exports = { query, pool };
