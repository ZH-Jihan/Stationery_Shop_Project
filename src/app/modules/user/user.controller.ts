import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { UserServices } from './user.service';

const registerUser = asyncHandler(async (req, res) => {
  const result = await UserServices.registerNewUserIntoDb(req.body);

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: 'User registration successfully',
  });
});

const updateUserWonProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { profileEmail } = req.params;
  const result = await UserServices.updateUserWonProfileInDb(
    email,
    profileEmail,
    req.body,
  );
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: 'User won profile updated successfully',
  });
});

export { registerUser, updateUserWonProfile };
