import User from "../model/Users.model"
import Career from "../model/Career.model"
import Candidate from "../model/Candidate.model"
import Meeting from "../model/Meeting.model"
// import { validateEmail, validatePhonenumber } from "../utils/validate"
import { Response } from "express"
import sendResponse from "../utils/response"
import { MeetingInterface } from "../types/interface"
import { checkDataExists, genId, genUnique, isEmpty, isUndefined } from "../utils"
import { validateEmail } from "../utils/validate"
// import { DB, SCHEMA } from "../config/db"

const TABLE = "meeting"

class MeetingControler {


    private handleCreatePayload(res: Response, payload: MeetingInterface) {
        const { candidateId, careerId, endTime, startDate, startTime, title, description } = payload;

        if (isUndefined(title) || isEmpty(title)) {
            sendResponse(res, 400, false, "missing meeting title.")
            return false
        }
        if (isUndefined(description) || isEmpty(description)) {
            sendResponse(res, 400, false, "missing meeting description.")
            return false
        }
        if (isUndefined(candidateId) || isEmpty(candidateId)) {
            sendResponse(res, 400, false, "missing candidate id.")
            return false
        }
        if (isUndefined(careerId) || isEmpty(careerId)) {
            sendResponse(res, 400, false, "missing career id.")
            return false
        }
        if (isUndefined(endTime) || isEmpty(endTime)) {
            sendResponse(res, 400, false, "missing end time.")
            return false
        }
        if (isUndefined(startDate) || isEmpty(startDate)) {
            sendResponse(res, 400, false, "missing start date.")
            return false
        }
        if (isUndefined(startTime) || isEmpty(startTime)) {
            sendResponse(res, 400, false, "missing startTime.")
            return false
        }
        return true
    }

    public async byId(res: Response, ID: string) {
        try {

            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${ID}" `
            const meetingData: any = await Meeting.find({id: ID})

            return sendResponse(res, 200, true, `meeting fetched successfully`, meetingData[0] || {})
        } catch (e: any) {
            return sendResponse(res, 500, false, `something went wrong: ${e.message}`)
        } 
    }

    public async byUserId(res: Response) {
        try {

            const userId = (res as any).user.id;
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE userId="${userId}" `
            const meetingData: any = await Meeting.find({userId})

            return sendResponse(res, 200, true, `meeting fetched successfully`, meetingData!)
        } catch (e: any) {
            return sendResponse(res, 500, false, `something went wrong: ${e.message}`)
        }
    }

    public async create(res: Response, payload: MeetingInterface) {
        const { careerId, candidateId } = payload;

        const handledPayload = this.handleCreatePayload(res, payload)

        if (!handledPayload) return;

        const userId = (res as any).user.id;

        try {

            // check if careerId and candidateId exists
            let query, query2;
            // query = ` SELECT * FROM ${SCHEMA}.career WHERE id="${careerId}" `
            // query2 = ` SELECT * FROM ${SCHEMA}.candidate WHERE id="${candidateId}" `
            const doesCareerExists = await Career.find({id: careerId})
            const doesCandidateExists = await Candidate.find({id: candidateId})

            if (doesCareerExists.length === 0)
                return sendResponse(res, 404, false, "failed to create meeting: career not found.")
            if (doesCandidateExists.length === 0)
                return sendResponse(res, 404, false, "failed to create meeting: candidate not found.")

            // check if this candidate applied to an existing job positing having same careerId
            const _userAppliedToCareerPage = doesCareerExists[0]["id"] === doesCandidateExists[0]["careerId"]

            if (!_userAppliedToCareerPage)
                return sendResponse(res, 404, false, "failed to create meeting: candidate not found on this job posting.")


            // save data
            try {

                const newpayload = {
                    id: `meeting_${genUnique()}`,
                    ...payload,
                    userId,
                    isTimeExpired: false,
                    createdAt: Date.now()
                }

                await Meeting.create(newpayload)

                return sendResponse(res, 200, true, `Meeting event created successfully`, newpayload)
            } catch (e: any) {
                console.log(e)
                return sendResponse(res, 500, false, `something went wrong creating meeting: ${e.message}`)
            }


        } catch (e: any) {
            return sendResponse(res, 500, false, `something went wrong: ${e.message}`)
        }
    }

    public async delete(res: Response, payload: MeetingInterface) {
        const { meetingId } = payload;

        if (isUndefined(meetingId) || isEmpty(meetingId)) {
            return sendResponse(res, 404, false, "missing meeting id.")
        }

        const userId = (res as any).user.id;

        try {

            // check if meetingId
            // const query = ` SELECT * FROM ${SCHEMA}.${TABLE} WHERE id="${meetingId}" `
            const doesMeetingExists = await Meeting.find({id: meetingId})
            
            if (doesMeetingExists.length === 0)
                return sendResponse(res, 404, false, "failed to delete: meeting not found.")

            const _wasMeetingCreatedByThisUser = doesMeetingExists[0]["userId"] === userId;

            if (!_wasMeetingCreatedByThisUser)
                return sendResponse(res, 403, false, "Unauthorised to delete meeting.")

            // delete data
            try {

                // const query2 = ` DELETE FROM ${SCHEMA}.${TABLE} WHERE id="${meetingId}" AND userId="${userId}" `
                await Meeting.find({id: meetingId, userId})

                return sendResponse(res, 200, true, `Meeting event deleted successfully`)
            } catch (e: any) {
                return sendResponse(res, 500, false, `something went wrong deleting scheduled meeting: ${e.message}`)
            }


        } catch (e: any) {
            return sendResponse(res, 500, false, `something went wrong: ${e.message}`)
        }
    }

}

export default MeetingControler