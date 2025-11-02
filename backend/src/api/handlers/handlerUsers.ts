import type { Request,Response } from "express";
import { createUser, deleteUserById, getUserById } from "../../db/queries/users.js";
import { NewUser } from "../../db/schema.js";

export const handlerCreateUser = async (req: Request, res: Response) => {
    try {
        type parameters = {
            username: string;
            email: string;
        }
        const params : parameters = req.body;
        const newUser  = await createUser({email: params.email, username: params.username});
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//get user by id
export const handlerGetUser = async (req:Request, res:Response) => {
    try {
        const userId: string = req.params.id
        if (!userId) {
            res.status(400).json({error:"Video paramater missing"})
            return
        }
        const user = await getUserById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user)
    } catch (error) {
        console.error("Error getting user",error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

//delete a user by id

export const handlerDeleteUser = async (req:Request,res:Response) => {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({error:"Userid is missing"})
        }
        await deleteUserById(userId)
        return res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        console.error("Error getting user",error)
        res.status(500).json({error:"Internal Server Error"})
    }
}