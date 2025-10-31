import type { Request,Response } from "express";
import { createUser } from "../../db/queries/users.js";

export const handlerCreateUser = async (req: Request, res: Response) => {
    try {
        type parameters = {
            username: string;
            email: string;
        }
        const params : parameters = req.body;
        const newUser = await createUser({email: params.email, username: params.username});
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
