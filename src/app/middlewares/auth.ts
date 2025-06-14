import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { TUserRole } from '../modules/auth/auth.interface';
import { verifyToken } from '../modules/auth/auth.utils';
import { User } from '../modules/user/user.model';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const auth = (...roles: TUserRole[]) => {
  return asyncHandler(async (req, res, next) => {
    const token = req?.headers?.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.replace('Bearer ', '').trim()
      : null;
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }

    const { exp, iat, email, role } = verifyToken(
      token,
      config.access_token_secret as string,
    );

    // Check token is expired or not
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > (exp as number)) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Your Session has expired please login again',
      );
    }

    const user = await User.isUserExist(email);

    // Check the user is exist or not in database
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exist");
    }

    // Check if user is blocked
    if (user.status === 'block') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    // Check user role is valid or not to access the route
    if (roles.length && !roles.includes(role)) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'You are not allowed to access this route',
      );
    }

    req.user = user;

    next();
  });
};

export default auth;
