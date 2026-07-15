import { z } from "zod";

const collectionBase = {
  title: z.string().min(2).max(180),
  category: z.string().min(2).max(80),
  description: z.string().min(10).max(1000),
  itemCount: z.number().int().min(0).optional(),
  imageUrl: z.string().max(500).optional(),
  region: z.string().max(160).optional(),
  period: z.string().max(120).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional()
};

export const createCollectionSchema = z.object(collectionBase);
export const updateCollectionSchema = z.object(collectionBase).partial();

export const reviewSubmissionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().max(500).optional()
});
