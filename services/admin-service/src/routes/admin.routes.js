import { Router } from "express";
import { validate } from "@archive/shared";
import {
  archiveItemDetail,
  archiveItemImage,
  archiveItems,
  collectionDetail,
  collections,
  community,
  create,
  createItem,
  dashboard,
  featuredCollections,
  learning,
  remove,
  review,
  submissions,
  update
} from "../controllers/archive.controller.js";
import { handleArchiveImageUpload } from "../middleware/image-upload.middleware.js";
import { requireAdmin, requireIdentity } from "../middleware/identity.middleware.js";
import { createArchiveItemSchema } from "../validation/archive-item.validation.js";
import {
  createCollectionSchema,
  reviewSubmissionSchema,
  updateCollectionSchema
} from "../validation/collection.validation.js";

const router = Router();

router.get("/items/:slug/image", archiveItemImage);
router.get("/items/:slug", archiveItemDetail);
router.get("/items", archiveItems);
router.get("/collections/featured", featuredCollections);
router.get("/collections/:slug", collectionDetail);
router.get("/collections", collections);
router.get("/resources", learning);
router.get("/community", community);

router.use(requireIdentity, requireAdmin);
router.get("/dashboard", dashboard);
router.post(
  "/items",
  handleArchiveImageUpload,
  validate(createArchiveItemSchema),
  createItem
);
router.post("/collections", validate(createCollectionSchema), create);
router.put("/collections/:slug", validate(updateCollectionSchema), update);
router.delete("/collections/:slug", remove);
router.get("/submissions", submissions);
router.patch("/submissions/:id/review", validate(reviewSubmissionSchema), review);

export default router;
