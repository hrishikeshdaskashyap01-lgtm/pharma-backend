import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// ➕ Add new medicine
router.post("/", async (req, res) => {
  try {
    const med = new Medicine(req.body);
    await med.save();
    res.status(201).json(med);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get all medicines (optionally with search ?search=...)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};

    if (search && search.length >= 3) {
      // ✅ Match if a word starts with typed letters
      query = { name: { $regex: "\\b" + search, $options: "i" } };
    }

    // 🔥 FIX: no .limit() → allow unlimited results
    const meds = await Medicine.find(query).populate("distributorId", "name");

    res.json(
      meds.map((m) => ({
        _id: m._id,
        name: m.name,
        code: m.code,
        brand: m.brand,
        distributorId: m.distributorId?._id,
        distributorName: m.distributorId?.name || m.distributorName || "",
        pack: m.pack,
        stock: m.stock,
        mrp: m.mrp,
        ptr: m.ptr,
        category: m.category,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
