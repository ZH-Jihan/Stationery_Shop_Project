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

const updateUserWonProfileInDb = async (
  email: string,
  profileEmail: string,
  payload: Partial<TUser>,
) => {
  const user = await User.isUserExist(email);

  if (user.email !== profileEmail) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      `You are not allowed to update this profile`,
    );
  }

  const updated = await User.findOneAndUpdate({ email }, payload, {
    new: true,
  });

  return updated;
};

const getUserProfileInDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

export const UserServices = {
  registerNewUserIntoDb,
  updateUserWonProfileInDb,
  getUserProfileInDb,
};
