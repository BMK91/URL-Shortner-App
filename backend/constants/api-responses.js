import { API_STATUS_CODE } from "./api-status.js";

const GENERIC_RESPONSE = {
  SUCCESS: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "",
  },
  BAD_REQUEST: {
    statusCode: API_STATUS_CODE.BAD_REQUEST,
    message: "Invalid input data",
  },
  UNAUTHORIZED: {
    statusCode: API_STATUS_CODE.UNAUTHORIZED,
    message: "Unauthorized access",
  },
  FORBIDDEN: {
    statusCode: API_STATUS_CODE.FORBIDDEN,
    message: "Access forbidden",
  },
  NOT_FOUND: {
    statusCode: API_STATUS_CODE.NOT_FOUND,
    message: "Resource not found",
  },
  CONFLICT: {
    statusCode: API_STATUS_CODE.CONFLICT,
    message: "Resource conflicted",
  },
  SERVER_ERROR: {
    statusCode: API_STATUS_CODE.ERROR,
    message: "Internal server error",
  },
  SOMETHING_WENT_WRONG: {
    statusCode: API_STATUS_CODE.ERROR,
    message: "Something went wrong",
  },
};

const API_RESPONSE = {
  ...GENERIC_RESPONSE,
  CREATED: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "Created successfully",
  },
  UPDATED: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "Updated successfully",
  },
  DELETED: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "Deleted successfully",
  },
  LOGGED_IN: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "Login successfully",
  },
  LOGGED_OUT: {
    statusCode: API_STATUS_CODE.SUCCESS,
    message: "Logged-out successfully",
  },
};

export default API_RESPONSE;
