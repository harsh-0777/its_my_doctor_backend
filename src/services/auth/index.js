import crypto from "crypto";
import { User } from "../../models/index.js";
import { getTabsForRole } from "../tab/index.js";
import {
  ApiError,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendEmail,
} from "../../utils/index.js";
import { AUTH_MESSAGES } from "../../constants/index.js";
import config from "../../config/index.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const otpEmailHtml = (otp, action = "verify your account") => `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f7f3ee;border-radius:12px;">
    <h2 style="color:#059669;margin-bottom:8px;">Its my Doc</h2>
    <p style="color:#374151;font-size:15px;">Use the OTP below to <strong>${action}</strong>. It expires in <strong>${config.OTP_EXPIRES_IN_MINUTES} minutes</strong>.</p>
    <div style="margin:24px 0;text-align:center;">
      <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#1e1b2e;">${otp}</span>
    </div>
    <p style="color:#6b7280;font-size:13px;">If you didn't request this, please ignore this email.</p>
  </div>
`;

const saveOTP = async (user) => {
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + config.OTP_EXPIRES_IN_MINUTES * 60 * 1000);
  await user.save();
  return otp;
};

// ─── Signup ───────────────────────────────────────────────────────────────────

export const signup = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already in use.");

  const user = await User.create({ name, email, password, role });
  const otp  = await saveOTP(user);

  await sendEmail({
    to: email,
    subject: "Verify your Its my Doc account",
    html: otpEmailHtml(otp, "verify your account"),
  });

  return { message: AUTH_MESSAGES.OTP_SENT, userId: user._id };
};

// ─── Verify OTP (used for both signup & login) ────────────────────────────────
// Always returns tokens so the user is logged in right after verification.

export const verifyOTP = async ({ userId, otp }) => {
  const user = await User.findById(userId).select("+otp +otpExpiresAt +refreshToken");
  if (!user) throw ApiError.notFound("User not found.");

  if (user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw ApiError.badRequest(AUTH_MESSAGES.OTP_INVALID);
  }

  const payload      = { id: user._id, role: user.role };
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.isVerified   = true;
  user.otp          = undefined;
  user.otpExpiresAt = undefined;
  user.refreshToken = refreshToken;
  await user.save();

  // Fetch accessible tabs for this role — sent to the frontend on login so the
  // client can render the correct navigation and protect routes client-side.
  // Server-side role checks (protect + authorize) remain the real security layer.
  const accessibleTabs = await getTabsForRole(user.role);

  return {
    accessToken,
    refreshToken,
    user:           { id: user._id, name: user.name, email: user.email, role: user.role },
    accessibleTabs,
  };
};

// ─── Login ────────────────────────────────────────────────────────────────────
// Verifies credentials → sends OTP → returns userId (tokens come after OTP verify).

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }
  if (!user.isVerified) {
    throw ApiError.forbidden("Account not verified. Please check your email for OTP.");
  }

  const otp = await saveOTP(user);

  await sendEmail({
    to: email,
    subject: "Your Its my Doc login OTP",
    html: otpEmailHtml(otp, "complete your login"),
  });

  return { message: AUTH_MESSAGES.OTP_SENT, userId: user._id };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshToken = async (token) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  const user = await User.findById(payload.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw ApiError.unauthorized("Refresh token revoked.");
  }

  const newAccessToken  = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
};
