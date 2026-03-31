import { chromium, request } from "playwright";
import { normalizeBaseUrl, safeFileName } from "./utils.js";

const selectors = {
  username: [
    'input[name="eid"]',
    'input[name="username"]',
    '#eid',
    '#username',
    'input[type="email"]'
  ],
  password: ['input[name="pw"]', 'input[name="password"]', '#pw', '#password', 'input[type="password"]'],
  submit: ['button[type="submit"]', 'input[type="submit"]', '#submit', '.login input[type="submit"]']
};

const firstVisibleSelector = async (page, candidates) => {
  for (const candidate of candidates) {
    const element = page.locator(candidate).first();
    if (await element.count()) {
      return element;
    }
  }
  return null;
};

const toCourseList = (payload) => {
  const collection =
    payload?.site_collection ?? payload?.siteCollection ?? payload?.sites ?? payload?.items ?? payload ?? [];

  if (!Array.isArray(collection)) {
    return [];
  }

  return collection
    .map((item) => ({
      id: item.id ?? item.siteId ?? item.entityId,
      title: item.title ?? item.siteTitle ?? item.entityTitle ?? "Ders",
      description: item.description ?? "",
      type: item.type ?? "course"
    }))
    .filter((item) => item.id && item.type !== "project")
    .sort((a, b) => a.title.localeCompare(b.title, "tr"));
};

const normalizeDownloadUrl = (baseUrl, maybeRelativeUrl) => {
  if (!maybeRelativeUrl) {
    return null;
  }
  if (/^https?:\/\//i.test(maybeRelativeUrl)) {
    return maybeRelativeUrl;
  }
  return `${baseUrl}${maybeRelativeUrl.startsWith("/") ? "" : "/"}${maybeRelativeUrl}`;
};

const sanitizeZipPath = (rawPath) =>
  rawPath
    .split("/")
    .map((segment) => safeFileName(segment))
    .filter(Boolean)
    .join("/");

const createAuthedRequestContext = (baseUrl, storageState) =>
  request.newContext({
    baseURL: baseUrl,
    storageState,
    extraHTTPHeaders: {
      Accept: "application/json"
    }
  });

export const loginAndFetchCourses = async ({ username, password, baseUrl: rawBaseUrl }) => {
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/portal`, { waitUntil: "domcontentloaded" });

    const usernameInput = await firstVisibleSelector(page, selectors.username);
    const passwordInput = await firstVisibleSelector(page, selectors.password);

    if (!usernameInput || !passwordInput) {
      throw new Error("Giris formu bulunamadi. Kurumunuzun giris sayfasi farkli olabilir.");
    }

    await usernameInput.fill(username);
    await passwordInput.fill(password);

    const submitButton = await firstVisibleSelector(page, selectors.submit);
    if (submitButton) {
      await Promise.all([
        page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => null),
        submitButton.click()
      ]);
    } else {
      await Promise.all([
        page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => null),
        passwordInput.press("Enter")
      ]);
    }

    const storageState = await context.storageState();
    const req = await createAuthedRequestContext(baseUrl, storageState);

    const response = await req.get("/direct/site.json?_limit=500");
    if (!response.ok()) {
      throw new Error(`Dersler cekilemedi (HTTP ${response.status()}). Giris basarisiz olabilir.`);
    }

    const payload = await response.json();
    const courses = toCourseList(payload);

    if (!courses.length) {
      throw new Error("Ders bulunamadi. Kullanici bilgilerini veya yetkileri kontrol edin.");
    }

    await req.dispose();
    return { storageState, baseUrl, courses };
  } finally {
    await context.close();
    await browser.close();
  }
};

const fetchFolderContentsRecursive = async (req, siteId, baseUrl, parentPath = "", contentId) => {
  try {
    const endpoint = contentId 
      ? `/direct/content/${contentId}.json?_limit=20000`
      : `/direct/content/site/${siteId}.json?_limit=20000`;
    
    const response = await req.get(endpoint);
    if (!response.ok()) return [];
    
    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : 
                   (payload?.content_collection ?? payload?.contentCollection ?? 
                    payload?.items ?? payload?.results ?? payload ?? []);
    
    const allFiles = [];
    
    for (const item of items) {
      const isFolder = item.type === "folder" || item.isCollection === true;
      const entityId = item.entityId ?? "";
      const storagePath = entityId.replace(`/group/${siteId}/`, "").replace(/^\/+/, "");
      const inferredName = storagePath.split("/").pop();
      const originalName = item.fileName ?? item.title ?? inferredName ?? "dosya";
      const safeName = safeFileName(originalName);
      const fullPath = parentPath ? `${parentPath}/${safeName}` : safeName;
      
      if (isFolder) {
        // Klasörün içini recursive olarak fetch et
        const folderId = item.id ?? entityId;
        if (folderId) {
          const nestedFiles = await fetchFolderContentsRecursive(req, siteId, baseUrl, fullPath, folderId);
          allFiles.push(...nestedFiles);
        }
        continue;
      }
      
      const downloadUrl = normalizeDownloadUrl(
        baseUrl,
        item.downloadUrl ?? item.url ?? item.entityURL ?? item.reference
      );
      
      if (!downloadUrl) continue;
      
      allFiles.push({
        id: item.id ?? entityId ?? safeName,
        path: sanitizeZipPath(fullPath),
        name: safeName,
        size: Number(item.contentLength ?? item.size ?? 0),
        downloadUrl
      });
    }
    
    return allFiles;
  } catch (error) {
    console.warn(`Folder traverse failed: ${error.message}`);
    return [];
  }
};

export const fetchCourseFiles = async ({ storageState, baseUrl, siteId }) => {
  const req = await createAuthedRequestContext(baseUrl, storageState);

  try {
    return await fetchFolderContentsRecursive(req, siteId, baseUrl);
  } finally {
    await req.dispose();
  }
};

export const downloadFileBuffer = async ({ storageState, baseUrl, url }) => {
  const req = await createAuthedRequestContext(baseUrl, storageState);

  try {
    const response = await req.get(url);
    if (!response.ok()) {
      throw new Error(`Dosya indirilemedi (HTTP ${response.status()})`);
    }
    return await response.body();
  } finally {
    await req.dispose();
  }
};
