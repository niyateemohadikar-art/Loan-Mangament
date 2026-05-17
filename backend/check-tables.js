const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.SUPABASE_DB_URL;

async function checkTables() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('📡 Fetching table list from Supabase...');
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('✅ Tables found in Supabase:');
    res.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error checking tables:', err.message);
  }
}

checkTables();
