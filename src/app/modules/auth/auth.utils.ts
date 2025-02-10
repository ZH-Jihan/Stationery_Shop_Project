import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';

export const generateToken = async (
  email: string,
  tokenSecret: string,
  tokenExpr: string,
) => {
  const user = await User.findOne({ email: email });

  const payload = {
    _id: user!._id,
    email: user!.email,
    role: user!.role,
    name: user!.name,
  };

  const token = jwt.sign(payload, tokenSecret, {
    expiresIn: tokenExpr as string,
  });

  return token;
};
