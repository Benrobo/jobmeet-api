import {Schema, model} from "mongoose"


const CareerSchema = new Schema({
    id:{type: "string", unique: true},
    userId:{type: "string"},
    orgName:{type: "string"},
    email:{type: "string"},
    title:{type: "string"},
    logo:{type: "string"},
    tags:{type: "string"},
    jobRole:{type: "string"},
    duration:{type: "string"},
    overview:{type: "string"},
    requirements:{type: "string"},
    benefits:{type: "string"},
    createdAt:{type: "string"},
}, {
    versionKey: false
})

const Career = model("Career", CareerSchema)

export default Career