import slugify from "slugify";
import { ApiError, notFound } from "@archive/shared";
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
  const [collections, published, pendingSubmissions] = await Promise.all([
    Collection.countDocuments(),
    Collection.countDocuments({ status: "published" }),
    Submission.countDocuments({ status: "pending" })
  ]);

  return {
    collections,
    published,
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
