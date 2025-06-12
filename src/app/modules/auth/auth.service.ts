import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import ApiError from '../../utils/ApiError';
import { User } from '../user/user.model';
import { TLogin } from './auth.interface';
import { generateToken, verifyToken } from './auth.utils';

const loginUserIntoDB = async (payload: TLogin) => {
  const user = await User.isUserExist(payload.email);

  // Check user all types of conditions for login
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user.status === 'block') {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User has been blocked');
  }

  if (user.isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'User has been deleted');
  }

  const isMatch = await User.matchPassword(payload.password, user.password);

  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  // If all conditions are met, then create token
  const accessToken = await generateToken(
    user.email,
    config.access_token_secret as string,
    config.access_token_expire as string,
  );

  const refreshToken = await generateToken(
    user.email,
    config.refresh_token_secret as string,
    config.refresh_token_expire as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const genAccessTokenWithRefreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.refresh_token_secret as string);

  if (!decoded) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const { exp, email } = decoded;

  const user = await User.isUserExist(email);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user.status === 'block') {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User has been blocked');
  }

  if (user.isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'User has been deleted');
  }

  const accessToken = await generateToken(
    email,
    config.access_token_secret as string,
    config.access_token_expire as string,
  );

  return { accessToken };
};

export const AuthServices = {
  loginUserIntoDB,
  genAccessTokenWithRefreshToken,
};
