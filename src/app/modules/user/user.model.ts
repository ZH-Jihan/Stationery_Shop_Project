import { model, Schema } from 'mongoose';
import { TUser, TUserModel } from './user.interface';

import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, default: 'Unknown' },
  address: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  image: { type: String, default: '' },
  status: {
    type: String,
    enum: ['active', 'block'],
    default: 'active',
  },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  console.log(email);
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.matchPassword = async function (
  inputPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(inputPassword, hashPassword);
};

export const User = model<TUser, TUserModel>('User', userSchema);
