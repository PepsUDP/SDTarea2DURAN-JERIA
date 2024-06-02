const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    host: process.env.POSTGRES_HOST || 'database',
    port: 5432,
    database: process.env.POSTGRES_DB || 'postgres'
});

pool.on('connect', () => {
    console.log('Connected to the database');
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
  
  module.exports = pool;