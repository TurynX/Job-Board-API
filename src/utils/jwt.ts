import jwt from "jsonwebtoken";

// Secret key to sign/verify tokens (use environment variable in production)
const SECRET = process.env.JWT_SECRET || "supersecret";
// How long until token expires (7 days default)
const EXPIRES_IN = "7d";

// What info we store in the token
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRES_IN as any,
  });
}

// Check if token is valid and get user info from it
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    throw new Error("Invalid token");
  }
}

// Get token from "Authorization: Bearer <token>" header
export function getTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) return null;

  // Split "Bearer <token>" into ["Bearer", "<token>"]
  const parts = authHeader.split(" ");

  // Must be exactly 2 parts and first must be "Bearer"
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1]; // Return just the token part
}
