import {
  fallbackCollections,
  fallbackCommunity,
  fallbackResources
} from "@/lib/archive-data";
import type {
  Collection,
  CommunityHighlight,
  LearningResource
} from "@/types/archive";
import { safeApiFetch } from "./api";

export const getCollections = () =>
  safeApiFetch<Collection[]>("/api/admin/collections", fallbackCollections);

export const getFeaturedCollections = () =>
  safeApiFetch<Collection[]>("/api/admin/collections/featured", fallbackCollections);

export const getCollection = async (slug: string) =>
  safeApiFetch<Collection | undefined>(
    `/api/admin/collections/${slug}`,
    fallbackCollections.find((collection) => collection.slug === slug)
  );

export const getLearningResources = () =>
  safeApiFetch<LearningResource[]>("/api/admin/resources", fallbackResources);

export const getCommunityHighlights = () =>
  safeApiFetch<CommunityHighlight[]>("/api/admin/community", fallbackCommunity);
