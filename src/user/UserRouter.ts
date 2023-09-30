import { Router } from "express";
import { login, verifyNumber } from "./UserAuth";
import { TokenWare } from "../Middlewares/Tokenware";

const UserRouter = Router();

UserRouter.post("/login", verifyNumber);
UserRouter.post("/verify/:_id", TokenWare, login);

export default UserRouter;
