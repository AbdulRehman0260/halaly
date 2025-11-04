#!/usr/bin/env node
// scripts/delete-user-by-email.js
// Usage: node scripts/delete-user-by-email.js <email>

import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();
const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/delete-user-by-email.js <email>');
  process.exit(1);
}

const connectionString = process.env.CONNECTION_STRING || process.env.DB_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('No connection string found in env (CONNECTION_STRING or DB_URL)');
  process.exit(1);
}

const sql = postgres(connectionString);

async function main() {
  try {
    const deleted = await sql`DELETE FROM users WHERE email = ${email} RETURNING id, email, hashed_password`;
    if (deleted.length === 0) {
      console.log('No user found with email', email);
    } else {
      console.log('Deleted rows:');
      for (const r of deleted) console.log(r);
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    process.exit(2);
  } finally {
    await sql.end().catch(()=>{});
  }
}

main();
