// const fs = require('fs');
// const path = require('path');

// const envPath = path.join(__dirname, '..', '.env.local');
// if (fs.existsSync(envPath)) {
//   const content = fs.readFileSync(envPath, 'utf8');
//   console.log("Keys defined in .env.local:");
//   content.split(/\r?\n/).forEach(line => {
//     const trimmed = line.trim();
//     if (!trimmed || trimmed.startsWith('#')) return;
//     const index = trimmed.indexOf('=');
//     if (index === -1) return;
//     const key = trimmed.substring(0, index).trim();
//     const val = trimmed.substring(index + 1).trim();
//     console.log(`- ${key}: ${val ? 'has value (length ' + val.length + ')' : 'empty'}`);
//   });
// } else {
//   console.log(".env.local does not exist.");
// }
