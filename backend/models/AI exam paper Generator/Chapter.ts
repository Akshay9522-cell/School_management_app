import { Schema, model, Document, Types } from "mongoose";

export interface IChapter extends Document {
  name: string;          // "The Ice-Cream Man"
  chapterNumber: number; // 1, 2, 3, 4...
  subject: Types.ObjectId;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    chapterNumber: {
      type: Number,
      required: true,
      index: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ⛔ Prevent duplicate chapter numbers in same subject
// Example: English Class 5 cannot have Chapter 1 twice
ChapterSchema.index(
  { chapterNumber: 1, subject: 1 },
  { unique: true }
);

export default model<IChapter>("Chapter", ChapterSchema);
