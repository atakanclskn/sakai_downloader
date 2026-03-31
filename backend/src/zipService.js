import fs from "fs";
import os from "os";
import path from "path";
import archiver from "archiver";
import { fetchCourseFiles, downloadFileBuffer } from "./sakaiClient.js";
import { safeFileName } from "./utils.js";

const tmpRoot = path.join(os.tmpdir(), "sakai-downloader-artifacts");

const ensureTmpDir = async () => {
  await fs.promises.mkdir(tmpRoot, { recursive: true });
};

const appendReport = (archive, lines) => {
  const body = lines.join("\n") + "\n";
  archive.append(body, { name: "rapor.txt" });
};

const sanitizeZipPath = (rawPath) =>
  rawPath
    .split("/")
    .map((segment) => safeFileName(segment))
    .filter(Boolean)
    .join("/");

export const createCoursesZip = async ({ session, selectedCourses }) => {
  await ensureTmpDir();

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `sakai-icerik-${stamp}.zip`;
  const zipPath = path.join(tmpRoot, fileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  const warnings = [];

  const closedPromise = new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(output);

  for (const course of selectedCourses) {
    const courseFolder = safeFileName(course.title || course.id);
    let files = [];

    try {
      files = await fetchCourseFiles({
        storageState: session.storageState,
        baseUrl: session.baseUrl,
        siteId: course.id
      });
    } catch (error) {
      warnings.push(`[${course.title}] Icerikler alinamadi: ${error.message}`);
      continue;
    }

    if (!files.length) {
      warnings.push(`[${course.title}] Icerik bulunamadi.`);
      continue;
    }

    for (const file of files) {
      const innerPath = file.path ? sanitizeZipPath(file.path) : safeFileName(file.name);
      const zipEntry = path.posix.join(courseFolder, innerPath);

      try {
        const buffer = await downloadFileBuffer({
          storageState: session.storageState,
          baseUrl: session.baseUrl,
          url: file.downloadUrl
        });
        archive.append(buffer, { name: zipEntry });
      } catch (error) {
        warnings.push(`[${course.title}] ${file.name} indirilemedi: ${error.message}`);
      }
    }
  }

  if (warnings.length) {
    appendReport(archive, ["Eksik veya hatali dosyalar:", "", ...warnings]);
  }

  await archive.finalize();
  await closedPromise;

  return { zipPath, fileName, warnings };
};

export const removeArtifactFile = async (zipPath) => {
  try {
    await fs.promises.unlink(zipPath);
  } catch {
    // Artifact was already deleted.
  }
};
