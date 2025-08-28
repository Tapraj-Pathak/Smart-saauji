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
    // Nepal PAN is typically 9 or 10 characters; relax if needed
    match: /^[A-Z0-9]{8,12}$/
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner', 'staff'], default: 'owner' }
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


