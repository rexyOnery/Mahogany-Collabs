import { asyncHandler, ok } from "@archive/shared";
import {
  getOrCreateProfile,
  updateProfile
} from "../services/profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile(req.user);
  return ok(res, profile, "Profile loaded");
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user, req.body);
  return ok(res, profile, "Profile updated");
});
