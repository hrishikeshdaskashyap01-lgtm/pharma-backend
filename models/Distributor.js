import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    balance: { type: Number, default: 0 },

    // 🔑 Extra optional fields for flexibility
    code: { type: String },
    contactPerson: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },

    gstNumber: { type: String },
    licenseNumber: { type: String },
    creditLimit: { type: Number },
    paymentTerms: { type: String },

    isActive: { type: Boolean, default: true },
    isMapped: { type: Boolean, default: true },

    extra: { type: mongoose.Schema.Types.Mixed }, // unexpected data
  },
  { collection: "distributors", timestamps: true } // ✅ keep collection name + auto timestamps
);

const Distributor = mongoose.model("Distributor", distributorSchema);
export default Distributor;
