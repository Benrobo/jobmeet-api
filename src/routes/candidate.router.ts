import express,{Request, Response} from "express"
import CandidateController from "../controller/candidate.controller"
import isLoggedIn from "../middlewares/auth.middleware";

const Router = express.Router();

const Candidate = new CandidateController();


// all candidates
Router.get("/getall", (req:Request, res: Response) => {
    Candidate.all(res);
});

// by org career id
Router.get("/:orgId", (req:Request, res: Response) => {
    const params = req.params;
    const orgId = params.orgId || null
    Candidate.byOrgId(res, orgId);
});

// add Candidates
Router.post("/add", (req:Request, res: Response) => {
    const payload = req.body;
    Candidate.add(res, payload);
});

// change candidate status
Router.put("/update", isLoggedIn, (req:Request, res: Response) => {
    const payload = req.body;
    Candidate.changeCandidateStatus(res, payload);
});

// delete candidate
Router.delete("/delete", isLoggedIn, (req:Request, res: Response) => {
    const payload = req.body;
    Candidate.delete(res, payload);
});


export default Router