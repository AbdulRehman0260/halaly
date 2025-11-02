import type {NewVideo} from "../schema.js";
import {db} from "../index.js";
import {videos} from "../schema.js";
import {eq} from "drizzle-orm";

//create a video
export async function createVideo(video: NewVideo) {
    const [result] = await db
    .insert(videos)
    .values(video)
    .returning();
    return result;
}

//delete video by id
export async function deleteVideo(videoId: string) {
    await db
    .delete(videos)
    .where(eq(videos.id, videoId));
}

//get video by id
export async function getVideoById(videoId: string) {
    const video = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))
    return video;
}