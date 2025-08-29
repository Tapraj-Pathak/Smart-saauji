import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
<<<<<<< HEAD
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
=======
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner', 'staff'], default: 'owner' }
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
>>>>>>> 19e5b88bc692b57ba3d55cb579a630ac0a62ede2

export default mongoose.model('User', UserSchema);


