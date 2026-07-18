import { z } from "zod";

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .default("");

const csvList = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => String(entry).split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}, z.array(z.string().trim().min(1).max(80)).max(25).default([]));

export const createArchiveItemSchema = z.object({
  title: z.string().trim().min(2).max(180),
  shortDescription: z.string().trim().min(10).max(500),
  materialType: z.string().trim().min(2).max(80),
  rightsStatus: z.string().trim().min(2).max(160),
  accessLevel: z.enum(["public", "restricted", "private"]).default("public"),
  publicationStatus: z.enum(["draft", "published", "archived"]).default("published"),
  altText: z.string().trim().min(5).max(220),
  publicContent: z.string().trim().min(10).max(4000),
  creator: optionalText(160),
  dateOrPeriod: optionalText(120),
  country: optionalText(120),
  region: optionalText(160),
  community: optionalText(160),
  language: optionalText(120),
  subjectTags: csvList,
  keywords: csvList,
  sourceOrDonor: optionalText(180),
  culturalSensitivityLabel: optionalText(180),
  caption: optionalText(500),
  internalNotes: optionalText(2000)
});
