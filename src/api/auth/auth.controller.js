import * as authService from "../../services/auth/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, AUTH_MESSAGES } from "../../constants/index.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, AUTH_MESSAGES.SIGNUP_SUCCESS, result));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const result = await authService.verifyOTP(req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, AUTH_MESSAGES.OTP_VERIFIED, result));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, AUTH_MESSAGES.LOGIN_SUCCESS, result));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body.refreshToken);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, "Token refreshed.", result));
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, AUTH_MESSAGES.LOGOUT_SUCCESS, result));
});
