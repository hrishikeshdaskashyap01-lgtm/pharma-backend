// server/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    retailerId: { type: String, required: true }, // for now string
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
      required: true,
    }, // ✅ ObjectId for populate
    items: [
      {
        medicineId: { type: String, required: true },
        name: String,
        brand: String,
        price: Number,
        qty: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "placed", "uploaded", "processed"],
      default: "placed",
    },
    source: {
      type: String,
      enum: ["viaDistributor", "viaProduct"],
      default: "viaDistributor", // 👈 added to know where draft came from
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
