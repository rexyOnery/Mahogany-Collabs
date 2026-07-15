import { Router } from "express";
import { validate } from "@archive/shared";
import {
  collectionDetail,
  collections,
  community,
  create,
  dashboard,
  featuredCollections,
  learning,
  remove,
  review,
  submissions,
  update
} from "../controllers/archive.controller.js";
import { requireAdmin, requireIdentity } from "../middleware/identity.middleware.js";
import {
  createCollectionSchema,
  reviewSubmissionSchema,
  updateCollectionSchema
} from "../validation/collection.validation.js";

const router = Router();

router.get("/collections/featured", featuredCollections);
router.get("/collections/:slug", collectionDetail);
router.get("/collections", collections);
router.get("/resources", learning);
router.get("/community", community);

router.use(requireIdentity, requireAdmin);
router.get("/dashboard", dashboard);
router.post("/collections", validate(createCollectionSchema), create);
router.put("/collections/:slug", validate(updateCollectionSchema), update);
router.delete("/collections/:slug", remove);
router.get("/submissions", submissions);
router.patch("/submissions/:id/review", validate(reviewSubmissionSchema), review);

export default router;
