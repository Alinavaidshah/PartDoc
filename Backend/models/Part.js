import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 5 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    hasGrades: { type: Boolean, default: true },
    refurbishedPrice: { type: Number, default: 0 },
    brandNewPrice: { type: Number, default: 0 },
    hasColors: { type: Boolean, default: false },
    colors: { type: [String], default: [] },
  },
  { timestamps: true }
);

partSchema.index({ category: 1, name: 1 });
partSchema.index({ countInStock: 1 });
partSchema.index({ createdAt: -1 });

const Part = mongoose.model('Part', partSchema, 'Parts');
export default Part;