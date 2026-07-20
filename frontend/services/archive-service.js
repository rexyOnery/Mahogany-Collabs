import {
  fallbackCollections,
  fallbackCommunity,
  fallbackResources
} from "@/lib/archive-data";
import { API_BASE_URL, apiFetch, safeApiFetch } from "./api";

export const archiveImageUrl = (item) =>
  `${API_BASE_URL}/api/admin/items/${item.slug}/image`;

export const getCollections = () =>
  safeApiFetch("/api/admin/collections", fallbackCollections);

export const getFeaturedCollections = () =>
  safeApiFetch("/api/admin/collections/featured", fallbackCollections);

export const getCollection = async (slug) =>
  safeApiFetch(
    `/api/admin/collections/${slug}`,
    fallbackCollections.find((collection) => collection.slug === slug)
  );

export const getLearningResources = () =>
  safeApiFetch("/api/admin/resources", fallbackResources);

export const getCommunityHighlights = () =>
  safeApiFetch("/api/admin/community", fallbackCommunity);

export const buildArchiveItemsPath = (params = {}) => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value).trim()) {
      query.set(key, String(value).trim());
    }
  }

  const queryString = query.toString();
  return `/api/admin/items${queryString ? `?${queryString}` : ""}`;
};

export const searchArchiveItems = (params = {}) =>
  apiFetch(buildArchiveItemsPath(params), { cache: "no-store" });

export const getArchiveItemFeed = async (params = {}) => {
  try {
    const items = await apiFetch(buildArchiveItemsPath(params), {
      next: { revalidate: 0 }
    });
    return { items, unavailable: false };
  } catch {
    return { items: [], unavailable: true };
  }
};

export const getArchiveItem = async (slug) =>
  safeApiFetch(`/api/admin/items/${slug}`, undefined);

export const createArchiveItem = async (formData, token) => {
  let response;

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
      return JSON.parse(responseText);
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

