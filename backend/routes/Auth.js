import express from "express";
const authRouter = express.Router();

import { login, logout, refreshToken } from "../controller/Auth.js";

authRouter
  .post("/login", login)
  .post("/logout", logout)
  .post("/refresh-token", refreshToken);

export default authRouter;
