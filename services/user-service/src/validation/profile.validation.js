import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(120).optional(),
  organization: z.string().max(160).optional(),
  interests: z.array(z.string().min(1).max(80)).max(12).optional(),
  savedCollectionIds: z.array(z.string()).max(100).optional()
});
