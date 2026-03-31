const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const asJson = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Sunucu hatasi");
  }
  return payload;
};

export const loginToSakai = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  return asJson(response);
};

export const createZipForCourses = async ({ sessionId, courseIds }) => {
  const response = await fetch(`${API_BASE_URL}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, courseIds })
  });
  return asJson(response);
};

export const getDownloadUrl = ({ sessionId, downloadId }) =>
  `${API_BASE_URL}/api/download/${downloadId}?sessionId=${encodeURIComponent(sessionId)}`;
