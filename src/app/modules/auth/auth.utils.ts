import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../utils/ApiError';
import { User } from '../user/user.model';

export const generateToken = async (
  email: string,
  secret: string,
  expiresIn: string,
) => {
  const user = await User.findOne({ email: email });

  const jwtPayload = {
    _id: user!._id,
    email: user!.email,
    role: user!.role,
    name: user!.name,
  };

  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, tokenSecret: string) => {
  try {
    const decoded = jwt.verify(token, tokenSecret) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ' Token not valid');
  }
};
