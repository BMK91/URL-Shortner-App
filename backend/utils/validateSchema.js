import API_RESPONSE from "../constants/api-responses.js";
import { sendError } from "./responseHandler.js";

const validateSchema = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const err = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );

      return sendError(res, { ...API_RESPONSE.BAD_REQUEST, err });
    }
  };
};

export { validateSchema };

