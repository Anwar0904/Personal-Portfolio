import "dotenv/config";

const getEnvValue = (key: string, fallback = "") => {
  const value = process.env[key]?.trim();
  return value || fallback;
};

const getRequiredEnvValue = (key: string, fallback = "") => {
  const value = getEnvValue(key, fallback);

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV !== "production") {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

export const env = {
  MONGODB_URI: getRequiredEnvValue(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017/adm-platform"
  ),

  MONGODB_DB: getEnvValue("MONGODB_DB", "adm-website"),

  JWT_ACCESS_SECRET: getRequiredEnvValue(
    "JWT_ACCESS_SECRET",
    "dev-access-secret-change-me"
  ),

  JWT_REFRESH_SECRET: getRequiredEnvValue(
    "JWT_REFRESH_SECRET",
    "dev-refresh-secret-change-me"
  ),

  JWT_ACCESS_EXPIRES: getEnvValue("JWT_ACCESS_EXPIRES", "24h"),

  JWT_REFRESH_EXPIRES: getEnvValue("JWT_REFRESH_EXPIRES", "7d"),

  BCRYPT_SALT_ROUNDS: Number(getEnvValue("BCRYPT_SALT_ROUNDS", "10")),
};

// Validate production environment configuration
if (process.env.NODE_ENV === "production") {
  // Ensure JWT secrets are changed from defaults
  if (
    env.JWT_ACCESS_SECRET === "dev-access-secret-change-me" ||
    env.JWT_REFRESH_SECRET === "dev-refresh-secret-change-me"
  ) {
    throw new Error(
      "ERROR: JWT secrets are set to development defaults in production! " +
      "Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET to strong random values."
    );
  }

  // Ensure MongoDB is not localhost in production
  if (
    env.MONGODB_URI.includes("localhost") ||
    env.MONGODB_URI.includes("127.0.0.1")
  ) {
    throw new Error(
      "ERROR: MongoDB URI points to localhost in production! " +
      "Set MONGODB_URI to your production database connection string."
    );
  }
}