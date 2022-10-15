import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import connectMongo from "./utils/connect"
import dotenv from "dotenv"
// import { DB_URL } from "./config"
import {AuthRouter, UserRouter, CarrerRouter, CandidateRouter, MeetingRouter} from "./routes"
// import { DB } from "./config/db"
import sendMail from "./utils/sendMail"

dotenv.config()

const app = express()
// middlewares
app.use(cors())
app.use(bodyParser.json({limit: "100mb"}))
app.use(bodyParser.urlencoded({extended: false}))


// create table

app.get("/", (req: any, res)=>{
   req.name = "ben"
   res.json({msg: "welcome"})
})

// sendMail("sdcdsc", "dsvcv", "dsfvcv")

// authentication
app.use("/api/auth", AuthRouter)
// users
app.use("/api/users", UserRouter)
// career
app.use("/api/career", CarrerRouter)
// candidate
app.use("/api/candidate", CandidateRouter)
// create / schedule meeting
app.use("/api/meeting", MeetingRouter)


const nodeEnv = process.env.NODE_ENV
const PORT = typeof nodeEnv === "undefined" || nodeEnv === "development" ? 5000 : process.env.PORT

app.listen(PORT, async ()=>{
    await connectMongo()
    console.log(`DB Connected`)
    console.log(`server started @ http://localhost:${PORT}`)
})