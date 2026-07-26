// const mysql = require('mysql2/promise');
// const fs = require('fs');
// const path = require('path');

// async function debugMedia() {
//   const envPath = path.join(__dirname, '..', '.env.local');
//   const config = {
//     host: '',
//     port: 0,
//     user: '',
//     password: '',
//     database: ''
//   };

//   if (fs.existsSync(envPath)) {
//     const envContent = fs.readFileSync(envPath, 'utf8');
//     const lines = envContent.split(/\r?\n/);
//     for (const line of lines) {
//       const trimmed = line.trim();
//       if (!trimmed || trimmed.startsWith('#')) continue;
//       const index = trimmed.indexOf('=');
//       if (index === -1) continue;
//       const key = trimmed.substring(0, index).trim();
//       let val = trimmed.substring(index + 1).trim();
//       if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
//         val = val.slice(1, -1);
//       }
//       if (key === 'DB_HOST') config.host = val;
//       if (key === 'DB_PORT') config.port = parseInt(val, 10);
//       if (key === 'DB_USER') config.user = val;
//       if (key === 'DB_PASSWORD') config.password = val;
//       if (key === 'DB_NAME') config.database = val;
//     }
//   } else {
//     console.error('.env.local file not found.');
//     process.exit(1);
//   }

//   // Validate that all required configuration items are present in .env.local
//   if (!config.host || !config.port || !config.user || !config.database) {
//     console.error('❌ Error: Missing required database environment variables in .env.local!');
//     process.exit(1);
//   }

//   let connection;
//   try {
//     connection = await mysql.createConnection(config);
//     console.log('Connected to DB');

//     const [blogs] = await connection.query('SELECT id, title FROM blogs');
//     console.log('Blogs in DB:', blogs);

//     const [media] = await connection.query('SELECT * FROM media');
//     console.log('Media in DB:', media);
//   } catch (err) {
//     console.error('Error:', err);
//   } finally {
//     if (connection) await connection.end();
//   }
// }

// debugMedia();
