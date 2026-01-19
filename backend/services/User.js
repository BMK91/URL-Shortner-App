import { User } from "../models/User";

const getUserById = async (id) => {
  try {
    const user = await User.findOne({
      _id: id,
      isActive: true,
      isDeleted: true,
    });
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {}
  return null;
};

export { getUserById };
