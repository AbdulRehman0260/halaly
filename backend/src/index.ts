import dotenv from 'dotenv';
import postgres from 'postgres';
import {drizzle} from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import express from 'express';
import { handlerReadiness } from './api/handlers/handlerReadiness.js';
import { middlewareLogging } from './api/middleware/logging.js';
import { config } from './config.js';
// Load .env before reading process.env
dotenv.config();



const migrationClient = postgres(config.db.url,{max:1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
app.use(express.json());
app.get('/healthz',middlewareLogging, handlerReadiness);
app.use("/app",express.static('./src/app'));

app.listen(config.api.port, () => {
  console.log(`server is running on http://localhost:${config.api.port}`);
});