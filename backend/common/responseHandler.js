import API_ERRORS from "../constants/api-errors";

const responseHandler = (res, statusCode = 500, message = "", dataObj = null, data = null) => {
  if (!dataObj) {
    dataObj = {};
  }

  const response = {
    status: statusCode === 200 ? API_STATUS.SUCCESS : API_STATUS.ERROR,
    data,
    message
  };

  return res.status(statusCode).json(response);
};

export { responseHandler };
