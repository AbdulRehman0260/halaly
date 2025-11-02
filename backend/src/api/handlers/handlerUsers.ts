import type { Request,Response } from "express";
import { createUser, deleteUserById, getUserByEmail, getUserById } from "../../db/queries/users.js";
import type { NewUser } from "../../db/schema.js";
import { checkPasswordHash, hashPassword } from "../../auth.js";

export const handlerCreateUser = async (req: Request, res: Response) => {
    try {
        type parameters = {
            username: string;
            email: string;
            password:string
        }
        const params : parameters = req.body;
        const hashed_password = await hashPassword(params.password)
        const newUser  = await createUser({email: params.email, username: params.username,hashed_password:hashed_password});

        type UserResponse = Omit<NewUser,'hashed_password'>

       const secureResponse: UserResponse =  {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            created_at:newUser.created_at,
            updated_at:newUser.updated_at
        }

        res.status(201).json(secureResponse);
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
            res.status(400).json({error:"User paramater missing"})
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

//get user by email
export const handlerGetUserByEmail = async (req:Request, res:Response) => {
    try {
        type params = {
            password:string,
            email:string
        }
        const auth:params = req.body

        if (!auth.email || !auth.password) {
            res.status(400).json({error:"User paramaters missing"})
            return
        }
        const User = await getUserByEmail(auth.email)
        if (!User) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        
        type UserResponse = Omit<NewUser,'hashed_password'>
        
        const secureResponse: UserResponse =  {
            id: User.id,
            username: User.username,
            email: User.email,
            created_at:User.created_at,
            updated_at:User.updated_at
        }
        if (await checkPasswordHash(auth.password, User.hashed_password)) {
            res.status(200).json(secureResponse)
        } else {
            res.status(401).json({error:"Unauthorized - Incorrect email or password"})
        }

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