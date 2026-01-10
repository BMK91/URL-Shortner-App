import express from "express";

import {
  createUrlRequest,
  deleteUrlHistory,
  getOriginalUrl,
  getUrlHistory,
} from "../controller/UrlRequest.js";

const router = express.Router();

router
  .post("/", createUrlRequest)
  .post("/get-original-url", getOriginalUrl)
  .post("/url-history", getUrlHistory)
  .delete("/delete-history/:id", deleteUrlHistory);

export default router;
