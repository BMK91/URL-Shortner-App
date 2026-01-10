import API_ERRORS from "../constants/api-responses.js";
import { API_STATUS } from "../constants/api-status.js";

const sendSuccess = (
  res,
  { statusCode = 200, message = "", data = null } = {}
) => {
  return res.status(statusCode).json({
    status:
      statusCode >= 200 && statusCode < 300
        ? API_STATUS.SUCCESS
        : API_STATUS.FAILED,
    message,
    data,
  });
};

const sendError = (
  res,
  { statusCode, message, err = null } = API_ERRORS.SERVER_ERROR
) => {
  return res.status(statusCode).json({
    status: API_STATUS.FAILED,
    message,
    err,
  });
};

export { sendError, sendSuccess };
