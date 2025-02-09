import { TUser } from './user.interface';
import { User } from './user.model';

const registerNewUserIntoDb = async (payload: TUser) => {
  const user = await User.isUserExist(payload.email);

  if (user) {
    throw new Error('User already exists');
  }
};
