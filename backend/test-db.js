const { Client } = require('pg');
require('dotenv').config();

// Try connecting directly using the IPv6 address in brackets
const connectionString = "postgresql://postgres:Niyatee%40180108@[2406:da1a:82a:9d02:34f7:8417:a00b:55ce]:5432/postgres";

async function testConnection() {
  console.log('🔍 Testing connection via direct IPv6...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ SUCCESS: Connected to Supabase via IPv6!');
    const res = await client.query('SELECT NOW()');
    console.log('⏰ Database Time:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('❌ CONNECTION FAILED:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
  }
}

testConnection();
