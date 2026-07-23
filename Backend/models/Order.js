import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      houseNo: { type: String, required: true },
      nearestLandmark: { type: String },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: false }, // REQUIRED FALSE KAR DIYA
        price: { type: Number, required: true },
        part: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Part',
        },
      },
    ],
    paymentMethod: { type: String, required: true },
    paymentResult: {
      transactionId: { type: String },
      receiptImage: { type: String }, 
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    orderStatus: { type: String, required: true, default: 'Order Received & Being Prepared' },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;