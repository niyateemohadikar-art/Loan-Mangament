const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:123456@localhost:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to local postgres!');
    const schemaPath = path.join(__dirname, '../supabase_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons or run as a single string. pg handles multiple statements
    await client.query(sql);
    console.log('✅ Schema initialized successfully on local database.');
  } catch (err) {
    console.error('❌ Error executing schema:', err.message);
  } finally {
    await client.end();
  }
}

run();
