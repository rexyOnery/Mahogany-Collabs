import { Router } from "express";
import { validate } from "@archive/shared";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/profile.controller.js";
import { requireIdentity } from "../middleware/identity.middleware.js";
import { updateProfileSchema } from "../validation/profile.validation.js";

const router = Router();

router.use(requireIdentity);
router.get("/me", getMyProfile);
router.patch("/me", validate(updateProfileSchema), updateMyProfile);

export default router;
