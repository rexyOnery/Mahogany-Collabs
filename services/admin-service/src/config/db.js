import mongoose from "mongoose";
import { logger } from "@archive/shared";
import { env } from "./env.js";
import {
  ArchiveItem,
  archiveItemTextIndexFields,
  archiveItemTextIndexOptions
} from "../models/archive-item.model.js";
import { Collection } from "../models/collection.model.js";
import { Submission } from "../models/submission.model.js";

const isTextIndex = (index = {}) =>
  Boolean(index.textIndexVersion) ||
  Object.values(index.key || {}).some((value) => value === "text");

const hasExpectedTextFields = (index = {}) => {
  const actualFields = Object.keys(index.weights || {}).sort();
  const expectedFields = Object.keys(archiveItemTextIndexFields).sort();

  return (
    actualFields.length === expectedFields.length &&
    expectedFields.every(
      (field, position) =>
        actualFields[position] === field && index.weights[field] === 1
    )
  );
};

export const isCurrentArchiveTextIndex = (index = {}) =>
  isTextIndex(index) &&
  hasExpectedTextFields(index) &&
  index.name === archiveItemTextIndexOptions.name &&
  index.default_language === archiveItemTextIndexOptions.default_language &&
  index.language_override === archiveItemTextIndexOptions.language_override;

const getArchiveItemIndexes = async () => {
  try {
    return await ArchiveItem.collection.indexes();
  } catch (error) {
    if (error.code === 26 || error.codeName === "NamespaceNotFound") {
      return [];
    }
    throw error;
  }
};

export const ensureAdminIndexes = async () => {
  const indexes = await getArchiveItemIndexes();
  const legacyTextIndex = indexes.find(
    (index) => isTextIndex(index) && !isCurrentArchiveTextIndex(index)
  );

  if (legacyTextIndex) {
    logger.warn("Replacing legacy archive text index", {
      index: legacyTextIndex.name
    });
    await ArchiveItem.collection.dropIndex(legacyTextIndex.name);
  }

  for (const model of [ArchiveItem, Collection, Submission]) {
    await model.createIndexes();
  }

  logger.info("Admin database indexes ready");
};

export const connectDb = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("autoIndex", false);
  await mongoose.connect(env.mongoUri);
  logger.info("Admin database connected");
};
