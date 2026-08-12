import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["purchase", "sale", "return", "adjustment", "damage", "manual"], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, default: "" },
  performedBy: { type: String, default: "System" },
  timestamp: { type: Date, default: Date.now },
});

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String, required: true },
    sku: { type: String, required: true },
    currentStock: { type: Number, required: true, default: 100 },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, required: true, default: 100 },
    lowStockThreshold: { type: Number, default: 10 },
    transactions: [inventoryTransactionSchema],
  },
  { timestamps: true }
);

inventorySchema.index({ sku: 1 });
inventorySchema.index({ product: 1 });

export const Inventory = mongoose.model("Inventory", inventorySchema);
