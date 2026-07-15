import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    itemCount: {
      type: Number,
      default: 0,
      min: 0
    },
    imageUrl: {
      type: String,
      default: ""
    },
    region: {
      type: String,
      default: "African Diaspora"
    },
    period: {
      type: String,
      default: "1800-1970"
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published"
    },
    featured: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: String,
      default: "system"
    }
  },
  {
    timestamps: true
  }
);

collectionSchema.index({
  title: "text",
  description: "text",
  category: "text",
  region: "text"
});

export const Collection = mongoose.model("Collection", collectionSchema);
