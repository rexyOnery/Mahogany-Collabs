import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    note: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    reviewedBy: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const Submission = mongoose.model("Submission", submissionSchema);
