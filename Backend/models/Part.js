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
    colors: { type: [String], default: ['Space Black', 'Silver', 'Graphite'] },
  },
  { timestamps: true }
);

const Part = mongoose.model('Part', partSchema, 'Parts');
export default Part;