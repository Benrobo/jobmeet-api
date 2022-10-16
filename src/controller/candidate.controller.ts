import User from "../model/Users.model"
import Career from "../model/Career.model"
import Candidate from "../model/Candidate.model"
// import { validateEmail, validatePhonenumber } from "../utils/validate"
import { Response } from "express"
import sendResponse from "../utils/response"
import { CandidateInterface, CandidateStatus  } from "../types/interface"
import { checkDataExists, genId, genUnique, isEmpty, isUndefined } from "../utils"
import { validateEmail } from "../utils/validate"
// import { DB, SCHEMA } from "../config/db"

const TABLE = "candidate"

class CandidateController{

    private handleAddPayload<T extends CandidateInterface>(res: Response, payload: T, action: string = "create"){
        const { careerId, document, email, fullName, jobRole, link,profileImage, duration } = payload;

        // if(action === "edit"){
        //     const {careerId} = payload;
        //     if (isUndefined(careerId) || isEmpty(careerId)){
        //         sendResponse(res, 404, false, "career page ID is missing.")
        //         return false
        //     }
        // }

        if (isUndefined(careerId) || isEmpty(careerId)){
            sendResponse(res, 400, false, "organization ID is missing.")
            return false
        }

        // if (isUndefined(profileImage) || isEmpty(profileImage)){
        //     sendResponse(res, 400, false, "profile image is missing.")
        //     return false
        // }

        if (isUndefined(email) || isEmpty(email)){
            sendResponse(res, 400, false, "email is missing.")
            return false
        }

        if (isUndefined(fullName) || isEmpty(fullName)){
            sendResponse(res, 400, false, "fullName is missing.")
            return false
        }

        if (isUndefined(link) || isEmpty(link)){
            sendResponse(res, 400, false, "link url is missing.")
            return false
        }

        if (isUndefined(jobRole) || isEmpty(jobRole)){
            sendResponse(res, 400, false, "job role is missing.")
            return false
        }

        if (isUndefined(document) || isEmpty(document)){
            sendResponse(res, 400, false, "document is missing.")
            return false
        }

        if (isUndefined(duration) || isEmpty(duration)){
            sendResponse(res, 400, false, "duration is missing.")
            return false
        }

        // verify email
        if(!validateEmail(email)){
            sendResponse(res, 400, false, "email is invalid")
            return false;
        }
        return true
    }

    private handleCandidateStatusPayload<T extends CandidateStatus>(res: Response, payload: T){
        const { careerId, candidateId, status } = payload;
        const validStatus = ["pending", "approved", "rejected"]

        
        
        if (isUndefined(careerId) || isEmpty(careerId)){
            sendResponse(res, 400, false, "organization ID is missing.")
            return false
        }

        if (isUndefined(candidateId) || isEmpty(candidateId)){
            sendResponse(res, 400, false, "candidate Id is missing.")
            return false
        }

        if (isUndefined(status) || isEmpty(status)){
            sendResponse(res, 400, false, "status is missing.")
            return false
        }

        if (!checkDataExists(validStatus, status)){
            sendResponse(res, 400, false, "invalid status state.")
            return false
        }
        
        return true
    }

    public async all(res: Response){
        try {
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE}`
            const result = await Candidate.find();
            sendResponse(res, 200, true, "candidate fetched successfully.", result)
        } catch (e: any) {
            sendResponse(res, 200, false, "something went wrong. "+e.message)
        }
    }

    public async byOrgId(res: Response, ID: string | null){

        if(ID === "" || typeof ID === "undefined" || ID === null){
            sendResponse(res, 400, false, "organization ID is missing.")
            return false
        }

        try {
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE careerId="${ID}" `
            const result = await Candidate.find({careerId: ID});
            sendResponse(res, 200, true, "career candidates fetched successfully.", result!)
        } catch (e: any) {
            sendResponse(res, 200, false, "something went wrong. "+e.message)
        }
    }

    public async add(res: Response, payload: CandidateInterface){
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const ishandledPaylod = this.handleAddPayload(res, payload)

        if(!ishandledPaylod) return

        const {profileImage, fullName, careerId} = payload;

        const userImg = isUndefined(profileImage) || isEmpty(profileImage) ? `https://avatars.dicebear.com/api/micah/${fullName}.svg` : profileImage;

        try {
            
            // check if org career page exists
            // const query = ` SELECT * FROM ${SCHEMA}.career WHERE id="${careerId}" `
            const isCareerExists = await Career.find({id: careerId})

            if(isCareerExists.length === 0) return sendResponse(res, 404, false, "career page not found")

            // create candidate
            const newPayload = {
                id: `candidate_${genUnique()}`,
                createdAt: Date.now(),
                status: "pending",
                ...payload
            }
            newPayload["profileImage"] = userImg

            await Candidate.create(newPayload)

            sendResponse(res, 200, true, "application submitted successfully.", newPayload)
            
        } catch (e: any) {
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
        
    }

    public async changeCandidateStatus(res: Response, payload: any){
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const {candidateId, careerId, status} = payload;
        const userId = (res as any).user.id

        const handledPayload = this.handleCandidateStatusPayload(res, payload)

        if(!handledPayload) return

        try {
            let query;
            // check if org career page exists
            // query = ` SELECT * FROM ${SCHEMA}.career WHERE id="${careerId}" `
            const isCareerExists = await Career.find({id: careerId})
            if(isCareerExists.length === 0) return sendResponse(res, 404, false, "career page not found")

            // query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${candidateId}" `
            const isCandidateExists = await Candidate.find({id: candidateId})
            if(isCandidateExists.length === null) return sendResponse(res, 404, false, "candidate not found")
            
            // check if user trying to update candidate status is actually the owner of the career page or who added the career page.
            const filter= {userId, id: careerId}
            // query = ` SELECT * FROM ${SCHEMA}.career WHERE userId="${userId}" AND id="${careerId}"`
            const isAuthorised = await Career.find(filter)
            if(isAuthorised.length === 0) return sendResponse(res, 401, false, "not authorised to update candidate status.")

            // update candidate status 
            await Candidate.findOneAndUpdate({id: candidateId},{
                id: candidateId,
                careerId,
                status
            })

            sendResponse(res, 200, true, `candidate ${status} successfully.`)
        } catch (e: any) {
            console.log(e)
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
        
    }

    public async delete(res: Response, payload: any){
        if (typeof res === "undefined") throw new Error("res object is missing.")

        const {candidateId, careerId} = payload;
        const userId = (res as any).user.id

                
        if (isUndefined(careerId) || isEmpty(careerId)){
            sendResponse(res, 400, false, "organization ID is missing.")
            return false
        }

        if (isUndefined(candidateId) || isEmpty(candidateId)){
            sendResponse(res, 400, false, "candidate Id is missing.")
            return false
        }


        try {

            let query;
            // check if org career page exists
            // query = ` SELECT * FROM ${SCHEMA}.career WHERE id="${careerId}" `
            const isCareerExists = await Career.find({id: careerId})
            if(isCareerExists.length === 0) return sendResponse(res, 404, false, "career page not found")

            // query = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${candidateId}" `
            const isCandidateExists = await Candidate.find({id: candidateId})
            if(isCandidateExists.length === null) return sendResponse(res, 404, false, "candidate not found")

            // check if user trying to update candidate state is actually the owner of the career page or who added the career page.
            const filter= {userId, id: careerId}
            // query = ` SELECT * FROM ${SCHEMA}.career WHERE userId="${userId}" AND id="${careerId}"`
            const isAuthorised = await Career.find(filter)
            if(isAuthorised.length === 0) return sendResponse(res, 401, false, "not authorised to update candidate status.")

            // delete candidate
            // query = ` DELETE FROM ${SCHEMA}.${TABLE} WHERE id="${candidateId}" AND careerId="${careerId}" `
            await Candidate.deleteOne({id: candidateId, careerId})

            sendResponse(res, 200, true, "candidate deleted successfully.")
        } catch (e: any) {
            sendResponse(res, 500, false, `something went wrong. ${e.message} `)
        }
        
    }
}

export default CandidateController