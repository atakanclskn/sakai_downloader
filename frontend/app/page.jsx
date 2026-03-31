"use client";

import { useMemo, useState } from "react";
import { createZipForCourses, getDownloadUrl, loginToSakai } from "../lib/api";

const DEFAULT_BASE_URL = "https://online.deu.edu.tr";

const COURSE_TYPE_LABEL = {
  course: "Ders",
  project: "Proje",
  site: "Site"
};

const extractCourseCode = (title) => {
  const match = title.match(/^([A-Z]{2,3}\s?\d{4})/);
  return match ? match[1].replace(/\s/g, "") : "Diğer";
};

export default function HomePage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    baseUrl: DEFAULT_BASE_URL
  });
  const [authState, setAuthState] = useState({
    sessionId: "",
    courses: [],
    expiresAt: null
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingZip, setLoadingZip] = useState(false);
  const [error, setError] = useState("");
  const [lastDownload, setLastDownload] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  const groupedCourses = useMemo(() => {
    const groups = {};
    authState.courses.forEach((course) => {
      const code = extractCourseCode(course.title);
      if (!groups[code]) groups[code] = [];
      groups[code].push(course);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [authState.courses]);

  const filteredGroups = useMemo(() => {
    if (!searchFilter.trim()) return groupedCourses;
    const query = searchFilter.toLowerCase();
    return groupedCourses
      .map(([code, courses]) => [
        code,
        courses.filter((c) => c.title.toLowerCase().includes(query) || code.toLowerCase().includes(query))
      ])
      .filter(([_, courses]) => courses.length > 0);
  }, [groupedCourses, searchFilter]);

  const allSelected = useMemo(
    () => authState.courses.length > 0 && selectedCourses.length === authState.courses.length,
    [authState.courses.length, selectedCourses.length]
  );

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleGroup = (code) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const toggleGroupSelection = (code, courses, selectAll = true) => {
    const courseIdsInGroup = courses.map((c) => c.id);
    if (selectAll) {
      setSelectedCourses((prev) => [...new Set([...prev, ...courseIdsInGroup])]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => !courseIdsInGroup.includes(id)));
    }
  };

  const isGroupFullySelected = (courses) => {
    return courses.length > 0 && courses.every((c) => selectedCourses.includes(c.id));
  };

  const isGroupPartiallySelected = (courses) => {
    return courses.some((c) => selectedCourses.includes(c.id)) && !isGroupFullySelected(courses);
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCourses([]);
      return;
    }
    setSelectedCourses(authState.courses.map((course) => course.id));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLastDownload(null);
    setLoadingLogin(true);

    try {
      const payload = await loginToSakai(form);
      setAuthState({
        sessionId: payload.sessionId,
        courses: payload.courses,
        expiresAt: payload.expiresAt
      });
      setSelectedCourses(payload.courses.map((course) => course.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  const onCreateZip = async () => {
    if (!selectedCourses.length) {
      setError("En az bir ders secmelisiniz.");
      return;
    }

    setError("");
    setLoadingZip(true);

    try {
      const payload = await createZipForCourses({
        sessionId: authState.sessionId,
        courseIds: selectedCourses
      });

      setLastDownload({
        ...payload,
        link: getDownloadUrl({ sessionId: authState.sessionId, downloadId: payload.downloadId })
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingZip(false);
    }
  };

  const hasSession = Boolean(authState.sessionId);

  return (
    <div className="page">
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />

      <header className="hero">
        <p className="badge">DEU Sakai Yardimci Araci</p>
        <h1>Sakai ders iceriklerini tek tusla zip olarak indir.</h1>
        <p className="lead">
          Her derse tek tek girip haftalari indirme derdi bitiyor. Kullanici bilgilerinle giris yap,
          dersleri sec, tek paket halinde al.
        </p>
      </header>

      <main className="layout">
        <section className="panel glass">
          <h2>1. Sakai Girisi</h2>
          <p className="muted">Bilgiler sadece bu oturumda kullanilir, diskte kalici tutulmaz.</p>

          <form onSubmit={onLogin} className="form-grid">
            <label>
              Kullanici Adi
              <input
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="ogrenci numarasi"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Sifre
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="********"
                autoComplete="current-password"
                required
              />
            </label>

            <label>
              Sakai URL
              <input
                value={form.baseUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, baseUrl: e.target.value }))}
                placeholder={DEFAULT_BASE_URL}
                required
              />
            </label>

            <button className="btn primary" type="submit" disabled={loadingLogin}>
              {loadingLogin ? "Giris yapiliyor..." : "Dersleri Getir"}
            </button>
          </form>
        </section>

        <section className="panel glass">
          <div className="section-head">
            <h2>2. Ders Secimi</h2>
            <button className="btn ghost" onClick={toggleAll} disabled={!hasSession}>
              {allSelected ? "Secimi Temizle" : "Tumunu Sec"}
            </button>
          </div>

          {!hasSession && <p className="muted">Once giris yaparak ders listesini getirin.</p>}

          {hasSession && (
            <>
              <p className="muted">
                {selectedCourses.length} / {authState.courses.length} ders secildi. Oturum suresi:{" "}
                {new Date(authState.expiresAt).toLocaleTimeString("tr-TR")}
              </p>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Ders ara (kod yada ad)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="course-groups">
                {filteredGroups.length === 0 ? (
                  <p className="muted">Aramaniza uygun ders bulunamadi.</p>
                ) : (
                  filteredGroups.map(([code, courses]) => (
                    <div key={code} className="course-group">
                      <div className="group-header">
                        <button
                          className="group-toggle"
                          onClick={() => toggleGroup(code)}
                          aria-expanded={expandedGroups[code] ?? true}
                        >
                          <span className="toggle-icon">{expandedGroups[code] ?? true ? "▼" : "▶"}</span>
                          <span className="code">{code}</span>
                          <span className="count">({courses.length} ders)</span>
                        </button>
                        <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            indeterminate={isGroupPartiallySelected(courses)}
                            checked={isGroupFullySelected(courses)}
                            onChange={() => toggleGroupSelection(code, courses, !isGroupFullySelected(courses))}
                          />
                          <span>Grubu sec</span>
                        </label>
                      </div>

                      {(expandedGroups[code] ?? true) && (
                        <div className="group-courses">
                          {courses.map((course) => (
                            <label key={course.id} className="course-card">
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => toggleCourse(course.id)}
                              />
                              <div>
                                <strong>{course.title}</strong>
                                <span>{COURSE_TYPE_LABEL[course.type] || course.type || "Ders"}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button className="btn primary" onClick={onCreateZip} disabled={loadingZip || !selectedCourses.length}>
                {loadingZip ? "Zip hazirlaniyor..." : `${selectedCourses.length} Dersi Zip Yap`}
              </button>
            </>
          )}
        </section>

        <section className="panel">
          <h2>3. Indirme</h2>
          <p className="muted">Hazirlanan paketi tek tikla indirebilirsiniz.</p>

          {lastDownload ? (
            <div className="download-box">
              <p>
                <strong>Dosya:</strong> {lastDownload.fileName}
              </p>
              <p>
                <strong>Son gecerlilik:</strong>{" "}
                {new Date(lastDownload.expiresAt).toLocaleTimeString("tr-TR")}
              </p>
              <a className="btn accent" href={lastDownload.link}>
                ZIP Dosyasini Indir
              </a>

              {Array.isArray(lastDownload.warnings) && lastDownload.warnings.length > 0 && (
                <div className="warning-box">
                  <h3>Uyari / Eksikler</h3>
                  <ul>
                    {lastDownload.warnings.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="muted">Heniz olusturulmus bir zip yok.</p>
          )}

          {error && <p className="error">{error}</p>}
        </section>
      </main>
    </div>
  );
}
