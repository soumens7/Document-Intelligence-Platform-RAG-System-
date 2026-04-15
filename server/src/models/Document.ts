import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    storageName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "ready", "error"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);