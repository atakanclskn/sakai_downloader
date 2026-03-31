import crypto from "crypto";

const sessions = new Map();
const downloadArtifacts = new Map();

const newId = () => crypto.randomUUID();

export const createSession = ({ storageState, baseUrl, courses, maxAgeMinutes }) => {
  const id = newId();
  const now = Date.now();

  sessions.set(id, {
    id,
    storageState,
    baseUrl,
    courses,
    createdAt: now,
    expiresAt: now + maxAgeMinutes * 60_000
  });

  return sessions.get(id);
};

export const getSession = (sessionId) => {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
};

export const createDownloadArtifact = ({ sessionId, zipPath, fileName, retentionMinutes }) => {
  const id = newId();
  const now = Date.now();

  downloadArtifacts.set(id, {
    id,
    sessionId,
    zipPath,
    fileName,
    createdAt: now,
    expiresAt: now + retentionMinutes * 60_000
  });

  return downloadArtifacts.get(id);
};

export const getDownloadArtifact = (id) => {
  const artifact = downloadArtifacts.get(id);

  if (!artifact) {
    return null;
  }

  if (Date.now() > artifact.expiresAt) {
    downloadArtifacts.delete(id);
    return null;
  }

  return artifact;
};

export const removeDownloadArtifact = (id) => {
  downloadArtifacts.delete(id);
};

export const cleanupExpired = () => {
  const now = Date.now();

  for (const [id, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(id);
    }
  }

  for (const [id, artifact] of downloadArtifacts.entries()) {
    if (now > artifact.expiresAt) {
      downloadArtifacts.delete(id);
    }
  }
};
