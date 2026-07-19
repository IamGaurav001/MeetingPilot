/**
 * Auth service.
 *
 * Handles authentication business logic:
 * - User registration
 * - Login with credential verification
 * - JWT token generation and refresh
 * - Refresh token rotation
 *
 * Database queries live here (no separate repository — only 2-3 queries).
 */

import { getPrisma } from '../../config/database.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES } from '../../shared/constants/errorCodes.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/crypto.js';

/**
 * Register a new user.
 */
export async function register({ name, email, password }) {
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw AppError.conflict('A user with this email already exists', ERROR_CODES.AUTH_USER_EXISTS);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const tokens = await generateTokens(user);

  return { user, ...tokens };
}

/**
 * Login with email and password.
 */
export async function login({ email, password }) {
  const prisma = getPrisma();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password', ERROR_CODES.AUTH_INVALID_CREDENTIALS);
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw AppError.unauthorized('Invalid email or password', ERROR_CODES.AUTH_INVALID_CREDENTIALS);
  }

  const tokens = await generateTokens({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...tokens,
  };
}

/**
 * Refresh an access token using a valid refresh token.
 * Implements refresh token rotation — old token is invalidated.
 */
export async function refresh(refreshTokenValue) {
  const prisma = getPrisma();

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw AppError.unauthorized('Invalid refresh token', ERROR_CODES.AUTH_TOKEN_INVALID);
  }

  // Find and invalidate the existing refresh token
  const storedToken = await prisma.refreshToken.findFirst({
    where: { token: refreshTokenValue, revoked: false },
  });

  if (!storedToken) {
    throw AppError.unauthorized(
      'Refresh token not found or revoked',
      ERROR_CODES.AUTH_TOKEN_INVALID,
    );
  }

  // Revoke the old token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  // Generate new token pair
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    throw AppError.unauthorized('User not found', ERROR_CODES.AUTH_USER_NOT_FOUND);
  }

  return generateTokens(user);
}

/**
 * Logout — revoke all refresh tokens for the user.
 */
export async function logout(userId) {
  const prisma = getPrisma();

  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
}

// ---- Internal helpers ----

/**
 * Generate access + refresh token pair and persist the refresh token.
 */
async function generateTokens(user) {
  const prisma = getPrisma();

  const payload = { userId: user.id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Persist refresh token for rotation
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { accessToken, refreshToken };
}
