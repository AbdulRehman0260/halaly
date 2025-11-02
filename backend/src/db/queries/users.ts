import { db } from "../index.js";
import {users } from "../schema.js";
import type { NewUser } from "../schema.js";
import { eq } from "drizzle-orm";

//create new user   
export async function createUser(user: NewUser) {
    const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
    return result;
}

//get user by id
export async function getUserById(userId: string) {
    const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    return user;
}

//get user by email
export async function getUserByEmail(email: string) {
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    return user;
}

//delete user by id
export async function deleteUserById(userId: string) {
    await db
    .delete(users)
    .where(eq(users.id, userId));
}