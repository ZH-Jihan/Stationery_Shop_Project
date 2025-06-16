import { Model, Types } from 'mongoose';

export interface TUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  image: string;
  role: 'user' | 'admin';
  status: 'active' | 'block';
  password: string;
  isDeleted: boolean;
  wishlist?: Types.ObjectId[];
}

export interface TUserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  matchPassword(inputPassword: string, hashPassword: string): Promise<Boolean>;
}
