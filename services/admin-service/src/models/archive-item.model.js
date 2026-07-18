import mongoose from "mongoose";

const accessLevels = ["public", "restricted", "private"];
const publicationStatuses = ["draft", "published", "archived"];

const archiveItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    publicContent: {
      type: String,
      required: true,
      trim: true
    },
    materialType: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    rightsStatus: {
      type: String,
      required: true,
      trim: true
    },
    accessLevel: {
      type: String,
      enum: accessLevels,
      default: "public",
      index: true
    },
    publicationStatus: {
      type: String,
      enum: publicationStatuses,
      default: "published",
      index: true
    },
    altText: {
      type: String,
      required: true,
      trim: true
    },
    creator: {
      type: String,
      default: "",
      trim: true
    },
    dateOrPeriod: {
      type: String,
      default: "",
      trim: true
    },
    country: {
      type: String,
      default: "",
      trim: true
    },
    region: {
      type: String,
      default: "",
      trim: true,
      index: true
    },
    community: {
      type: String,
      default: "",
      trim: true
    },
    language: {
      type: String,
      default: "",
      trim: true,
      index: true
    },
    subjectTags: {
      type: [String],
      default: []
    },
    keywords: {
      type: [String],
      default: []
    },
    sourceOrDonor: {
      type: String,
      default: "",
      trim: true
    },
    culturalSensitivityLabel: {
      type: String,
      default: "",
      trim: true
    },
    caption: {
      type: String,
      default: "",
      trim: true
    },
    internalNotes: {
      type: String,
      default: "",
      trim: true,
      select: false
    },
    image: {
      originalFilename: {
        type: String,
        required: true
      },
      mimeType: {
        type: String,
        required: true
      },
      fileSize: {
        type: Number,
        required: true,
        min: 0
      },
      width: {
        type: Number,
        required: true,
        min: 1
      },
      height: {
        type: Number,
        required: true,
        min: 1
      },
      format: {
        type: String,
        required: true
      },
      checksum: {
        type: String,
        required: true
      },
      storagePath: {
        type: String,
        required: true,
        select: false
      },
      imageUrl: {
        type: String,
        required: true
      }
    },
    createdBy: {
      type: String,
      default: "system"
    },
    updatedBy: {
      type: String,
      default: "system"
    }
  },
  {
    timestamps: true
  }
);

export const archiveItemTextIndexFields = {
  title: "text",
  shortDescription: "text",
  publicContent: "text",
  materialType: "text",
  rightsStatus: "text",
  altText: "text",
  creator: "text",
  dateOrPeriod: "text",
  country: "text",
  region: "text",
  community: "text",
  language: "text",
  subjectTags: "text",
  keywords: "text",
  sourceOrDonor: "text",
  culturalSensitivityLabel: "text",
  caption: "text"
};

export const archiveItemTextIndexOptions = {
  name: "archive_item_text_search",
  default_language: "none",
  language_override: "archiveSearchLanguage"
};

archiveItemSchema.index(archiveItemTextIndexFields, archiveItemTextIndexOptions);

export const ArchiveItem = mongoose.model("ArchiveItem", archiveItemSchema);
export { accessLevels, publicationStatuses };
