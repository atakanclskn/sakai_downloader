import dotenv from "dotenv";

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: toInt(process.env.PORT, 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  maxSessionAgeMinutes: toInt(process.env.MAX_SESSION_AGE_MINUTES, 45),
  downloadRetentionMinutes: toInt(process.env.DOWNLOAD_RETENTION_MINUTES, 20)
};
