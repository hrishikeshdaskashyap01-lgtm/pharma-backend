// server/routes/distributorRoutes.js
import express from "express";
import Medicine from "../models/Medicine.js";
import Distributor from "../models/Distributor.js";

const router = express.Router();

// ✅ Get all distributors (id, name, balance)
router.get("/", async (req, res) => {
  try {
    const distributors = await Distributor.find();
    res.json(
      distributors.map((d) => ({
        _id: d._id,
        name: d.name,
        balance: d.balance || 0,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Onboard distributor with medicines
router.post("/onboard", async (req, res) => {
  try {
    const { distributor, medicines = [] } = req.body;
    if (!distributor || !distributor.name) {
      return res.status(400).json({ error: "Distributor name is required" });
    }

    // create distributor (or find if already exists)
    let dist = await Distributor.findOne({ name: distributor.name });
    if (!dist) {
      dist = await Distributor.create(distributor);
    }

    // insert medicines with distributorId + name
    const medsToInsert = medicines.map((m) => ({
      ...m,
      distributorId: dist._id,
      distributorName: dist.name,
    }));

    if (medsToInsert.length > 0) {
      await Medicine.insertMany(medsToInsert);
    }

    res.json({
      message: "Onboarded successfully",
      distributor: { _id: dist._id, name: dist.name },
      inserted: medsToInsert.length,
    });
  } catch (err) {
    console.error("❌ Onboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get medicines by distributor (with optional search + log)
router.get("/:id/medicines", async (req, res) => {
  try {
    const distributorId = req.params.id;
    const search = req.query.search;
    console.log("📥 Distributor Medicines Request:", { distributorId, search });

    let query = { distributorId };

    if (search && search.length >= 3) {
      query.name = { $regex: "^" + search, $options: "i" };
    }

    console.log("📤 Final Mongo Query:", query);

    const meds = await Medicine.find(query).populate("distributorId", "name");
    console.log("✅ Found medicines:", meds.length);

    res.json(
      meds.map((m) => ({
        _id: m._id,
        name: m.name,
        brand: m.brand,
        distributorId: m.distributorId?._id,
        distributorName: m.distributorId?.name || "",
        mrp: m.mrp ?? null,
        ptr: m.ptr ?? null,
        pts: m.pts ?? null,
        stock: m.stock ?? null,
        batch: m.batch ?? null,
        expiryDate: m.expiryDate ?? null,
        scheme: m.scheme ?? null,
        bonus: m.bonus ?? null,
      }))
    );
  } catch (err) {
    console.error("❌ Distributor Medicines Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
