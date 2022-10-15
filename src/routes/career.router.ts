import express,{Request, Response} from "express"
import CareerController from "../controller/career.controller"
import isLoggedIn from "../middlewares/auth.middleware";

const Router = express.Router();

const Career = new CareerController();


// all careers
Router.get("/getall", (req: any, res: any) => {
    Career.all(res);
});

// career page by id
Router.get("/byId/:id", (req: Request, res: Response) => {
    const params = req.params
    const id = params.id || ""
    Career.byId(res, id);
});


// by user id
Router.post("/byUserId", isLoggedIn, (req: Request, res: Response) => {
    Career.byUserId(res);
});


// create
Router.post("/create", isLoggedIn, (req: any, res: any) => {
    const payload = req.body;
    Career.create(res, payload);
});

// update
Router.put("/update", isLoggedIn, (req: any, res: any) => {
    const payload = req.body;
    Career.update(res, payload);
});


// delete career page
Router.delete("/delete", isLoggedIn, (req: any, res: any) => {
    const payload = req.body;
    Career.delete(res, payload);
});


export default Router