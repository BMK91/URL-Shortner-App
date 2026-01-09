import mongoose from "mongoose";

const UrlConfigSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      required: true,
      default: "http://short.ly/",
    },
    urlLength: { type: Number, required: true, default: 6 },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

export const UrlConfig = mongoose.model("UrlConfig", UrlConfigSchema);
