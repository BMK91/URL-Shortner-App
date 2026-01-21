import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import API_RESPONSE from "../constants/api-responses.js";
import { generateJwtToken } from "../middleware/Auth.js";
import { User } from "../models/User.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

const { JWT_REFRESH_SECRET } = process.env;

const JWT_COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    NAME: "accessToken",
    CONFIG: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 Hour
      sameSite: "lax",
      secure: true || process.env.NODE_ENV === "production",
    },
  },
  REFRESH_TOKEN: {
    NAME: "refreshToken",
    CONFIG: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
};

const setJwtHttpCookie = (
  res,
  [accessToken, refreshToken] = [],
  isClear = false,
) => {
  const { ACCESS_TOKEN, REFRESH_TOKEN } = JWT_COOKIE_CONFIG;

  if (isClear) {
    res.clearCookie(ACCESS_TOKEN.NAME, ACCESS_TOKEN.CONFIG);
    res.clearCookie(REFRESH_TOKEN.NAME, REFRESH_TOKEN.CONFIG);
    return;
  }

  res.cookie(ACCESS_TOKEN.NAME, accessToken, ACCESS_TOKEN.CONFIG);
  res.cookie(REFRESH_TOKEN.NAME, refreshToken, REFRESH_TOKEN.CONFIG);
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      isActive: true,
      isDeleted: false,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, {
        ...API_RESPONSE.SUCCESS,
        message: "Invalid credentials!",
      });
    }
    delete user.password;

    const tokenPayload = generateJwtToken({
      userId: user._id,
      role: user.role,
    });

    setJwtHttpCookie(res, tokenPayload);

    return sendSuccess(res, API_RESPONSE.LOGGED_IN);
    // return sendSuccess(res, {
    //   ...API_RESPONSE.LOGGED_IN,
    //   data: { tokenPayload },
    // });
  } catch (error) {
    // console.log(error);
    return sendError(res);
  }
};

const refreshToken = async (req, res) => {
  try {
    // const token = req.headers["authorization"]?.split(" ")[1];
    // const token = req.get("authorization")?.split(" ")[1];
    const token = req.cookies.refreshToken;
    if (!token) {
      return sendError(res, API_RESPONSE.FORBIDDEN);
    }

    const authData = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findOne({ _id: authData.userId });
    if (!user) {
      return sendError(res, API_RESPONSE.FORBIDDEN);
    }

    const tokenPayload = generateJwtToken({
      userId: user._id,
      role: user.role,
    });
    setJwtHttpCookie(res, tokenPayload);

    return sendSuccess(res);
  } catch (error) {
    // console.log(error);
    return sendError(res, API_RESPONSE.FORBIDDEN);
  }
};

const logout = async (req, res) => {
  try {
    setJwtHttpCookie(res, [], true);
    return sendSuccess(res, API_RESPONSE.LOGGED_OUT);
  } catch (error) {
    // console.log(error);
    return sendError(res);
  }
};

const authUser = async (req, res) => {
  try {
    const payload = {
      authenticated: true,
      user: req.user,
    };

    return sendSuccess(res, {
      ...API_RESPONSE.SUCCESS,
      data: payload,
    });
  } catch (error) {
    sendError(res);
  }
};

export { authUser, login, logout, refreshToken };

