import jwt from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

const generateToken = async (
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
    expiresIn: tokenExpr,
  });

  return token;
};

export default generateToken;
