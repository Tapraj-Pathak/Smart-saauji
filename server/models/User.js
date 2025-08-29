import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  },
  panNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9]{8,12}$/
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner', 'staff'], default: 'owner' },
  //products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // <-- Add this line (optional)
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (_doc, ret) => {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});



export default mongoose.model('User', UserSchema);


