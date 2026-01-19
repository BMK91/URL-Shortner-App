import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import API_RESPONSE from "../constants/api-responses.js";
import { User } from "../models/User.js";
import { sendError } from "../utils/responseHandler.js";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;

const generateJwtToken = (payload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return [accessToken, refreshToken];
};

const verifyAuth = async (req, res, next) => {
  try {
    // const token = req.headers["authorization"]?.split(" ")[1];
    // const token = req.get("authorization")?.split(" ")[1];
    const token = req.cookies.accessToken;
    if (!token) {
      return sendError(res, API_RESPONSE.FORBIDDEN);
    }

    const authData = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await User.findOne({ _id: authData.userId });
    if (!user) {
      return sendError(res, API_RESPONSE.FORBIDDEN);
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    return sendError(res, API_RESPONSE.FORBIDDEN);
  }
};

export { generateJwtToken, verifyAuth };
