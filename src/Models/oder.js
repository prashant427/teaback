const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    products: [
      {
        productId: { type: String, required: true }, // Sanity _id
        quantity: { type: Number, default: 1 },
      },
    ],
    paymentMethod: { type: String, enum: ["cod", "upi", "card"], required: true },
    status: { type: String, enum: ["placed", "confirmed", "shipped", "delivered"], default: "placed" },
  },
  { timestamps: true }
);
