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

export { registerUser };
