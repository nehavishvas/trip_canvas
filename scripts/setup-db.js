// const fs = require('fs');
// const path = require('path');
// const mysql = require('mysql2/promise');

// async function setupDatabase() {
//   const envPath = path.join(__dirname, '..', '.env.local');
//   const schemaPath = path.join(__dirname, '..', 'schema.sql');

//   const config = {
//     host: '',
//     port: 0,
//     user: '',
//     password: '',
//     database: '',
//     multipleStatements: true
//   };

//   console.log('Reading environment variables from .env.local...');
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
//     console.error(`Parsed configuration:`, {
//       host: config.host || 'MISSING',
//       port: config.port || 'MISSING',
//       user: config.user || 'MISSING',
//       database: config.database || 'MISSING'
//     });
//     process.exit(1);
//   }

//   if (!fs.existsSync(schemaPath)) {
//     console.error('schema.sql file not found.');
//     process.exit(1);
//   }

//   let sql = fs.readFileSync(schemaPath, 'utf8');

//   // Strip CREATE DATABASE and USE statements to prevent privilege errors on shared remote hosts
//   console.log('Removing database creation constraints for compatibility with shared host...');
//   sql = sql.replace(/CREATE DATABASE IF NOT EXISTS `?\w+`?;/gi, '-- Removed CREATE DATABASE');
//   sql = sql.replace(/USE `?\w+`?;/gi, '-- Removed USE');

//   console.log(`Connecting to database '${config.database}' at ${config.host}...`);
//   let connection;
//   try {
//     connection = await mysql.createConnection(config);
//     console.log('Connected successfully. Importing schema and seed data...');
    
//     await connection.query(sql);
    
//     console.log('✅ Success! All tables created and seeded inside your database.');
//   } catch (error) {
//     console.error('❌ Failed to set up the database:', error.message);
//     process.exit(1);
//   } finally {
//     if (connection) {
//       await connection.end();
//     }
//   }
// }

// setupDatabase();