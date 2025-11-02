import type {NewVideo} from "../schema.js";
import {db} from "../index.js";
import {videos} from "../schema.js";
import {eq} from "drizzle-orm";

//create a video
export async function createVideo(video: NewVideo): Promise<NewVideo> {
    const [result] = await db
    .insert(videos)
    .values(video)
    .returning();
    return result;
}

//delete video by id
export async function deleteVideo(videoId: string):Promise<void>  {
    await db
    .delete(videos)
    .where(eq(videos.id, videoId));
}

//get video by id
export async function getVideoById(videoId: string): Promise<NewVideo> {
    const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId));
    return video;
}

//get all videos
export async function getAllVideos(user_id:string):Promise<NewVideo[]> {
    const videosArray = await db.select().from(videos).where(eq(videos.user_id,user_id));
    return videosArray
}