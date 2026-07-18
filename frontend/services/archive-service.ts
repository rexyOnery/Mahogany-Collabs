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
import { API_BASE_URL, apiFetch, type ApiEnvelope, safeApiFetch } from "./api";

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

export type ArchiveItemSearchParams = {
  search?: string;
  materialType?: string;
  region?: string;
  language?: string;
  limit?: number;
};

export const buildArchiveItemsPath = (params: ArchiveItemSearchParams = {}) => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value).trim()) {
      query.set(key, String(value).trim());
    }
  }

  const queryString = query.toString();
  return `/api/admin/items${queryString ? `?${queryString}` : ""}`;
};

export const searchArchiveItems = (params: ArchiveItemSearchParams = {}) =>
  apiFetch<ArchiveItem[]>(buildArchiveItemsPath(params), { cache: "no-store" });

export const getArchiveItemFeed = async (
  params: ArchiveItemSearchParams = {}
): Promise<{ items: ArchiveItem[]; unavailable: boolean }> => {
  try {
    const items = await apiFetch<ArchiveItem[]>(buildArchiveItemsPath(params), {
      next: { revalidate: 0 }
    });
    return { items, unavailable: false };
  } catch {
    return { items: [], unavailable: true };
  }
};

export const getArchiveItem = async (slug: string) =>
  safeApiFetch<ArchiveItem | undefined>(`/api/admin/items/${slug}`, undefined);

export const createArchiveItem = async (formData: FormData, token: string) => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/admin/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
  } catch {
    throw new Error(
      `Could not reach the archive API gateway at ${API_BASE_URL}. Check the Docker dev stack and try again.`
    );
  }

  const responseText = await response.text();
  const body = (() => {
    try {
      return JSON.parse(responseText) as ApiEnvelope<ArchiveItem> & {
        details?: Array<{ path?: string; message?: string }>;
      };
    } catch {
      return null;
    }
  })();


  if (!response.ok) {
    const details = body?.details
      ?.map((detail) => detail.message)
      .filter(Boolean)
      .join("; ");
    const message = [body?.message, details].filter(Boolean).join(": ");

    throw new Error(
      message || responseText.trim() || `Archive item upload failed (${response.status})`
    );
  }

  if (!body?.data) {
    throw new Error("Archive item upload returned an invalid response");
  }

  return body.data;
};
