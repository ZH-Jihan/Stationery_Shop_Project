import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { AuthServices } from './auth.service';

const loginUser = asyncHandler(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

const genAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is required');
  }

  const result =
    await AuthServices.genAccessTokenWithRefreshToken(refreshToken);

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Access token was created successfully',
    data: result,
  });
});

export { genAccessToken, loginUser };
