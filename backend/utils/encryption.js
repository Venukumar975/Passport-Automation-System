import bcrypt from 'bcryptjs';

/**
 * Hash a plain-text password.
 * Returns a bcrypt hash.
 */
export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

/**
 * Compare a plain text password against a stored hash.
 * Returns true when they match.
 */
export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export default { hashPassword, comparePassword };
