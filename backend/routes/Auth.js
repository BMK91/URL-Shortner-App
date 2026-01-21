import express from "express";
const authRouter = express.Router();

import { authUser, login, logout, refreshToken } from "../controller/Auth.js";
import { verifyAuth } from "../middleware/Auth.js";

authRouter
  .get("/me", verifyAuth, authUser)
  .post("/login", login)
  .post("/logout", logout)
  .post("/refresh-token", refreshToken);

export default authRouter;
