import API_RESPONSE from "../constants/api-responses.js";
import { User } from "../models/User.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return sendError(res, {
        ...API_RESPONSE.CONFLICT,
        message: "E-mail already exists!",
      });
    }

    const payload = {
      name,
      email,
      password,
    };

    await User.create(payload);
    return sendSuccess(res, {
      ...API_RESPONSE.SUCCESS,
      message: "User registered successfully!",
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export { createUser };
