import { asyncHandler, created, ok } from "@archive/shared";
import {
  findUserById,
  loginUser,
  registerUser
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return created(res, result, "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return ok(res, result, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.sub);
  return ok(res, user, "Authenticated user");
});
