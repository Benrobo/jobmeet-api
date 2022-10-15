import express,{Request, Response} from "express"
import MeetingController from "../controller/meeting.controller"
import isLoggedIn from "../middlewares/auth.middleware";

const Router = express.Router();

const Meeting = new MeetingController();


// meeting by id
Router.get("/:meetingId", (req:Request, res: Response) => {
    const params = req.params;
    const meetId = params.meetingId || ""
    Meeting.byId(res, meetId);
});

// by org career id
Router.post("/byUserId", isLoggedIn, (req:Request, res: Response) => {
    Meeting.byUserId(res);
});

// add meeting
Router.post("/create", isLoggedIn, (req:Request, res: Response) => {
    const payload = req.body;
    Meeting.create(res, payload);
});

// change meeting status
// Router.put("/update", isLoggedIn, (req:Request, res: Response) => {
//     const payload = req.body;
//     Meeting.changeMeetingStatus(res, payload);
// });

// delete meeting
Router.delete("/delete", isLoggedIn, (req:Request, res: Response) => {
    const payload = req.body;
    Meeting.delete(res, payload);
});


export default Router