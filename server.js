// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js"; 
import orderRoutes from "./routes/orderRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js"; // 👈 distributor routes
import globalSearchRoutes from "./routes/globalSearchRoutes.js"; // 👈 added

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cors());

// ✅ Check Mongo URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

// ✅ Auth Routes
app.use("/auth", authRoutes);

// ✅ Distributor API (all handled inside distributorRoutes.js)
app.use("/api/distributors", distributorRoutes);

// ✅ Medicine API
app.use("/api/medicines", medicineRoutes);

// ✅ Order API
app.use("/api/orders", orderRoutes);

// ✅ Global Search API (life-saving emergency search)
app.use("/api/global-search", globalSearchRoutes);

// ✅ Mongo connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
