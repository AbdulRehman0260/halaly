#!/usr/bin/env node
// Script: scripts/find-bad-hashes.js
// Usage: node scripts/find-bad-hashes.js
// Scans the users table for hashed_password values that do not look like argon2 PHC strings

import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const connectionString = process.env.CONNECTION_STRING || process.env.DB_URL || process.env.CONNECTIONSTRING || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('No connection string found in env (CONNECTION_STRING or DB_URL)');
  process.exit(1);
}

const sql = postgres(connectionString);

async function main() {
  try {
    const rows = await sql`SELECT id, email, hashed_password FROM users WHERE hashed_password NOT LIKE '$argon2%';`;
    if (rows.length === 0) {
      console.log('No suspicious hashed_password values found.');
      process.exit(0);
    }

    console.log(`Found ${rows.length} suspicious rows:`);
    for (const r of rows) {
      console.log(`- id=${r.id} email=${r.email} hash=${r.hashed_password}`);
    }
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(2);
  } finally {
    await sql.end({ timeout: 1000 }).catch(() => { });
  }
}

main();
