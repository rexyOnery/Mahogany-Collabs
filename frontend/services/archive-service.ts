import {
  fallbackCollections,
  fallbackCommunity,
  fallbackResources
} from "@/lib/archive-data";
import type {
  ArchiveItem,
  Collection,
  CommunityHighlight,
  LearningResource
} from "@/types/archive";
import { API_BASE_URL, type ApiEnvelope, safeApiFetch } from "./api";

export const archiveImageUrl = (item: Pick<ArchiveItem, "slug">) =>
  `${API_BASE_URL}/api/admin/items/${item.slug}/image`;

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

export const searchArchiveItems = (params: {
  search?: string;
  materialType?: string;
  region?: string;
  language?: string;
  limit?: number;
} = {}) => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value).trim()) {
      query.set(key, String(value).trim());
    }
  }

  const queryString = query.toString();
  return safeApiFetch<ArchiveItem[]>(
    `/api/admin/items${queryString ? `?${queryString}` : ""}`,
    []
  );
};

export const getArchiveItem = async (slug: string) =>
  safeApiFetch<ArchiveItem | undefined>(`/api/admin/items/${slug}`, undefined);

export const createArchiveItem = async (formData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<ArchiveItem> | null;

  if (!response.ok) {
    throw new Error(body?.message || "Archive item upload failed");
  }

  return body?.data as ArchiveItem;
};
