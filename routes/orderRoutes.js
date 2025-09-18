// server/routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Place new order
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming Order Payload:", JSON.stringify(req.body, null, 2));

    const order = new Order(req.body);
    await order.save();

    res.json({ message: "✅ Order placed successfully", order });
  } catch (err) {
    console.error("❌ Order Save Error:", err.message);
    if (err.errors) {
      console.error("⚠️ Validation Errors:", JSON.stringify(err.errors, null, 2));
    }
    res.status(500).json({ error: err.message, details: err.errors });
  }
});

// ✅ Get all orders (optional for testing)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("distributorId", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get drafts for a specific retailer
router.get("/drafts/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const drafts = await Order.find({ retailerId, status: "draft" })
      .sort({ createdAt: -1 })
      .populate("distributorId", "name");
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get confirmed/placed orders for My Orders screen
router.get("/retailer/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const orders = await Order.find({
      retailerId,
      status: { $ne: "draft" },
    })
      .sort({ createdAt: -1 })
      .populate("distributorId", "name"); // 👈 populate name
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update order status (distributor side)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("distributorId", "name");

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single order by id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("distributorId", "name");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
