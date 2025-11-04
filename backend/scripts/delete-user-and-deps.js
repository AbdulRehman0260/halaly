#!/usr/bin/env node
// scripts/delete-user-and-deps.js
// Usage: node scripts/delete-user-and-deps.js <email>

import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();
const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/delete-user-and-deps.js <email>');
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
    const users = await sql`SELECT id,email FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      console.log('No user found with email', email);
      return;
    }
    const uid = users[0].id;

    await sql.begin(async sqlTx => {
      // Delete likes by user or for user's videos
      await sqlTx`DELETE FROM likes WHERE user_id = ${uid} OR video_id IN (SELECT id FROM videos WHERE user_id = ${uid})`;

      // Delete comments by user or for user's videos
      await sqlTx`DELETE FROM comments WHERE user_id = ${uid} OR video_id IN (SELECT id FROM videos WHERE user_id = ${uid})`;

      // Delete thumbnails for user's videos
      await sqlTx`DELETE FROM thumbnails WHERE video_id IN (SELECT id FROM videos WHERE user_id = ${uid})`;

      // Delete the videos owned by the user
      await sqlTx`DELETE FROM videos WHERE user_id = ${uid}`;

      // Finally delete the user
      const deleted = await sqlTx`DELETE FROM users WHERE id = ${uid} RETURNING id, email`;
      console.log('Deleted user and dependent data:', deleted);
    });

  } catch (err) {
    console.error('Error deleting user and dependencies:', err);
    process.exit(2);
  } finally {
    await sql.end().catch(()=>{});
  }
}

main();
