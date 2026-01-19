import express from "express";
const userRouter = express.Router();

import { createUser } from "../controller/User.js";

userRouter.post("/", createUser);

export default userRouter;
