// const fs = require('fs');
// const path = require('path');
// const mysql = require('mysql2/promise');

// async function diagnose() {
//   const envPath = path.join(__dirname, '..', '.env.local');
//   const config = {
//     host: '',
//     port: 0,
//     user: '',
//     password: '',
//     database: ''
//   };

//   console.log('--- Database Diagnostic ---');
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
//     console.error('.env.local file not found in root directory!');
//     process.exit(1);
//   }

//   // Validate that all required configuration items are present in .env.local
//   if (!config.host || !config.port || !config.user || !config.database) {
//     console.error('❌ Error: Missing required database environment variables in .env.local!');
//     console.error(`Parsed configuration:`, {
//       host: config.host || 'MISSING',
//       port: config.port || 'MISSING',
//       user: config.user || 'MISSING',
//       database: config.database || 'MISSING'
//     });
//     process.exit(1);
//   }

//   console.log(`Config parsed from .env.local:`);
//   console.log(`- Host: ${config.host}`);
//   console.log(`- Port: ${config.port}`);
//   console.log(`- User: ${config.user}`);
//   console.log(`- Database: ${config.database}`);
//   console.log(`- Password length: ${config.password ? config.password.length : 0} chars`);

//   let connection;
//   try {
//     console.log('\nConnecting to MySQL database...');
//     connection = await mysql.createConnection(config);
//     console.log('✅ Successfully connected to database!');

//     console.log('\nChecking tables...');
//     const [tables] = await connection.query('SHOW TABLES');
//     console.log('Tables found in database:', tables.map(t => Object.values(t)[0]));

//     const usersTableExists = tables.some(t => Object.values(t)[0] === 'users');
//     if (!usersTableExists) {
//       console.log('❌ "users" table DOES NOT exist!');
//       process.exit(1);
//     }

//     console.log('\nChecking users in database...');
//     const [users] = await connection.query('SELECT id, name, email, role, password_hash FROM users');
//     console.log(`Total users found: ${users.length}`);
//     for (const user of users) {
//       console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
//       console.log(`  Password Hash in DB: ${user.password_hash}`);
//     }

//   } catch (error) {
//     console.error('❌ Diagnostic failed with error:', error.message);
//   } finally {
//     if (connection) {
//       await connection.end();
//     }
//   }
// }

// diagnose();
