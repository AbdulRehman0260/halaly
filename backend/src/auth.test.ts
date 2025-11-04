import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";

describe("JWT testing", () => {
    const userID = "abcdef"
    const secret = "vbrleo@1340"
    let jwt1:string

    beforeAll(() => {
     jwt1 = makeJWT(userID, 3600, secret);
    })

    it("should return the correct boolean value", () => {
        const result = validateJWT(jwt1,secret);
        expect(result).toBe(userID)
    })
})
