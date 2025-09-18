// models/Medicine.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    // 🔑 Basic Identity
    name: { type: String, required: true },
    code: { type: String }, // distributor / ERP ka internal code
    brand: { type: String }, // company/brand
    category: { type: String }, // e.g. Antibiotic, Vitamin

    // 📦 Packaging + Distributor Link
    pack: { type: String }, // e.g. "10 TAB"
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
      required: true,
    },
    distributorName: { type: String }, // optional, quick access ke liye

    // 💰 Pricing (all optional except name+distributor)
    mrp: { type: Number }, // ✅ made optional
    ptr: { type: Number }, // Purchase Trade Rate
    pts: { type: Number }, // Purchase Trade Scheme
    rate: { type: Number }, // optional net rate / after discount

    // 📊 Stock Info
    stock: { type: Number, default: 0 }, // available quantity
    batch: { type: String },
    expiryDate: { type: Date },
    scheme: { type: String },
    bonus: { type: String },
    box: { type: Number }, // ✅ optional box size for flexible schema

    // 🕒 Meta
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Flexible catch-all
    extra: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true } // ✅ auto createdAt + updatedAt
);

export default mongoose.model("Medicine", medicineSchema);
