import express from "express";

import {
    createUrlRequest,
    getOriginalUrl,
    getUrlHistory,
} from "../controller/UrlRequest.js";

const router = express.Router();

router
  .post("/", createUrlRequest)
  .post("/get-original-url", getOriginalUrl)
  .post("/url-history", getUrlHistory);

export default router;
