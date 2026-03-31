export const normalizeBaseUrl = (input) => {
  const candidate = (input || "https://online.deu.edu.tr").trim();
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  return withProtocol.replace(/\/$/, "");
};

export const safeFileName = (value) =>
  (value || "dosya")
    .replace(/[<>:\"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180) || "dosya";
