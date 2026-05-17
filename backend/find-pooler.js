const { Client } = require('pg');

const regions = ['ap-south-1', 'us-east-1', 'us-west-1', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'];
const password = encodeURIComponent('Niyatee@180108');
const projectRef = 'lxhfzwakvfudomdxuonr';

async function test() {
  for (let region of regions) {
    const url = `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    const client = new Client({ connectionString: url, connectionTimeoutMillis: 5000 });
    try {
      console.log('Testing', region);
      await client.connect();
      console.log('SUCCESS with region:', region);
      console.log('Valid URL:', url);
      await client.end();
      return url;
    } catch (e) {
      console.log('Failed', region, e.message);
    }
  }
}
test();
