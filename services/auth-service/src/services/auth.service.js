import bcrypt from "bcryptjs";
import { ApiError, unauthorized } from "@archive/shared";
import { User } from "../models/user.model.js";
import { signAccessToken } from "./token.service.js";

const toAuthPayload = (user) => ({
  user: user.toSafeObject(),
  token: signAccessToken(user)
});

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "user"
  });

  return toAuthPayload(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw unauthorized("Invalid email or password");
  }

  return toAuthPayload(user);
};

export const findUserById = async (id) => {
  const user = await User.findById(id);
  return user?.toSafeObject();
};
