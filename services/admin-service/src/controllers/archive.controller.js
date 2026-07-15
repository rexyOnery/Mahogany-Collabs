import { asyncHandler, created, ok } from "@archive/shared";
import {
  createCollection,
  deleteCollection,
  getCollectionBySlug,
  getCommunityHighlights,
  getDashboardSummary,
  getLearningResources,
  listCollections,
  listFeaturedCollections,
  listSubmissions,
  reviewSubmission,
  updateCollection
} from "../services/archive.service.js";

export const collections = asyncHandler(async (req, res) => {
  const data = await listCollections(req.query);
  return ok(res, data, "Collections loaded");
});

export const featuredCollections = asyncHandler(async (req, res) => {
  const data = await listFeaturedCollections();
  return ok(res, data, "Featured collections loaded");
});

export const collectionDetail = asyncHandler(async (req, res) => {
  const data = await getCollectionBySlug(req.params.slug);
  return ok(res, data, "Collection loaded");
});

export const learning = asyncHandler(async (req, res) =>
  ok(res, getLearningResources(), "Learning resources loaded")
);

export const community = asyncHandler(async (req, res) =>
  ok(res, getCommunityHighlights(), "Community highlights loaded")
);

export const dashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardSummary();
  return ok(res, data, "Admin dashboard loaded");
});

export const create = asyncHandler(async (req, res) => {
  const data = await createCollection(req.body, req.user);
  return created(res, data, "Collection created");
});

export const update = asyncHandler(async (req, res) => {
  const data = await updateCollection(req.params.slug, req.body);
  return ok(res, data, "Collection updated");
});

export const remove = asyncHandler(async (req, res) => {
  const data = await deleteCollection(req.params.slug);
  return ok(res, data, "Collection deleted");
});

export const submissions = asyncHandler(async (req, res) => {
  const data = await listSubmissions();
  return ok(res, data, "Submissions loaded");
});

export const review = asyncHandler(async (req, res) => {
  const data = await reviewSubmission(req.params.id, req.body, req.user);
  return ok(res, data, "Submission reviewed");
});
