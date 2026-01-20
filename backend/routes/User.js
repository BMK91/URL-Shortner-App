import express from "express";
const userRouter = express.Router();

import { createUser, listUser } from "../controller/User.js";

userRouter.post("/list", listUser).post("/create", createUser);

export default userRouter;
