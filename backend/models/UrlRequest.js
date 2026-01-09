import mongoose from "mongoose";

const UrlRequestSchema = new mongoose.Schema(
  {
    urlName: {
      type: String,
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      unique: true,
    },
    shortenUrl: {
      type: String,
      required: true,
      unique: true,
    },
    urlCode: {
      type: String,
      unique: true,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UrlRequest = mongoose.model("UrlRequest", UrlRequestSchema);
