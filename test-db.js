const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv1428.hstgr.io',
  user: 'u283788768_zakarya',
  password: 'Rentamanager123',
  database: 'u283788768_rentamanager',
  port: 3306
});

connection.connect(error => {
  if (error) {
    return console.error('❌ Connection error:', error.message);
  }
  console.log('✅ Connected to MySQL database.');
  connection.end();
});
