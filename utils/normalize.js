// utils/normalize.js
export function normalizeDistributorData(raw) {
  return {
    name: raw.name || raw.distributorName || "Unnamed Distributor",
    code: raw.code || null,
    contactPerson: raw.contactPerson || raw.person || null,
    phone: raw.phone || raw.mobile || null,
    email: raw.email || null,
    address: raw.address || null,
    gstNumber: raw.gstNumber || null,
    licenseNumber: raw.licenseNumber || null,
    creditLimit: raw.creditLimit ?? null,
    paymentTerms: raw.paymentTerms || null,
    isActive: raw.isActive ?? true,
    isMapped: raw.isMapped ?? true,
    extra: raw.extra || {}
  };
}

export function normalizeMedicineData(raw, distributorId, distributorName) {
  return {
    distributorId,
    distributorName,
    name: raw.name || raw.medicineName || "Unnamed",
    code: raw.code || raw.itemCode || null,
    brand: raw.brand || raw.company || null,
    category: raw.category || null,
    pack: raw.pack || raw.packSize || null,
    mrp: raw.mrp ?? null,
    ptr: raw.ptr ?? null,
    pts: raw.pts ?? null,
    stock: raw.stock ?? null,
    batch: raw.batchNo || raw.batch || null,
    expiryDate: raw.expiry ? new Date(raw.expiry) : (raw.expiryDate ? new Date(raw.expiryDate) : null),
    scheme: raw.scheme || null,
    bonus: raw.bonus || null,
    extra: raw.extra || {}
  };
}
