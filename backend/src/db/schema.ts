import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';

//user table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    hashed_password: varchar("hashed_password", { length:255}).notNull().default("unset"),
    email: varchar('email', { length: 255 }).notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export type NewUser = typeof users.$inferInsert;

//video table
export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id),              
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export type NewVideo = typeof videos.$inferInsert;

//comments table
export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    video_id: uuid('video_id').notNull().references(() => videos.id),   
    user_id: uuid('user_id').notNull().references(() => users.id),
    content: varchar('content', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export type NewComment = typeof comments.$inferInsert;

//thumbnails table
export const thumbnails = pgTable('thumbnails', {
    id: uuid('id').primaryKey().defaultRandom(),
    video_id: uuid('video_id').notNull().references(() => videos.id),
    url: varchar('url', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export type NewThumbnail = typeof thumbnails.$inferInsert;

//likes table
export const likes = pgTable('likes', {
    id: uuid('id').primaryKey().defaultRandom(),
    video_id: uuid('video_id').notNull().references(() => videos.id),
    user_id: uuid('user_id').notNull().references(() => users.id),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export type NewLike = typeof likes.$inferInsert;

