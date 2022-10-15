import  User from "../model/Users.model"
import { genAccessToken, genRefreshToken } from "../utils/token"
import { validateEmail, validatePhonenumber } from "../utils/validate"
import {Response} from "express"
import sendResponse from "../utils/response"
import { LoginInterface, RegisterInterface } from "../types/interface"
import { compareHash, genHash, genId } from "../utils"
// import {DB, SCHEMA } from "../config/db"


/**
 * 
 * VALID ROLES
 *  1 -- > USER
 *  2 -- > AUTHOR
 *  3 -- > ADMIN
 */

const TABLE = "users"

class AuthController {
    async login(res: Response, payload: LoginInterface){
        if (res === undefined || typeof res === "undefined") {
            throw new Error("expected a valid 'res' object but got none ");
        }
        if (Object.entries(payload).length === 0) {
            return sendResponse(
                res,
                400,
                false,
                "failed to log In, missing payload."
            );
        }

        
        const { email, password } = payload;

        if (email === "") {
            return sendResponse(res, 400, false, "email is missing");
        }

        if (password === "") {
            return sendResponse(res, 400, false, "password is missing");
        }

        if (!validateEmail(email))
            return sendResponse(res, 400, false, "email given is invalid");

        // check if user with this email address already exists
        let userExistsResult, userData, query;
        // query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE email="${email}"`
        
        try {
            userExistsResult = await User.find({email});

            if (userExistsResult.length === 0)
                return sendResponse(
                    res,
                    400,
                    false,
                    "user with this email address dont exists."
                );

            userData = userExistsResult[0];
            if (userExistsResult.length > 0 && !compareHash(password, userData.hash!))
                return sendResponse(res, 400, false, "password given is incorrect");

        } catch (e: any) {
            console.log(e)
            return sendResponse(res, 500, false, "something went wrong logging in", {
                error: e.message,
            });
        }


        try {
            // userExistsResult = await DB.query(query);
            // userData = userExistsResult.data[0];

            const userPayload : any = {
                id: userData?.id,
                username: userData?.username,
                email: userData?.email,
                role: 1
            };
            const refreshToken = genRefreshToken(userPayload);
            const accessToken = genAccessToken(userPayload);
            
            userPayload["token"] = refreshToken;

            // const query
            await User.findOneAndUpdate({email}, {token: refreshToken})

            return sendResponse(res, 201, true, "Logged In successful", {
                ...userPayload,
                accessToken,
            });
        } catch (e: any) {
            console.log(e)
            sendResponse(res, 500, false, "something went wrong logging in", {
                error: e.message,
            });
        }
    }

    async register(res: Response, payload: RegisterInterface){
        if (res === undefined || typeof res === "undefined") {
            throw new Error("expected a valid 'res' object but got none ");
        }
        if (Object.entries(payload).length === 0) {
            return sendResponse(
                res,
                400,
                false,
                "failed to log In, missing payload."
            );
        }

        
        const { email, password, username } = payload;

        if (email === "" || email === "undefined") {
            return sendResponse(res, 400, false, "email is missing");
        }
        if (username === "" || username === undefined) {
            return sendResponse(res, 400, false, "username is missing");
        }
        if (password === "" || username === "undefined") {
            return sendResponse(res, 400, false, "password is missing");
        }

        if (!validateEmail(email))
            return sendResponse(res, 400, false, "email given is invalid");

        // check if user with this email address already exists
        let userExistsResult, userData;
        // query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE email="${email}"`
        
        try {
            userExistsResult = await User.find({email});

            if (userExistsResult.length > 0)
                return sendResponse(
                    res,
                    400,
                    false,
                    "user with this email address already exists."
                );
                
                try {
                    const hash = genHash(10, password)
                    const userPayload = {
                        id: genId(),
                        username: username,
                        email: email,
                        role: 1,
                        hash,
                        token: "",
                        createdAt: Date.now()
                    };
        
                    await User.create(userPayload)
        
                    return sendResponse(res, 201, true, "registering successful", {
                        id: userPayload.id,
                        username: userPayload.username,
                        email: userPayload.email,
                        role: userPayload.role,
                        token: userPayload.token,
                        createdAt: userPayload.createdAt,
                    });
                } catch (e: any) {
                    sendResponse(res, 500, false, "something went wrong while registering", {
                        error: e.message,
                    });
                }
        } catch (e: any) {
            sendResponse(res, 500, false, "something went wrong logging in", {
                error: e.message,
            });
            
        }

    }
}

export default AuthController