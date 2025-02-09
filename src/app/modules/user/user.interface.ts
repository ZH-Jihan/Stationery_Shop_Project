import { Model } from 'mongoose';

export interface TUser {
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

export interface TUserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  matchPassword(inputPassword: string, hashPassword: string): Promise<Boolean>;
}
