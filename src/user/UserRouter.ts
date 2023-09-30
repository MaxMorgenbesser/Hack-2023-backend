import { Router } from "express";
import { login, verifyNumber } from "./UserAuth";
import { TokenWare } from "../Middlewares/TokenWare";

const UserRouter = Router();

UserRouter.post("/login", verifyNumber);
UserRouter.post("/verify/:_id", TokenWare, login);

export default UserRouter;
