import mongoose,{Schema, model} from "mongoose"


const MeetingSchema = new Schema({
    id:{type: "string", unique: true},
    userId:{type: "string"},
    title: {type: "string"},
    description: {type: "string"},
    candidateId:{type: "string"},
    startDate:{type: "string"},
    startTime:{type: "string"},
    endTime:{type: "string"},
    isTimeExpired:{type: "boolean"},
    createdAt:{type: "string"}
}, {
    versionKey: false
})

const Meeting = model("Meeting", MeetingSchema)

export default Meeting