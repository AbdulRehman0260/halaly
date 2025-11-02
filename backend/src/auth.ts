import argon2 from "argon2"

export const hashPassword = async (password:string): Promise<string>=>  {
    try {
    const hash = await argon2.hash(password);
    return hash;     
    } catch (error) {
        return `Error occurred while hashing password ${error}`
    }
}

export const checkPasswordHash = async (password:string, hash:string): Promise <boolean> => {
    if (await argon2.verify(password,hash)) {
        return true
    } else {
        return false
    }
}