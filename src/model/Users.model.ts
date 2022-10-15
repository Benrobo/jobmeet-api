import {Schema, model} from "mongoose"


const UsersSchema = new Schema({
    id:{type: "string", unique: true},
    username:{type: "string"},
    email:{type: "string", unique: true},
    hash:{type: "string"},
    token:{type: "string"},
    role:{type: "string"},
    createdAt:{type: "string"},
}, {
    versionKey: false
})

const User = model("User", UsersSchema)

export default User