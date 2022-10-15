import express, {Request} from "express"
import UsersControler from "../controller/users.controller"

const Router = express.Router();

const Users = new UsersControler();


// get all users
Router.get("/getAll", (req: any, res: any) => {
    Users.all(res);
});

Router.get("/byId/:id", (req: Request, res: any) => {
    const userId = req.params.id || ""
    Users.byId(res, userId);
});



export default Router