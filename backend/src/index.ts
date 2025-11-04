import dotenv from 'dotenv';
import postgres from 'postgres';
import {drizzle} from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import express from 'express';
import { handlerReadiness } from './api/handlers/handlerReadiness.js';
import { handlerCreateUser,handlerDeleteUser,handlerGetUser, handlerLogin } from './api/handlers/handlerUsers.js';
import { handlerCreateVideo, handlerDeleteVideo, handlerGetAllVideos, handlerGetVideoById } from './api/handlers/handlerVideos.js';
import middlewareAuth from './api/middleware/auth.js';
import { middlewareLogging } from './api/middleware/logging.js';
import { config } from './config.js';
// Load .env before reading process.env
dotenv.config();

//migrations
const migrationClient = postgres(config.db.url,{max:1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

//app instance
const app = express();

//middleware
app.use(express.json());
app.get('/healthz',middlewareLogging, handlerReadiness);

//videos
app.post('/api/videos', middlewareAuth, handlerCreateVideo);
app.get('/api/videos/:id', handlerGetVideoById);
app.delete('/api/videos/:id', middlewareAuth, handlerDeleteVideo);
app.get('/api/allvideos/:id',handlerGetAllVideos);

//users
app.post('/api/users',handlerCreateUser);
app.post('/api/login',handlerLogin);
app.get('/api/users/:id',handlerGetUser)
app.delete('/api/users/:id',handlerDeleteUser)


//static files
app.use("/app",express.static('./src/app'));

//listening to server
app.listen(config.api.port, () => {
  console.log(`server is running on http://localhost:${config.api.port}`);
});