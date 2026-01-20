import { z } from "zod";

import API_RESPONSE from "../constants/api-responses.js";
import { User } from "../models/User.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { validateSchema } from "../utils/validateSchema.js";
import { AUTH_ROLES } from "../constants/common.js";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input data
    validateSchema(userSchema)(req, res, () => {});

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

const listUser = async (req, res) => {
  try {
    const isAdmin = req.user?.role === AUTH_ROLES.ADMIN;

    const users = await User.find(
      {
        ...(isAdmin ? {} : { role: { $ne: AUTH_ROLES.ADMIN } }),
        isActive: true,
        isDeleted: false,
      },
      { role: 0 },
    );

    return sendSuccess(res, {
      ...API_RESPONSE.SUCCESS,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export { createUser, listUser };
