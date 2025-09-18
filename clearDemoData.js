import mongoose from "mongoose";
import dotenv from "dotenv";
import Medicine from "./models/Medicine.js";
import Distributor from "./models/Distributor.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const clear = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // sirf Demo Stores aur unke medicines clear karenge
    await Distributor.deleteMany({ name: /Demo Store/ });
    await Medicine.deleteMany({ distributorName: { $regex: "Demo Store" } });

    console.log("🗑️ Old Demo data cleared successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error clearing data:", err);
    process.exit(1);
  }
};

clear();
