import crypto from "node:crypto";
import path from "node:path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";
import slugify from "slugify";
import { ApiError, notFound } from "@archive/shared";
import { ArchiveItem } from "../models/archive-item.model.js";
import { Collection } from "../models/collection.model.js";
import { Submission } from "../models/submission.model.js";
import {
  communityHighlights,
  learningResources,
  seedCollections,
  seedSubmissions
} from "../data/seed-data.js";

export const seedArchiveData = async () => {
  const collectionCount = await Collection.countDocuments();
  if (collectionCount === 0) {
    await Collection.insertMany(seedCollections);
  }

  const submissionCount = await Submission.countDocuments();
  if (submissionCount === 0) {
    await Submission.insertMany(seedSubmissions);
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPublicArchiveItemFilters = (query = {}) => {
  const filters = {
    publicationStatus: "published",
    accessLevel: "public"
  };

  for (const key of ["materialType", "region", "language"]) {
    const value = query[key] ? String(query[key]).trim() : "";
    if (value) {
      filters[key] = new RegExp(`^${escapeRegex(value)}$`, "i");
    }
  }

  const search = query.search ? String(query.search).trim() : "";
  if (search) {
    filters.$text = { $search: search };
  }

  return filters;
};

export const normalizeArchiveListLimit = (limit) => {
  const numericLimit = Number(limit || 20);
  if (!Number.isFinite(numericLimit)) {
    return 20;
  }

  return Math.min(Math.max(Math.trunc(numericLimit), 1), 50);
};

const toPublicArchiveItem = (item) => {
  const value = typeof item.toObject === "function" ? item.toObject() : item;
  const { internalNotes, image, ...rest } = value;
  const { storagePath, ...safeImage } = image || {};
  return {
    ...rest,
    image: safeImage
  };
};

const getUniqueArchiveSlug = async (title) => {
  const baseSlug = slugify(title, { lower: true, strict: true }) || "archive-item";
  let slug = baseSlug;
  let suffix = 2;

  while (await ArchiveItem.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const extensionForFormat = (format, originalName) => {
  const fromFormat = {
    jpeg: "jpg",
    jpg: "jpg",
    png: "png",
    webp: "webp",
    gif: "gif",
    tiff: "tif"
  }[format];

  if (fromFormat) {
    return fromFormat;
  }

  const ext = path.extname(originalName).replace(".", "").toLowerCase();
  return ext || "img";
};

export const extractArchiveImageInfo = async (file) => {
  if (!file) {
    throw new ApiError(400, "An archive image is required");
  }

  const metadata = await sharp(file.buffer).metadata().catch(() => {
    throw new ApiError(400, "The uploaded file could not be read as an image");
  });

  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new ApiError(400, "The uploaded image is missing required dimensions");
  }

  return {
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    checksum: crypto.createHash("sha256").update(file.buffer).digest("hex")
  };
};

export const listArchiveItems = async (query = {}) => {
  const filters = getPublicArchiveItemFilters(query);
  const limit = normalizeArchiveListLimit(query.limit);
  const projection = filters.$text ? { score: { $meta: "textScore" } } : {};
  const sort = filters.$text ? { score: { $meta: "textScore" } } : { createdAt: -1 };
  const items = await ArchiveItem.find(filters, projection).sort(sort).limit(limit);
  return items.map(toPublicArchiveItem);
};

export const getArchiveItemBySlug = async (slug) => {
  const item = await ArchiveItem.findOne({
    slug,
    publicationStatus: "published",
    accessLevel: "public"
  });

  if (!item) {
    throw notFound("Archive item");
  }

  return toPublicArchiveItem(item);
};

export const getArchiveItemImageBySlug = async (slug) => {
  const item = await ArchiveItem.findOne({
    slug,
    publicationStatus: "published",
    accessLevel: "public"
  });

  if (!item?.image?.imageUrl) {
    throw notFound("Archive item image");
  }

  return item;
};

export const createArchiveItem = async (input, file, identity) => {
  const slug = await getUniqueArchiveSlug(input.title);
  const extractedImage = await extractArchiveImageInfo(file);
  const extension = extensionForFormat(extractedImage.format, extractedImage.originalFilename);
  const storedFilename = `${slug}-${Date.now()}.${extension}`;
  const blob = await put(`archive-items/${storedFilename}`, file.buffer, {
    access: "public",
    contentType: extractedImage.mimeType,
    addRandomSuffix: false
  });

  try {
    const item = await ArchiveItem.create({
      ...input,
      slug,
      subjectTags: input.subjectTags || [],
      keywords: input.keywords || [],
      image: {
        ...extractedImage,
        storagePath: blob.pathname,
        imageUrl: blob.url
      },
      createdBy: identity?.sub || identity?.email || "system",
      updatedBy: identity?.sub || identity?.email || "system"
    });

    return toPublicArchiveItem(item);
  } catch (error) {
    await del(blob.url).catch(() => undefined);
    throw error;
  }
};

export const listCollections = async (query = {}) => {
  const filters = { status: "published" };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return Collection.find(filters).sort({ featured: -1, title: 1 });
};

export const listFeaturedCollections = async () =>
  Collection.find({ status: "published", featured: true }).sort({ title: 1 });

export const getCollectionBySlug = async (slug) => {
  const collection = await Collection.findOne({ slug, status: "published" });
  if (!collection) {
    throw notFound("Collection");
  }
  return collection;
};

export const getLearningResources = () => learningResources;

export const getCommunityHighlights = () => communityHighlights;

export const createCollection = async (input, identity) => {
  const slug = slugify(input.title, { lower: true, strict: true });
  const existing = await Collection.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "A collection with this title already exists");
  }

  return Collection.create({
    ...input,
    slug,
    createdBy: identity.sub
  });
};

export const updateCollection = async (slug, input) => {
  const collection = await Collection.findOneAndUpdate({ slug }, input, {
    new: true
  });

  if (!collection) {
    throw notFound("Collection");
  }

  return collection;
};

export const deleteCollection = async (slug) => {
  const collection = await Collection.findOneAndDelete({ slug });
  if (!collection) {
    throw notFound("Collection");
  }
  return { slug, deleted: true };
};

export const getDashboardSummary = async () => {
  const [collections, published, pendingSubmissions, archiveItems] = await Promise.all([
    Collection.countDocuments(),
    Collection.countDocuments({ status: "published" }),
    Submission.countDocuments({ status: "pending" }),
    ArchiveItem.countDocuments({ publicationStatus: "published", accessLevel: "public" })
  ]);

  return {
    collections,
    published,
    archiveItems,
    pendingSubmissions,
    preservationQueue: 18,
    recentActivity: [
      "Featured collections refreshed",
      "Community submissions reviewed",
      "Learning resources prepared for next exhibit"
    ]
  };
};

export const listSubmissions = async () =>
  Submission.find().sort({ createdAt: -1 }).limit(50);

export const reviewSubmission = async (id, review, identity) => {
  const submission = await Submission.findByIdAndUpdate(
    id,
    {
      status: review.status,
      reviewedBy: identity.email || identity.sub
    },
    { new: true }
  );

  if (!submission) {
    throw notFound("Submission");
  }

  return submission;
};
