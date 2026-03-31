import dotenv from "dotenv";

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toList = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const config = {
  port: toInt(process.env.PORT, 4000),
  frontendOrigins: toList(process.env.FRONTEND_ORIGIN, [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ]),
  maxSessionAgeMinutes: toInt(process.env.MAX_SESSION_AGE_MINUTES, 45),
  downloadRetentionMinutes: toInt(process.env.DOWNLOAD_RETENTION_MINUTES, 20)
};
