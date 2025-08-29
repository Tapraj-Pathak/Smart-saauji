import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, default: 0 },
  category: { type: String, trim: true },
  expiryDate: { type: Date },
  minStock: { type: Number, default: 10 },
  //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- Add this line
}, { timestamps: true });

ProductSchema.index({ name: 'text', category: 'text' });

export default mongoose.model('Product', ProductSchema);


