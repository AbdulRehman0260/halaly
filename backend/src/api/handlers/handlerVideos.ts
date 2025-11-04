import { createVideo, getAllVideos, getVideoById } from "../../db/queries/videos.js";
import type { Request,Response } from 'express';
import { deleteVideo } from "../../db/queries/videos.js";
import type { NewVideo } from "../../db/schema.js";
import { config } from "../../config.js";

//create a video
export const handlerCreateVideo = async (req: Request, res: Response) => {
    try {
        type parameters = {
            title: string;
            description: string;
            user_id: string;
        }
        const videoParams : parameters = req.body;
        // userId should be attached by the auth middleware
        const userID = (req as unknown as { userId?: string }).userId;
        if (!userID) {
            res.status(401).json({ error: 'Authorization required' });
            return;
        }

        const newVideo = await createVideo({ title: videoParams.title, description: videoParams.description, user_id: userID });
        res.status(201).json(newVideo);
    } catch (error) {
        console.error("Error creating video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//delete video by id
export const handlerDeleteVideo = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.id;
        if (!videoId) {
            res.status(400).json({ error: "Video ID is required" });
            return;
        }
        await deleteVideo(videoId);
        res.status(204).send("Video deleted successfully");
    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//get video by id
export const handlerGetVideoById = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.id;
        if (!videoId) {
            res.status(400).json({ error: "Video ID is required" });
            return;
        }
        const video = await getVideoById(videoId);
        if (!video) {
            res.status(404).json({ error: "Video not found" });
            return;
        }
        res.status(200).json(video);
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const handlerGetAllVideos = async (req:Request, res:Response) => {
    try {
        const userId: string = req.params.id
        if (!userId) {
            res.status(400).json({error:"User paramater missing"})
            return

        }
        const allVideos = await getAllVideos(userId)
        if (allVideos.length === 0) {
            res.status(404).json({ error: "No video found" });
            return
        }
        res.status(200).json(allVideos)
    } catch (error) {
        console.error("Error getting videos",error)
        res.status(500).json({error:"Internal Server Error"})
    }
}