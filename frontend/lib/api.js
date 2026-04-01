const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const REQUEST_TIMEOUT_MS = 45_000;

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Istek zaman asimina ugradi. Lutfen tekrar deneyin.");
    }
    throw new Error("Sunucuya baglanilamadi. Backend calisiyor mu kontrol edin.");
  } finally {
    clearTimeout(timeoutId);
  }
};

const asJson = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Sunucu hatasi");
  }
  return payload;
};

export const loginToSakai = async (credentials) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  return asJson(response);
};

export const createZipForCourses = async ({ sessionId, courseIds }) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, courseIds })
  });
  return asJson(response);
};

export const getDownloadUrl = ({ sessionId, downloadId }) =>
  `${API_BASE_URL}/api/download/${downloadId}?sessionId=${encodeURIComponent(sessionId)}`;
