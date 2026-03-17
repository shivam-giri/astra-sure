import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Optional – Google OAuth users won't have a local password
    passwordHash: { type: String, required: false },
    // Google OAuth
    googleId: { type: String, sparse: true, unique: true },
    // increment this on password reset to invalidate old reset tokens
    resetVersion: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);