// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Distributor from "./models/Distributor.js";
import Medicine from "./models/Medicine.js";

dotenv.config();

// 🎯 Sample realistic medicine names
const medicineNames = [
  "Azithromycin 500mg",
  "Paracetamol 650mg",
  "Vitamin C 500mg",
  "Amoxicillin 250mg",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
  "Doxycycline 100mg",
  "Pantoprazole 40mg",
  "Metformin 500mg",
  "Atorvastatin 10mg",
  "Losartan 50mg",
  "Amlodipine 5mg",
  "Omeprazole 20mg",
  "Levofloxacin 500mg",
  "Clarithromycin 250mg",
  "Cefixime 200mg",
  "Diclofenac 50mg",
  "Folic Acid 5mg",
  "Vitamin D3 60000 IU",
  "Iron Folic Acid",
  "Calcium Carbonate 500mg",
  "Zinc Sulphate 50mg",
  "Hydroxychloroquine 200mg",
  "Amiodarone 100mg",
  "Bisoprolol 5mg",
  "Clopidogrel 75mg",
  "Gliclazide 80mg",
  "Glimipride 2mg",
  "Insulin Glargine",
  "Salbutamol Inhaler",
  "Budesonide Inhaler",
  "Montelukast 10mg",
  "Levocetirizine 5mg",
  "Fluconazole 150mg",
  "Itraconazole 100mg",
  "Prednisolone 5mg",
  "Hydrocortisone 10mg",
  "Warfarin 5mg",
  "Digoxin 0.25mg",
  "Furosemide 40mg",
  "Spironolactone 25mg",
  "Enalapril 5mg",
  "Ramipril 2.5mg",
  "Telmisartan 40mg",
  "Rosuvastatin 20mg",
  "Simvastatin 20mg",
  "Erythromycin 250mg",
  "Ceftriaxone 1g Injection",
  "Linezolid 600mg",
  "Meropenem 1g Injection",
];

// 🎯 Distributors
const distributors = [
  { name: "Demo Store 2", balance: 30000 },
  { name: "Demo Store 3", balance: 20000 },
  { name: "Demo Store 4", balance: 45000 },
  { name: "Demo Store 5", balance: 15000 },
];

// Helper: generate medicines with variation
function generateMedicines(distributorId, distributorName) {
  return medicineNames.map((med, i) => {
    const baseMrp = 50 + i * 3; // vary MRP
    const basePtr = baseMrp - 10; // PTR < MRP
    const stockVariation = (distributorId.toString().charCodeAt(0) + i) % 3;

    let stock = 0;
    if (stockVariation === 0) stock = 0; // No stock
    else if (stockVariation === 1) stock = Math.floor(Math.random() * 10) + 1; // Low stock (1-10)
    else stock = Math.floor(Math.random() * 100) + 20; // High stock (20-120)

    return {
      distributorId,
      distributorName,
      name: med,
      code: `CODE${i + 1}`,
      brand: i % 2 === 0 ? "Sun Pharma" : "Cipla",
      category: i % 3 === 0 ? "Antibiotic" : "General",
      pack: `${10 + (i % 5)} TAB`,
      mrp: baseMrp,
      ptr: basePtr,
      stock,
      box: i % 10,
    };
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    for (const dist of distributors) {
      // create distributor
      const distributor = new Distributor(dist);
      await distributor.save();

      // generate medicines
      const medicines = generateMedicines(distributor._id, distributor.name);
      await Medicine.insertMany(medicines);

      console.log(`✅ Inserted ${medicines.length} medicines for ${dist.name}`);
    }

    console.log("🎉 Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
