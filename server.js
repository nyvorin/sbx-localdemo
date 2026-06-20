const http = require('http');
const { Client } = require('pg');
const redis = require('redis');
const PORT = process.env.PORT || 3000;
http.createServer(async (req, res) => {
  let db = 'unset', rd = 'unset';
  if (process.env.DATABASE_URL) {
    try { const c = new Client({ connectionString: process.env.DATABASE_URL });
      await c.connect(); const r = await c.query("select 'db-reachable' as ok");
      db = r.rows[0].ok; await c.end();
    } catch (e) { db = 'ERR: ' + e.message; }
  }
  if (process.env.REDIS_URL) {
    try { const rc = redis.createClient({ url: process.env.REDIS_URL });
      await rc.connect(); rd = await rc.ping(); await rc.quit();
    } catch (e) { rd = 'ERR: ' + e.message; }
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(`<h1>sbx-localdemo</h1><p data-testid="pg">POSTGRES: ${db}</p><p data-testid="redis">REDIS: ${rd}</p>`);
}).listen(PORT, '0.0.0.0', () => console.log('sbx-localdemo listening on ' + PORT));
