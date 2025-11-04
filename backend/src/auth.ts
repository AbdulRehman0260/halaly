import argon2 from "argon2"
import type {JwtPayload} from "jsonwebtoken"
import jwt from "jsonwebtoken";
import { Request,Response } from "express";

export const hashPassword = async (password:string): Promise<string>=>  {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (error) {
        // Throw so callers can't accidentally store an error string as the hash
        console.error('Error hashing password', error);
        throw new Error('Error hashing password');
    }
}

export const checkPasswordHash = async (password:string, hash:string): Promise <boolean> => {
    try {
        return await argon2.verify(hash, password) ? true : false;
    } catch (err) {
        // If the stored hash is malformed or verification fails, log and return false
        console.error('Password verification failed:', err);
        return false;
    }
}

// make the signed object using a secret
export const makeJWT = (userID:string, expiresIn:number, secret:string):string => {

    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const timeIssued:number = Math.floor(Date.now() / 1000);
    const expiryTime = timeIssued + expiresIn

    const jwtpayload = {
        iss:"halaly",
        sub: userID,
        iat: timeIssued,
        exp: expiryTime
    } satisfies payload

    return jwt.sign(jwtpayload,secret);
}

// validate jwt token

export const validateJWT = (tokenString:string, secret:string): string => {
    const decodedPayload = jwt.verify(tokenString, secret);
    if (!decodedPayload) {
        throw new Error("token is invalid or expired")
    }
    if (!decodedPayload.sub){
        throw new Error("Token does not contain the required information")
    }
    const userID = decodedPayload.sub as string
    return userID;

}

//getBearer token

export const getBearerToken = (req:Request): string => {
     const authHeader = req.get("Authorization")

     if (!authHeader) {
        throw new Error("No authorization header present")
     }

     const headers = authHeader.split(" ")

     if(headers.length < 2 || headers[0] != "Bearer") {
        throw new Error("Malformed header string")
     }

     const tokenString = headers[1].trim()
     return tokenString;
}