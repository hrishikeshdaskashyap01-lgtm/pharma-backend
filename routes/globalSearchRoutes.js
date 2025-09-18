// server/routes/globalSearchRoutes.js
import express from "express";
import Medicine from "../models/Medicine.js";
import Distributor from "../models/Distributor.js";

const router = express.Router();

/**
 * 🌍 Global Medicine Search
 * - Search all distributors' medicines
 * - Useful for life-saving / emergency search
 */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.length < 3) {
      return res.status(400).json({ error: "Search term must be at least 3 characters" });
    }

    console.log("🌍 Global Search Request:", search);

    // ✅ Regex based search across all distributors
    const medicines = await Medicine.find({
      name: { $regex: search, $options: "i" },
    })
      .limit(50) // limit results to avoid huge payload
      .lean();

    // ✅ Attach distributor info
    const distributorIds = [...new Set(medicines.map((m) => m.distributorId?.toString()))];
    const distributors = await Distributor.find({ _id: { $in: distributorIds } })
      .select("name phone email address")
      .lean();

    const distributorMap = distributors.reduce((acc, d) => {
      acc[d._id.toString()] = d;
      return acc;
    }, {});

    const results = medicines.map((m) => ({
      _id: m._id,
      name: m.name,
      brand: m.brand,
      mrp: m.mrp,
      ptr: m.ptr,
      stock: m.stock,
      distributor: distributorMap[m.distributorId?.toString()] || null,
    }));

    res.json(results);
  } catch (err) {
    console.error("❌ Global Search Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
