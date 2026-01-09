const API_ERRORS = {
  INVALID_INPUT: {
    status: 400,
    message: "Invalid Input Data",
  },
  URL_ALREADY_EXISTS: {
    status: 409,
    message: "Original URL | URL Code Already Exists",
  },
  NOT_FOUND: {
    status: 404,
    message: "Resource Not Found",
  },
  SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
};

export default API_ERRORS;
