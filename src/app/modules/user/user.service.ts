import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { TUser } from './user.interface';
import { User } from './user.model';

const registerNewUserIntoDb = async (payload: TUser) => {
  const user = await User.isUserExist(payload.email);

  if (user) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `User ${user.email} already exists`,
    );
  }

  const newUser = await User.create(payload);

  return newUser;
};

export const UserServices = {
  registerNewUserIntoDb,
};
