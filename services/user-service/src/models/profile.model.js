import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: String,
      default: ""
    },
    interests: {
      type: [String],
      default: []
    },
    savedCollectionIds: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Profile = mongoose.model("Profile", profileSchema);
