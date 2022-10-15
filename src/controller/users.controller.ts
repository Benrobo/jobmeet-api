import  User from "../model/Users.model"
// import { validateEmail, validatePhonenumber } from "../utils/validate"
import {Response} from "express"
import sendResponse from "../utils/response"
// import { LoginInterface, RegisterInterface } from "../types/interface"
import { genHash, genId } from "../utils"
// import { DB, SCHEMA } from "../config/db"


const TABLE = "users"

class UsersController {

    async all(res: Response){
        try {
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} `
            const results = await User.find();
            let newResults : any[] = [] 
            results.map((data: any)=>{
               return newResults.push({
                id: data.id,
                email: data.email,
                username: data.username,
                role: data.role,
                token: data.token,
                createdAt: data.createdAt
               })
            })
            

            return sendResponse(res, 200, true, "users fetched successfully", newResults)
        } catch (e: any) {
            sendResponse(res, 500, false, "something went wrong logging in", {
                error: e.message,
            });
        }
    }

    async byId(res: Response, id: string){
        try {
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${id}" `
            const results = await User.find({id});
            let newResults = {}
            if(results.length === 0) newResults = {}
            const data = results[0]
            newResults = {
                id: data?.id,
                email: data?.email,
                username: data?.username,
                role: data?.role,
                token: data?.token,
                createdAt: data?.createdAt
            }
            
            const message = results.length === 0 ? "No user found" : "users fetched successfully";
            const statusCode = results.length === 0 ? 404 : 200
            return sendResponse(res, statusCode, true, message, newResults)
        } catch (e: any) {
            sendResponse(res, 500, false, "something went wrong fetching user", {
                error: e.message,
            });
        }
    }
}

export default UsersController







