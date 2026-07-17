import multer from "multer";
import { ApiError } from "@archive/shared";
import { env } from "../config/env.js";

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/tiff"
]);

export const uploadArchiveImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.archiveImageMaxBytes
  },
  fileFilter: (req, file, done) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      return done(new ApiError(400, "Only image uploads are supported"));
    }

    return done(null, true);
  }
});

const archiveImageUpload = uploadArchiveImage.single("image");

export const handleArchiveImageUpload = (req, res, next) => {
  archiveImageUpload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Archive images must be 10 MB or smaller"
          : error.message;
      return next(new ApiError(400, message));
    }

    return next(error);
  });
};
