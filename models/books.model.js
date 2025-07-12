import mongoose from "mongoose";
import path from "path";

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    publishDate: {
      type: Date,
      required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }
  },
  {
    timestamps: true,
  }
);

bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null) {
        return path.join('/', coverImageBasePath, this.coverImage)
    }
})

export const Book = mongoose.model("Book", bookSchema);
export { coverImageBasePath }