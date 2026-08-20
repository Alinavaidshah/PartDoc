import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Password ko optional banaya agar clerkId exist karti hai
    password: { 
      type: String, 
      required: function() { return !this.clerkId; } 
    },
    // Clerk ID add kar di
    clerkId: { type: String, unique: true, sparse: true }, 
    isAdmin: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Password hashing logic
userSchema.pre('save', async function (next) {
  // Sirf tab hash karo agar password change hua ho aur clerkId na ho
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Baaki functions wese hi rahenge...
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'Users');
export default User;