import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import {
  cleanupExpired,
  createDownloadArtifact,
  createSession,
  getDownloadArtifact,
  getSession,
  removeDownloadArtifact
} from "./sessionStore.js";
import { loginAndFetchCourses } from "./sakaiClient.js";
import { createCoursesZip, removeArtifactFile } from "./zipService.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "sakai-downloader-backend" });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password, baseUrl } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "Kullanici adi ve sifre zorunludur." });
  }

  try {
    const { storageState, courses, baseUrl: normalizedBaseUrl } = await loginAndFetchCourses({
      username,
      password,
      baseUrl
    });

    const session = createSession({
      storageState,
      baseUrl: normalizedBaseUrl,
      courses,
      maxAgeMinutes: config.maxSessionAgeMinutes
    });

    return res.json({
      sessionId: session.id,
      expiresAt: session.expiresAt,
      courses
    });
  } catch (error) {
    return res.status(401).json({ message: error.message || "Giris basarisiz." });
  }
});

app.get("/api/courses", (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId gereklidir." });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ message: "Oturum gecersiz veya suresi dolmus." });
  }

  return res.json({ courses: session.courses, expiresAt: session.expiresAt });
});

app.post("/api/download", async (req, res) => {
  const { sessionId, courseIds } = req.body ?? {};

  if (!sessionId || !Array.isArray(courseIds) || !courseIds.length) {
    return res.status(400).json({ message: "sessionId ve en az bir courseIds gereklidir." });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ message: "Oturum gecersiz veya suresi dolmus." });
  }

  const selectedCourses = session.courses.filter((course) => courseIds.includes(course.id));
  if (!selectedCourses.length) {
    return res.status(404).json({ message: "Secilen dersler bulunamadi." });
  }

  try {
    const { zipPath, fileName, warnings } = await createCoursesZip({ session, selectedCourses });

    const artifact = createDownloadArtifact({
      sessionId,
      zipPath,
      fileName,
      retentionMinutes: config.downloadRetentionMinutes
    });

    return res.json({
      downloadId: artifact.id,
      fileName: artifact.fileName,
      expiresAt: artifact.expiresAt,
      warnings
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "ZIP olusturulurken hata olustu." });
  }
});

app.get("/api/download/:downloadId", async (req, res) => {
  const sessionId = req.query.sessionId;
  const { downloadId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId gereklidir." });
  }

  const artifact = getDownloadArtifact(downloadId);
  if (!artifact || artifact.sessionId !== sessionId) {
    return res.status(404).json({ message: "Indirme kaydi bulunamadi." });
  }

  if (!fs.existsSync(artifact.zipPath)) {
    removeDownloadArtifact(artifact.id);
    return res.status(410).json({ message: "ZIP dosyasi temizlenmis." });
  }

  return res.download(artifact.zipPath, artifact.fileName, async () => {
    await removeArtifactFile(artifact.zipPath);
    removeDownloadArtifact(artifact.id);
  });
});

setInterval(cleanupExpired, 60_000).unref();

app.listen(config.port, () => {
  console.log(`Sakai Downloader backend running on http://localhost:${config.port}`);
});
