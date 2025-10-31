import dotenv from 'dotenv';
import express from 'express';
import { handlerReadiness } from './api/handlers/handlerReadiness.js';
import { middlewareLogging } from './api/middleware/logging.js';

// Load .env before reading process.env
dotenv.config();

const app = express();
app.use(express.json());
app.get('/healthz',middlewareLogging, handlerReadiness);
app.use("/app",express.static('./src/app'));

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});