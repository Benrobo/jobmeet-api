import User from "../model/Users.model"
import Career from "../model/Career.model"
// import { validateEmail, validatePhonenumber } from "../utils/validate"
import { Response } from "express"
import sendResponse from "../utils/response"
import { CareerInterface } from "../types/interface"
import { genId, genUnique, isEmpty, isUndefined } from "../utils"
import { validateEmail } from "../utils/validate"
// import { DB, SCHEMA } from "../config/db"

const TABLE = "career"

class CareerController {

    private handleAddPayload<T extends CareerInterface>(res: Response, payload: T, action: string = "create"){
        const { orgName, email, title, tags, jobRole, duration, overview, requirements, benefits } = payload;

        if(action === "edit"){
            const {careerId} = payload;
            if (isUndefined(careerId) || isEmpty(careerId)){
                sendResponse(res, 404, false, "career page ID is missing.")
                return false
            }
        }

        if (isUndefined(orgName) || isEmpty(orgName)){
            sendResponse(res, 400, false, "organization name is missing.")
            return false
        }

        if (isUndefined(email) || isEmpty(email)){
            sendResponse(res, 400, false, "email is missing.")
            return false
        }

        if (isUndefined(title) || isEmpty(title)){
            sendResponse(res, 400, false, "title is missing.")
            return false
        }

        if (isUndefined(tags) || isEmpty(tags)){
            sendResponse(res, 400, false, "tags is missing.")
            return false
        }

        if (isUndefined(jobRole) || isEmpty(jobRole)){
            sendResponse(res, 400, false, "job role is missing.")
            return false
        }

        if (isUndefined(duration) || isEmpty(duration)){
            sendResponse(res, 400, false, "duration is missing.")
            return false
        }

        if (isUndefined(overview) || isEmpty(overview)){
            sendResponse(res, 400, false, "overview is missing.")
            return false
        }

        if (isUndefined(requirements) || isEmpty(requirements)){
            sendResponse(res, 400, false, "requirements is missing.")
            return false
        }

        if (isUndefined(benefits) || isEmpty(benefits)){
            sendResponse(res, 400, false, "benefits is missing.")
            return false
        }
        // verify email
        if(!validateEmail(email)){
            sendResponse(res, 400, false, "email is invalid")
            return false;
        }
        return true
    }

    public async all(res: Response){
        try {
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} `
            const result = await Career.find()
            sendResponse(res, 200, true, "career page fetched successfully.", result!)
        } catch (e: any) {
            sendResponse(res, 200, false, "something went wrong. "+e.message)
        }
    }

    public async byId(res: Response, ID: string){
        try {
            // const query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${ID}" `
            const result : any = await Career.find({id: ID});

            sendResponse(res, 200, true, "career page fetched successfully.", result!)
        } catch (e: any) {
            sendResponse(res, 200, false, "something went wrong. "+e.message)
        }
    }

    public async byUserId(res: Response){
        try {
            const {id} = (res as any).user;
            // const query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE userId="${id}" `
            const result = await Career.find({userId: id});

            if(result.length === 0) return sendResponse(res, 404, false, "career page not found.")

            sendResponse(res, 200, true, "career page fetched successfully.", result!)
        } catch (e: any) {
            sendResponse(res, 200, false, "something went wrong. "+e.message)
        }
    }

    public async create(res: Response, payload: CareerInterface) {
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const { orgName,logo } = payload;

        const ishandledPaylod = this.handleAddPayload(res, payload)

        if(!ishandledPaylod) return

        const {id} = (res as any).user
        const orgLogo = isUndefined(logo) || isEmpty(logo) ? `https://avatars.dicebear.com/api/initials/${orgName}.svg` : logo;

        try {
            
            // check if user exists
            let query;
            // query = ` SELECT * FROM ${SCHEMA}.users WHERE id='${id}'`;
            const isAuthorExists = await User.find({id});
            
            if(isAuthorExists.length === 0) return sendResponse(res, 404, false, "unauthorised to create career.")
            
            // create career
            const newPayload = {
                id: `career_${genUnique()}`,
                userId: id,
                createdAt: Date.now(),
                ...payload
            }
            newPayload["logo"] = orgLogo

            const result = await Career.create(newPayload)
            // update user role to 2 (Author)
            await User.findOneAndUpdate({id}, {role: 2})
            
            sendResponse(res, 200, true, "career page created successfully.", newPayload)
        } catch (e: any) {
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
        
    }

    public async update(res: Response, payload: CareerInterface){
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const { careerId, orgName,logo } = payload;

        const ishandledPaylod = this.handleAddPayload(res, payload, "edit")

        if(!ishandledPaylod) return

        const {id} = (res as any).user
        const orgLogo = isUndefined(logo) || isEmpty(logo) ? "dicebear avatar image here" : logo;

        // check if user exists
        try {
            
            let query;
            // query = ` SELECT * FROM ${SCHEMA}.users WHERE id='${id}'`;
            const isAuthorExists = await User.find({id});
            
            if(isAuthorExists.length === 0) return sendResponse(res, 404, false, "unauthorised to update career.")

            // check if career pageid exists
            // query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${careerId}"`
            const careerExists = await Career.find({id: careerId});

            if(careerExists.length === 0) return sendResponse(res, 404, false, "failed: career page not found.")

            // create career
            const newPayload = {
                id: careerId,
                userId: id,
                createdAt: Date.now(),
                ...payload
            }
            newPayload["logo"] = orgLogo

            await Career.findOneAndUpdate({id}, newPayload)
            
            sendResponse(res, 200, true, "career page updated successfully.")
        } catch (e: any) {
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
    }

    public async delete(res: Response, payload: CareerInterface){
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const { careerId } = payload;

        if (isUndefined(careerId) || isEmpty(careerId)){
            sendResponse(res, 404, false, "career page ID is missing.")
            return false
        }

        const {id} = (res as any).user

        try {
            
            // check if user exists and author has permission role level of 2
            let query;
            // query = ` SELECT * FROM ${SCHEMA}.users WHERE id='${id}'`;
            const isAuthorExists : any = await User.find({id});
            
            if(isAuthorExists.length === 0) return sendResponse(res, 404, false, "unauthorised to delete career page.")
            
            if(isAuthorExists[0].role !== 2) return sendResponse(res, 403, false, "Not permitted to delete career page.")

            // check if career pageid exists
            // query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE id='${careerId}'`;
            const careerExists = await Career.find({id: careerId});
            if(careerExists.length === 0) return sendResponse(res, 404, false, "failed: career page not found.")


            // check if author is permitted to delete a post
            // query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE id='${careerId}'`;
            const hasPermission = careerExists;
            if(hasPermission.length === 0) return sendResponse(res, 403, false, "Not permitted to delete career page.")

            // query = `DELETE FROM ${SCHEMA}.${TABLE} WHERE id='${careerId}'`;
            await Career.deleteOne({id: careerId});
            
            sendResponse(res, 200, true, "career page deleted successfully.")
        } catch (e: any) {
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
    }
}

export default CareerController