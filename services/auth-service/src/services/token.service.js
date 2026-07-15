import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);
