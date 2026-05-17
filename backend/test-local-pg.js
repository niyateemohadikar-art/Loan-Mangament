const { Client } = require('pg');

const passwords = ['postgres', 'admin', 'password', '1234', '', 'root', 'Niyatee@180108', 'Niyatee@2008', '123456'];

async function test() {
  for (let p of passwords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: p,
      database: 'postgres'
    });
    try {
      await client.connect();
      console.log('SUCCESS with password:', p);
      await client.end();
      return p;
    } catch (e) {
      console.log('Failed with', p, e.message);
    }
  }
}
test();
