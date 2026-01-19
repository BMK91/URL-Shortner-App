import express from "express";

import {
  createUrlRequest,
  deleteUrlHistory,
  getOriginalUrl,
  getUrlHistory,
} from "../controller/UrlRequest.js";
import authRouter from "./Auth.js";
import userRouter from "./User.js";
import { verifyAuth } from "../middleware/Auth.js";

const router = express.Router();

router.use("/auth", authRouter);

router
  .post("/", verifyAuth, createUrlRequest)
  .post("/get-original-url", verifyAuth, getOriginalUrl)
  .post("/url-history", verifyAuth, getUrlHistory)
  .delete("/delete-history/:id", verifyAuth, deleteUrlHistory);

router.use("/user", userRouter);

export default router;
