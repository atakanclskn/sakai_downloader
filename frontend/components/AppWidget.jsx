"use client";

import { useMemo, useState } from "react";
import { createZipForCourses, getDownloadUrl, loginToSakai } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { Lock, Search, Download, ChevronDown, ChevronRight, CheckSquare, Square, Loader2, Play } from "lucide-react";

const DEFAULT_BASE_URL = "https://online.deu.edu.tr";

const extractCourseCode = (title) => {
  const match = title.match(/^([A-Z]{2,3}\s?\d{4})/);
  return match ? match[1].replace(/\s/g, "") : "Diğer";
};

export function AppWidget() {
  const { t } = useTranslation();
  
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
    [authState.courses, selectedCourses]
  );
  
  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleGroupSelection = (coursesInGroup, select) => {
    const ids = coursesInGroup.map(c => c.id);
    if (select) {
      setSelectedCourses(prev => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedCourses(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  const selectAll = () => setSelectedCourses(authState.courses.map(c => c.id));
  const clearAll = () => setSelectedCourses([]);
  
  const toggleGroupExpansion = (code) => {
    setExpandedGroups(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.baseUrl) return;
    setLoadingLogin(true);
    setError("");
    try {
      const data = await loginToSakai(form);
      setAuthState({
        sessionId: data.sessionId,
        courses: data.courses || [],
        expiresAt: data.expiresAt
      });
      setSelectedCourses([]);
      setExpandedGroups(
        Object.fromEntries(
          Object.keys(
            data.courses.reduce((acc, c) => {
              const code = extractCourseCode(c.title);
              acc[code] = true;
              return acc;
            }, {})
          ).map(k => [k, true])
        )
      );
    } catch (err) {
      setError(t("app.errorLogin"));
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleDownload = async () => {
    if (selectedCourses.length === 0 || !authState.sessionId) return;
    setLoadingZip(true);
    setError("");
    try {
      const result = await createZipForCourses(authState.sessionId, selectedCourses, form.baseUrl);
      setLastDownload(result);
    } catch (err) {
      setError(t("app.errorFetch"));
    } finally {
      setLoadingZip(false);
    }
  };

  return (
    <div id="app-widget" className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start scroll-mt-24">
      {/* Kolon 1: Login */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col h-full">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Lock className="w-5 h-5 text-primary" />
            {t("app.loginTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{t("app.loginDesc")}</p>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("app.username")}</label>
              <input
                type="text"
                placeholder="Örn: ogr@deu.edu.tr"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("app.password")}</label>
              <input
                type="password"
                placeholder="•••••••••"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("app.url")}</label>
              <input
                type="url"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-muted-foreground"
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                required
              />
            </div>
          </div>
          {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl mt-4">{error}</div>}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full h-12 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loadingLogin ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {loadingLogin ? t("app.fetchingBtn") : t("app.fetchBtn")}
            </button>
          </div>
        </form>
      </div>

      {/* Kolon 2: Ders Secimi */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col h-[500px] lg:h-[600px] lg:col-span-2">
        <div className="p-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <Search className="w-5 h-5 text-primary" />
              {t("app.selectionTitle")}
            </h3>
            {authState.courses.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">{t("app.selectionDesc")}</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {t("app.courseFound").replace("{count}", authState.courses.length)} 
                <span className="font-mono bg-background px-2 py-0.5 rounded border ml-2 text-xs">
                  {new Date(authState.expiresAt).toLocaleTimeString()}
                </span>
              </p>
            )}
          </div>
          {authState.courses.length > 0 && (
            <button
              onClick={allSelected ? clearAll : selectAll}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors whitespace-nowrap"
            >
              {allSelected ? t("app.clearAll") : t("app.selectAll")}
            </button>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-muted/10 space-y-4">
          {authState.courses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <p>Listenizi görmek için lütfen giriş yapın.</p>
            </div>
          ) : (
            <>
              {/* Search logic */}
              <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ders ara..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              {filteredGroups.map(([code, courses]) => {
                const isExpanded = expandedGroups[code] !== false;
                const groupIds = courses.map(c => c.id);
                const isAllGroupSelected = groupIds.every(id => selectedCourses.includes(id));
                const isSomeGroupSelected = groupIds.some(id => selectedCourses.includes(id)) && !isAllGroupSelected;

                return (
                  <div key={code} className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="flex items-center p-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toggleGroupExpansion(code)}>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground mr-2 shrink-0" /> : <ChevronRight className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />}
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary text-sm mr-3 shrink-0">
                        {code}
                      </span>
                      <span className="text-sm font-medium text-foreground flex-grow truncate">{courses.length} ders</span>
                      
                      {/* Group toggle */}
                      <button 
                        className="p-2 -m-2 z-10 relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupSelection(courses, !isAllGroupSelected);
                        }}
                      >
                        {isAllGroupSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : isSomeGroupSelected ? (
                          <div className="w-5 h-5 rounded-[4px] border-2 border-primary bg-primary/20 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-0.5 bg-primary rounded-full"></div>
                          </div>
                        ) : (
                          <Square className="w-5 h-5 text-muted-foreground opacity-50" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border bg-background divide-y divide-border">
                        {courses.map(course => {
                          const isSelected = selectedCourses.includes(course.id);
                          return (
                            <div 
                              key={course.id} 
                              className={`flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                              onClick={() => toggleCourseSelection(course.id)}
                            >
                              <div className="shrink-0 mt-0.5">
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-primary" />
                                ) : (
                                  <Square className="w-5 h-5 text-muted-foreground opacity-50" />
                                )}
                              </div>
                              <div className="min-w-0 flex-grow">
                                <p className={`text-sm font-medium leading-snug line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                  {course.title}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
        
        {/* Indirme Paneli - Altta Sabit */}
        <div className="p-4 md:p-6 border-t border-border bg-card">
          {lastDownload ? (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t("app.downloadFile")} {lastDownload.filename}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("app.expires")} {new Date(lastDownload.expiresAt).toLocaleTimeString()}</p>
              </div>
              <a
                href={getDownloadUrl(lastDownload.filename)}
                className="shrink-0 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                download
              >
                <Download className="w-4 h-4" />
                {t("app.downloadBtn")}
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground hidden sm:block">
                {selectedCourses.length > 0 ? `${selectedCourses.length} ders hazırlandı` : t("app.noZip")}
              </p>
              <button
                onClick={handleDownload}
                disabled={loadingZip || selectedCourses.length === 0}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingZip ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {loadingZip ? t("app.zippingBtn") : t("app.zipBtn").replace("{count}", selectedCourses.length)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
