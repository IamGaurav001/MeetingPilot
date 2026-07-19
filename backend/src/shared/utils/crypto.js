/**
 * Crypto utilities.
 *
 * Password hashing and JWT token helpers.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a hash.
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT access token.
 *
 * @param {object} payload - Data to encode (e.g., { userId, email })
 * @returns {string} Signed JWT
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Generate a JWT refresh token.
 *
 * @param {object} payload - Data to encode
 * @returns {string} Signed refresh JWT
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

/**
 * Verify a refresh token.
 *
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded payload
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}
