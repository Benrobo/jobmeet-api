import {Schema, model} from "mongoose"


const CandidateSchema = new Schema({
    id:{type: "string", unique: true},
    careerId:{type: "string"},
    jobRole:{type: "string"},
    status:{type: "string"},
    fullName:{type: "string"},
    email:{type: "string"},
    document:{type: "string"},
    duration:{type: "string"},
    link:{type: "string"},
    profileImage:{type: "string"},
    createdAt:{type: "string"}
}, {
    versionKey: false
})

const Candidate = model("Candidate", CandidateSchema)

export default Candidate